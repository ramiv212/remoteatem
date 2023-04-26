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
    };

    addUser(user) {
        if (user.type === "remote") {
            this.remoteUser = user;
        }

        else if(user.type === "local") {
            this.localUser = user;
        };
    };

    isReady() {
        if (this.remoteUser && this.localUser) {
            return true
        } else {
            return false;
        };
    };
};