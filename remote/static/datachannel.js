

export function startDataChannel(peerConnection) {
    const dataChannel = peerConnection.createDataChannel("datachannel");


    // datachannel handles
    dataChannel.onerror = (error) => {
    console.log("Data Channel Error:", error);
    };



    dataChannel.onmessage = (event) => {
    console.log("Got Data Channel Message:", event.data);
    };



    dataChannel.onopen = () => {
        const message = JSON.stringify({
            dataChannelState: dataChannel.readyState
        });
        
        dataChannel.send(message);
        console.log(`dataChannel is ${dataChannel.readyState}`);
    };



    dataChannel.onclose = () => {
    console.log("The Data Channel is Closed");
    };



    return dataChannel;
}