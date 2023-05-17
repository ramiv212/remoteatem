const getHost = function getHost() {
    if (process.env.LOCALHOST == 1) {
        return `http://127.0.0.1:5000`;
    }
    else {
        return `wss://remoteatem-production.up.railway.app`;
    };
};

exports.getHost = getHost;