module.exports = {
  successResponse: (req, res, code, data) => {
    res.status(code).json({ code, data, success: true });
  },
  errorResponse: (req, res, code, error) => {
    res.status(code).json({ code, error, sucess: false });
  },

  serverResponse: (res, code, message) => {
    res.status(code).json({ code, message, sucess: false });

  },
}