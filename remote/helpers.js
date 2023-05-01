import os from 'os';

export function printMyIp() {
    const networkInterfaces = os.networkInterfaces();
    const networkInterfaceKeys = Object.keys(networkInterfaces);

    networkInterfaceKeys.forEach((intf) => {
        if (intf === 'en0') {
            networkInterfaces[intf].forEach((net) => {
                if (net.family === 'IPv4') {
                    console.log(`Your IP is ${net.address}`);
                };
            });
        };
    });
};