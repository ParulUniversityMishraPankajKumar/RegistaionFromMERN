const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model('Counter', counterSchema);
