// Video Elements Config
const selfVideo = document.querySelector("#selfview");
const remoteVideo = document.querySelector("#remoteview");
const cameraSelect = document.querySelector("#camera-select");
const audioSelect = document.querySelector("#audio-select");


export function resizeVideoElement(videoElement) {
    const computedHeightInPixels = parseInt(getComputedStyle(videoElement).height.slice(0,-2));
    const aspectRatio = computedHeightInPixels * 1.78

    console.log(computedHeightInPixels,aspectRatio);

    remoteVideo.style.width = `${aspectRatio}px`;
};


// returns the deviceId of mediaDevice of deviceName
async function getDeviceId(enumeratedDevices,deviceName) {
    const devicesArray = await enumeratedDevices;
    const device = devicesArray.filter(mediaDevice => mediaDevice.label === deviceName)[0];
    return device.deviceId;
};



// returns the video sender from an array of peerConnection.getSenders()
function getSender(RTCRtpSenders,kind) {
    return RTCRtpSenders.filter(sender => sender.track.kind === kind)[0];
};



// returns a default user-facing vide stream if option object's initialSetup: true
// otherwise returns a stream with the specific passed-down deviceName
async function getLocalStream(mediaDevicesObj,options) {
    const { videoDeviceName,audioDeviceName,initialSetup } = options;

    const constraints = {
        audio: true,
        video: true,
    };

    if (initialSetup) {

        constraints.video = {
            facingMode: "user"
        };
        
    } else {
        // TODO make this exact and then add a try catch
        const enumeratedDevices = mediaDevicesObj.enumerateDevices();
        const videoDeviceId = await getDeviceId(enumeratedDevices,videoDeviceName);
        const audioDeviceId = await getDeviceId(enumeratedDevices,audioDeviceName);

        constraints.video = {
            deviceId: {
                exact: videoDeviceId
            }
        };

        constraints.audio = {
            deviceId: {
                exact: audioDeviceId
            }
        };
    };

    const stream = await mediaDevicesObj.getUserMedia(constraints);

    // stream.getTracks().forEach((track) => {
    //     console.log(track.label)
    // });

    return stream;
};



// create an Option element of value device.label and add it to the
// dropdown of video devices
function addMediaToDropdowns(device) {
    const newOption = document.createElement("option");
    newOption.text = device.label;

    if (device.kind === "videoinput") cameraSelect.add(newOption);
    if (device.kind === "audioinput") audioSelect.add(newOption);
};


// change the value of dropdown selectors when media is changed
function setSelectorsToCurrentTrack(MediaStreamTrack) {
    if (MediaStreamTrack.kind === "video") {
        cameraSelect.value = MediaStreamTrack.label;
    } 
    else if (MediaStreamTrack.kind === "audio") {
        audioSelect.value = MediaStreamTrack.label;
    };
};


async function handleMediaChange(mediaDevicesObj,peerConnection) {
    const videoDeviceToChangeTo = cameraSelect.value;
    const audioDevoceToChangeTo = audioSelect.value;


    // create new local stream with newly selected devices
    const newLocalStream = await getLocalStream(mediaDevicesObj,{
        videoDeviceName: videoDeviceToChangeTo, 
        audioDeviceName: audioDevoceToChangeTo,
        initialSetup: false
    });


    // add new tracks to new local stream
    const newTracks = newLocalStream.getTracks(); 
    const newVideoTrack = newTracks.filter(track => track.kind === "video")[0];
    const newAudioTrack = newTracks.filter(track => track.kind === "audio")[0];


    // get senders from peerconnection
    const sendersArray = peerConnection.getSenders();
    const videoSender = getSender(sendersArray,"video");
    const audioSender = getSender(sendersArray,"audio");


    // add new stream to local video element
    selfVideo.srcObject = newLocalStream;


    // replace peerconnection tracks with tracks from new stream
    videoSender.replaceTrack(newVideoTrack);
    audioSender.replaceTrack(newAudioTrack);

    resizeVideoElement(remoteVideo);
}


export async function start(peerConnection) {

    const mediaDevicesObj = navigator.mediaDevices;
    const enumeratedDevices = await mediaDevicesObj.enumerateDevices();

    const localStream = await getLocalStream(mediaDevicesObj,{initialSetup: true});
    const remoteStream = new MediaStream();

    // add each device to the video dropdown
    enumeratedDevices.forEach((mediaDevice) => {
        addMediaToDropdowns(mediaDevice);
    });


    // add the current local tracks to the peer connection
    for (const track of localStream.getTracks()) {
        peerConnection.addTrack(track,localStream);

        // change the media select dropdown to the correct media
        setSelectorsToCurrentTrack(track);
    }
    
    // add local video stream to local video element
    selfVideo.srcObject = localStream;
    selfVideo.onloadedmetadata = () => {
        selfVideo.play();
    };


    // change local media sources when video select dropdown is changed
    cameraSelect.addEventListener("change", (e) => {
        handleMediaChange(mediaDevicesObj,peerConnection);
    });

    // change local media sources when audio select dropdown is changed
    audioSelect.addEventListener("change", (e) => {
        handleMediaChange(mediaDevicesObj,peerConnection);
    });


    return {localStream : localStream,
            remoteStream: remoteStream,
            selfVideo: selfVideo,
            remoteVideo: remoteVideo
        };
}