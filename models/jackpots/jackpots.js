const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const jackpots = new Schema({
  ticket: {
    type: {
      jackpot: { type: String, required: true },
      powerBall: { type: Number, required: true }
    },
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Jackpots", jackpots);
