const math = require('mathjs');

const allCell = fetch(new Request('/info/all')).then(res => res.json());

class Cell {
  constructor(x, y, features) {
    this.location = {
      x,
      y,
    };
    this.desc = `This cell is in ${x}, ${y}: ${features}`;
  }

  init() {
    this.ready = allCell
      .then((array) => {
        this.cell = array.find(v => v.x === this.location.x && v.y === this.location.y);
        if (this.cell == null) {
          return fetch(new Request(`/info/cell?x=${this.location.x}&y=${this.location.y}`))
            .then(res => res.json())
            .then((value) => {
              this.cell = value;
            });
        }
        return Promise.resolve();
      }).catch(console.error);
    return this;
  }
}

export default class Grid {
  constructor(sizeX, sizeY) {
    this.size = {
      x: sizeX,
      y: sizeY,
    };

    this.cells = math.ones(sizeX, sizeY).map((value, index) => new Cell(index[0], index[1]))
      .map(v => v.init());
  }
}
