

export function startDataChannel(peerConnection) {
    const dataChannel = peerConnection.createDataChannel("datachannel");

    console.log(dataChannel);

    // datachannel handles
    dataChannel.onerror = (error) => {
    console.log("Data Channel Error:", error);
    };

    dataChannel.onmessage = (event) => {
    console.log("Got Data Channel Message:", event.data);
    };

    dataChannel.onopen = () => {
    dataChannel.send("Hello World!");
    };

    dataChannel.onclose = () => {
    console.log("The Data Channel is Closed");
    };

    return dataChannel;
}