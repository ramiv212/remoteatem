const { app, BrowserWindow , ipcMain} = require('electron');
const path = require("path");
const { startExpress } = require('./express.js');
const { atem,initAtemStateEventListeners } = require("./atem.js");
const { getHost } = require('./mainhelpers.js');
require('dotenv').config();


const HOST = getHost();


const createWindow = () => {
    const win = new BrowserWindow({
        width: 450,
        height: 900,
        title: 'RemoteAtem Local Client',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            }
        }
    )
  
    win.loadFile('./renderer/index.html');

    return win;
};



// handle any messages that are sent from the Electron renderer process
function handleMessageFromRenderer(event,message,socket) {

    // if datachannel connection has been made, close websocket connection
    if (message.dataChannelState === 'open') {
        console.log(`DataChannel is ${message.dataChannelState}`);
        socket.disconnect();
    };

    // if atem is succesfully connected, send success message back to renderer. Else send back error.
    if (message.connectToAtem) {
        console.log('message from renderer')
        console.log(message);
        try {
            atem.connect(message.connectToAtem);
        } 
        
        catch(e) {
            const jsonifiedErrorBody = JSON.stringify({
                atemConnectionError: e.message
            });

            event.sender.send('message-from-main',jsonifiedErrorBody);
        };
    };
};



// handle messages going to the remote server from the renderer process
function handleMessageToRemote(_event,message,socket) {
    const parsedJsonMessage = JSON.parse(message);
    socket.emit('message',parsedJsonMessage);
};



// handle messages coming from the WebRTC datachannel which are then sent via the
// Electron renderer to be sent to the ATEM switcher
function handleDataFromDataChannel(_event,data,atem,socket) {
    const parsedJsonData = JSON.parse(data);

    if (parsedJsonData.dataChannelState === "open") {
        console.log('DataChannel connection is open. Closing Web Socket')
        socket.disconnect();
    };

    if (parsedJsonData.atem) {
        const action = parsedJsonData['atem'].action;
        const values = parsedJsonData['atem'].values;
        console.log(action,values)
        atem.do({action,values});

    };  
};



app.whenReady().then(() => {
    startExpress();
    const win = createWindow();
    
    initAtemStateEventListeners(win);

    // handle messages coming from remote websockets
    // and send them to Electron renderer process

    win.webContents.on('did-finish-load', () => {
        win.webContents.send('message-from-main','Hello,World!');

        console.log('ready')

        // Websockets Logic
        // the websockets are used mainly just to 
        ipcMain.on('session-id', (_event,data) => {
            console.log('session-id-from-renderer')
            
            const { io } = require("socket.io-client");
            const socket = io(HOST);

            const sessionId = data.sessionId;

            

            socket.on('connect',() => {
                console.log('socket connect');

                console.log('join-room')
                console.log(sessionId);
                socket.emit('join-room',{
                    type: 'local',
                    sessionId: sessionId
                });

                win.webContents.send('message-from-main', {
                    connectedToServer: true
                });
                
            });
        
            socket.on("message",(message) => {
                win.webContents.send('message-from-remote',message);
            });


            socket.on('disconnect',() =>{
                console.log('socket disconnect')
                    win.webContents.send('message-from-main', {
                        connectedToServer: false
                });
            });



             // handle messages that come from the Electron renderer to the Electron main process
            ipcMain.on('message-from-renderer', (event,data) => {
                console.log(data);
                handleMessageFromRenderer(event,data,socket)
            });


            ipcMain.on('message-to-remote', (event,data) => {
                handleMessageToRemote(event,data,socket);
            });

            // *** Is this needed????
            ipcMain.on('response-from-sender',(_event,value) => {
                console.log(value);
            });


            ipcMain.on('data-to-atem', (event,data) => {
                console.log('DATA TO ATEM')
                handleDataFromDataChannel(event,data,atem,socket);
            });
        });
    });
});



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  });