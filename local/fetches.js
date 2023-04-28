
function handleSessionIdResponse(response) {
    if (response.error) {
        errorMessageSpan.innerText = response.error;
    }

    else if (response.sessionId) {
        console.log('ran sendmessage to main')
        sendMessageToMain({
            sessionId: response.sessionId
        });
    };
};

async function fetchGetSessionId(sessionId) {
    console.log('ran fetch');
    const url = "http://127.0.0.1:5000/get-session-id";
    const body = JSON.stringify({roomId: sessionId,});
    try {
        fetch(url,{
            method: "POST",
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