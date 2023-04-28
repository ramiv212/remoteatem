function createSocket(url){
    const { io } = require("socket.io-client");
    const socket = io(url);

    socket.on('connect',() => {
        console.log('connected!');
    });

    socket.on('disconnect',() => {
        console.log('disconnected!');
    });
    
    return socket 
};
    


exports.createSocket = createSocket;