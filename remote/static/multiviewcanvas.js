import Multiview from './MultiviewObj.js';

const canvas = document.querySelector('canvas');
const video = document.querySelector('video');
const videoConfig = {
    FPS: 60,
    WIDTH: 1920,
    HEIGHT: 1080,
};


const mv = new Multiview(canvas,video,videoConfig);

const ctx = canvas.getContext('2d', { alpha: false });
let canvasInterval = null;



export default function drawCanvas(video) {

    canvasInterval = window.setInterval(() => {
        mv.drawImage(video);
    }, 1000 / videoConfig.FPS);


    video.onpause = function() {
        clearInterval(canvasInterval);
    };


    video.onended = function() {
        clearInterval(canvasInterval);
    };
    

    video.onplay = function() {
    

    clearInterval(canvasInterval);
        canvasInterval = window.setInterval(() => {

            mv.drawImage(video);

        }, 1000 / videoConfig.FPS);
    };

};