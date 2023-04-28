const roomIdInput = document.getElementById("room-id-input");
const atemIpInput = document.getElementById("atem-ip-input");

const beginSessionButton = document.getElementById("begin-session-button");
const connectToAtemButton = document.getElementById("connect-to-atem-button");

const sessionStatusText = document.getElementById("session-status-text");
const atemConnectionStatusText = document.getElementById('atem-connection-status-text');



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




// handle messages coming from main Electron process
window['electronAPI'].onMainMessage((event,message) => {
    console.log(message);
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.connectedToAtem) {
        atemConnectionStatusText.innerText = 'Connected';
        atemConnectionStatusText.className ='text-success fw-bolder';
    } else {
        atemConnectionStatusText.innerText = 'Disconnected';
        atemConnectionStatusText.className ='text-danger fw-bolder';
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