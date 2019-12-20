const jackpot_Gen = () => {
  const jackpotArr = Array(6).fill(0);
  const powerBall = Math.floor(Math.random() * 9) + 1;
  const jackpot = jackpotArr
    .map((_, i) => {
      const number = Math.floor(Math.random() * 60) + 1;
      if (jackpotArr.indexOf(number) !== -1) {
        return (jackpotArr[i] = Math.floor(Math.random() * 60) + 1);
      } else return (jackpotArr[i] = number);
    })
    .join(",");
  return { jackpot, powerBall };
};
module.exports = jackpot_Gen;
