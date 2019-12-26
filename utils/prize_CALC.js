const Jackpot = 1000;
const _5 = 250;
const _4 = 25;
const _3 = 2;
const _2 = 0;
const powerCoinValue = 2;

module.exports = (count, powerCoin) => {
  let amount = 0;
  switch (count) {
    case 6:
      amount = Jackpot;
      break;
    case 5:
      amount = _5;
      break;
    case 4:
      amount = _4;
      break;
    case 3:
      amount = _3;
      break;
    case 2:
      amount = _2;
      break;
    default:
      amount = -1;
      break;
  }
  return powerCoin
    ? {
        money: amount + powerCoinValue,
        lucky_coin: amount === 0 ? 1 : 0
      }
    : {
        money: amount,
        lucky_coin: amount === 0 ? 1 : 0
      };
};
