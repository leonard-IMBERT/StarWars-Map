const mongoose = require('mongoose');

const { Schema } = mongoose;

const CellScheme = new Schema({
  x: Number,
  y: Number,
  color: String,
  elements: [String],
  desc: String,
});

const PlanetScheme = new Schema({
  name: String,
  desc: String,
  sector1: String,
  sector2: String,
  sector3: String,
  sector4: String,
  sector5: String,
  sector6: String,
});

const Connection = mongoose.createConnection('mongodb://localhost:27017/map', { useNewUrlParser: true });
const Cell = Connection.model('Cell', CellScheme, 'cells');
const Planet = Connection.model('Planet', PlanetScheme, 'planets');

module.exports = { Cell, Planet, Connection };
