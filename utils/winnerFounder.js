const M_ThisDraw = require("../models/jackpots/thisDraw");
const M_User = require("../models/auth/User");
const prize_CALC = require("./prize_CALC");

let thisDrawCount = 0;

const winnerFounder = async jackpot => {
  const { ticket, drawCount } = jackpot;
  thisDrawCount = drawCount;
  const thisDraw = await M_ThisDraw.getAllTickets();
  MegaWinner(ticket, thisDraw);
};

const MegaWinner = async (ticket, thisDraw) => {
  let winTicketList = {
    TicketWinPrize: [],
    quantity: 0,
    lucky_coin: 0
  };
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
      console.log(TempArr);

      equalItem = TempArr.length;
      if (equalItem > 1) {
        const prize = prize_CALC(equalItem, powerBallStatus);
        winTicketList.TicketWinPrize = winTicketList.TicketWinPrize.concat({
          equalItem,
          TempArr,
          powerBallStatus,
          userTicket: userTicket.ticket,
          powerBall: userTicket.powerBall
        });
        winTicketList.quantity = winTicketList.quantity + prize.money;
        winTicketList.lucky_coin = winTicketList.lucky_coin + prize.lucky_coin;
      }
      TempArr = [];
      equalItem = 0;
      powerBallStatus = false;
    });
    if (winTicketList.TicketWinPrize.length > 0) {
      SaveMegaWinner(user.email, winTicketList);
      winTicketList = {
        TicketWinPrize: [],
        quantity: 0,
        lucky_coin: 0
      };
    }
  });
  await M_ThisDraw.deleteMany({});
};

const SaveMegaWinner = async (email, winTicketList) => {
  console.log(email, winTicketList);

  try {
    const userDoc = await M_User.findOne({
      email
    });
    let docLen = userDoc.winners.length;
    if (docLen > 0) {
      if (userDoc.winners[docLen - 1].drawCount === thisDrawCount) {
        userDoc.winners[docLen - 1].list = userDoc.winners[
          docLen - 1
        ].list.concat(winTicketList.TicketWinPrize);
        userDoc.perfect_money = userDoc.perfect_money + winTicketList.quantity;
        userDoc.lucky_coin = userDoc.lucky_coin + winTicketList.lucky_coin;
      } else {
        userDoc.winners = userDoc.winners.concat({
          list: winTicketList.TicketWinPrize,
          drawCount: thisDrawCount,
          date: new Date()
        });
        userDoc.perfect_money = userDoc.perfect_money + winTicketList.quantity;
        userDoc.lucky_coin = userDoc.lucky_coin + winTicketList.lucky_coin;
      }
    } else {
      userDoc.winners = [
        {
          list: winTicketList.TicketWinPrize,
          drawCount: thisDrawCount,
          date: new Date()
        }
      ];
      userDoc.perfect_money = winTicketList.quantity;
      userDoc.lucky_coin = winTicketList.lucky_coin;
    }
    return await userDoc.save();
  } catch (e) {
    console.log("SaveMegaWinner ==>", e);
  }
};

module.exports = winnerFounder;
