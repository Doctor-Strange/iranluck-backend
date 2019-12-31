const draw = require("../utils/draw");
const M_Jackpots = require("../models/jackpots/jackpots");
const M_User = require("../models/auth/User");
const M_ThisDraw = require("../models/jackpots/thisDraw");

// Router ===> /game/getCountDown
exports.getCountDown = (req, res) => {
  return res.json({
    success: true,
    countDown: draw.countDown()
  });
};

// Router ===> /game/saveTicket
exports.saveTicket = async (req, res) => {
  // const email = "test@gmail.com";
  const email = "sajad.saderi@gmail.com";
  const ticket = [
    { ticket: "24,60,10,51,12,29", powerBall: 8 },
    { ticket: "42,25,7,50,41,18", powerBall: 8 },
    { ticket: "11,20,12,56,34,39", powerBall: 8 },
    { ticket: "19,54,45,17,58,15", powerBall: 8 },
    { ticket: "58,43,21,30,17,12", powerBall: 5 },
    { ticket: "55,38,51,4,6,25", powerBall: 7 },
    { ticket: "37,36,46,50,19,16", powerBall: 3 },
    { ticket: "43,53,26,19,52,24", powerBall: 2 },
    { ticket: "52,44,32,23,12,52", powerBall: 6 },
    { ticket: "27,17,57,33,47,7", powerBall: 5 }
  ];
  // DEV ^
  if (ticket.length > 100)
    res.status(403).json({
      success: false,
      message: "You can't buy more than 100 tickets on each day."
    });
  try {
    const drawCount = await M_Jackpots.estimatedDocumentCount();
    const user = await M_User.addTicket(email, ticket, drawCount);
    M_ThisDraw.saveTicket(email, ticket);
    return res.json({
      success: true,
      message: "Ok"
    });
  } catch (e) {
    console.log("saveTicket ==> ", e);
    res.status(500).json({
      success: false,
      message: e.message
    });
  }
};
