const remoteVideoElement = document.getElementById('remoteview');

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


const multiViewOnclickFunction = function (e) {
    multiViewWindowDivs.forEach((window) => {
        window.classList.remove("live");
    });

    e.target.classList.add("live");
};


function initMultiviewOnclicks(multiViewOnclickFunction) {
    const quadrants = document.getElementsByClassName('subquadrant-window');
    for (let i = 0; i < quadrants.length; i++) {
        quadrants[i].onclick = (e) => {
            multiViewOnclickFunction(e);
        };

        // add this quadrant div to multiViewWindowDivs
        // this list is used to clear the "Live" or "Preview" state on all other windows when one is clicked.
        multiViewWindowDivs.push(quadrants[i]);
    };

    const subQuadrants = document.getElementsByClassName('quadrant-window');
    for (let i = 0; i < subQuadrants.length; i++) {
        subQuadrants[i].onclick = (e) => {
            multiViewOnclickFunction(e);
        };

        // add this quadrant div to multiViewWindowDivs
        // this list is used to clear the "Live" or "Preview" state on all other windows when one is clicked.
        multiViewWindowDivs.push(subQuadrants[i]);
    };
};


// take the width of the multiview and divide it by 1.78
// set this new float value to the window height
// to get a 16/9 size window
function setMultiviewWidth(multiViewDiv) {
    const multiViewDivWidth = getComputedStyle(multiViewDiv).width;
    const floatWidth = parseFloat(multiViewDivWidth) / 1.78;
    multiViewDiv.style.height = `${floatWidth}px`;
};


function setRemoteVideoPosition(remoteVideo,multiViewDiv) {
    const computedStyle = getComputedStyle(multiViewDiv);
    const width = computedStyle.width;
    const height = computedStyle.height;
    const left = multiView.getBoundingClientRect().x;
    const top = multiView.getBoundingClientRect().y;

    console.log(multiViewDiv.getBoundingClientRect())
    
    remoteVideo.style.width = width;
    remoteVideo.style.height = height;
    remoteVideo.style.top = `${top}px`;
    remoteVideo.style.left = `${left}px`;

};


setMultiviewWidth(multiView);
setRemoteVideoPosition(remoteVideoElement,multiView);


// check if window is resized
window.addEventListener('resize', (e) => {
    setMultiviewWidth(multiView);
    setRemoteVideoPosition(remoteVideoElement,multiView);
});


function divideQuadrant(quadrantNumber) {
    const quadrantDiv = document.getElementById(`qw${quadrantNumber}`);
    const subQuadrantDiv = document.getElementById(`s${quadrantNumber}`);

    quadrantDiv.style.display = 'none';
    subQuadrantDiv.style.display = 'grid';
};

function unDivideQuadrant(quadrantNumber) {
    const quadrantDiv = document.getElementById(`qw${quadrantNumber}`);
    const subQuadrantDiv = document.getElementById(`s${quadrantNumber}`);

    quadrantDiv.style.display = 'grid';
    subQuadrantDiv.style.display = 'none';
};

function initConfigMultiviewWindows(multiviewGridConfig,gridNumber) {
    let displaySubquadrant = multiviewGridConfig[gridNumber];
    if (displaySubquadrant) {
        divideQuadrant(gridNumber);
    } else {
        unDivideQuadrant(gridNumber);
    };
};

function configMultiviewWindows(multiviewGridConfig,gridNumber) {
    let displaySubquadrant = multiviewGridConfig[gridNumber];

    if (!displaySubquadrant) {
        divideQuadrant(gridNumber);
    } else {
        unDivideQuadrant(gridNumber);
    };

    multiviewGridConfig[gridNumber] = !multiviewGridConfig[gridNumber];
};

function windowConfigButtonsActions(windowButtons) {
    for (let i = 1; i < 5; i++) {
        windowButtons[i].onclick = () => {configMultiviewWindows(multiviewGridConfig,i)};
    };
};

function initWindowDivisions(multiviewGridConfig) {
    for (let i = 1; i < 5; i++) {
        initConfigMultiviewWindows(multiviewGridConfig,i);
    };
};


export function initMultiview() {
    initMultiviewOnclicks(multiViewOnclickFunction);
    initWindowDivisions(multiviewGridConfig);
    windowConfigButtonsActions(windowButtons);
};
    