const { app, BrowserWindow , ipcMain} = require('electron');
const path = require("path");
const { socket } = require("./socket.js");
const { startExpress } = require('./express.js');
const Atem = require("./atem.js");

// TODO add a check that shows user if server is online


const createWindow = () => {
    const win = new BrowserWindow({
        width: 450,
        height: 750,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            }
        }
    )
  
    win.loadFile('index.html');
    return win;
};



// sends a signal to the server to have this socket leave its own room
// and join the room of this sessionId
function joinSocketRoom(sessionId) {
    socket.emit('join-room',{
        type: 'local',
        sessionId: sessionId
    });
};


// handle any messages that are sent from the Electron renderer process
function handleMessageFromRenderer(_event,message) {
    // if the message contains a sessionId, join the websocket room of sessionId
    if (message.sessionId) {
        joinSocketRoom(message.sessionId);
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

    const atem = new Atem('192.168.1.196')

    win.webContents.send('message-from-main','Hello,World!');


    // handle the signal from the server to start the WebRTC call
    // this will send the message via the webcontents API to the Electron renderer process
    socket.on('start-call', () => {
        console.log("start-call from remote");
        win.webContents.send('start-call', {
            startCall: true,
        });
    });


    // handle messages coming from remote websockets
    // and send them to Electron renderer process
    socket.on("message",(message) => {
        win.webContents.send('message-from-remote',message);
    });
    

    ipcMain.on('response-from-sender',(_event,value) => {
        console.log(value);
    });

    
    // handle messages that come from the Electron renderer to the Electron main process
    ipcMain.on('message-from-renderer', handleMessageFromRenderer);

    ipcMain.on('message-to-remote', handleMessageToRemote);

    ipcMain.on('data-to-atem', (event,data) => {
        console.log('MESSAGE TO MAIN')
        handleDataToAtem(event,data,atem);
    });
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })


