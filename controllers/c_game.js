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
  const email = "iran.luck.email@gmail.com";
  const ticket = [{ ticket: "xx,xx,xx,xx,xx,xx", powerBall: 7 }];
  if (ticket.length > 100)
    res.status(403).json({
      success: false,
      message: "You can't buy more than 100 tickets on each day."
    });
  const drawCount = await M_Jackpots.estimatedDocumentCount();
  const user = await M_User.addTicket(email, ticket, drawCount);
  M_ThisDraw.saveTicket(email, ticket);
  return res.json({
    success: true,
    message: "Ok"
  });
};
