class Obstacle {
  #maxX; #currentX; #y; #icon;
  constructor({maxX, y}, icon) {
    this.#maxX = maxX;
    this.#y = y;
    this.#icon = icon;
    this.#currentX = 0;
  }

  #isOver() {
    return this.#currentX > this.#maxX;
  }

  move() {
    if (!this.#isOver()) {
      this.#currentX++;
    }
  }
  
  areCrashed(x, y) {
    return this.#currentX === x && this.#y === y;
  }

  visit(visitor) {
    if (!this.#isOver()) {
      return visitor(this.#currentX, this.#y, this.#icon);
    }
  }
}
module.exports = { Obstacle };
