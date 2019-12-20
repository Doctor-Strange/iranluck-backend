const draw = require("../utils/draw");
exports.getCountDown = (req, res) => {
  res.json({
    success: true,
    countDown: draw.countDown()
  });
};
