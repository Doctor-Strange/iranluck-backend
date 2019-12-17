const M_SignUp = require("../models/auth/createUser");
const M_ConfirmList = require("../models/confirm/confirmList");
const confirmCode_GEN = require("../utils/confirmCode_GEN");
const bcrypt = require("bcryptjs");
const Mailer = require("../utils/mailer");

exports.signup = async (req, res) => {
  email = "saderi.sajad@gmail.com";
  password = "qwedsasd";
  try {
    const user = await M_SignUp.findOne({
      email
    });
    if (user) {
      return res.json({
        success: false,
        message: "This email is signed up before"
      });
    } else {
      const hashPass = await bcrypt.hash(password, 12);
      createNewUser = await new M_SignUp({
        email,
        password: hashPass
      }).save();
      res.json({ message: "successful", success: true });
      Mailer(email);
      return;
    }
  } catch (e) {
    console.log("Error handler ===> ", e);
  }

  // new M_SignUp({
  //   email:"sajad@saderi.com",
  //   password:'122345'
  // }).save().then(()=>{
  //   res.send("signup");
  // })
};

exports.signIn = async (req, res) => {
  const code = confirmCode_GEN;
  email = "saderi.sajad@gmail.com";
  password = "qwedsasd";
  try {
    const ConfirmCodeListCheck = await M_ConfirmList.findOne({ email });
    if (ConfirmCodeListCheck) {
      return res.json({
        success: false,
        message: "Go to your email and copy your confirm code."
      });
    }
    const user = await M_SignUp.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "This email is not signed up"
      });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (passwordCompare) {
      res.json({ success: true, message: "Ok" });
      const newCode = await new M_ConfirmList({
        email,
        code
      }).save();
      Mailer(email, "Confirm Code", code);
      return;
    } else {
      return res.json({
        success: false,
        user_name: "Please enter the correct password."
      });
    }
  } catch (e) {
    console.log("Error handler ===> ", e);
  }
};
