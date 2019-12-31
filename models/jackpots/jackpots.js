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
  drawCount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

jackpots.statics.getLastJackpot = async () => {
  try {
    const latTicket = await Jackpots.findOne()
      .sort({ date: -1 })
      .limit(1);
    return latTicket;
  } catch (e) {
    throw new Error("An Error occur, We are working on it");
  }
};

const Jackpots = mongoose.model("Jackpots", jackpots);

module.exports = Jackpots;
