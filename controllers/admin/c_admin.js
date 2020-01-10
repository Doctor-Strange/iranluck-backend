const M_Admin = require("../../models/admin/M_Admin");
// const M_AdminConfirmList = require("../../models/admin/M_AdminConfirmList");
const confirmCode_GEN = require("../../utils/confirmCode_GEN");

// Route ====> /admin/signup
exports.signup = async (req, res) => {
  email = "sajad.saderi@gmail.com";
  password = "iuj";
  const code = confirmCode_GEN;
  try {
    const user = await M_Admin.findOne({
      email
    });
    if (user) {
      return res.json({
        success: false,
        message: "You are one the admins"
      });
    } else {
      const newUser = new M_Admin({
        email,
        password,
        last_seen: [{ date: new Date() }]
      });
      await newUser.save();
      const token = await newUser.generateAuthToken();
      return res.status(201).json({
        token: token,
        message: "successful",
        success: true
      });
    }
  } catch (e) {
    console.log("Error handler ===> ", e);
    return res.status(400).json({ message: e.message, success: false });
  }
};

// Route ====> /admin/signin
exports.signIn = async (req, res) => {
  email = "sajad.saderi@gmail.com";
  password = "iuj";
  try {
    const user = await M_Admin.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    return res.json({ success: true, message: "Ok", token: token });
  } catch (e) {
    console.log("Error handler ===> ", e);
    return res.status(401).json({ success: false, message: e.message });
  }
};

// Route ====> /admin/confirmcode
exports.confirmCodeCheck = async (req, res) => {
  // const {_id} = req.user
  // const {code} = req.body

  const code = "22574";
  const _id = "";
  // DEV^
  try {
    await M_Admin.checkConfirmcode(_id, code);
    return res.json({
      success: true,
      message: "ok"
    });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};
