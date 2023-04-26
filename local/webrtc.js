

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
};



const peerConnection = new RTCPeerConnection(servers);

peerConnection.addEventListener('connectionstatechange',() => {
    console.log(peerConnection.connectionState);
});

start(peerConnection)
    .then((remoteStream) => {
        
    console.log(remoteStream)

    //Send message to the remote client. Must first be sent to
    // main process
    function sendMessage(message) {
        const jsonMessage = JSON.stringify(message);
        sendMessageToRemote(jsonMessage);
    };



    // add track to remote video when tracks are received
        // from peerConnection
        peerConnection.ontrack = (e) => {
            e.streams[0].getTracks().forEach(track => {
                // add the tracks to the remoteStream
                remoteStream.addTrack(track);
                console.log(track);
            });

            remoteVideo.onloadedmetadata = function(e) {
                console.log("LOADED METADATA")
                remoteVideo.play();
            };
        };

        // then add the stream to the remote video element
        remoteVideo.srcObject = remoteStream;



        // when reveiving an ICE candidate, send it
        peerConnection.onicecandidate = ({ candidate }) => {
            if (candidate !== null) {
                sendMessage({ candidate });
            };
        };


    // handle messages coming from the remote client.
    // they first come through the main process
    window['electronAPI'].onMessageFromRemote( async (event,message) => {

        const { description, candidate } = message;

        // initial reciept of call from caller
        if (description) {
            peerConnection.setRemoteDescription(description)
                .then(() => peerConnection.createAnswer())
                .then((answer) => {
                    peerConnection.setLocalDescription(answer,() => {
                        sendMessage({answer: peerConnection.localDescription})
                        console.log(peerConnection.connectionState);
                    });
                });
        };


        // handle receiving of ICE candidates
        if (candidate && candidate !== null) {
            peerConnection.addIceCandidate(candidate);
            console.log('added ICE candidate')
        };
    });

    // data channel communication
    const dataChannel = peerConnection.createDataChannel("atem-channel");
        
    dataChannel.onmessage = (event) => {
        console.log(`Received ${event.data}`);
    };

    dataChannel.onopen = () => {
        console.log("datachannel open");
    };
    
    dataChannel.onclose = () => {
        console.log("datachannel close");
    };
});