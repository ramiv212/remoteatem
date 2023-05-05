function createSocket(url,token){
    const { io } = require("socket.io-client");
    const socket = io(url, {
        auth: {
            token: "abcd"
          }
    });

    return socket 
};
    


exports.createSocket = createSocket;