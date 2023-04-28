const roomIdInput = document.getElementById("room-id-input");
const atemIpInput = document.getElementById("atem-ip-input");

const beginSessionButton = document.getElementById("begin-session-button");
const connectToAtemButton = document.getElementById("connect-to-atem-button");

const sessionStatusText = document.getElementById("session-status-text");
const atemConnectionStatusText = document.getElementById('atem-connection-status-text');

const signalServerStatusLight = document.getElementById('signal-server-status-light');

// exposed APIs from preload.js which send messages from
// renderer to Node
function sendMessageToMain(message) {
    window['electronAPI'].sendMessageToMain(message);
};

function sendMessageToRemote(message) {
    window['electronAPI'].sendMessageToRemote(message);
};

function sendDataToAtem(data) {
    window['electronAPI'].sendDataToAtem(data);
};


// ADDING A STATUS LIGHT ON SERVER CONNECTION TO LOCAL APP
// IS IT JSON OR NOT??


// handle messages coming from main Electron process
window['electronAPI'].onMainMessage((_event,message) => {
    console.log('MESSAGE-FROM-MAIN')

    // messages from main procces that tell the renderer if the ATEM is connected
    if (message.connectedToAtem) {
        atemConnectionStatusText.innerText = 'Connected';
        atemConnectionStatusText.className ='text-success fw-bolder';
    } else {
        atemConnectionStatusText.innerText = 'Disconnected';
        atemConnectionStatusText.className ='text-danger fw-bolder';
    };


    // messages from main procces that tell the renderer if the signal server is connected
    if (message.connectedToServer) {
        signalServerStatusLight.className ='signal-server-status-light-connected';
    } else {
        signalServerStatusLight.className ='signal-server-status-light-disconnected';

    };
});


window['electronAPI'].onStartCall((event,message) => {
    console.log("Starting call!")
});


window['electronAPI'].onDataFromAtem((event,data) => {
    console.log(data);
});



beginSessionButton.addEventListener("click",() => {
    // this function lives in ./fetches.js
    if (roomIdInput.value === "") {
        return
    };
    fetchGetSessionId(roomIdInput.value);
});


connectToAtemButton.addEventListener("click",() => {
    const messageBody = { connectToAtem: atemIpInput.value };

    sendMessageToMain(messageBody);
});