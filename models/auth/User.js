const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const Ref_GEN = require("../../utils/ref_id_GEN");
const confirmCode_GEN = require("../../utils/confirmCode_GEN");

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
      list: [
        {
          userTicket: { type: String, required: true },
          powerBall: { type: Number, required: true },
          equalItem: Number,
          TempArr: [],
          powerBallStatus: Boolean
        }
      ],
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
  ref_id: {
    type: String,
    default: Ref_GEN()
  },
  parent_ref_id: String,
  // check if the parent got half of the prize of the winner.
  parent_active: {
    type: Boolean,
    default: true
  },
  perfect_money: {
    type: Number,
    default: 0
  },
  lucky_coin: {
    type: Number,
    default: 1
  },
  confirm_code: {
    code: Number,
    Timestamp: Number
  },
  deposit_history: {
    type: [
      {
        amount: Number,
        date: Date
      }
    ]
  },
  withdrawal_history: {
    type: [
      {
        amount: Number,
        date: Date
      }
    ]
  },
  wallet: String,
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ],
  inbox: {
    type: [
      {
        read: {
          type: Boolean,
          default: false
        },
        message: {
          type: String,
          required: true
        },
        date: Date
      }
    ]
  }
});

signup.pre("save", async function(next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

signup.statics.generateConfirmCode = async _id => {
  // add 3 minutes to current time stamp
  let Timestamp = Date.now() + 180;
  const user = await Signup.findOne({ _id });
  user.confirm_code = {
    code: confirmCode_GEN,
    Timestamp
  };
  return await user.save();
};

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

signup.statics.addLuckyCoin = async ref_id => {
  const user = await Signup.findOne({ ref_id });
  if (!user) {
    throw new Error("Invalid Reference ID.");
  }
  user.lucky_coin = user.lucky_coin + 1;
  return await user.save();
};

signup.statics.addTicket = async (
  // id,
  email,
  // DEV^
  ticket,
  drawCount,
  perfect_money,
  lucky_coin
) => {
  try {
    // const user = await Signup.findOne({ id });
    const user = await Signup.findOne({ email });
    // DEV^
    if (!user) {
      throw new Error("User not found!");
    }
    user.perfect_money = perfect_money;
    user.lucky_coin = lucky_coin;
    if (user.tickets.length >= 1) {
      const DocLen = user.tickets.length - 1;
      if (user.tickets[DocLen].drawCount === drawCount) {
        user.tickets[DocLen].ticket = user.tickets[DocLen].ticket.concat(
          ticket
        );
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
  } catch (e) {
    throw new Error(e);
  }
};

signup.statics.getAllUsers = async () => {
  try {
    const userList = await Signup.find({}).select(
      "email perfect_money lucky_coin"
    );
    return userList;
  } catch (e) {
    throw new Error("An Error occur, We are working on it.");
  }
};

signup.statics.checkConfirmcode = async (_id, confirmCode) => {
  const user = await await Signup.findOne({ _id });
  if (!user) {
    throw new Error("Email address is not correct");
  }
  const { Timestamp, code } = user;
  const RightNowTimeStamp = Date.now();
  if (Timestamp > RightNowTimeStamp) {
    if (code === confirmCode) {
      user.confirm_code = {
        code: 0,
        Timestamp: 0
      };
      return await user.save();
    } else {
      throw new Error("Your confirm code is not correct.");
    }
  } else {
    throw new Error("Your confirm code is expired.");
  }
};

const Signup = mongoose.model("Users", signup);

module.exports = Signup;
