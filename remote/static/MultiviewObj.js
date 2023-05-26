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
        this.isActive = false;
        this.isProgram = true;
        this.isPreview = false;
        this.isDivided = false;
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
    };
};


export default class Multiview {
    constructor(canvas) {

        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d', { alpha: false });

        this.CANVASWIDTH = 1920;
        this.CANVASHEIGHT = 1080;

        this.COMPUTEDWIDTH = null;
        this.COMPUTEDHEIGHT = null;

        this.quadrants = [];
        this.subQuadrants = [];

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
        this.initWhiteGrid();
        this.setClickListener();

    };


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


    clearAllIsLive() {
        for (let i = 0; i < this.allQuadrants.length; i++) {
            this.allQuadrants[i].isLive = false;
        };
    };


    setTallies() {    
        for (let i = 0; i < this.allQuadrants.length; i++) {
    
            const currentQuadrant = this.allQuadrants[i];
    
            if (!currentQuadrant.isProgram && !currentQuadrant.isPreview) {
                if (currentQuadrant[i].isLive) {
                    drawRedTally(currentQuadrant.coords);
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

        console.log(this.COMPUTEDWIDTH,this.COMPUTEDHEIGHT)
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

            console.log(rect)
    
            if (this.hit(rect,e.x,e.y)) {
                return subQuadrant;
            };
        };
    };


    setClickListener() {
        // handle clicking on multiview
        document.addEventListener('click',(e) => {
            const clickedOnSquare = this.getClickedQuadrant(e);

            // logic for clicking on a subquadrant
            if (clickedOnSquare && clickedOnSquare.isDivided) {        
                    const clickedOnsubQuadrant = this.getClickedSubQuadrant(e,clickedOnSquare);
                    console.log(clickedOnsubQuadrant);

                // logic for clicking on a quadrant
                } else if (clickedOnSquare && !clickedOnSquare.isDivided) {
                    clickedOnSquare.isLive = true;
                    console.log(clickedOnSquare);
                } else {
                    return;
                }
            });
        };
};
