import { getHost } from "./rendererhelpers.js";
import { sendSessionId } from "./renderer.js";
import { sessionStatusText } from "./elements.js";


const HOST = getHost();


function handleSessionIdResponse(response) {
    console.log(response)
    if (response.error) {
        console.log('error')
        sessionStatusText.className = 'text-danger fw-bolder';
        sessionStatusText.innerText = response.error;
    }

    else if (response.sessionId) {
        console.log('received ID')
        sendSessionId({
            sessionId: response.sessionId});
    };
};

export async function fetchGetSessionId(sessionId) {
    const url = `${HOST}/get-session-id`;
    console.log(url);
    const body = JSON.stringify({roomId: sessionId,});
    try {
        fetch(url,{
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: body,
        })
        .then(res => res.json())
        .then(json => {
            handleSessionIdResponse(json);
        })
        .catch((e) => {
            if (e.message === 'Failed to fetch') {
                sessionStatusText.className = 'text-danger fw-bolder';
                sessionStatusText.innerText = "No Response From Server";
            };
        });
    } catch (error) {
        console.log(error.name)
    };
};