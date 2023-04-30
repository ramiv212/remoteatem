import { 
    atemConnectionStatusText,
    signalServerStatusLight,
    beginSessionButton,
    connectToAtemButton,
    atemIpInput,
    roomIdInput
    
 } from "./elements.js";
 import { fetchGetSessionId } from "./fetches.js";

// exposed APIs from preload.js which send messages from
// renderer to Node

export function sendMessageToMain(message) {
    window['electronAPI'].sendMessageToMain(message);
};

export function sendMessageToRemote(message) {
    window['electronAPI'].sendMessageToRemote(message);
};

export function sendDataToAtem(data) {
    window['electronAPI'].sendDataToAtem(data);
};



function initRecieveMessages(){

    // handle messages coming from main Electron process
    window['electronAPI'].onMainMessage((_event,message) => {
        console.log('MESSAGE-FROM-MAIN')
        console.log(message)

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
};


function initEventListeners(){
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
};
    



export default function initRendere() {
    initRecieveMessages();
    initEventListeners();
};