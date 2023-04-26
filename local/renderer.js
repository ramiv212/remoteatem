const roomIdInput = document.getElementById("room-id-input");
const beginSessionButton = document.getElementById("begin-session-button");
const errorMessageSpan = document.getElementById("error-message");

function sendMessageToMain(message) {
    window['electronAPI'].sendMessageToMain(message);
};

function sendMessageToRemote(message) {
    window['electronAPI'].sendMessageToRemote(message);
};




function handleResponse(response) {

    if (response.error) {
        errorMessageSpan.innerText = response.error;
    }

    else if (response.sessionId) {
        sendMessageToMain({
            sessionId: response.sessionId
        });
    };
};



async function fetchGetSessionId(sessionId) {
    const url = "http://127.0.0.1:5000/get-session-id";
    const body = JSON.stringify({roomId: sessionId,});

    const sessionIdResponse = fetch(url,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body,
    })
    .then(res => res.json())
    .then(json => {
        console.log(json);
        handleResponse(json);
    })
    .catch((e) => {
        console.log(e)
    });
};


beginSessionButton.addEventListener("click",() => {
    fetchGetSessionId(roomIdInput.value);
});




// handle messages coming from main
window['electronAPI'].onMainMessage((event,message) => {
    console.log(message);
    event.sender.send('response-from-sender',"Hello to you too!");
});


window['electronAPI'].onStartCall((event,message) => {
    console.log(message)
});