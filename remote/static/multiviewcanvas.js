import Multiview from './MultiviewObj.js';

const canvas = document.querySelector('canvas');
const video = document.querySelector('video');

const mv = new Multiview(canvas);

console.log(mv);


const FPS = 60;
const WIDTH = 1920;
const HEIGHT = 1080;

const ctx = canvas.getContext('2d', { alpha: false });
let canvasInterval = null;



function drawImage() {
    ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);
};



export default function initDrawImage(video) {

    canvasInterval = window.setInterval(() => {
        drawImage(video);
    }, 1000 / FPS);


    video.onpause = function() {
        clearInterval(canvasInterval);
    };


    video.onended = function() {
        clearInterval(canvasInterval);
    };
    

    video.onplay = function() {

    setClickListener();

    // initial setting of the offsetTop and offsetLeft values that will eventually change on resize
    offsetTop = canvas.offsetTop;
    offsetLeft = canvas.offsetLeft;

    clearInterval(canvasInterval);
        canvasInterval = window.setInterval(() => {
            drawImage(video);
            initWhiteGrid();
            setTallies();
            testOffsets();

        }, 1000 / FPS);
    };
};