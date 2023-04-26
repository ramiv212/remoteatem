import { start,resizeVideoElement } from "./media.js";
import atem from "./atemHelpers.js";

// get session uuid from query params
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const sessionId = urlParams.get('sessionId');
console.log({sessionId});


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

const { remoteStream, remoteVideo } = await start(peerConnection);


// init socket.io
export const socket = io();


// join room of sessionId
socket.emit("join-room",{
    type: 'remote',
    sessionId: sessionId,
});


// determine if client caller
socket.on("start-call", async () => {

    //Function to send message in a room
    function sendMessage(message, room) {
        // console.log('Client sending message: ', message, room);
        socket.emit('message', message, room);
    };


    // add track to remote video when tracks are received
    // from peerConnection
    peerConnection.ontrack = (e) => {
        e.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track);
        });

        remoteVideo.onloadedmetadata = function(e) {
            console.log("LOADED METADATA")
            remoteVideo.play();
        };
    };


    remoteVideo.srcObject = remoteStream;
    resizeVideoElement(remoteVideo);


    // when reveiving an ICE candidate, send it
    peerConnection.onicecandidate = ({ candidate }) => {
        if (candidate !== null) {
            sendMessage({ candidate });
        };
    };


    // initial call to receiver

    console.log("sending description");
        peerConnection.createOffer()
            .then((offer) => {
                peerConnection.setLocalDescription(offer,() => {
                    sendMessage({ description: peerConnection.localDescription });
                });
            });


    // handle incoming WebRTC messages
    socket.on("message", (data) => {

        const { answer, candidate } = data;

        // final step
        if(answer) {
            console.log("set remote description")
            peerConnection.setRemoteDescription(answer,() => {
                console.log(peerConnection.connectionState);
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


atem();