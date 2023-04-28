import { io } from "./routes.js"
import User from "./User.js";
import { activeSessions,doesThisSessionExist } from "./activesessions.js";

export default function startSockets() {
    io.on("connection", (socket) => {
        console.log("connection");


        // client will send a message to server asking to join its socket
        // to a room of the session uuid
        socket.on("join-room", (userInfo) => {

            // socket of user leaves their own socket room and joins a room of sessionId
            socket.leave(socket.id);
            socket.join(userInfo.sessionId);


            // if the session already exists, return the session
            const sessionToJoin = doesThisSessionExist(activeSessions,userInfo.roomId);

            // if the session already exists, add user to this session
            if (sessionToJoin) {
                const userToJoin = new User(userInfo.type,socket)
                sessionToJoin.addUser(userToJoin);
            };
            

            // if both users are in, emit message to both users to start the session
            if (sessionToJoin?.isReady()) {
                console.log('Session Starting!')
                sessionToJoin.remoteUser.socket.emit("start-call",true);
                sessionToJoin.localUser.socket.emit("start-call",true);
            };
        });


        // relay any websocket messages from one socket to the other
        socket.on("message", (data) => {
            socket.broadcast.emit("message",data);
        });
    });
};
    