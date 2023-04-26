const roomIdInput = document.getElementById("roomId");
const loginButton = document.getElementById("loginButton");

// get the session uuid from the server and redirect
// to the /session page with a concatenated session uuid
async function beginSession(sessionId) {
    const url = `/session?sessionId=${sessionId}`;
    window.location.href = url;
};

async function fetchCreateSession() {
    const roomId = roomIdInput.value;
    const url = "/create-session";
    const body = JSON.stringify({roomId: roomId,});

    const response = fetch(url,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body,
    })
    .then(res => res.json())
    .then(json => {
        console.log(json);
        beginSession(json.sessionId);
    })
    .catch((e) => {
        console.log(e)
    });
};


loginButton.addEventListener("click", () => {
    fetchCreateSession();
});

roomIdInput.addEventListener("keypress",(e) => {
    if(e.key === "Enter") {
        fetchCreateSession();
    };
});
