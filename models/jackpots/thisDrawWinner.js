const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const thisDrawWinner = new Schema({
  tickets: {
    type: [
      {
        email: {
          type: String,
          required: true
        },
        win_ticket: [
          {
            userTicket: { type: String, required: true },
            powerBall: { type: Number, required: true }
          }
        ]
      }
    ],
    required: true
  },
  draw_count: {
    type: Number,
    default: 0
  }
});

thisDrawWinner.statics.saveWinners = async thisDrawWinners => {
  console.log("thisDrawWinners ====>", thisDrawWinners);

  try {
    const newWinnersList = new ThisDrawWinners({
      tickets: thisDrawWinners.tickets,
      draw_count: thisDrawWinners.draw_count
    });
    await newWinnersList.save();
    return;
  } catch (e) {
    console.log(e);
    throw new Error("An Error occur, We are working on it.");
  }
};

thisDrawWinner.statics.getByDraw = async draw_count => {
  const DrawResult = await ThisDrawWinners.findOne({ draw_count });
  if (!DrawResult) {
    throw new Error("This draw is not exist.");
  } else return DrawResult;
};

thisDrawWinner.statics.getAllWinners = async () => {
  const tickets = await ThisDrawWinners.find();
  return tickets;
};

const ThisDrawWinners = mongoose.model("ThisDrawWinners", thisDrawWinner);

module.exports = ThisDrawWinners;
