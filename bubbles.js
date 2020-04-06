let symBalls

function setup() {
    createCanvas(1200, 900);
    symBalls = new SymBalls
    symBalls.addBall(new SymBall(100, 200))
    symBalls.addBall(new SymBall(100, 300))
    symBalls.addBall(new SymBall(100, 400))
}


function draw() {
    background(200, 200, 210);
    symBalls.run()
}

function mousePressed() {
    symBalls.drag()
}

function mouseReleased() {
    symBalls.drop()
}

function SymBalls() {
    this.balls = []
};
SymBalls.prototype.addBall = function (b) {
    this.balls.push(b)
};
SymBalls.prototype.run = function () {
    for (let i = 0; i < this.balls.length; i++) {
        this.balls[i].run();
    }
};
SymBalls.prototype.drag = function () {
    for (let i = 0; i < this.balls.length; i++) {
        this.balls[i].drag();
    }
}
SymBalls.prototype.drop = function () {
    for (let i = 0; i < this.balls.length; i++) {
        this.balls[i].drop();
    }
}

function SymBall(x, y) {
    this.x = x;
    this.y = y;
    this.size = 50;
    this.rollover = false;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.draw = function () {
        push();
        if (this.dragging) {
            fill(0, 0, 0);
        } else if (this.rollover) {
            fill(250, 250, 250);
        } else {
            fill(100, 100, 100);
        }
        ;
        strokeWeight(4);
        stroke('#222222');
        ellipse(this.x, this.y, this.size, this.size);
        pop();
    };
};
SymBall.prototype.run = function () {
    if (mouseX > this.x - this.size / 2 && mouseX < this.x + this.size / 2 && mouseY > this.y - this.size / 2 && mouseY < this.y + this.size / 2) {
        this.rollover = true;
    } else {
        this.rollover = false;
    }
    if (this.dragging) {
        this.x = mouseX + this.offsetX;
        this.y = mouseY + this.offsetY;
    }
    this.draw()
};
SymBall.prototype.drag = function () {
    if (this.rollover) {
        this.dragging = true;
        // If so, keep track of relative location of click to corner of rectangle
        this.offsetX = this.x - mouseX;
        this.offsetY = this.y - mouseY;
    }
}
SymBall.prototype.drop = function () {
    this.dragging = false
}
