const draw = require("../utils/draw");
exports.getCountDown = (req, res) => {
  res.json({
    success: true,
    countDown: draw.countDown()
  });
};

exports.saveTicket = (req, res) => {
  const ticket = [
    { ticket: "56,34,45,33,6,12", powerBall: 7 },
    { ticket: "26,30,45,57,16,12", powerBall: 5 },
    { ticket: "23,60,12,23,55,34", powerBall: 3 }
  ];
  res.json({
    success: true,
    countDown: draw.countDown()
  });
};
