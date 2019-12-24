const M_ThisDraw = require("../models/jackpots/thisDraw");
const M_User = require("../models/auth/User");
let thisDrawCount = 0;
const winnerFounder = async jackpot => {
  const { ticket, drawCount } = jackpot;
  thisDrawCount = drawCount;
  const thisDraw = await M_ThisDraw.getAllTickets();
  MegaWinner(ticket, thisDraw);
};

const MegaWinner = async (ticket, thisDraw) => {
  let winTicketList = [];
  let TempArr = [];
  let equalItem = 0;
  let powerBallStatus = false;
  thisDraw.forEach(user => {
    let jackpotArray = ticket.jackpot.split(",");
    user.tickets.forEach(userTicket => {
      powerBallStatus =
        userTicket.powerBall === ticket.powerBall ? true : false;
      let userTicketArray = userTicket.ticket.split(",");
      userTicketArray.forEach(a => {
        jackpotArray.forEach(b => {
          if (a === b) TempArr.push(a);
        });
      });
      equalItem = TempArr.length;
      if (equalItem > 1) {
        winTicketList = winTicketList.concat({
          equalItem,
          TempArr,
          powerBallStatus,
          userTicket: userTicket.ticket,
          powerBall: userTicket.powerBall
        });
      }
      TempArr = [];
    });
    if (equalItem > 1) {
      SaveMegaWinner(user.email, winTicketList);
      winTicketList = [];
    }
  });
  await M_ThisDraw.deleteMany({});
};

const SaveMegaWinner = async (email, winTicketList) => {
  try {
    const userDoc = await M_User.findOne({
      email
    });
    let docLen = userDoc.winners.length;
    if (docLen > 0) {
      if (userDoc.winners[docLen - 1].drawCount === thisDrawCount) {
        userDoc.winners[docLen - 1].list = userDoc.winners[
          docLen - 1
        ].list.concat(winTicketList);
      } else {
        userDoc.winners = userDoc.winners.concat({
          list: winTicketList,
          drawCount: thisDrawCount,
          date: new Date()
        });
      }
    } else {
      userDoc.winners = [
        { list: winTicketList, drawCount: thisDrawCount, date: new Date() }
      ];
    }
    return await userDoc.save();
  } catch (e) {
    console.log(e);
  }
};

module.exports = winnerFounder;
