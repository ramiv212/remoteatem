const { app, BrowserWindow , ipcMain, ipcRenderer, dialog} = require('electron');
const path = require("path");
const { socket } = require("./socket.js")
const { initAtem } = require("./atem.js")

// TODO add a check that shows user if server is online

const createWindow = () => {
    const win = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            }
        }
    )
  
    win.loadFile('index.html');
    return win;
};


function joinSocketRoom(sessionId) {
    socket.emit('join-room',{
        type: 'local',
        sessionId: sessionId
    });
};


function handleMessageFromRenderer(event,message) {
    if (message.sessionId) {
        joinSocketRoom(message.sessionId);
    };
};


// handle messages going to the remote server from the renderer process
function handleMessageToRemote(event,message) {
    const parsedJsonMessage = JSON.parse(message);
    socket.emit('message',parsedJsonMessage);
};


app.whenReady().then(() => {
    const win = createWindow();
    const atem = initAtem();

    win.webContents.send('message-from-main','Hello,World!');

    // handle the signal from the server to start the WebRTC call
    socket.on('start-call', () => {
        console.log("start-call from remote");
        win.webContents.send('start-call', {
            startCall: true,
        });
    });

    // handle any other messages coming from remote
    socket.on('message', (message) => {
        win.webContents.send('message-from-remote', message);

        if (message.atem) {
            atem.changeProgramInput(1);
        };
    });


    ipcMain.on('response-from-sender',(_event,value) => {
        console.log(value);
    });

    ipcMain.on('message-from-renderer', handleMessageFromRenderer);
    ipcMain.on('message-to-remote', handleMessageToRemote);
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })


