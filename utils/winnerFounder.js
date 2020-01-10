const M_ThisDraw = require("../models/jackpots/thisDraw");
const M_User = require("../models/auth/User");
const prize_CALC = require("./prize_CALC");
const winAlert = require("../utils/messages/winAlert");
const M_ThisDrawWinners = require("../models/jackpots/thisDrawWinner");

let thisDrawCount = 0;
let thisDrawWinners = {
  tickets: [],
  draw_count: 0
};
const winnerFounder = async jackpot => {
  const { ticket, drawCount } = jackpot;
  thisDrawCount = drawCount;
  thisDrawWinners.draw_count = drawCount;
  try {
    const thisDraw = await M_ThisDraw.getThisDrawTickets();
    await MegaWinner(ticket, thisDraw);
    if (thisDrawWinners.tickets.length > 0) {
      await M_ThisDrawWinners.saveWinners(thisDrawWinners);
      return;
    }
  } catch (e) {
    console.log("Error handler in winnerFounder ====>", e);
  }
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
      // console.log(TempArr);
      equalItem = TempArr.length;
      if (equalItem === 1 && powerBallStatus) {
        winTicketList = {
          ...winTicketList,
          lucky_coin: winTicketList.lucky_coin + 1
        };
      } else if (equalItem > 1) {
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
    if (
      winTicketList.TicketWinPrize.length === 0 &&
      winTicketList.lucky_coin > 0
    ) {
      SaveMegaWinner(user.email, winTicketList);
    } else if (winTicketList.TicketWinPrize.length > 0) {
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
  // console.log(email, winTicketList);
  try {
    const userDoc = await M_User.findOne({
      email
    });
    if (winTicketList.TicketWinPrize.length < 1) {
      userDoc.lucky_coin = userDoc.lucky_coin + winTicketList.lucky_coin;
    } else {
      let docLen = userDoc.winners.length;
      if (docLen > 0) {
        if (userDoc.winners[docLen - 1].drawCount === thisDrawCount) {
          userDoc.winners[docLen - 1].list = userDoc.winners[
            docLen - 1
          ].list.concat(winTicketList.TicketWinPrize);
          userDoc.perfect_money =
            userDoc.perfect_money + winTicketList.quantity;
          userDoc.lucky_coin = userDoc.lucky_coin + winTicketList.lucky_coin;
        } else {
          userDoc.winners = userDoc.winners.concat({
            list: winTicketList.TicketWinPrize,
            drawCount: thisDrawCount,
            date: new Date()
          });
          userDoc.perfect_money =
            userDoc.perfect_money + winTicketList.quantity;
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
      if (userDoc.parent_active && winTicketList.quantity > 0) {
        const parentDoc = await M_User.findOne({
          parent_ref_id: userDoc.parent_ref_id
        });
        parentDoc.perfect_money =
          parentDoc.perfect_money + winTicketList.quantity / 2;
        await parentDoc.save();
        userDoc.parent_active = false;
      }
    }
    thisDrawWinners.tickets = thisDrawWinners.tickets.concat({
      email,
      win_ticket: winTicketList.TicketWinPrize
    });
    userDoc.inbox = userDoc.inbox.concat(winAlert(thisDrawCount));
    return await userDoc.save();
  } catch (e) {
    console.log("SaveMegaWinner ==>", e);
  }
};

module.exports = winnerFounder;
