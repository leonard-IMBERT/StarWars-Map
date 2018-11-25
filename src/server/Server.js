const express = require('express');
const bodyParser = require('body-parser');
require('dotenv');
const path = require('path');

const { Cell, Planet } = require('./Connector');
const Logger = require('./Logger');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.SW_PORT || 3000;

    this.app.use(bodyParser.json());

    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'html', 'index.html'));
    });
    this.app.get('/:location', (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'html', 'planet.html'));
    });

    this.app.get('/info/cell', (req, res) => {
      Cell.findOne({ x: req.query.x, y: req.query.y }).then((e) => {
        if (e == null) {
          const cell = new Cell({ x: req.query.x, y: req.query.y });
          cell.save().then(() => res.status(200).send(JSON.stringify(cell)));
        } else res.status(200).send(e);
      }).catch(res.status(500).send);
    });
    this.app.get('/info/all', (req, res) => {
      Cell.find().then(e => res.status(200).send(e))
        .catch(err => res.status(500).send(err));
    });
    this.app.post('/info/cell', (req, res) => {
      const { x, y } = req.query;
      if (Number.isNaN(Number(x)) || Number.isNaN(Number(y))) {
        Logger.error(`${JSON.stringify({ x, y })}`);
        res.status(400).send('Invalid x or y param');
      } else {
        Cell.create({ x, y, features: req.body })
          .then((e) => {
            res.status(200).send(e);
          }).catch((err) => {
            res.status(500).send(err);
          });
      }
    });
    this.app.patch('/info/cell', (req, res) => {
      Cell.updateOne({ x: req.body.x, y: req.body.y }, req.body)
        .then((e) => {
          if (e == null) res.status(404);
          else res.status(200);
          res.send(e);
        })
        .catch(err => res.status(500).send(err));
    });

    this.app.get('/planet/:name', (req, res) => {
      Planet.findOne({ name: req.params.name }).then((value) => {
        if (value == null) res.status(404).send('No planet found');
        else res.status('200').send(value);
      }).catch(err => res.status('500').send(err));
    });
    this.app.post('/planet/:name', (req, res) => {
      req.body.name = req.params.name;
      Planet.create(req.body)
        .then(e => res.status(200).send(e))
        .catch(err => res.status(500).send(err));
    });
    this.app.patch('/planet/:name', (req, res) => {
      Planet.updateOne({ name: req.params.name }, req.body)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send(err));
    });

    this.app.get('/style/:style', (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'css', `${req.params.style}.css`));
    });
    this.app.get('/images/:image', (req, res) => {
      res.sendFile(path.join(__dirname, '..', '..', 'dist', 'images', req.params.image));
    });
    this.app.get('/script/:name', (req, res) => {
      res.sendFile(path.join(__dirname, '..', '..', 'dist', `${req.params.name}.js`));
    });
  }

  start() {
    return new Promise((res) => {
      const tmp = this.app.listen(this.port, () => {
        Logger.info(`Server for the starwars map listening on port ${this.port}`);
        res(tmp);
      });
    });
  }
}

module.exports = Server;
