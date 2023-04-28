import startServer from "./routes.js";
import startSockets from "./sockets.js";


// TODO add custom headers to websocket connection to make it more secure
// TODO refactor all local client code to ES6
// TODO add logic for when local client cannot find atem when trying to connect
// TODO display room number on client
// TODO better server logic for joining client to client in a room
// TODO ATEM to remote data
// TODO remote to ATEM data
// TODO block people from going to /session without a sessionId
// TODO Room is full logic
// TODO Disconnect Logic
// TODO fix aspect ratio for multiview width on wide screen
// maybe put multiview over video instead?
// TODO make a map to map console inputs to quadrants in multiview
// TODO add some check to see if the WebRTC connection has closed, in a timely manner
// TODO "session does not exist" server response is not changing session status textm

startServer();
startSockets();