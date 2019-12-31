const M_User = require("../models/auth/User");
// const M_ConfirmList = require("../models/confirm/confirmList");
const signUpPresent = require("../utils/messages/signUpPresent");

// Route ====> /auth/signup
exports.signup = async (req, res) => {
  // email = "test@gmail.com";
  const email = "sajad.saderi@gmail.com";
  password = "987654321";
  parent_ref_id = null;
  try {
    const user = await M_User.findOne({
      email
    });
    if (user) {
      return res.json({
        success: false,
        message: "This email is signed up before"
      });
    } else {
      let userData = null;
      if (parent_ref_id) {
        await M_User.addLuckyCoin(parent_ref_id);
        userData = {
          email,
          password,
          parent_ref_id
        };
      } else {
        userData = {
          email,
          password,
          inbox: signUpPresent()
        };
      }
      const newUser = new M_User(userData);
      await newUser.save();
      const token = await newUser.generateAuthToken();
      res
        .status(201)
        .json({
          token: token,
          message: "successful",
          success: true,
        });
    }
  } catch (e) {
    console.log("Error handler ===> ", e);
    return res.status(400).json({ message: e.message, success: false });
  }
};

// Route ====> /auth/signin
exports.signIn = async (req, res) => {
  email = "saderi.sajad@gmail.com";
  password = "987654321";
  try {
    const user = await M_User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    return res.json({ success: true, message: "Ok", token: token });
  } catch (e) {
    return res.status(401).json({ success: false, message: e.message });
  }
};

// Route ====> /auth/confirmcode
// exports.confirmCodeCheck = async (req, res) => {
//   const code = "22574";
//   email = "iran.luck.email@gmail.com";
//   try {
//     const checkCredentials = await M_ConfirmList.findByCredentials(email, code);
//     checkCredentials.remove();
//     return res.json({
//       success: true,
//       message: "ok"
//     });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//     console.log("Error handler ===> ", e);
//   }
// };

// send email workFlow ===>

// const code = confirmCode_GEN;

// const codeAssigned = await M_ConfirmList.findOne({ email });
//     if (codeAssigned) {
//       return res.status(400).json({
//         success: false,
//         message: "Go to your email and copy your confirm code."
//       });
//       const newCode = await new M_ConfirmList({
//         email,
//         code
//       });
//       await newCode.save();
//       Mailer(email, "Confirm Code", code);
//     }
