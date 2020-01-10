const M_User = require("../models/auth/User");
module.exports = async (req, res, next) => {
  const _id = req.user;
  try {
    await M_User.generateConfirmCode(_id);
    next();
  } catch (e) {
    res.status(400).json({
      success: false,
      message: e.message
    });
  }
};
