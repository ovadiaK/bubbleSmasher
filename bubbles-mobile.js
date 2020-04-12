let symBalls
let symButtons
let old_width
let old_height

document.ontouchmove =function (event) {
event.preventDefault();
}
function setup() {
    var canvasDiv = document.getElementById('canvasHolder');
    var width = canvasDiv.offsetWidth;
    old_width = width;
    var height = canvasDiv.offsetHeight;
    old_height = height;
    var sketchCanvas = createCanvas(width, height);
    sketchCanvas.parent("canvasHolder");
    symBalls = new SymBalls;
    symButtons = new MakerButtons();
    symButtons.addButton(new MakerButton(0, 20, 0, 200, 0));
    symButtons.addButton(new MakerButton(0, 20, 0, 0, 200));
    symButtons.addButton(new MakerButton(0, 20, 200, 0, 0));
    symButtons.reposition(width);
}

function windowResized() {
    var canvasDiv = document.getElementById('canvasHolder');
    var width = canvasDiv.offsetWidth;
    var height = canvasDiv.offsetHeight;
    resizeCanvas(width, height);
    symButtons.reposition(width);
    symBalls.reposition(width, height, old_width, old_height);
    old_width = width;
    old_height = height;
}

function draw() {
    background(200, 200, 210);
    symBalls.run();
    symButtons.run();
}

function touchStarted() {
    symButtons.clicked();
    symBalls.clicked();
}

function touchMoved() {
    symBalls.drag();
    return false
}
$(document).on('touchend touchcancel', function() {
    symBalls.drop()

});
function touchEnded() {
    symBalls.drop()
}


function MakerButtons() {
    this.buttons = [];
}

MakerButtons.prototype.addButton = function (b) {
    this.buttons.push(b);
};

MakerButtons.prototype.run = function () {
    for (let i = 0; i < this.buttons.length; i++) {
        this.buttons[i].run();
    }
}
MakerButtons.prototype.clicked = function () {
    for (let i = 0; i < this.buttons.length; i++) {
        if (mouseX > this.buttons[i].x && mouseX < this.buttons[i].x + this.buttons[i].xSize && mouseY > this.buttons[i].y && mouseY < this.buttons[i].y + this.buttons[i].ySize) {
            this.buttons[i].makeBall();
            return
        }
    }
}
MakerButtons.prototype.reposition = function (w) {
    let dist = w / 10;
    let n = this.buttons.length;
    if (w < 350) {
        dist = 0;
    }
    if (dist > 100) {
        dist = 100;
    }
    for (let i = 0; i < n; i++) {
        this.buttons[i].x = w / 2 + (i - n / 2) * (this.buttons[i].xSize + dist);
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
SymBalls.prototype.reposition = function (w, h, wo, ho) {
    for (let i = 0; i < this.balls.length; i++) {
        this.balls[i].x = this.balls[i].x * w / wo;
        this.balls[i].y = this.balls[i].y * h / ho;
        console.log(i)
    }
}
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
SymBalls.prototype.clicked = function () {
    for (let i = 0; i < this.balls.length; i++) {
        a = this.balls[i].clicked();
        if (a == true) {
            move(this.balls, i, this.balls.length - 1)
            return
        }
    }
}
SymBalls.prototype.drag = function () {
    if (this.balls.length == 0) {
        return
    }
    a = this.balls[this.balls.length - 1].drag();
}
SymBalls.prototype.drop = function () {
    if (this.balls.length == 0) {
        return
    }
    this.balls[this.balls.length - 1].drop(this.balls);
}

function SymBall(x, y, r, g, b) {
    this.x = x;
    this.y = y;
    this.size = 50;
    this.destroy = false;
    this.rollover = false;
    this.dragging = false;
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

    this.draw()
};
SymBall.prototype.clicked = function () {
    inside = (mouseX > this.x - this.size / 2 && mouseX < this.x + this.size / 2 && mouseY > this.y - this.size / 2 && mouseY < this.y + this.size / 2)
    console.log(inside)
    if (inside == true) {
        this.dragging = true;
    } else {
        this.dragging = false;
    }
    return this.dragging

}
SymBall.prototype.drag = function () {
    if (this.dragging == true) {
        this.x = mouseX;
        this.y = mouseY;
    }
}
SymBall.prototype.drop = function (n) {
    if (this.dragging ==true){
        this.dragging = false
        for (let i = 0; i < n.length - 1; i++) {
            inside = (mouseX > n[i].x - n[i].size / 2 && mouseX < n[i].x + n[i].size / 2 && mouseY > n[i].y - n[i].size / 2 && mouseY < n[i].y + n[i].size / 2)
            if (inside == true) {
                this.merge(n[i])
            }
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