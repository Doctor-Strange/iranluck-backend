const M_User = require("../models/auth/User");

const middle_purchase = (req, res, next) => {
  const { lucky_coin, perfect_money } = req.user;
  //   const {use_lucky_coin }= req;
  const use_lucky_coin = true;
  // DEV^
  // ticketCount = req.ticket.length
  ticketCount = 3;
  // DEV^
  try {
    if (perfect_money <= 0) {
      throw new Error(
        "Your Don't have any Perfect Money, please charge your account"
      );
    }
    if (use_lucky_coin && lucky_coin <= 0) {
      throw new Error("You can't use your Lucky Coin");
    }
    // add ticketCount to request object
    req.ticketCount = ticketCount;
    if (use_lucky_coin) {
      if (ticketCount > perfect_money) {
        if (ticketCount === perfect_money + 1) {
          next();
        } else if (ticketCount > perfect_money + 1) {
          throw new Error(
            "Your Deposit is not enough, please charge your account"
          );
        } else {
          next();
        }
      }
      if (ticketCount < perfect_money) {
        next();
      }
    } else {
      if (ticketCount > perfect_money) {
        throw new Error(
          "Your Deposit is not enough, please charge your account"
        );
      } else {
        next();
      }
    }
  } catch (e) {
    console.log(e);
    return res.status(402).json({
      message: e.message,
      success: false
    });
  }
};

module.exports = middle_purchase;
