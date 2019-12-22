const M_Jackpots = require("../models/jackpots/jackpots");

const jackpot_Gen = require("./jackpot_Gen");

const date = new Date();
let remainingDay;
let getDay = date.getDay();
let getHours;
let getMinutes;
let getSeconds;
let remainingHours;
let remainingMinutes;
let remainingSeconds;
const drawDate = { day: 0, hour: 0, minute: 0, second: 0 };
switch (getDay) {
  case 0:
    remainingDay = 0;
    break;
  case 1:
    remainingDay = 6;

    break;
  case 2:
    remainingDay = 5;

    break;
  case 3:
    remainingDay = 4;

    break;
  case 4:
    remainingDay = 3;

    break;
  case 5:
    remainingDay = 2;

    break;
  default:
    remainingDay = 1;

    break;
}

exports.draw = () => {
  dayStarter();
};

exports.countDown = () => {
  const date = new Date();
  return {
    remainingDay,
    remainingHours: 23 - date.getHours(),
    remainingMinutes: 59 - date.getMinutes(),
    remainingSeconds: 59 - date.getSeconds()
  };
};

const dayStarter = () => {
  console.log("daily count down started");
  let dailyInterval = setInterval(() => {
    //console.log(remainingDay);
    if (drawDate.day === remainingDay) {
      hourStarter();
      //   set the start day to 6
      clearInterval(dailyInterval);
    } else remainingDay = remainingDay - 1;
  }, 86400000);
};

const hourStarter = () => {
  // set the hours of that current moment
  getHours = date.getHours();
  remainingHours = 23 - getHours;

  //console.log("hourly count down started");
  let hoursInterval = setInterval(() => {
    //console.log(remainingHours);
    if (drawDate.hour === remainingHours) {
      minutesStarter();
      clearInterval(hoursInterval);
    } else remainingHours = remainingHours - 1;
  }, 3600000);
};

const minutesStarter = () => {
  getMinutes = date.getMinutes();
  remainingMinutes = 59 - getMinutes;
  //console.log("minutely count down started");
  let minutesInterval = setInterval(() => {
    //console.log(remainingMinutes);
    if (drawDate.minute === remainingMinutes) {
      secondsStarter();
      clearInterval(minutesInterval);
    } else remainingMinutes = remainingMinutes - 1;
  }, 60000);
};
const secondsStarter = () => {
  getSeconds = date.getSeconds();
  remainingSeconds = 59 - getSeconds;
  //console.log("secondly count down started");
  let secondsInterval = setInterval(() => {
    //console.log(remainingSeconds);
    if (drawDate.second === remainingSeconds) {
      remainingDay = 6;
      dayStarter();
      jackpotSaver();
      clearInterval(secondsInterval);
    } else remainingSeconds = remainingSeconds - 1;
  }, 1000);
};

const jackpotSaver = async () => {
  const jackpotIs = jackpot_Gen();
  //console.log(jackpotIs);
  const collectionLength = await M_jackpot.estimatedDocumentCount();
  const jackpot = new M_Jackpots({
    ticket: jackpotIs,
    date: new Date(),
    drawCount: collectionLength
  });
  await jackpot.save();
};
