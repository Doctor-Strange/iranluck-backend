module.exports = () => {
  // Base 36 uses letters and digits to represent a number:
  return (Math.random() + 1)
    .toString(36)
    .substring(2)
    .toUpperCase();
};
