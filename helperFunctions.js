module.exports = {
  sendResponse: (res, errorValue, messagevalue, dataValue) => {
    res.send({
      error: errorValue,
      message: messagevalue,
      data: dataValue,
    });
  },
  errorLogging: (myError) => {
    console.error(`Error (${myError.code}): ${myError.message}`);
  },
};
