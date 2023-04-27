class Atem {
    constructor() {
        this.dataChannel = null;
    };


    setDataChannel(dataChannel) {
        this.dataChannel = dataChannel;
        console.log(`Added ${this.dataChannel} to ATEM instance`)
    };


    sendToAtem(data) {
        if (this.dataChannel?.readyState === 'open') {
            const dataBody = {
                atem: data
            };
            const jsonifiedData = JSON.stringify(dataBody);
            this.dataChannel.send(jsonifiedData);
            console.log(jsonifiedData);
        }; 
    };


    changeProgramInput(input,me = 0) {
        this.sendToAtem({
            action: "changeProgramInput",
            values: {
                input: input,
                me: me
            },
        });


        
    };
};


export const atem = new Atem();