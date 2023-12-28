
const jwt = require('jsonwebtoken');
const userSchema = require('../models/userModel');
const response = require('../functions/responses');
const dbQuries = require('../models/dbQueries');


module.exports = {

  generateToken: async (_id) => {
    const newtoken = jwt.sign({ _id: _id.toString() }, process.env.JWT_SECRET_KEY, { expiresIn: '50m' });
    return newtoken;
  },


  userAuth: async (req, res, next) => {

    try {
      const token = req.header('Authorization').replace("Bearer ", "");
      // const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);

      if (!token) {
        return response.errorResponse(req, res, 401, 'Missing authorization header');
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          return false;
        }
        return decoded;
      })
      if (!decoded) {
        return response.errorResponse(req, res, 401, 'session expired');
      }

      const user = await userSchema.findOne({ _id: decoded._id });


      if (!user) {
        return response.errorResponse(req, res, 401, "please authenticate");
      }

      if (user.role === "admin" || user.role === "parent") {
        req.user = user;
        req.token = token;
        return next();
      }
      return response.errorResponse(req, res, 401, "access denied");

    }
    catch (error) {
      return response.serverResponse(res, 500, "Server Error");
    }
  },

  loginAuth: async (req, res, next) => {
    try {
      const data = await dbQuries.findUser(req.body.email);

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

  registerAuth: async (req, res, next) => {

    const data = await dbQuries.findUser(req.body.email)

  }
}
