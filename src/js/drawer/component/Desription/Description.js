require('./Description.css');
const html = require('./Description.html');

export default class Description {
  constructor(cell) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.component = document.createElement('div');
    this.component.classList.add('desc-bg');
    this.component.innerHTML = html;

    const list = this.component.querySelector('#planet-list');

    (cell.elements || []).forEach((name) => {
      const link = document.createElement('a');
      link.innerText = name;
      link.href = `/${name}`;
      const li = document.createElement('li');
      li.appendChild(link);
      list.appendChild(li);
    });

    this.component.querySelector('#desc-close').addEventListener('click', () => {
      document.querySelector('body').removeChild(this.component);
    });

    this.component.querySelector('p#desc-text').innerText = `Selected tile: ${cell.x}, ${cell.y}`;

    this.component.querySelector('#desc-close').addEventListener('click', () => {
      document.querySelector('body').removeChild(this.component);
    });


    const note = this.component.querySelector('textarea#desc-note');
    const saveDesc = this.component.querySelector('button#desc-save');

    saveDesc.addEventListener('click', () => {
      const ret = cell;
      ret.desc = note.value;
      fetch(new Request(`/info/cell?x=${cell.x}&y=${cell.y}`), {
        method: 'PATCH',
        body: JSON.stringify(ret),
        headers,
      }).then((res) => {
        const obj = {};
        obj.status = res.status;
        obj.text = res.text();
      }).then((res) => {
        if (res.status === 200) console.log('Ok');
        else throw new Error(res.text);
      });
    });

    const input = this.component.querySelector('input#planet-name');
    this.component.querySelector('button#planet-confirm').addEventListener('click', () => {
      cell.elements.push(input.value);

      fetch(new Request(`/info/cell?x=${cell.x}&y=${cell.y}`), {
        method: 'PATCH',
        body: JSON.stringify(cell),
        headers,
      }).then((res) => {
        if (res.status === 200) {
          return fetch(new Request(`/planet/${input.value}`, {
            method: 'POST',
            body: JSON.stringify({}),
            headers,
          }));
        }
        throw new Error('Could not find the cell');
      }).then((res) => {
        if (res.status === 200) {
          document.location.href = `/${input.value}`;
        } else {
          throw new Error('Could not create planet');
        }
      }).catch(console.error);
    });
    document.querySelector('body').appendChild(this.component);
  }
}
