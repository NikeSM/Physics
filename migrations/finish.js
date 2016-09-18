module.exports = (sum, length, callback, text) => {
  if (sum === length) {
    callback();
    console.log(text);
  }
  return sum + 1;
};