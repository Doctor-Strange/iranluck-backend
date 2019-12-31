const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const admin = new Schema({
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
  password: {
    type: String,
    required: true,
    minLength: 8
  },
  priority: {
    type: Number,
    default: 2
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ],
  last_seen: {
    type: [
      {
        date: Date
      }
    ],
    required: true
  }
});

admin.pre("save", async function(next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

admin.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

admin.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await Admin.findOne({ email });
  if (!user) {
    throw new Error("Invalid Email or Password.");
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid Email or Password.");
  }

  user.last_seen = user.last_seen.concat({
    date: new Date()
  });
  user.save();
  return user;
};

const Admin = mongoose.model("Admins", admin);

module.exports = Admin;
