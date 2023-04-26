export const activeSessions = [];

export function doesThisSessionExist(activeSessions,sessionId) {
    return activeSessions.filter(session => session.sessionId === sessionId)[0];
};