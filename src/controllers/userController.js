const dbQueries = require('../models/dbQueries');
const bcrypt = require('../functions/bcrypt');
const auth = require('../middleware/auth');
const mapfun = require('../functions/mapFunctiions');
const responses = require('../functions/responses');

module.exports = {


  register: async (req, res) => {

    try {

      const find = await dbQueries.findUser(req.body.email);

      if (find) {
        return responses.errorResponse(req, res, 409, "email Already exists");
      }

      if (req.body.password !== req.body.confirmPassword) {
        return responses.errorResponse(req, res, 400, "password not matched");
      }

      const hash = await bcrypt.hashPassword(req.body.password);
      const body = {
        name: req.body.name,
        email: req.body.email,
        password: hash,
        role: req.body.role,
        isActive: true,
      }
      const result = await dbQueries.register(body);
      let data;

      switch (result.role) {
        case 'parent':
          const parentData = await dbQueries.addParent(result.id);

          // setting up childern data to add them into user table
          const children = await mapfun.mapChildren(req.body.children, req.body.children.class);

          // registering into user table 
          data = await dbQueries.register(children);
          console.log("data is ", data);

          // mapping childern feild  
          const user_ids = data.map(child => child._id);
          const grades = req.body.children.map(child => child.class);
          const names = req.body.children.map(child => child.name);

          // adding childern to childern table
          const childernData = await dbQueries.addChildern(user_ids, grades, names);

          //update parent table with childern Id
          data = await dbQueries.addchildernToparent(parentData._id, childernData);
          break;

        case 'teacher':
          data = await dbQueries.addTeacher(result.id, req.body.subjects, req.body.classes);
          break;


        default:
          // Handle the case when the role is neither 'parent', 'teacher',
          console.error('Invalid role:', result.role);
          break;
      }

      if (result && data) {
        return responses.successResponse(req, res, 201, data);
      }
      else {
        return responses.errorResponse(req, res, 400, "failed to signup");
      }
    }
    catch (err) {
      return responses.serverResponse(res, 500, err);
    }

  },


  login: async (req, res) => {

    try {
      const user = await dbQueries.findUser(req.body.email);

      if (!user) {
        return responses.errorResponse(req, res, 404, "not found");
      }

      const valid = await bcrypt.comparePassword(req.body.password, user.password);

      if (!valid) {
        return responses.errorResponse(req, res, 409, "check your credentials");
      }

      const token = await auth.generateToken(user._id);
      return responses.successResponse(req, res, 200, token);
    }
    catch (err) {

      return responses.serverResponse(res, 500, err);
    }

  },




  getTeachers: async (req, res) => {

    try {

      const teachers = await dbQueries.getTeachers();

      if (teachers) {

        return responses.successResponse(req, res, 200, teachers);
      }
      return responses.errorResponse(req, res, 404, "no data found")
    }
    catch (err) {
      return responses.serverResponse(res, 500, "internal server error");
    }
  },

  getLocations: async (req, res) => {
    try {
      const locations = await dbQueries.getLocations();

      if (locations) {

        return responses.successResponse(req, res, 200, locations);
      }
      return responses.errorResponse(req, res, 404, "no data found");
    }
    catch (err) {
      return responses.serverResponse(res, "500", "internal server error");
    }
  },

  addClass: async (req, res) => {

    try {
      const data = {
        name: req.body.name,
        subjects: req.body.subjects,
      }

      const Class = await dbQueries.addClass(data);

      if (Class) {
        return responses.successResponse(req, res, 201, Class)
      }
      return responses.errorResponse(req, res, 400, "unable to add");
    }
    catch (err) {
      return responses.errorResponse(res, 500, "internal server erroe");
    }


  }
}