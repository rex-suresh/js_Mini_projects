const { stdout } = process;
const fs = require('fs');
const doNothing = () => { };
const log = (text) => fs.appendFile('./log.txt', text, 'utf8', doNothing);

const BALL_TEXT = '⚽', HIDDEN_CURSOR = '\x1B[?25l', VISIBLE_CURSOR = '\x1B[?25h', BRICK_TEXT = '🍚';

class Bricks{
  constructor({ x, y, width, height }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.holes = [];
  }
  collide({ x, y }) {
    if (x < this.x) return;
    if (y < this.y) return;
    if (y > (this.y + this.height)) return;
    if (x > (this.x + this.width)) return;
    if (this.holes.find(h => h.x == x && h.y == y)) return;
    this.holes.push({x, y});
    log(`${x},${y} => ${this.holes.length}`);
  }
  isWeak() {
    const half = (this.width * this.height) / 4;
    return (this.holes.length > half);
  }
}
class Ball{
  constructor({x,y,dx,dy}) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
  }
  move({ maxX, maxY }) {
    this.x += this.dx;
    this.y += this.dy;
    if(this.x >= maxX || this.x < 0) this.dx = -this.dx;
    if (this.y >= maxY || this.y < 0) this.dy = -this.dy;
  }
  visit(ballVisitor) {
    ballVisitor(this.x, this.y);
  }
}
const erase = (ball) => {
  ball.visit((x, y) => {
    stdout.cursorTo(x, y);
    stdout.write('  '.repeat(BALL_TEXT.length));
  })  
}
const draw = (ball) => {
  ball.visit((x, y) => {
    stdout.cursorTo(x, y);
    stdout.write(BALL_TEXT);
  })  
}
const setupScreen = () => {
  stdout.cursorTo(0, 0);
  stdout.write(HIDDEN_CURSOR);
  stdout.clearScreenDown();
}
const resetScreen = () => {
  stdout.cursorTo(0, 0);
  stdout.write(VISIBLE_CURSOR);
  stdout.clearScreenDown();
}
const drawBox = ({x,y,width,height}) => {
  for (let r = 0; r < height; r++){
    stdout.cursorTo(x, y + r);
    stdout.write(BRICK_TEXT.repeat(width));
  }
}
const main = () => {
  let [maxX, maxY] = stdout.getWindowSize();
  setupScreen();
  const ball = new Ball({ x: 0, y: 0, dx: 1, dy: 1 })
  const wall = { maxX: maxX - 2, maxY };
  const box = { x: 60, y: 10, width: 15, height: 10 };
  drawBox(box);
  const bricks = new Bricks(box);
  const timer = setInterval(() => {
    erase(ball);
    ball.move(wall);
    ball.visit((x, y) => bricks.collide({ x, y }));
    draw(ball);
    if (bricks.isWeak()) {
      clearInterval(timer);
      resetScreen();
    }
  }, 42);
};
main();
