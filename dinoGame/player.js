class Player {
  #x; #y; #icon; #maxX; #maxY;
  constructor({x, y, maxX, maxY}, icon) {
    this.#x = x;
    this.#y = y;
    this.#maxX = maxX;
    this.#maxY = maxY;
    this.#icon = icon;
  }

  move({ dx, dy }) {
    if (this.#x + dx >= this.#maxX || this.#y + dy >= this.#maxY / 2) {
      return;
    }
    this.#x += dx;
    this.#y += dy;
  }
  visit(visitor) {
    return visitor(this.#x, this.#y, this.#icon);
  }
  toString() {
    return this.#icon;
  }
}
module.exports = { Player };
