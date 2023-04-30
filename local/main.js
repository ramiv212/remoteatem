const { app, BrowserWindow , ipcMain} = require('electron');
const path = require("path");
const { createSocket } = require("./socket.js");
const { startExpress } = require('./express.js');
const { atem,initAtemStateEventListeners } = require("./atem.js");
require('dotenv').config();

function getHost() {
    if (process.env.LOCALHOST == 1) {
        return `http://127.0.0.1:5000`;
    }
    else {
        return `wss://remoteatem-production.up.railway.app`;
    };
};

const HOST = getHost();
console.log(HOST)

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
  
    win.loadFile('index.html');

    return win;
};


const socket = createSocket(HOST);


// sends a signal to the server to have this socket leave its own room
// and join the room of this sessionId
function joinSocketRoom(sessionId) {
    console.log('join-room')
    console.log(sessionId);
    socket.emit('join-room',{
        type: 'local',
        sessionId: sessionId
    });
};


// handle any messages that are sent from the Electron renderer process
function handleMessageFromRenderer(event,message) {

    // if the message contains a sessionId, join the websocket room of sessionId
    if (message.sessionId) {
        joinSocketRoom(message.sessionId);
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
function handleMessageToRemote(_event,message) {
    const parsedJsonMessage = JSON.parse(message);
    socket.emit('message',parsedJsonMessage);
};



// handle messages coming from the WebRTC datachannel which are then sent via the
// Electron renderer to be sent to the ATEM switcher
function handleDataToAtem(_event,data,atem) {
    const parsedJsonData = JSON.parse(data);

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

        socket.on("message",(message) => {
            win.webContents.send('message-from-remote',message);
        });



        // handle the signal from the server to start the WebRTC call
        // this will send the message via the webcontents API to the Electron renderer process
        // socket.on('start-call', () => {
        //     console.log("start-call from remote");
        //     win.webContents.send('start-call', {
        //         startCall: true,
        //     });
        // });
        

        ipcMain.on('response-from-sender',(_event,value) => {
            console.log(value);
        });

        
        // handle messages that come from the Electron renderer to the Electron main process
        ipcMain.on('message-from-renderer', (event,data) => {
            console.log(data);
            handleMessageFromRenderer(event,data,socket)
        });

        ipcMain.on('message-to-remote', handleMessageToRemote);

        ipcMain.on('data-to-atem', (event,data) => {
            console.log('DATA TO ATEM')
            handleDataToAtem(event,data,atem);
        });
    });

    // let the renderer process know that the websocket server is connected
    win.webContents.once('did-finish-load',() => {
        socket.on('connect',() => {
            console.log('socket connect')
                win.webContents.send('message-from-main', {
                    connectedToServer: true
                });
        });

        socket.on('disconnect',() =>{
            console.log('socket disconnect')
                win.webContents.send('message-from-main', {
                    connectedToServer: false
            });
        });
    })
});



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  });