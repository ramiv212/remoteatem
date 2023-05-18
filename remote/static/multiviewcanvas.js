const canvas = document.querySelector('canvas');
const video = document.querySelector('video');


const FPS = 60;
const WIDTH = 1920;
const HEIGHT = 1080;

const ctx = canvas.getContext('2d', { alpha: false });
let canvasInterval = null;



function drawImage() {
    ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);
};



// this function draws a red square around a quadrant or subquadrant when the coordinates and dimenstions are passed into it.
function drawRedTally({ x , y, width,height}) {
    console.log(`ran drawRedTally\n`)
    console.log({x,y,width,height})
    ctx.lineWidth = 7;
    ctx.strokeStyle = "red";
    ctx.strokeRect(x, y, width, height);
};



// this function draws a red square around a quadrant or subquadrant when the coordinates and dimenstions are passed into it.
function drawGreenTally({ x , y, width,height}) {
    ctx.lineWidth = 7;
    ctx.strokeStyle = "green";
    ctx.strokeRect(x, y, width, height);
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
        quadrantCoords[quadrantCount] = {x: x, y: y, width:WIDTH / 2, height: HEIGHT / 2, divisor: 2,id: `q${quadrantCount}`};
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
        subQuadrantCoords[subQuadrantCount] = {x: x, y: y, width: WIDTH / 4, height: HEIGHT / 4, divisor: 4,id: `s${subQuadrantCount}`};
        subQuadrantCount ++;
    };
};





const multiViewGridState = {
    1: {
        id: 'q1',
        isLive: false,
        isActive: false,
        isProgram: false,
        isPreview: false,
        isDivided: false,
        quad: quadrantCoords[1],
        subQuad: {
            1: {
                id: 's1',
                isLive: false,
                isProgram: false,
                isPreview: false,
                quad: subQuadrantCoords[1],
            },

            2: {
                id: 's2',
                isLive: false,
                isProgram: false,
                isPreview: false,
                quad: subQuadrantCoords[2],
            },

            3: {
                id: 's3',
                isLive: false,
                isProgram: false,
                isPreview: false,
                quad: subQuadrantCoords[5],
            },

            4: {
                id: 's4',
                isLive: false,
                isProgram: false,
                isPreview: false,
                quad: subQuadrantCoords[6],
            },
        }
    },
    
    2: {
        id: 'q2',
        isLive: false,
        isActive: false,
        isProgram: false,
        isDivided: false,
        quad: quadrantCoords[2],
        subQuad: {
            1: {
                id: 's5',
                isLive: false,
                isProgram: false,
                isPreview: false,
                quad: subQuadrantCoords[3],
            },

            2: {
                id: 's6',
                isLive: false,
                isProgram: false,
                isPreview: false,
                quad: subQuadrantCoords[4],
            },

            3: {
                id: 's7',
                isLive: false,
                isProgram: false,
                isPreview: false,
                quad: subQuadrantCoords[7],
            },

            4: {
                id: 's8',
                isLive: false,
                isProgram: false,
                isPreview: false,
                quad: subQuadrantCoords[8],
            },
        }
    },

    3: {
        id: 'q3',
        isLive: false,
        isActive: false,
        isProgram: false,
        isDivided: true,
        quad: quadrantCoords[3],
        subQuad: {
            1: {
                id: 's9',
                isLive: true,
                isProgram: false,
                isPreview: false,
                quad: subQuadrantCoords[9],
            },

            2: {
                id: 's10',
                isLive: false,
                isProgram: false,
                isPreview: false,
                quad: subQuadrantCoords[10],
            },

            3: {
                id: 's11',
                isLive: false,
                isProgram: false,
                isPreview: false,
                quad: subQuadrantCoords[13],
            },

            4: {
                id: 's12',
                isLive: false,
                isProgram: false,
                isPreview: false,
                quad: subQuadrantCoords[14],
            },
        }
    },

    4: {
        id: 'q4',
        isLive: false,
        isActive: false,
        isProgram: false,
        isDivided: true,
        quad: quadrantCoords[4],
        subQuad: {
            1: {
                id: 's13',
                isLive: false,
                isProgram: false,
                isPreview: false,
                quad: subQuadrantCoords[11],
            },

            2: {
                id: 's14',
                isLive: false,
                isProgram: false,
                isPreview: false,
                quad: subQuadrantCoords[12],
            },

            3: {
                id: 's15',
                isLive: false,
                isProgram: false,
                isPreview: false,
                quad: subQuadrantCoords[15],
            },

            4: {
                id: 's16',
                isLive: false,
                isProgram: false,
                isPreview: false,
                quad: subQuadrantCoords[16],
            },
        }
    },
};


function initWhiteGrid() {
    // iterate over the boolean config object
    for (let i = 1; i <= Object.keys(multiViewGridState).length; i++) {

        // if the config for this quadrant is set to true, then draw a subQuadrant of four squares sin this quadrant
        if (multiViewGridState[i].isDivided) {
            for (let j = 1; j <= Object.keys(multiViewGridState[i]['subQuad']).length; j++) {
                drawWhiteQuadrant(j,multiViewGridState[i]['subQuad'][j]['quad']);
            };
        // if it is set to false then only draw a square around the quadrant
        } else {
            drawWhiteQuadrant(i,multiViewGridState[i]['quad']);
        };
    };
};



function clearAllIsLive() {
    for (let i = 1; i <= 4; i++) {
        multiViewGridState[i].isLive = false;

        for (let j = 1; j <= 4; j++) {
            multiViewGridState[i]['subQuad'][j].isLive = false;
        };
    };
};



function clearAllIsPreviewed() {

};



function setTallies() {
    for (let i = 1; i <= 4; i++) {
        if (!multiViewGridState[i].isProgram && !multiViewGridState[i].isPreview) {
            if (multiViewGridState[i].isLive) {
                drawRedTally(multiViewGridState[i]['quad']);
            } else {
                for (let j = 1; j <= 4; j++) {
                    const square = multiViewGridState[i]['subQuad'][j];
                    if (!square.isProgram && !square.isPreview && square.isLive) {
                        console.log(square);
                        drawRedTally(square['quad']);
                    };
                };
            };
        };
    };
};



// function to check if mouse click intersects with quadrant in multiview
function hit(rect, x, y) {
    return (x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height);
};




function getClickedQuadrant(e,quadrant) {
    const offsetTop = canvas.offsetTop;
    const offsetLeft = canvas.offsetLeft;
    const width = parseFloat(getComputedStyle(canvas).width.slice(0,-2)) / 2;
    const height = parseFloat(getComputedStyle(canvas).height.slice(0,-2)) / 2;


    // check if click is on a quadrant
    for (let i = 1; i <= Object.keys(quadrant).length ; i++)  {
        
        const rect = {
            x: (quadrant[i]['quad'].x / 2) + offsetLeft,
            y: (quadrant[i]['quad'].y / 2) + offsetTop,
            width: width,
            height: height,
        };

        if (hit(rect,e.x,e.y)) {
            return {index: i, id: quadrant[i].id};
        };
    };
};



function getClickedSubQuadrant(e,subQuadrant) {
    const offsetTop = canvas.offsetTop;
    const offsetLeft = canvas.offsetLeft;
    const width = parseFloat(getComputedStyle(canvas).width.slice(0,-2)) / 4;
    const height = parseFloat(getComputedStyle(canvas).height.slice(0,-2)) / 4;


    // check if click is on a subQuadrant
    for (let i = 1; i <= Object.keys(subQuadrant).length ; i++)  {
        
        const rect = {
            x: (subQuadrant[i]['quad'].x / 2) + offsetLeft,
            y: (subQuadrant[i]['quad'].y / 2) + offsetTop,
            width: width,
            height: height,
        };

        console.log(e.x,rect.x)
        console.log(e.y,rect.y)

        if (hit(rect,e.x,e.y)) {
            return {index: i, id: subQuadrant[i].id};
        };
    };
};



// handle clicking on multiview
document.addEventListener('click',(e) => {
    const clickedOnSquare = getClickedQuadrant(e,multiViewGridState).index;

    if (clickedOnSquare) {
        clearAllIsLive();
        
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
                    console.log(multiViewGridState[clickedOnSquare]['subQuad'][i]);
                };
            };

        // logic for clicking on a quadrant
        } else {
            multiViewGridState[clickedOnSquare].isLive = true;
        };
    } 
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
            setTallies();
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