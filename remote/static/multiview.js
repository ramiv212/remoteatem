import { atem } from "./atemHelpers.js"
import initDrawImage from "./multiviewcanvas.js";


const multiView = document.getElementById('multiview');

const windowButtons = {
    1: document.getElementById('windowButton1'),
    2: document.getElementById('windowButton2'),
    3: document.getElementById('windowButton3'),
    4: document.getElementById('windowButton4')
};

const multiViewWindowDivs = [];

// false means the quadrant only has 1 window
// true means quadrant has 4 windows
const multiviewGridConfig =  {
    1: false,
    2: false,
    3: true,
    4: true,
};


// FOR TESTING PURPOSES ONLY, DELETE THIS LATER
function addToCorrectQuadrant(index) {
    const map = {
        8:   3,
        9:   4,
        12:  5,
        13:  6,
        10:  0,
        11:  9,
        14:  8,
        15:  10,
    };

    if (index >= 8) {
        return map[index];
    };
};


// take the width of the multiview and divide it by 1.78
// set this new float value to the window height
// to get a 16/9 size window
function setMultiviewWidth(multiViewDiv) {
    multiViewDiv.style.width = `${window.innerWidth * 0.7}px`;
};


// position the video right under the multiview.
function setRemoteVideoPosition(remoteVideo,multiViewDiv) {
    const computedStyle = getComputedStyle(multiViewDiv);
    const width = computedStyle.width;
    const height = computedStyle.height;
    const left = multiView.getBoundingClientRect().x;
    const top = multiView.getBoundingClientRect().y;
    
    remoteVideo.style.width = width;
    remoteVideo.style.height = height;
    remoteVideo.style.top = `${top}px`;
    remoteVideo.style.left = `${left}px`;
};


// setMultiviewWidth(multiView);
// setRemoteVideoPosition(remoteVideoElement,multiView);
initDrawImage(remoteVideoElement);


// check if window is resized
window.addEventListener('resize', (_e) => {
    setMultiviewWidth(multiView);
    setRemoteVideoPosition(remoteVideoElement,multiView);
});


window.addEventListener('scroll',(_e) => {
    setRemoteVideoPosition(remoteVideoElement,multiView);
});


export function initMultiview() {
};
    