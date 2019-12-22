const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const signup = new Schema({
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
  tickets: [
    {
      ticket: {
        type: [
          {
            ticket: { type: String, required: true },
            powerBall: { type: Number, required: true }
          }
        ],
        required: true
      },
      drawCount: {
        type: Number,
        required: true
      },
      date: {
        type: Date,
        required: true
      }
    }
  ],
  winners: [
    {
      ticket: { type: String, required: true },
      powerBall: { type: Number, required: true },
      drawCount: {
        type: Number,
        required: true
      },
      date: {
        type: Date,
        required: true
      }
    }
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

signup.pre("save", async function(next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

signup.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

signup.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await Signup.findOne({ email });
  if (!user) {
    throw new Error("Invalid Email or Password.");
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid Email or Password.");
  }
  return user;
};

signup.statics.addTicket = async (email, ticket, drawCount) => {
  const user = await Signup.findOne({ email });
  if (user.tickets.length >= 1) {
    const DocLen = user.tickets.length - 1;
    if (user.tickets[DocLen].drawCount === drawCount) {
      user.tickets[DocLen].ticket = user.tickets[DocLen].ticket.concat(ticket);
    } else {
      user.tickets = user.tickets.concat({
        ticket,
        date: new Date(),
        drawCount
      });
    }
  } else {
    user.tickets = [{ ticket, date: new Date(), drawCount }];
  }
  user.save();
  return user;
};

const Signup = mongoose.model("Signup", signup);

module.exports = Signup;
