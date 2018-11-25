import Drawer from './drawer/Drawer';
import Grid from './map/Grid';
import Description from './drawer/component/Desription/Description';

const math = require('mathjs');

const map = document.querySelector('#map');
const menu = document.querySelector('#menu');

const drawer = new Drawer(map);

let selected;

class MapConf {
  constructor(hexSize, gridColor, selectedColor) {
    this.hexSize = hexSize;
    this.gridColor = gridColor;
    this.selectedColor = selectedColor;
    this.menuWidth = menu.offsetWidth;
  }

  hexWidth() {
    return this.hexSize * Math.sqrt(3);
  }

  hexHeight() {
    return this.hexSize * 2;
  }
}

const mapConf = new MapConf(25, '#8e8e8e', 'black');

drawer.setSize(map.clientWidth, map.clientHeight);

const optimalGrid = {
  x: Math.ceil(map.clientWidth / mapConf.hexWidth() + 1),
  y: Math.ceil(map.clientHeight / mapConf.hexHeight() * 1.5),
};

const grid = new Grid(optimalGrid.x, optimalGrid.y);

function trueLocation(cell) {
  let x = cell.location.x * mapConf.hexWidth() - 15;
  if (cell.location.y % 2 === 0) {
    x += mapConf.hexWidth() / 2;
  }

  let y = cell.location.y * mapConf.hexHeight();
  y += -(cell.location.y * 0.25 * mapConf.hexHeight());
  return {
    x,
    y,
  };
}

function notOutOfBound(cell) {
  const { x, y } = trueLocation(cell);
  return !(
    x - mapConf.hexSize / 2 < 0
    || x + mapConf.hexSize / 2 > map.clientWidth
    || y - mapConf.hexSize / 2 < 0
    || y + mapConf.hexSize / 2 > map.clientHeight
  );
}

function print() {
  drawer.clean();

  const finished = [];

  grid.cells.forEach((value) => {
    const { x, y } = trueLocation(value);


    // out of boud verifying
    finished.push(value.ready.then(() => {
      if (notOutOfBound(value)) {
        drawer.drawHexagon(
          x,
          y,
          mapConf.hexSize,
          mapConf.gridColor,
          value.cell.color || 'white',
          true,
        );
        drawer.drawTextCentered(
          x,
          y + mapConf.hexHeight() / 4,
          `${value.location.x}, ${value.location.y}`,
          mapConf.gridColor,
        );
        if (value.cell.elements.length !== 0) {
          drawer.drawHexagon(x + 11, y - 7, mapConf.hexSize - 15, mapConf.gridColor, 'black', true);
        }
        if (value.cell.desc != null && value.cell.desc !== '') {
          const old = drawer.ctx.font;
          drawer.ctx.font = '20px Federant';
          drawer.drawText(x - 13, y - 1, '!', 'black');
          drawer.ctx.font = old;
        }
      }
    }));
  });
  return finished;
}

window.addEventListener('resize', () => {
  drawer.setSize(map.clientWidth, map.clientHeight);
  print();
});

map.addEventListener('mousemove', (event) => {
  drawer.clean();
  Promise.all(print()).then(() => {
    grid.cells.forEach((value) => {
      const { x, y } = trueLocation(value);
      const diffX = x - event.clientX + mapConf.menuWidth;
      const diffY = y - event.clientY;
      const distance = math.sqrt(diffX * diffX + diffY * diffY);

      if (
        math.abs(diffX) < mapConf.hexWidth() / 2
        && math.abs(diffY) < mapConf.hexHeight() / 2
        && distance < mapConf.hexSize
        && notOutOfBound(value)
      ) {
        selected = value;
        drawer.drawHexagon(x, y, mapConf.hexSize, mapConf.selectedColor);
        drawer.drawTextCentered(
          x,
          y + mapConf.hexHeight() / 4,
          `${value.location.x}, ${value.location.y}`,
          mapConf.selectedColor,
        );
      }
    });
  });
});

map.addEventListener(('click'), () => {
  /* eslint-disable no-new */
  new Description(selected.cell);
  /* eslint-enable */
});

print();
