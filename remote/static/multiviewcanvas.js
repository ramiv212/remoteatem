const canvas = document.querySelector('canvas');
const video = document.querySelector('video');


const FPS = 60;
const WIDTH = 1920;
const HEIGHT = 1080;

const ctx = canvas.getContext('2d', { alpha: false });
let canvasInterval = null;



// false means the quadrant only has 1 window
// true means quadrant has 4 windows
const multiviewGridConfig =  {
    1: false,
    2: false,
    3: false,
    4: false,
};



function drawImage() {
    ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);
};



// this function draws a red square around a quadrant or subquadrant when the coordinates and dimenstions are passed into it.
function drawRedTally({ x , y, divisor}) {
    ctx.lineWidth = 7;
    ctx.strokeStyle = "red";
    ctx.strokeRect(x, y, WIDTH / divisor, HEIGHT / divisor);
};




// this function draws a red square around a quadrant or subquadrant when the coordinates and dimenstions are passed into it.
function drawWhiteQuadrant(i,{ x , y, divisor}) {
    ctx.lineWidth = 7;
    ctx.strokeStyle = "white";
    ctx.strokeRect(x, y, WIDTH / divisor, HEIGHT / divisor);
    ctx.fillStyle = 'white';
    ctx.font = "30px Arial";
    ctx.fillText(i, x + 10, y + 35);
};




// init quadrants by creating an object of objects that represents the x and y starting position of each square
// by dividing the WIDTH and HEIGHT of the canvas into 2
// each square is numbered from 1 through 4, top-to-bottom and left-to-right.
// the divisor is to help the drawRedTally function know what number to divide the WIDTH and HEIGHT to to get the dimensions of the square
const quadrantCoords = {};
let quadrantCount = 1;

for (let y = 0; y < HEIGHT; y += (HEIGHT / 2)) {
    for (let x = 0; x < WIDTH; x += (WIDTH / 2)) {
        quadrantCoords[quadrantCount] = {x: x, y: y, divisor: 2};
        quadrantCount ++;
    };
};




// init subquadrants by creating an object of objects that represents the x and y starting position of each square
// by dividing the WIDTH and HEIGHT of the canvas into 4
// each square is numbered from 1 through 16, top-to-bottom and left-to-right.
// the divisor is to help the drawRedTally function know what number to divide the WIDTH and HEIGHT to to get the dimensions of the square
const subQuadrantCoords = {};
let subQuadrantCount = 1;

for (let y = 0; y < HEIGHT; y += (HEIGHT / 4)) {
    for (let x = 0; x < WIDTH; x += (WIDTH / 4)) {
        subQuadrantCoords[subQuadrantCount] = {x: x, y: y, divisor: 4};
        drawWhiteQuadrant(subQuadrantCount,subQuadrantCoords[subQuadrantCount])
        subQuadrantCount ++;
    };
};





const multiViewGridState = {
    1: {
        isLive: false,
        isActive: false,
        isProgram: false,
        isPreview: false,
        isDivided: false,
        quad: quadrantCoords[1],
        subQuad: {
            1: subQuadrantCoords[1],
            2: subQuadrantCoords[2],
            3: subQuadrantCoords[5],
            4: subQuadrantCoords[6]
        }
    },
    
    2: {
        isLive: false,
        isActive: false,
        isProgram: false,
        isDivided: false,
        quad: quadrantCoords[2],
        subQuad: {
            1: subQuadrantCoords[3],
            2: subQuadrantCoords[4],
            3: subQuadrantCoords[7],
            4: subQuadrantCoords[8]
        }
    },

    3: {
        isLive: false,
        isActive: false,
        isProgram: false,
        isDivided: false,
        quad: quadrantCoords[3],
        subQuad: {
            1: subQuadrantCoords[9],
            2: subQuadrantCoords[10],
            3: subQuadrantCoords[13],
            4: subQuadrantCoords[14]
        }
    },

    4: {
        isLive: false,
        isActive: false,
        isProgram: false,
        isDivided: false,
        quad: quadrantCoords[4],
        subQuad: {
            1: subQuadrantCoords[11],
            2: subQuadrantCoords[12],
            3: subQuadrantCoords[15],
            4: subQuadrantCoords[16]
        }
    },
};


function initWhiteGrid() {
    // iterate over the boolean config object
    for (let i = 1; i <= Object.keys(multiviewGridConfig).length; i++) {

        // if the config for this quadrant is set to true, then draw a subQuadrant of four squares sin this quadrant
        if (multiviewGridConfig[i]) {
            for (let j = 1; j <= Object.keys(multiViewGridState[i]['subQuad']).length; j++) {
                drawWhiteQuadrant(j,multiViewGridState[i]['subQuad'][j]);
            };
        // if it is set to false then only draw a square around the quadrant
        } else {
            drawWhiteQuadrant(i,multiViewGridState[i]['quad']);
        };
    };
};




// function to check if mouse click intersects with quadrant in multiview
function hit(rect, x, y) {
    return (x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height);
};




document.addEventListener('click',(e) => {
    const offsetTop = canvas.offsetTop;
    const offsetLeft = canvas.offsetLeft;
    const width = parseFloat(getComputedStyle(canvas).width.slice(0,-2)) / 2;
    const height = parseFloat(getComputedStyle(canvas).height.slice(0,-2)) / 2;


    for (let i = 1; i <= Object.keys(multiViewGridState).length ; i++)  {
        const rect = {
            x: (multiViewGridState[i]['quad'].x / 2) + offsetLeft,
            y: (multiViewGridState[i]['quad'].y / 2) + offsetTop,
            width: width,
            height: height,
        };

        console.log(i,hit(rect,e.x,e.y));

    };
});



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
    clearInterval(canvasInterval);
        canvasInterval = window.setInterval(() => {
            drawImage(video);
            initWhiteGrid();
        }, 1000 / FPS);
    };
};




// take the WIDTH of the multiview and divide it by 1.78
// set this new float value to the window HEIGHT
// to get a 16/9 size window
function setMultiviewWidth(canvas) {
    canvas.style.width = `${window.innerWidth * 0.7}px`;
};




setMultiviewWidth(canvas);

// check if window is resized
window.addEventListener('resize', (_e) => {
    setMultiviewWidth(canvas);
});