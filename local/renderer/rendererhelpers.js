export function capitalize(s)
{
    return s[0].toUpperCase() + s.slice(1);
};



// check if the app is being served locally or on a server
export function getHost() {
    const isLocal = window['electronAPI'].hostedLocally;
    console.log(`Is Local: ${isLocal}`);

    if (isLocal == 1) {
        return `http://127.0.0.1:5000`;
    }
    else {
        return `https://remoteatem-production.up.railway.app`;
    };
};