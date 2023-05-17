

const { contextBridge, ipcRenderer } = require('electron')



contextBridge.exposeInMainWorld('electronAPI', {
    onMainMessage: (callback) => ipcRenderer.on('message-from-main', callback),
    onStartCall: (message) => ipcRenderer.on('start-call',message),
    onMessageFromRemote: (message) => ipcRenderer.on('message-from-remote',message),
    onDataFromAtem: (data) => ipcRenderer.on('data-from-atem',data),

    sendSessionId: (message) => ipcRenderer.send('session-id', message),
    sendMessageToMain: (message) => ipcRenderer.send('message-from-renderer', message),
    sendMessageToRemote: (message) => ipcRenderer.send('message-to-remote', message),
    sendDataToAtem: (data) => ipcRenderer.send('data-to-atem', data),
    hostedLocally : process.env.LOCALHOST,
})

