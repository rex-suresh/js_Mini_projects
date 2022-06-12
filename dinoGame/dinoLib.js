const { EventEmitter } = require('events');
const { stdout, exit } = process;
const { clear } = console;

const setupScreen = () => {
  const cursorHidden = '\x1B[?25l';
  stdout.cursorTo(0, 0);
  stdout.write(cursorHidden);
  stdout.clearScreenDown();
};

const resetScreen = (message) => {
  const visibleCursor = '\x1B[?25h';
  stdout.write(visibleCursor);
  clear();
  stdout.cursorTo(0, 0);
  stdout.write(message);
  exit();
};

const erase = (item) => {
  item.visit((x, y, icon) => {
    stdout.cursorTo(x, y);
    stdout.write('  '.repeat(icon.length));
  });
};

const drawTrack = ({ maxX, maxY }, track) => {
  stdout.cursorTo(0, track);
  stdout.write('-'.repeat(maxX));
  stdout.cursorTo(maxX, maxY);
};

const draw = (x, y, icon) => {
  stdout.cursorTo(x, y);
  stdout.write(icon);
};

const movePlayer = (player, movement) => {
  erase(player);
  player.move(movement);
  player.visit(draw);
};

const getMoves = (player) => {
  const moves = new EventEmitter();
  moves.on('\x1B[A', () => movePlayer(player, { dx: 0, dy: -1 }));
  moves.on('\x1B[B', () => movePlayer(player, { dx: 0, dy: 1 }));
  moves.on('\x1B[C', () => movePlayer(player, { dx: 1, dy: 0 }));
  moves.on('\x1B[D', () => movePlayer(player, { dx: -1, dy: 0 }));
  moves.on('q', () => quitGame());
  return moves;
};

const quitGame = () => { 
  resetScreen('bye bye');
};

const dinoDiedExit = () => {
  resetScreen('YOU HIT THE OBSTACLE !!!');
};

module.exports = {
  setupScreen, resetScreen, erase, drawTrack, draw, dinoDiedExit, getMoves
};
