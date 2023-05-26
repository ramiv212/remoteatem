class Quadrant {
    constructor(x,y,width,height,id) {
        this.DIVISOR = 2;
        this.coords = {
            x: x,
            y: y,
            width: width,
            height: height,
            divisor: this.DIVISOR
        };
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
    constructor(x,y,width,height,id) {
        this.DIVISOR = 4;
        this.coords = {
            x: x,
            y: y,
            width: width,
            height: height,
            divisor: this.DIVISOR
        };
        this.id = id;
    };
};


export default class Multiview {
    constructor(canvas) {

        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d', { alpha: false });

        this.WIDTH = 1920;
        this.HEIGHT = 1080;

        this.quadrants = [];
        this.subQuadrants = [];

        // init
        this.initQuadrants();
        this.initSubQuadrants();

        this.quadrants[2].isDivided = true;
        this.quadrants[3].isDivided = true;

        this.addSubquadrantsToQuadrants();
        this.allQuadrants = this.quadrants.concat(this.subQuadrants);
        this.setMultiviewWidth();
        this.initWhiteGrid();

    };


    initQuadrants() {
        let quadrantCount = 1;

        for (let y = 0; y < this.HEIGHT; y += (this.HEIGHT / 2)) {
            for (let x = 0; x < this.WIDTH; x += (this.WIDTH / 2)) {
                this.quadrants.push(new Quadrant(x,y,this.WIDTH / 2,this.HEIGHT / 2,`q${quadrantCount}`));
                quadrantCount ++;
            };
       };
    };


    initSubQuadrants() {
        let subQuadrantCount = 1;

        for (let y = 0; y < this.HEIGHT; y += (this.HEIGHT / 4)) {
            for (let x = 0; x < this.WIDTH; x += (this.WIDTH / 4)) {
                this.subQuadrants.push(new SubQuadrant(x,y,this.WIDTH / 4,this.HEIGHT / 4,`sq${subQuadrantCount}`));
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
        this.ctx.strokeRect(x, y, this.WIDTH / divisor, this.HEIGHT / divisor);
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
            console.log(this.quadrants[i].isDivided)
            if (this.quadrants[i].isDivided) {
                console.log(this.quadrants[i].subQuadrants)
                for (let j = 0; j < this.quadrants[i].subQuadrants.length; j++) {
                    this.drawWhiteQuadrant(j + 1,this.quadrants[i].subQuadrants[j].coords);
                    console.log(this.quadrants[i].subQuadrants[j].coords);
                };
            // if it is set to false then only draw a square around the quadrant
            } else {
                this.drawWhiteQuadrant(i,this.quadrants[i]['coords']);
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

    // take the WIDTH of the multiview and divide it by 1.78
    // set this new float value to the window HEIGHT
    // to get a 16/9 size window
    setMultiviewWidth() {
        this.canvas.style.width = `${window.innerWidth * 0.7}px`;
    };


    setWindowResizeListener() {
        // check if window is resized
        window.addEventListener('resize', (_e) => {
            this.setMultiviewWidth(this.canvas);
        });
    };


};
