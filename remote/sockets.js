import { io } from "./routes.js"
import User from "./User.js";
import { doesThisRoomExist } from "./routes.js";
import { activeSessions,doesThisSessionExist } from "./activesessions.js";

export default function startSockets() {
    io.on("connection", (socket) => {
        console.log("connection");

        // rudementary code to determine if user is polite or not polite
        // users.push(socket);
        // if (users.length === 2) {
        //     for (let i = 0; i < users.length; i++) {
        //         users[i].emit("isCaller",i)
        //     };
        //     users.length = 0;
        // };



        // client will send a message to server asking to join its socket
        // to a room of the session uuid
        socket.on("join-room", (userInfo) => {

            socket.leave(socket.id);
            socket.join(userInfo.sessionId);

            
            const sessionToJoin = doesThisSessionExist(activeSessions,userInfo.roomId);

            if (sessionToJoin) {
                const userToJoin = new User(userInfo.type,socket)

                sessionToJoin.addUser(userToJoin);
            };
            
            if (sessionToJoin.isReady()) {
                console.log('Session Starting!')
                sessionToJoin.remoteUser.socket.emit("start-call",true);
                sessionToJoin.localUser.socket.emit("start-call",true);
            };

        });

        socket.on("message", (data) => {
            socket.broadcast.emit("message",data);
        });
    });
};
    