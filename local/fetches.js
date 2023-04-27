async function fetchGetSessionId(sessionId) {
    const url = "http://127.0.0.1:5000/get-session-id";
    const body = JSON.stringify({roomId: sessionId,});



    function handleSessionIdResponse(response) {
        if (response.error) {
            errorMessageSpan.innerText = response.error;
        }
    
        else if (response.sessionId) {
            sendMessageToMain({
                sessionId: response.sessionId
            });
        };
    };

    

    const sessionIdResponse = fetch(url,{
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
        console.log(e)
    });
};