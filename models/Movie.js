const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: Number },
  genre: { type: String },
  description: { type: String },
  director: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
