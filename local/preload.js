// const socket = require("./socket.js");
// const fetchGetSessionId = require("./fetches.js");

const { contextBridge, ipcRenderer, ipcMain } = require('electron')



contextBridge.exposeInMainWorld('electronAPI', {
    onMainMessage: (callback) => ipcRenderer.on('message-from-main', callback),
    onStartCall: (message) => ipcRenderer.on('start-call',message),
    onMessageFromRemote: (message) => ipcRenderer.on('message-from-remote',message),

    sendMessageToMain: (message) => ipcRenderer.send('message-from-renderer', message),
    sendMessageToRemote: (message) => ipcRenderer.send('message-to-remote', message),
})
