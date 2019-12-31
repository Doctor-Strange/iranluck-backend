const mongoose = require("mongoose");
const validator = require("validator");

const confirmCode_GEN = require("../../utils/confirmCode_GEN");

const Schema = mongoose.Schema;

const adminConfirmList = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid Email address" });
      }
    }
  },
  code: {
    type: String
  }
});

adminConfirmList.pre("save", async function(next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified("email")) {
    user.code = confirmCode_GEN;
  }
  next();
});

adminConfirmList.statics.findByCredentials = async (email, code) => {
  const user = AdminConfirmList.findOne({ email });
  if (!user) {
    throw new Error("Unauthorized Email.");
  }
  if (user.code !== code) {
    throw new Error("Invalid Confirm code.");
  }
  return { success: true, message: "Ok" };
};

const AdminConfirmList = mongoose.model("AdminConfirmLists", adminConfirmList);

module.exports = AdminConfirmList;
