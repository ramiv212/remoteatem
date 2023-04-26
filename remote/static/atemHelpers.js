import { socket } from "./webrtc.js";

export default function atem() {

    const testButton = document.getElementById('atem-test');

    console.log(testButton);

    function changeProgramInput(input) {
        socket.emit('message',{
            atem: {
                action: changeProgramInput,
                input: 1,
            }
        });
    };

    testButton.addEventListener('click',() => {
        changeProgramInput(1);
    });

}