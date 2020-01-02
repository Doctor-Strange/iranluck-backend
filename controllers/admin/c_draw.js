const M_User = require("../../models/auth/User");
const M_Jackpots = require("../../models/jackpots/jackpots");
const M_ThisDraw = require("../../models/jackpots/thisDraw");
const M_ThisDrawWinners = require("../../models/jackpots/thisDrawWinner");
const jackpot_Gen = require("../../utils/jackpot_Gen");
const winnerFounder = require("../../utils/winnerFounder");

//  Route ====> /admin/getRegisteredUser
exports.getRegisteredUser = async (req, res) => {
  try {
    const userList = await M_User.getAllUsers();
    return res.json({
      success: true,
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
      success: true,
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
      success: true,
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
  draw = 11;
  try {
    const thisDraw = await M_ThisDrawWinners.getByDraw(draw);
    return res.json({
      success: true,
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
      success: true,
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

//  Route ====> /admin/manualDraw
exports.manualDraw = async (req, res) => {
  try {
    const jackpotIs = jackpot_Gen();
    const collectionLength = await M_Jackpots.estimatedDocumentCount();
    const jackpot = new M_Jackpots({
      ticket: jackpotIs,
      date: new Date(),
      drawCount: collectionLength
    });
    await jackpot.save();
    jackpotIs.drawCount = collectionLength;
    res.json({
      success: true,
      jackpot: jackpotIs
    });
    const soldTicketLen = await M_ThisDraw.estimatedDocumentCount();
    if (soldTicketLen > 0) {
      winnerFounder(jackpot);
    } else {
      console.log("Nothing Sold");
    }
  } catch (e) {
    console.log("Error handler getWinnerTicketsByDraw ===>", e);
    return res.status(402).json({
      success: false,
      message: e.message
    });
  }
};
