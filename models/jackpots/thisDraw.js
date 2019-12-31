const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const thisDraw = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  tickets: {
    type: [
      {
        ticket: { type: String, required: true },
        powerBall: { type: Number, required: true }
      }
    ],
    required: true
  }
});

thisDraw.statics.saveTicket = async (email, ticket) => {
  const user = await ThisDraw.findOne({ email });
  if (user) {
    user.tickets = user.tickets.concat(ticket);
    user.save();
  } else {
    const newUser = new ThisDraw({
      tickets: ticket,
      email
    });
    newUser.save();
  }
  return;
};

// thisDraw.statics.getAllTickets = async () => {
//   const user = await ThisDraw.find();
//   return user;

  // if (user) {
  //   user.tickets = user.tickets.concat(ticket);
  //   user.save();
  // } else {
  //   const newUser = new ThisDraw({
  //     tickets: ticket,
  //     email
  //   });
  //   newUser.save();
  // }
// };

thisDraw.statics.getThisDrawTickets = async () => {
  try {
    const tickets = await ThisDraw.find();
    return tickets;
  } catch (e) {
    throw new Error("An Error occur, We are working on it.");
  }
};

const ThisDraw = mongoose.model("ThisDraw", thisDraw);

module.exports = ThisDraw;
