import { atem } from "./atemHelpers.js";

const defaultNameMap = {
    0: 'Black',
    1 : 'Input 1',
    2 : 'Input 2',
    3 : 'Input 3',
    4 : 'Input 4',
    5 : 'Input 5',
    6 : 'Input 6',
    7 : 'Input 7',
    8 : 'Input 8',
    9 : 'Input 9',
    10: 'Input 10',
    11: 'Input 11',
    12: 'Input 12',
    13: 'Input 13',
    14: 'Input 14',
    15: 'Input 15',
    16: 'Input 16',
    17: 'Input 17',
    18: 'Input 18',
    19: 'Input 19',
    20: 'Input 20',
    1000: 'Color Bars',
    2001: 'Color 1',
    2002: 'Color 2',
    3010: 'Media Player 1',
    3011: 'Media Player 1 Key',
    3020: 'Media Player 2',
    3021: 'Media Player 2 Key',
    4010: 'Key 1 Mask',
    4020: 'Key 2 Mask',
    4030: 'Key 3 Mask',
    4040: 'Key 4 Mask',
    5010: 'DSK 1 Mask',
    5020: 'DSK 2 Mask',
    6000: 'Super Source',
    7001: 'Clean Feed 1',
    7002: 'Clean Feed 2',
    8001: 'Auxilary 1',
    8002: 'Auxilary 2',
    8003: 'Auxilary 3',
    8004: 'Auxilary 4',
    8005: 'Auxilary 5',
    8006: 'Auxilary 6',
    10010: 'ME 1 Prog',
    10011: 'ME 1 Prev',
    10020: 'ME 2 Prog',
    10021: 'ME 2 Prev',
    null: 'None'
};

// FOR TESTING PURPOSES ONLY, DELETE THIS LATER
const inputMap = {
    'q1'  : 10010,
    'q2'  : 10011,
    'q3'  : null,
    'q4'  : null,
    'sq1' : null,
    'sq2' : null,
    'sq3' : null,
    'sq4' : null,
    'sq5' : null,
    'sq6' : null,
    'sq7' : null,
    'sq8' : null, 
    'sq9' : 1,
    'sq10': 2,
    'sq11': 3,
    'sq12': 4,
    'sq13': 5,
    'sq14': 6,
    'sq15': 7,
    'sq16': 8,
};


class Quadrant {
    constructor(x,y,width,height,id,xIdx,yIdx) {
        this.coords = {
            x: x,
            y: y,
            width: width,
            height: height,
            xIdx: xIdx,
            yIdx: yIdx,
            divisor: 2,
        };

        this.offsetLeft = null;
        this.offsetTop = null;

        this.id = id;

        this.subQuadrants = [];

        this.isLive = false;
        this.isProgram = false;
        this.isPreview = false;
        this.isDivided = false;

        this.label = '';
        this.input = 0;
    };
};


class SubQuadrant {
    constructor(x,y,width,height,id,xIdx,yIdx) {
        this.coords = {
            x: x,
            y: y,
            width: width,
            height: height,
            xIdx: xIdx,
            yIdx: yIdx,
            divisor: 4,
        };
        this.id = id;

        this.isLive = false;
        this.isProgram = false;
        this.isPreview = false;

        this.label = '';
        this.input = 0;

    };
};


export default class Multiview {
    constructor(canvas,video,videoConfig) {

        this.canvas = canvas;
        this.video = video;
        this.videoConfig = videoConfig;
        this.ctx = this.canvas.getContext('2d', { alpha: false });

        this.CANVASWIDTH = 1920;
        this.CANVASHEIGHT = 1080;

        this.COMPUTEDWIDTH = null;
        this.COMPUTEDHEIGHT = null;

        this.quadrants = [];
        this.subQuadrants = [];

        // settings offcanvas
        this.offcanvas = document.getElementsByClassName('offcanvas')[0];
        this.settingsButton = document.getElementById('settings-button');
        this.closeSettingsButton = document.getElementsByClassName('btn-close')[0];
        
        this.mvMiniConfigQuadrants = document.getElementsByClassName('mini-grid-quad');
        this.mvMiniConfigSubQuadrants = document.getElementsByClassName('mini-grid-subquad');

        this.labelSelectDropdown = document.getElementById('label-select');
        this.selectedMiniMvQuad = null;

        this.mvConfigQuadLabelTexts = document.getElementsByClassName('mv-config-quad-label');
        this.mvConfigSubQuadLabelTexts = document.getElementsByClassName('mv-config-subquad-label');


        // init
        this.initQuadrants();
        this.initSubQuadrants();

        this.setCanvasWidth()
        this.setComputedWidth();

        this.quadrants[0].isDivided = false;
        this.quadrants[1].isDivided = false;
        this.quadrants[2].isDivided = true;
        this.quadrants[3].isDivided = true;

        this.addSubquadrantsToQuadrants();
        this.allQuadrants = this.quadrants.concat(this.subQuadrants);
        this.setMultiviewOffset();
        this.setWindowResizeListener();
        this.setClickListeners();
        this.initWhiteGrid();
        this.setMiniGridVisibility();

    };


    sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
      }


    stripPx(string) {
        return parseFloat(string.slice(0,-2));
    };





    initQuadrants() {
        let quadrantCount = 1;
        let xIdx = 0;
        let yIdx = 0;

        for (let y = 0; y < this.CANVASHEIGHT; y += (this.CANVASHEIGHT / 2)) {
            for (let x = 0; x < this.CANVASWIDTH; x += (this.CANVASWIDTH / 2)) {

                const xIdx = x / (this.CANVASWIDTH / 2);
                const yIdx = y / (this.CANVASHEIGHT / 2);

                this.quadrants.push(new Quadrant(x,y,this.CANVASWIDTH / 2,this.CANVASHEIGHT / 2,`q${quadrantCount}`,xIdx,yIdx));
                quadrantCount ++;
            };
       };
    };


    initSubQuadrants() {
        let subQuadrantCount = 1;

        for (let y = 0; y < this.CANVASHEIGHT; y += (this.CANVASHEIGHT / 4)) {
            for (let x = 0; x < this.CANVASWIDTH; x += (this.CANVASWIDTH / 4)) {

                const xIdx = x / (this.CANVASWIDTH / 4);
                const yIdx = y / (this.CANVASHEIGHT / 4);

                this.subQuadrants.push(new SubQuadrant(x,y,this.CANVASWIDTH / 4,this.CANVASHEIGHT / 4,`sq${subQuadrantCount}`,xIdx,yIdx));
                subQuadrantCount ++;
            };
        };
    };


    // get the subquadrants inside each quadrant and add them to an array that will live inside the
    // quadrant object that they reside in so they can be referenced from the quadrant itself when needed
    addSubquadrantsToQuadrants() {
        let count = 0;
        let idx = 0;

        for (let i = 0; i < this.quadrants.length; i++) {

            // first two times, count for the top half of the quadrant
            if (count <= 2) {
                idx = 0 + count;
            // second two times, count for the bottom half
            } else {
                idx = 4 + count;
            };

            for (let j = 0; j < this.quadrants.length / 2; j++) {
                this.quadrants[i].subQuadrants.push(this.subQuadrants[idx]);
                this.quadrants[i].subQuadrants.push(this.subQuadrants[idx + 1]);

                // console.log(this.subQuadrants[idx].id,this.subQuadrants[idx + 1].id);
                // console.log(idx,idx + 1)

                idx = idx + 4;
            };

            count = count + 2;
            // console.log(" ")
        };
    };


    drawWhiteQuadrant(i,{ x , y, divisor}) {
        this.ctx.lineWidth = 7;
        this.ctx.strokeStyle = "white";
        this.ctx.strokeRect(x, y, this.CANVASWIDTH / divisor, this.CANVASHEIGHT / divisor);
        this.ctx.fillStyle = 'white';
        this.ctx.font = "30px Arial";
        this.ctx.fillText(i, x + 10, y + 35);
    };


    drawRedTally({ x , y, width,height}) {
        this.ctx.lineWidth = 7;
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(x, y, width, height);
    };


    drawGreenTally({ x , y, width,height}) {
        this.ctx.lineWidth = 7;
        this.ctx.strokeStyle = "green";
        this.ctx.strokeRect(x, y, width, height);
    };


    initWhiteGrid() {
        this.ctx.globalCompositeOperation = 'source-over';

        for (let i = 0; i < this.quadrants.length; i++) {

            // if the config for this quadrant is set to true, then draw a subQuadrant of four squares sin this quadrant
            const currentQuadrant = this.quadrants[i];
            
            if (currentQuadrant.isDivided) {
                for (let j = 0; j < this.quadrants.length; j++) {
                    const currentSubQuadrant = currentQuadrant.subQuadrants[j];
                    this.drawWhiteQuadrant(currentSubQuadrant.id,currentSubQuadrant.coords);
                };

            // if it is set to false then only draw a square around the quadrant
            } else {
                this.drawWhiteQuadrant(currentQuadrant.id,currentQuadrant.coords);
            };
        };
    };

    
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }


    resetCanvas() {
        this.clearCanvas();
        this.initWhiteGrid();
        this.setTallies();
    };


    clearAllIsLive() {
        for (let i = 0; i < this.allQuadrants.length; i++) {
            this.allQuadrants[i].isLive = false;
        };
    };


    setTallies() {
        for (let i = 0; i < this.allQuadrants.length; i++) {
    
            const currentQuadrant = this.allQuadrants[i];
    
            if (!currentQuadrant.isProgram && !currentQuadrant.isPreview) {
                if (currentQuadrant.isLive) {
                    this.drawRedTally(currentQuadrant.coords);
                };
            };
        };
    };


    setMultiviewOffset() {
        this.offsetLeft = this.canvas.getBoundingClientRect().left;
        this.offsetTop = this.canvas.getBoundingClientRect().top;
    };


    // take the WIDTH of the multiview and divide it by 1.78
    // set this new float value to the window HEIGHT
    // to get a 16/9 size window
    setCanvasWidth() {
        this.canvas.style.width = `${window.innerWidth * 0.7}px`;
    };


    setComputedWidth() {
        this.COMPUTEDWIDTH = this.stripPx(getComputedStyle(this.canvas).width);
        this.COMPUTEDHEIGHT = this.stripPx(getComputedStyle(this.canvas).height);
    };


    setWindowResizeListener() {
        // check if window is resized
        window.addEventListener('resize', (_e) => {
            this.setCanvasWidth();
            this.setMultiviewOffset();
            this.setComputedWidth();
        });
    };


    // function to check if mouse click intersects with quadrant in multiview
    hit(rect, x, y) {
        return (x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height);
    };


    getClickedQuadrant(e) {
       const width = this.COMPUTEDWIDTH / 2;
       const height = this.COMPUTEDHEIGHT / 2;
    
        // check if click is on a quadrant
        for (let i = 0; i < this.quadrants.length; i++)  {

            const rect = {
                x: (this.quadrants[i]['coords'].xIdx * width) + this.offsetLeft,
                y: (this.quadrants[i]['coords'].yIdx * height) + this.offsetTop,
                width: width,
                height: height,
            };


            if (this.hit(rect,e.x,e.y)) {
                return this.quadrants[i];
            };
        };
    };


    getClickedSubQuadrant(e,quadrant) {
        
        const width = this.COMPUTEDWIDTH / 4;
        const height = this.COMPUTEDHEIGHT / 4;

        // check if click is on a subQuadrant
        for (let i = 0; i < quadrant['subQuadrants'].length ; i++)  {
            
            const subQuadrant = quadrant.subQuadrants[i];

            const rect = {
                x: (subQuadrant['coords'].xIdx * width) + this.offsetLeft,
                y: (subQuadrant['coords'].yIdx * height) + this.offsetTop,
                width: width,
                height: height,
            };
    
            if (this.hit(rect,e.x,e.y)) {
                return subQuadrant;
            };
        };
    };


    onMultiviewClick(e) {
        // only run this function if offcanvas is hidden
        if (!this.offcanvas.classList.contains('show')) {

            this.clearAllIsLive();

            const clickedOnSquare = this.getClickedQuadrant(e);

            // logic for clicking on a subquadrant
            if (clickedOnSquare && clickedOnSquare.isDivided) {        
                    const clickedOnsubQuadrant = this.getClickedSubQuadrant(e,clickedOnSquare);
                    clickedOnsubQuadrant.isLive = true;

                    // temporary code to test sending messages to ATEM
                    // by tapping on quadrants
                    atem.changeProgramInput(inputMap[clickedOnsubQuadrant.id]);
                    console.log(clickedOnsubQuadrant);
                    this.resetCanvas();

                // logic for clicking on a quadrant
                } else if (clickedOnSquare && !clickedOnSquare.isDivided) {

                    clickedOnSquare.isLive = true;
                    atem.changeProgramInput(inputMap[clickedOnSquare.id]);
                    console.log(clickedOnSquare);
                    this.resetCanvas();

                } else {
                    return;
                };
        };
    };


    handleMultiviewGridChange() {
        this.clearAllIsLive();
        this.clearCanvas();
        this.initWhiteGrid();
        this.setMiniGridVisibility();
        this.setTallies();
    };


    clearQuadLabels(quad) {
        quad.label = "";
    };


    setMiniGridVisibility() {
        for (let i = 0; i < this.mvMiniConfigQuadrants.length; i++) {

            // this quadrant is an HTML collection made up of the sub quadrants inside it. 
            const quadrantSubQuads = document.getElementsByClassName(`mini-quad-${i + 1}`);
            const quadrantQuad = document.getElementById(`mv-mini-grid-quad-${i + 1}`);
            
            if (this.quadrants[i].isDivided) {                

                // hide the text inside the quadrant when it is divided
                quadrantQuad.style.color = 'transparent';

                // show the subquads inside the quadrant (in the mini config)
                for (let j = 0; j < quadrantSubQuads.length; j++) {
                    quadrantSubQuads[j].style.display = 'block';
                };

            } else {

                // show the text inside the quadrant when it is un-divided
                quadrantQuad.style.color = 'white';


                // hide the subquads inside the quadrant (in the mini config)
                for (let j = 0; j < quadrantSubQuads.length; j++) {
                    quadrantSubQuads[j].style.display = 'none';
                    
                };
            }
        };


    };


    setMvMiniQuadLabels(i) {
        const label = defaultNameMap[inputMap[this.quadrants[i].id]];

        console.log(this.quadrants[i])

        this.quadrants[i].label = label;
        this.mvConfigQuadLabelTexts[i].innerText = label;
    };

    setMvMiniSubQuadLabels(i) {
        const subLabel = defaultNameMap[inputMap[this.subQuadrants[i].id]];

        this.subQuadrants[i].label = subLabel;
        this.mvConfigSubQuadLabelTexts[i].innerText = subLabel;
    };


    setAllMiniLabels() {

        const defaultNameMapArray = Object.entries(defaultNameMap);

        for (let i = 0; i < this.quadrants.length; i++) {
            this.mvConfigQuadLabelTexts[i].innerText = this.quadrants[i].label;


            // logic to change the update the inputMap
            // turn the defaultNameMap into an array of arrays so that it can be filtered
            // this is because we're trying to get the Input ID from the label,
            // and the object is set up as Input ID as the key and label as value (backwards fron what we need);
            const newAtemInputID = defaultNameMapArray.filter((arr) => {
                if (arr[1] === this.quadrants[i].label) return arr;
            });

            inputMap[this.quadrants[i].id] = newAtemInputID[0][0];
            this.quadrants[i].input = newAtemInputID[0][0];
        };

        // same but for subquadrants
        for (let i = 0; i < this.subQuadrants.length; i++) {
            this.mvConfigSubQuadLabelTexts[i].innerText = this.subQuadrants[i].label;

            const newAtemInputID = defaultNameMapArray.filter((arr) => {
                console.log(this.subQuadrants[i].label)
                console.log(arr[1])
                if (arr[1] === this.subQuadrants[i].label) return arr;
            });

            inputMap[this.subQuadrants[i].id] = newAtemInputID[0][0];
            this.subQuadrants[i].input = newAtemInputID[0][0];
        };
    };


    clearMvMiniConfigSelection() {

        for (let i = 0; i < this.mvMiniConfigQuadrants.length; i++) {
                this.mvMiniConfigQuadrants[i].style.outlineColor = 'white';
        };

        for (let i = 0; i < this.mvMiniConfigSubQuadrants.length; i++) {
                this.mvMiniConfigSubQuadrants[i].style.outlineColor = 'white';
        };

        this.selectedMiniMvQuad = null;
    };


    // when quadrant or subquadrant in mv mini config is clicked on
    // 
    handleMvMiniConfigSingleClick(isSub,number) {
        if (!isSub) {
            const quadrant = this.quadrants[number];
            console.log(quadrant.id,quadrant.label)

            // find the object of the selected mini quad or subquad
            this.selectedMiniMvQuad = this.quadrants[number];

            this.labelSelectDropdown.value = quadrant.label;

            inputMap

        } else {
            const subQuadrant = this.subQuadrants[number];
            console.log(subQuadrant.id,subQuadrant.label)
            
            // find the object of the selected mini quad or subquad
            this.selectedMiniMvQuad = this.subQuadrants[number];

            // set the label dropdown to the label of the clicked-on quadrant
            this.labelSelectDropdown.value = subQuadrant.label;
        };

    };

    

    setMvConfigButtons() {
        for (let i = 0; i < this.mvMiniConfigQuadrants.length; i++) {

            // click event listener for doubule clickin on a quadrant
            this.mvMiniConfigQuadrants[i].ondblclick = () => {

                // change the status of the multiview quadrant to show or hide
                this.quadrants[i].isDivided = !this.quadrants[i].isDivided;

                this.handleMultiviewGridChange();
            };

            this.setMvMiniQuadLabels(i);
        };

        
        // logic to merge a quadrant that is devided into a full quadrant without subquadrants
        // this strips the number from the 'mini-quad' class name in the subquadrants and uses that to index the quadrants
        for (let i = 0; i < this.mvMiniConfigSubQuadrants.length; i++) {
            this.mvMiniConfigSubQuadrants[i].ondblclick = () => {
                const parentQuadClasslist = this.mvMiniConfigSubQuadrants[i].classList;
                const parentQuadNumber = parseInt(parentQuadClasslist[1].slice(-1)) - 1;
               
                this.quadrants[parentQuadNumber].isDivided = !this.quadrants[parentQuadNumber].isDivided;

                this.clearMvMiniConfigSelection();
                this.handleMultiviewGridChange();
            };

            this.setMvMiniSubQuadLabels(i);
        };


        // click event listener for single click on a quadrant in mini mv config
        for (let i = 0; i < this.mvMiniConfigQuadrants.length; i++) {
            this.mvMiniConfigQuadrants[i].onclick = () => {
                this.clearMvMiniConfigSelection();
                this.mvMiniConfigQuadrants[i].style.outlineColor = 'yellow';
                this.handleMvMiniConfigSingleClick(false,i);
            };
        };


        // click event listener for single click on a subquadrant in mini mv config
        for (let i = 0; i < this.mvMiniConfigSubQuadrants.length; i++) {
            this.mvMiniConfigSubQuadrants[i].onclick = () => {
                this.clearMvMiniConfigSelection();
                this.mvMiniConfigSubQuadrants[i].style.outlineColor = 'yellow';
                this.handleMvMiniConfigSingleClick(true,i);
            };
        };
    };


    setClickListeners() {
            // handle clicking on multiview
            // only allow click on multiview if offcanvas is hidden
            document.addEventListener('click',(e) => {
                this.onMultiviewClick(e);
            });


            // logic for changing label on settings using the label dropdown in the offcanvas
            this.labelSelectDropdown.addEventListener('change',(e) => {

                const label = e.target.value;

                if (label !== "Select Assignment" && this.selectedMiniMvQuad) {
                    this.selectedMiniMvQuad.label = e.target.value;
                };

                this.setAllMiniLabels();
            });

            this.setMvConfigButtons();  
        };


        drawImage() {
            this.ctx.drawImage(this.video, 0, 0, this.videoConfig.WIDTH, this.videoConfig.HEIGHT);

            this.initWhiteGrid();
            this.setTallies();

        };
};
