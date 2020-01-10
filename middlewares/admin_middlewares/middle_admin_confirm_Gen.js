const M_Admin = require("../../models/admin/M_Admin");
const Mailer = require("../../utils/mailer");

module.exports = async (req, res, next) => {
  const _id = req.user;
  try {
    await M_Admin.generateConfirmCode(_id);
    Mailer(email, "Confirm Code", code);
    next();
  } catch (e) {
    res.status(400).json({
      success: false,
      message: e.message
    });
  }
};
