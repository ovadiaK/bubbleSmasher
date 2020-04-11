let symBalls
let symButtons

function setup() {
    createCanvas(1200, 900);
    symBalls = new SymBalls;
    symButtons = new MakerButtons();
    symButtons.addButton(new MakerButton(400, 20, 0, 200, 0));
    symButtons.addButton(new MakerButton(550, 20, 0, 0, 200));
    symButtons.addButton(new MakerButton(700, 20, 200, 0, 0));
}


function draw() {
    background(200, 200, 210);
    symBalls.run();
    symButtons.run();
}

function mousePressed() {
    symBalls.drag();
    symButtons.clicked()
}

function mouseReleased() {
    symBalls.drop();
}

function MakerButtons() {
    this.buttons = [];
}

MakerButtons.prototype.addButton = function (b) {
    this.buttons.push(b);
};

MakerButtons.prototype.run = function () {
    for (let i = 0; i < this.buttons.length; i++) {
        this.buttons[i].run()
    }
}
MakerButtons.prototype.clicked = function () {
    for (let i = 0; i < this.buttons.length; i++) {
        if (this.buttons[i].rollover == true) {
            this.buttons[i].makeBall()
        }
    }
}

function MakerButton(x, y, r, g, b) {
    this.x = x;
    this.y = y;
    this.xSize = 100;
    this.ySize = 30;
    this.red = r;
    this.green = g;
    this.blue = b;
    this.rollover = false;
    this.draw = function () {
        push();
        fill(this.red, this.green, this.blue);
        strokeWeight(4);
        if (this.rollover == true) {
            stroke(250, 250, 250)
        } else {
            stroke(50, 50, 50);
        }
        rect(this.x, this.y, this.xSize, this.ySize);
        pop();
    }
    this.makeBall = function () {
        symBalls.addBall(new SymBall(this.x + this.xSize / 2, this.y + 100, this.red, this.green, this.blue))
    }
}

MakerButton.prototype.run = function () {
    if (mouseX > this.x && mouseX < this.x + this.xSize && mouseY > this.y && mouseY < this.y + this.ySize) {
        this.rollover = true;
    } else {
        this.rollover = false;
    }
    this.draw()
}

function SymBalls() {
    this.balls = [];
};
SymBalls.prototype.addBall = function (b) {
    this.balls.push(b);
};
SymBalls.prototype.run = function () {
    for (let i = 0; i < this.balls.length; i++) {
        if (this.balls[i].destroy == true) {
            this.balls.splice(i, 1);
            break;
        }
    }
    for (let i = 0; i < this.balls.length; i++) {
        this.balls[i].run();
    }
};
SymBalls.prototype.drag = function () {
    for (let i = 0; i < this.balls.length; i++) {
        a = this.balls[i].drag();
        if (a == true) {
            move(this.balls, i, this.balls.length - 1)
            return
        }
    }
}
SymBalls.prototype.drop = function () {
    this.balls[this.balls.length - 1].drop(this.balls);
}

function SymBall(x, y, r, g, b) {
    this.x = x;
    this.y = y;
    this.size = 50;
    this.destroy = false;
    this.rollover = false;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.r = r;
    this.g = g;
    this.b = b;
    this.draw = function () {
        push();
        if (this.dragging) {
            fill(this.r, this.g, this.b);
            stroke(this.r, this.g, this.b);
        } else if (this.rollover) {
            fill(this.r, this.g, this.b);
            stroke(100, 100, 100);
        } else {
            fill(this.r, this.g, this.b);
            stroke(0, 0, 0);
        }
        ;
        strokeWeight(4);
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
    return this.dragging
}
SymBall.prototype.drop = function (n) {
    this.dragging = false
    for (let i = 0; i < n.length - 1; i++) {
        if (n[i].rollover == true) {
            this.merge(n[i])
        }
    }
}
SymBall.prototype.merge = function (n) {
    n.size = n.size + (this.size / 2);
    n.r = (this.r + n.r) / 2;
    n.b = (this.b + n.b) / 2;
    n.g = (this.g + n.g) / 2;
    this.destroy = true;
}

function move(arr, old_index, new_index) {
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        var k = new_index - arr.length;
        while ((k--) + 1) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
}