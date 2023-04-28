import { randomUUID } from "crypto"
import { activeSessions } from "./activesessions.js";


export default class ActiveRemoteSession {
    constructor(roomId) {
        this.roomId = roomId;
        this.uuid = randomUUID();
        this.remoteUser = null;
        this.localUser = null;

        // add this session to the list of active sessions
        activeSessions.push(this);

        // close this session if both users have disconnected
    };

    addUser(user) {
        this.checkDisconnects(user);

        if (user.type === "remote") {
            this.remoteUser = user;
        }

        else if(user.type === "local") {
            this.localUser = user;
        };
    };

    isReady() {
        if (this.remoteUser && this.localUser) {
            this.printSessions();
            return true
        } else {
            return false;
        };
    };


    end() {
        this.remoteUser?.socket.disconnect();
        this.localUser?.socket.disconnect();
        this.remoteUser = null;
        this.localUser = null;
        const indexOfSession = activeSessions.indexOf(this);
        activeSessions.splice(indexOfSession,1);
    };


    forceEndIfEmpty() {
        if (!this.localUser?.socket.connected && !this.remoteUser?.socket.connected) {
            this.end();
            console.log(`Session ${this.roomId} closed`);
        };
    };


    printSessions() {
        console.log(`*** Active Sessions:***`)
        activeSessions.forEach((session) => {
            console.log(`\n   Session: ${this.roomId}`)
            console.log(`       Local User: ${this.localUser.socket.id}`);
            console.log(`       Remote User: ${this.remoteUser.socket.id}`);
        });
    };


    checkDisconnects(user) {
        console.log(user.socket.connected);
        user.socket.on('disconnect',() => {
            this.forceEndIfEmpty();
            console.log('Remote User Disconnected');
        });
    };
}; 