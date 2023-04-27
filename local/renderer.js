const roomIdInput = document.getElementById("room-id-input");
const beginSessionButton = document.getElementById("begin-session-button");
const errorMessageSpan = document.getElementById("error-message");


beginSessionButton.addEventListener("click",() => {
    // this function lives in ./fetches.js
    fetchGetSessionId(roomIdInput.value);
});


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
    event.sender.send('response-from-sender',"Hello to you too!");
});


window['electronAPI'].onStartCall((event,message) => {
    console.log("Starting call!")
});


window['electronAPI'].onDataFromAtem((event,data) => {
    console.log(data);
});