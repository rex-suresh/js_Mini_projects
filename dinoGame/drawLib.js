const { Player } = require('./player.js');
const { Obstacle } = require('./obstacle.js');
const { erase, draw, dinoDiedExit } = require('./dinoLib.js');

const randInt = (limit) => Math.floor(Math.random() * limit);

const getObstacle = (maxX, position) => new Obstacle(
  { maxX: maxX - 4, y: position }, '➤➤');

const getDino = (maxX, maxY, track) => new Player(
  { x: maxX, y: track - 4, maxX, maxY }, '🦖');

const drawObstacles = (obstacles, playerCrash) => {
  obstacles.forEach(obstacle => {
    if (playerCrash(obstacle)) {
      dinoDiedExit();
    }
    erase(obstacle);
    obstacle.move();
    obstacle.visit(draw);
  });
};

module.exports = {
  getDino, randInt, getObstacle, drawObstacles
};
