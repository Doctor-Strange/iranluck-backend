const M_User = require("../../models/auth/User");
const M_Jackpots = require("../../models/jackpots/jackpots");
const M_ThisDraw = require("../../models/jackpots/thisDraw");
const M_ThisDrawWinners = require("../../models/jackpots/thisDrawWinner");

//  Route ====> /admin/getRegisteredUser
exports.getRegisteredUser = async (req, res) => {
  try {
    const userList = await M_User.getAllUsers();
    return res.json({
      success: false,
      user_list: userList
    });
  } catch (e) {
    console.log("Error handler getRegisteredUser===>", e);
    return res.json({
      success: false,
      message: e.message
    });
  }
};

//  Route ====> /admin/lastJackpot
exports.lastJackpot = async (req, res) => {
  try {
    const jackpot = await M_Jackpots.getLastJackpot();
    return res.json({
      success: false,
      jackpot
    });
  } catch (e) {
    console.log("Error handler lastJackpot ===>", e);
    return res.json({
      success: false,
      message: e.message
    });
  }
};

//  Route ====> /admin/getThisDrawTickets
exports.getThisDrawTickets = async (req, res) => {
  try {
    const thisDraw = await M_ThisDraw.getThisDrawTickets();
    return res.json({
      success: false,
      thisDraw
    });
  } catch (e) {
    console.log("Error handler getThisDrawTickets ===>", e);
    return res.json({
      success: false,
      message: e.message
    });
  }
};


//  Route ====> /admin/getWinnerTicketsByDraw
exports.getWinnerTicketsByDraw = async (req, res) => {
  draw = 11
  try {
    const thisDraw = await M_ThisDrawWinners.getByDraw(draw);
    return res.json({
      success: false,
      thisDraw
    });
  } catch (e) {
    console.log("Error handler getWinnerTicketsByDraw ===>", e);
    return res.status(402).json({
      success: false,
      message: e.message
    });
  }
};

//  Route ====> /admin/getAllWinnerTickets
exports.getAllWinnerTickets = async (req, res) => {
  try {
    const thisDraw = await M_ThisDrawWinners.getAllWinners();
    return res.json({
      success: false,
      thisDraw
    });
  } catch (e) {
    console.log("Error handler getWinnerTicketsByDraw ===>", e);
    return res.status(402).json({
      success: false,
      message: e.message
    });
  }
};