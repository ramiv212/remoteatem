import express from "express"
import bodyParser from 'body-parser'
import { createServer } from "http"
import { Server } from "socket.io"
import cors from 'cors'
import ActiveRemoteSession from "./ActiveRemoteSession.js"
import { activeSessions } from "./activesessions.js"
import path from "path"

const PORT = process.env.PORT ?? 5000;

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
    cors: {
      origin: "*"
    }
});

const corsOptions = {
    origin: '*'
}


app.use(express.static(path.join(process.cwd(), '/static')))
app.use(bodyParser.json());
app.use(cors(corsOptions));



app.get("/",(req,res) => {
    res.sendFile('login.html', {root : './views'});
});



// returns active session if it exists
export function doesThisRoomExist(activeSessions,roomId) {
    return activeSessions.filter(session => session.roomId === roomId)[0];
};



app.post("/create-session", (req,res) => {
    const roomId = req.body.roomId;
    console.log("**** Active sessions:")
    const currentSession = doesThisRoomExist(activeSessions,roomId);
    
    if (currentSession) {
        console.log(currentSession)
        console.log(`Added remote client to session of ID: ${currentSession.uuid}`);
        res.send({
            sessionId: currentSession.uuid});
    } 
    
    else {
        const newSession = new ActiveRemoteSession(roomId);
        console.log(`Created new session of ID: ${newSession.uuid}`);
        res.send({
            sessionId: newSession.uuid});
    };
});



app.post("/get-session-id", (req,res) => {
    console.log(req.ip);
    const roomId = req.body.roomId;
    const currentSession = doesThisRoomExist(activeSessions,roomId);
    
    if (currentSession) {
        console.log(`Local User: ${currentSession.localUser?.socket.id}`);
        console.log(`Remote User: ${currentSession.remoteUser?.socket.id}`);

        console.log(`Added local client to session of ID: ${currentSession.uuid}`);
        res.send({sessionId: currentSession.uuid})

        console.log(`Local User: ${currentSession.localUser?.socket.id}`);
        console.log(`Remote User: ${currentSession.remoteUser?.socket.id}`);
    } 
    
    else {
        res.send({"error":"Session does not exist"})
    };
});



app.get("/session",(req,res) => {
    console.log(req.query.sessionId);
    res.sendFile('session.html', {root : './views'});
});




export default function startServer() {
    httpServer.listen(PORT,() => {
        console.log(`Listening on port: ${PORT}`)
    });
};