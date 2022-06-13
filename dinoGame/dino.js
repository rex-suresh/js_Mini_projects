const { stdout, stdin } = process;
const { setupScreen, drawTrack, getMoves } =
  require('./dinoLib.js');
const { getDino, getObstacle, randInt, drawObstacles } =
  require('./drawLib.js');

const checkPos = (obstacle) => (x, y) => obstacle.areCrashed(x, y);

const main = (difficulty = 1) => {
  setupScreen();
  const [maxX, maxY] = stdout.getWindowSize();
  const track = Math.ceil(maxY / 2);
  const screenTime = 100 / difficulty;

  const dino = getDino(maxX, maxY, track);
  const obstacles = [getObstacle(maxX, randInt(track))];
  drawTrack({ maxX, maxY }, track);
  const moves = getMoves(dino);
    
  stdin.setRawMode(true);
  stdin.on('data', (keyStroke) => {
    moves.emit(keyStroke);
  });

  setInterval(() => {
    drawObstacles(obstacles, (obstacle) => dino.visit(checkPos(obstacle)));
  }, screenTime);

  setInterval(() => {
    obstacles.push(getObstacle(maxX, randInt(track)));
  }, screenTime * 10);
};

main(process.argv[2]);
