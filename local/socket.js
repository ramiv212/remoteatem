function createSocket(url){
    const { io } = require("socket.io-client");
    const socket = io(url);

    return socket 
};
    


exports.createSocket = createSocket;