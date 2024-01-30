
const jwt = require('jsonwebtoken');
const userSchema = require('../models/userModel');
const response = require('../functions/responses');
const commonQueries = require('../queries/commonQueries');



module.exports = {

  generateToken: async (_id) => {
    const newtoken = jwt.sign({ _id: _id.toString() }, process.env.JWT_SECRET_KEY, { expiresIn: '50m' });
    return newtoken;
  },


  userAuth: async (req, res, next) => {

    try {
      const token = req.header('Authorization');

      if (!token) {
        return response.errorResponse(req, res, 401, 'Missing authorization header');
      }

      const tokenWithoutBearer = token.replace("Bearer ", "");

      if (!tokenWithoutBearer) {
        return response.errorResponse(req, res, 401, 'Invalid authorization format');
      }

      const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          return false;
        }
        return decoded;
      });

      if (!decoded) {
        return response.errorResponse(req, res, 401, 'Session expired');
      }

      const user = await userSchema.findOne({ _id: decoded._id });

      if (!user) {
        return response.errorResponse(req, res, 401, 'Please authenticate');
      }

      if (user.role === 'admin' || user.role === 'parent') {
        req.user = user;
        req.token = tokenWithoutBearer;
        return next();
      }

      return response.errorResponse(req, res, 401, 'Access denied');
    } catch (error) {
      return response.serverResponse(res, 500, 'Server Error');
    }
  },

  loginAuth: async (req, res, next) => {
    try {
      const data = await commonQueries.findUser(req.body.email);

      if (!data) {
        return response.errorResponse(req, res, 401, "User not found");
      }

      if (data.role === 'children') {
        return response.errorResponse(req, res, 401, "Unauthorized");
      }

      next();
    } catch (error) {
      console.error('Error in loginAuth middleware:', error);
      return response.serverResponse(res, 500, "Server Error");
    }
  },

  // registerAuth: async (req, res, next) => {

  //   const data = await dbQuries.findUser(req.body.email)

  // },

  resetPassword: async (req, res, next) => {

    const decoded = jwt.verify(req.query.token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return false;
      }
      return decoded;
    });

    if (!decoded) {
      return response.errorResponse(req, res, 401, 'Session expired');
    }

    const user = await userSchema.findOne({ _id: decoded._id });
    console.log(user);

    if (!user) {
      return response.errorResponse(req, res, 401, 'Please authenticate');
    }
    req.user = user;
    return next();

  }
}
