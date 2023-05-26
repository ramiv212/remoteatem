import startServer from "./routes.js";
import startSockets from "./sockets.js";
import { printMyIp } from "./helpers.js";


import tls from 'tls';
tls.DEFAULT_MAX_VERSION = 'TLSv1.2';


// TODO offsets still now working properly on different window sizes
// TODO make it to where clicking on program or preview feed does not clear the tally
// TODO resize multiview click area offsets when resizing the window
// TODO add a check to make sure you have connection to the internet in local client
// TODO add session token so that refreshing browser won't disconnect session
// TODO add custom headers to websocket connection to make it more secure
// TODO add logic for when local client cannot find atem when trying to connect
// TODO display room number on client
// TODO better server logic for joining client to client in a room
// TODO ATEM to remote data
// TODO block people from going to /session without a sessionId
// TODO Room is full logic
// TODO Disconnect Logic
// TODO make a map to map console inputs to quadrants in multiview
// TODO add some check to see if the WebRTC connection has closed, in a timely manner
// TODO add a way to be checking if new media device has been added and add it to the list
    

printMyIp();
startServer();
startSockets();