const M_ThisDraw = require("../models/jackpots/thisDraw");
const M_User = require("../models/auth/User");
let thisDrawCount = 0;
const winnerFounder = async jackpot => {
  const { ticket, drawCount } = jackpot;
  thisDrawCount = drawCount;
  console.log(ticket.jackpot, ticket.powerBall);
  const thisDraw = await M_ThisDraw.getAllTickets();
  MegaWinner(ticket, thisDraw);
};

const MegaWinner = (ticket, thisDraw) => {
  thisDraw.map(user => {
    return user.tickets.find(userTicket => {
      if (
        userTicket.ticket === ticket.jackpot &&
        userTicket.powerBall === ticket.powerBall
      );
      return SaveMegaWinner(user.email, userTicket, ticket.drawCount);
    });
  });
};

const SaveMegaWinner = async (email, ticket) => {
  console.log(thisDrawCount);

  const userDoc = await M_User.findOne({
    email
  });
  let docLen = userDoc.winners.length;
  if (docLen > 0) {
    if (userDoc.winners[docLen - 1].drawCount === thisDrawCount) {
      userDoc.winners[docLen - 1].list = userDoc.winners[
        docLen - 1
      ].list.concat(ticket);
    } else {
      userDoc.winners = userDoc.winners.concat({
        list: ticket,
        drawCount: thisDrawCount,
        date: new Date()
      });
    }
  } else {
    userDoc.winners = [
      { list: ticket, drawCount: thisDrawCount, date: new Date() }
    ];
  }
  await userDoc.save();
};

module.exports = winnerFounder;
