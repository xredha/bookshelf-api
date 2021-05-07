const responseDataAPI = (status, message = undefined, data = undefined) => {
  if (!message) {
    return {
      status,
      data,
    };
  }
  if (!data) {
    return {
      status,
      message,
    };
  }
  return {
    status,
    message,
    data,
  };
};

module.exports = responseDataAPI;
