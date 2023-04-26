import startServer from "./routes.js";
import startSockets from "./sockets.js";

// TODO display room number on client
// TODO better server logic for joining client to client in a room

startServer();
startSockets();