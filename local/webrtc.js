import start from "./media.js";
import { remoteVideo } from "./media.js";
import { sendMessageToRemote } from "./renderer.js";
import { sessionStatusText } from "./elements.js";

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
};


export default function initWebRTC () {
    // WebRTC datachannel setup
    const peerConnection = new RTCPeerConnection(servers);

    peerConnection.ondatachannel = (event) => {
        // console.log("*** DATACHANNEL")
        const dataChannel = event.channel;
        dataChannel.onoopen = (e) => console.log(e);


        dataChannel.onmessage = (e) => {
            console.log('datachannel:')
            console.log(e.data)
            window['electronAPI'].sendDataToAtem(e.data);
        };

        // dataChannel.send('Hello back, from the datachannel!')
    };



    peerConnection.addEventListener('connectionstatechange',() => {
        const state = peerConnection.connectionState;
        console.log(`WebRTC Connection Status: ${state}`);

        if (state === "new") {
            sessionStatusText.innerHTML = 'New';
            sessionStatusText.className = 'text-warning fw-bolder';
        }

        else if (state === "connecting") {
            sessionStatusText.innerHTML = 'Connecting...';
            sessionStatusText.className = 'text-warning fw-bolder';
        }


        else if (state === "connected") {
            sessionStatusText.innerHTML = 'Connected';
            sessionStatusText.className = 'text-success fw-bolder';
        }


        else if (state === 'disconnected' || 'failed' || 'closed') {
            sessionStatusText.innerHTML = capitalize(state);
            sessionStatusText.className = 'text-danger fw-bolder';
        };

    });


    start(peerConnection)
        .then((remoteStream) => {

        console.log('START FUNCTION')

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


        // when receiving an ICE candidate, send it to local client
        peerConnection.onicecandidate = ({ candidate }) => {
            console.log('sending ICE candidate!')
            if (candidate !== null) {
                sendMessage({ candidate });
            };
        };


        // handle messages coming from the remote client.
        // they first come through the main process
        window['electronAPI'].onMessageFromRemote( async (_event,message) => {

            console.log('got a a message');

            const { description, candidate } = message;

            // initial reciept of call from caller
            // it will take the description and set it as its local description
            // then it will create and answer and send it back to caller
            if (description) {
                console.log('got a description!')
                peerConnection.setRemoteDescription(description)
                    .then(() => peerConnection.createAnswer())
                    .then((answer) => {
                        peerConnection.setLocalDescription(answer,() => {
                            sendMessage({answer: peerConnection.localDescription});
                            console.log('sent an answer!');
                        });
                    });
            };


            // handle receiving of ICE candidates
            if (candidate && candidate !== null) {
                peerConnection.addIceCandidate(candidate);
                console.log('added ICE candidate');
            };
        });    
    });
}

