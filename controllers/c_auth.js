const M_SignUp = require("../models/auth/createUser");
// const M_ConfirmList = require("../models/confirm/confirmList");

// Route ====> /auth/signup
exports.signup = async (req, res) => {
  email = "iran.luck.email@gmail.com";
  password = "123456789";
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
      const newUser = new M_SignUp({
        email,
        password
      });
      await newUser.save();
      const token = await newUser.generateAuthToken();
      return res
        .status(201)
        .json({ token: token, message: "successful", success: true });
      return;
    }
  } catch (e) {
    console.log("Error handler ===> ", e);
    return res.status(400).json({ message: e.message, success: false });
  }
};

// Route ====> /auth/signin
exports.signIn = async (req, res) => {
  email = "iran.luck.email@gmail.com";
  password = "123456789";
  try {
      const user = await M_SignUp.findByCredentials(email, password);
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
