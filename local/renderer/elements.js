const roomIdInput = document.getElementById("room-id-input");
const atemIpInput = document.getElementById("atem-ip-input");
const beginSessionButton = document.getElementById("begin-session-button");
const connectToAtemButton = document.getElementById("connect-to-atem-button");
const sessionStatusText = document.getElementById("session-status-text");
const atemConnectionStatusText = document.getElementById('atem-connection-status-text');
const signalServerStatusLight = document.getElementById('signal-server-status-light');
const loadingHtml = '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';

export {
    roomIdInput,
    atemIpInput,
    beginSessionButton,
    connectToAtemButton,
    sessionStatusText,
    atemConnectionStatusText,
    signalServerStatusLight,
    loadingHtml,
};