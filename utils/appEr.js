const appEr = (message) => {
  let error = new Error(message);
  error.stack = error.stack;
  error.status = error.status ? error.status : 500;
  return error;
};
module.exports = appEr;
