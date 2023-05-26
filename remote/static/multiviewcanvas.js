import Multiview from './MultiviewObj.js';

const canvas = document.querySelector('canvas');
const video = document.querySelector('video');

const mv = new Multiview(canvas);

console.log(mv);

let offsetTop = null;
let offsetLeft = null;

const FPS = 60;
const WIDTH = 1920;
const HEIGHT = 1080;

const ctx = canvas.getContext('2d', { alpha: false });
let canvasInterval = null;



function drawImage() {
    ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);
};



// function to check if mouse click intersects with quadrant in multiview
function hit(rect, x, y) {
    return (x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height);
};




function getClickedQuadrant(e,quadrant) {
    const width = parseFloat(getComputedStyle(canvas).width.slice(0,-2)) / 2;
    const height = parseFloat(getComputedStyle(canvas).height.slice(0,-2)) / 2;


    // check if click is on a quadrant
    for (let i = 1; i <= Object.keys(quadrant).length ; i++)  {
        
        const rect = {
            x: (quadrant[i]['quadCoords'].x / 2) + offsetLeft,
            y: (quadrant[i]['quadCoords'].y / 2) + offsetTop,
            width: width,
            height: height,
        };

        if (hit(rect,e.x,e.y)) {
            return {index: i, id: quadrant[i].id};
        };
    };
};



function getClickedSubQuadrant(e,subQuadrant) {
    const width = parseFloat(getComputedStyle(canvas).width.slice(0,-2)) / 4;
    const height = parseFloat(getComputedStyle(canvas).height.slice(0,-2)) / 4;


    // check if click is on a subQuadrant
    for (let i = 1; i <= Object.keys(subQuadrant).length ; i++)  {
        
        const rect = {
            x: (subQuadrant[i]['quadCoords'].x / 2) + offsetLeft,
            y: (subQuadrant[i]['quadCoords'].y / 2) + offsetTop,
            width: width,
            height: height,
        };


        if (hit(rect,e.x,e.y)) {
            return {index: i, id: subQuadrant[i].id};
        };
    };
};


function setClickListener() {
    // handle clicking on multiview
    document.addEventListener('click',(e) => {
        const clickedOnSquare = getClickedQuadrant(e,multiViewGridState).index;

        if (clickedOnSquare) {        
            // logic for clicking on a subquadrant
            if (multiViewGridState[clickedOnSquare].isDivided) {
                const clickedOnsubQuadrant = getClickedSubQuadrant(e,multiViewGridState[clickedOnSquare]['subQuad']);

                // loop over each subQuadrant in the quadrant that was clicked on
                for (let i = 1; i <= 4; i++) {
                    const subQuadrantId = multiViewGridState[clickedOnSquare]['subQuad'][i].id;

                    // find the quadrant that was clicked on and make it live 
                    // *** Maybe refactor this later into a separate function that finds and returns the subquadrant
                    if (subQuadrantId === clickedOnsubQuadrant.id) {
                        multiViewGridState[clickedOnSquare]['subQuad'][i].isLive = true;
                    };
                };

            // logic for clicking on a quadrant
            } else {
                multiViewGridState[clickedOnSquare].isLive = true;
            };
        } 
    });
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