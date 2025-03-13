async function delay(delayTimeInMs = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delayTimeInMs);
  });
}
module.exports = { delay };
