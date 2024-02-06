const bcrypt = require('../functions/bcrypt');
const auth = require('../middleware/auth');
const mapfun = require('../functions/mapFunctiions');
const responses = require('../functions/responses');
const commonQueries = require('../queries/commonQueries');
const adminQueries = require('../queries/AdminQueries');
const generalQueries = require('../queries/generalQueries');
const mapFunctiions = require('../functions/mapFunctiions');
const mailer = require('../functions/mailer');
const helpers = require('../functions/helpers');
const { response } = require('../../app');

module.exports = {

  register: async (req, res) => {

    try {

      const find = await commonQueries.findUser(req.body.email);

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

      const result = await adminQueries.register(body);
      let data;

      switch (result.role) {
        case 'parent':
          const parentData = await adminQueries.addParent(result.id);

          // setting up childern data to add them into user table

          const children = await mapfun.mapChildren(req.body.children, req.body.children.class);

          // registering into user table 
          data = await adminQueries.register(children);
          console.log("data is ", data);

          // mapping childern feild  
          const user_ids = data.map(child => child._id);
          const grades = req.body.children.map(child => child.class);
          const names = req.body.children.map(child => child.name);

          // adding childern to childern table
          const childernData = await adminQueries.addChildern(user_ids, grades, names);

          //update parent table with childern Id
          data = await adminQueries.addchildernToparent(parentData._id, childernData);
          break;

        case 'teacher':
          data = await adminQueries.addTeacher(result.id, req.body.subjects, req.body.classes);
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

  changePassword: async (req, res) => {
    try {
      //const hash = await bcrypt.hashPassword(req.body.oldPassword);
      const match = await bcrypt.comparePassword(req.body.oldPassword, req.user.password);
      console.log(req.user);
      console.log(match, req.user.password, req.body.newPassword, req.body.confirmPassword)
      if (match && req.body.newPassword == req.body.confirmPassword) {

        const hashPassword = await bcrypt.hashPassword(req.body.newPassword);

        const result = await commonQueries.resetPassword(req.user.email, hashPassword);
        if (result.success) {
          return responses.successResponse(req, res, 200, "password updated")
        }
      }
      return responses.errorResponse(req, res, 400, "check your data")
    }
    catch (err) {
      return responses.serverResponse(res, 500, err)
    }
  },

  forgetPassword: async (req, res) => {
    try {
      const user = await generalQueries.findEmail(req.body.email);
      console.log(user);

      if (!user) {
        return responses.errorResponse(req, res, 400, "enter valid email");
      }

      const token = await auth.generateToken(user._id);
      const resetLink = `https://localhost/resetPassword?token=${token}`
      console.log(resetLink);

      //const otp = helpers.numberGenerator(6);

      const info = await mailer.sendMailforForgetPassword(req.body.email, resetLink);
      console.log(info);


      if (info) {
        return responses.successResponse(req, res, 200, info);
      }

      return responses.errorResponse(req, res, 400, "unable to send otp")
    }
    catch (err) {
      return responses.serverResponse(res, 500, err);
    }

  },

  resetPassword: async (req, res) => {
    try {
      if (req.user.email == req.body.email && req.body.newPassword == req.body.confirmPassword) {

        const hash = await bcrypt.hashPassword(req.body.newPassword);

        const updatePassword = await commonQueries.resetPassword(req.body.email, hash);

        if (updatePassword.success) {
          return responses.successResponse(req, res, 200, "password reset sucessfully")
        }
      }
      return responses.errorResponse(req, res, 400, "check your data");
    }
    catch (err) {
      return responses.serverResponse(res, 500, err);
    }
  },

  addChildrenToParent: async (req, res) => {

    try {

      const parent = await generalQueries.findParentId(req.body.parentId);

      if (!parent) {
        return responses.errorResponse(req, res, 404, "No Parent found");
      }

      const children = await mapfun.mapChildren(req.body.children, req.body.children.class);

      // registering into user table 
      data = await adminQueries.register(children);
      console.log("data is ", data);

      // mapping childern feild  
      const user_ids = data.map(child => child._id);
      const grades = req.body.children.map(child => child.class);
      const names = req.body.children.map(child => child.name);

      // adding childern to childern table
      const childernData = await adminQueries.addChildern(user_ids, grades, names);

      //update parent table with childern Id
      data = await adminQueries.addchildernToparent(req.body.parentId, childernData);

      if (data) {
        return responses.successResponse(req, res, 201, "children added Sucessfully")
      }
      return responses.errorResponse(req, res, 400, "check your data");
    }
    catch (err) {
      return responses.serverResponse(res, 500, err);
    }
  },

  enableDisableChild: async (req, res) => {

    try {

      const isUpdated = await generalQueries.findChildIdandSetIsActive(req.body.childId);

      if (isUpdated) {
        return responses.successResponse(req, res, 200, "successfully done");
      }
      return responses.errorResponse(req, res, 404, "child not found")
    }
    catch (err) {
      return responses.serverResponse(res, 500, "internal server error");
    }
  },

  login: async (req, res) => {

    try {
      const user = await commonQueries.findUser(req.body.email);

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

  getAvailableLocations: async (req, res) => {
    try {
      const ptm = await commonQueries.findPtmById(req.body.ptmId);

      if (!ptm) {
        return responses.errorResponse(req, res, 400, "ptm not found")
      }

      const location = await adminQueries.getAvailableLocations(req.body.ptmId);

      if (location) {
        return responses.successResponse(req, res, 200, location)
      }
      return responses.errorResponse(req, res, 400, "check your data");
    }
    catch (err) {
      return responses.serverResponse(res, 500, "server error")
    }

  },

  getAllParents: async (req, res) => {

    try {
      const teachers = await adminQueries.getAllParents();

      if (teachers) {
        return responses.successResponse(req, res, 200, teachers);
      }
      return responses.errorResponse(req, res, 404, "no data found")
    }
    catch (err) {
      return responses.serverResponse(res, 500, "internal server error");
    }
  },

  getTeachers: async (req, res) => {

    try {

      const teachers = await adminQueries.getTeachers();

      if (teachers) {

        return responses.successResponse(req, res, 200, teachers);
      }
      return responses.errorResponse(req, res, 404, "no data found")
    }
    catch (err) {
      return responses.serverResponse(res, 500, "internal server error");
    }

  },

  addLocations: async (req, res) => {

    try {
      const subject = await adminQueries.addLocation(req.body);
      if (subject) {
        return responses.successResponse(req, res, 201, "location created");
      }
      return responses.errorResponse(req, res, 400, "unable to add location");
    }

    catch (error) {
      return responses.serverResponse(res, 500, "internal server error");
    }

  },

  getLocations: async (req, res) => {
    try {
      const locations = await generalQueries.getLocations(req.body);

      if (locations) {

        return responses.successResponse(req, res, 200, locations);
      }
      return responses.errorResponse(req, res, 404, "no data found");
    }
    catch (err) {
      return responses.serverResponse(res, "500", "internal server error");
    }
  },

  updateLocation: async (req, res) => {

    const locationId = req.params.id;

    try {
      // Find the location by ID
      const location = await generalQueries.getLocation(locationId);

      // If the location is not found, return an error response
      if (!location) {
        return responses.errorResponse(req, res, 404, 'Location not found');
      }
      const update = await adminQueries.updateLocation(location, req.body);
      console.log("update", update);
      if (update.success) {
        return responses.successResponse(req, res, 200, "updated successfully");
      }
      return responses.errorResponse(req, res, 400, update.message); 1

    } catch (error) {

      return responses.serverResponse(res, 500, "internal server error");
    }
  },

  deleteLocation: async (req, res) => {
    try {

      const location = await adminQueries.deleteLocation(req.params.id);

      if (location.success) {
        return responses.successResponse(req, res, 200, location.message);
      }
      return responses.errorResponse(req, res, 400, location.message)
    }
    catch (err) {
      return responses.serverResponse(res, 500, location.message);
    }
  },

  addSubject: async (req, res) => {
    try {
      const subject = await adminQueries.addSubjects(req.body);
      if (subject.success) {
        return responses.successResponse(req, res, 201, subject.message);
      }
      return responses.errorResponse(req, res, 400, subject.message);
    }

    catch (error) {
      return responses.serverResponse(res, 500, "internal server error");
    }

  },

  getSubjects: async (req, res) => {
    try {
      const subjects = await generalQueries.getSubjects();

      if (subjects) {

        return responses.successResponse(req, res, 200, subjects);
      }
      return responses.errorResponse(req, res, 404, "no data found");
    }
    catch (err) {
      return responses.serverResponse(res, "500", "internal server error");
    }
  },
  deleteSubject: async (req, res) => {
    try {

      const location = await adminQueries.deleteSubject(req.params.id);

      if (location.success) {
        return responses.successResponse(req, res, 200, location.message);
      }
      return responses.errorResponse(req, res, 400, location.message)
    }
    catch (err) {

      return responses.serverResponse(res, 500, location.message);

    }
  },

  addClass: async (req, res) => {

    try {
      const data = {
        name: req.body.name,
        subjects: req.body.subjects,
      }

      const Class = await adminQueries.addClass(data);

      if (Class) {
        return responses.successResponse(req, res, 201, Class)
      }
      return responses.errorResponse(req, res, 400, "unable to add");
    }
    catch (err) {
      return responses.errorResponse(res, 500, "internal server erroe");
    }
  },

  getAllClasses: async (req, res) => {

    try {
      const classes = await commonQueries.getAllClasses()

      if (classes) {
        return responses.successResponse(req, res, 200, classes.message);
      }
      return responses.errorResponse(req, res, 400, classes.message)
    } catch (error) {

      return responses.serverResponse(res, 500, "inrernal server error")
    }

  },



  getAllTimeSlotsCount: async (req, res) => {

    const data = await adminQueries.getAllTimeSlotsCount(req);

    if (data) {
      return responses.successResponse(req, res, 200, data);
    }
    return responses.errorResponse(req, res, 400, "no data found")
  },


  getAllTimeSlotsByTeacherIdAndPtmDateByDay: async (req, res) => {

    try {
      // fetching ptmID based on ptm Date provided

      const ptm = await generalQueries.getPtmIdByDay(req.body.ptmDate);

      console.log("ifffffffffffffffffffffffffffl ptrmmmmmmmmmmmmmmmmmmmmm", ptm);

      if (!ptm) {

        return responses.errorResponse(req, res, 400, "check your data")
      }

      // teching timeSlots based on PtmIds and TeacherId
      const timeslots = await adminQueries.getAllTimeSlotsByTeacherIdAndPtmDate(ptm, req.body.teacherId)
      //console.log(timeslots);

      if (timeslots) {
        return responses.successResponse(req, res, 200, timeslots);
      }
      return responses.errorResponse(req, res, 400, "no data found")
    }
    catch (err) {
      return responses.serverResponse(res, 500, "internal server error");
    }
  },



  getAllTimeSlotsByTeacherIdAndPtmDateByMonth: async (req, res) => {

    try {
      const ptm = await generalQueries.getPtmIdByMonth(req.body.ptmDate);    // fetching ptmIDs based on ptm Date provided
      console.log("iff monthhhhhhhhhhhhhhhhhhhhhhhhhhh ptm", ptm);

      if (!ptm) {

        return responses.errorResponse(req, res, 400, "check your data")
      }

      const timeslots = await adminQueries.getAllTimeSlotsByTeacherIdAndPtmDate(ptm, req.body.teacherId)  // teching timeSlots based on PtmId and TeacherId

      console.log(timeslots);

      if (timeslots) {
        return responses.successResponse(req, res, 200, timeslots);
      }
      return responses.errorResponse(req, res, 400, "no data found")
    }
    catch (err) {
      return responses.serverResponse(res, 500, "internal server error");
    }

  },

  getUsersCount: async (req, res) => {

    try {
      const count = await adminQueries.getUsersCount()

      if (count) {
        return responses.successResponse(req, res, 200, count);
      }
      return responses.errorResponse(req, res, 400, "no user found")
    }
    catch (err) {
      return responses.serverResponse(res, 500, "internal server error");
    }

  },


  getTeachersWithTimeslots: async (req, res) => {

    try {
      const slots = await adminQueries.getTeachersWithTimeslots()

      if (slots) {
        return responses.successResponse(req, res, 200, slots);
      }
      return responses.errorResponse(req, res, 400, "no timeSlots found")
    }
    catch (err) {
      return responses.serverResponse(res, 500, "internal server error");
    }
  },

  swapTeacher: async (req, res) => {

    try {

      const classIds = await adminQueries.getclasses(req.body.teacherId);

      if (classIds) {

        const commonteachers = await adminQueries.teacherswithCommonClasses(classIds, req.body.teacherId);

        console.log("common teachers", commonteachers);

        const teachersInPtm = await adminQueries.getteachersfromPtm(req.body.ptmId);

        console.log("teachers in ptm", teachersInPtm);

        if (commonteachers && teachersInPtm) {

          const swapteachers = await mapFunctiions.findIntersection(commonteachers, teachersInPtm);

          if (swapteachers.length > 0) {
            return responses.successResponse(req, res, 200, swapteachers);
          }
        }
      }
      return responses.errorResponse(req, res, 400, "swap not possible");
    }
    catch (err) {
      return responses.serverResponse(res, 500, "internal server error");
    }
  },

  updateTeacherForSwap: async (req, res) => {

    try {
      const classIds = await adminQueries.getclasses(req.body.newTeacher);
      console.log(classIds);

      if (classIds) {

        const commonTeachers = await adminQueries.teachersWithCommonClassesAndCurrent(classIds, req.body.newTeacher);
        console.log("common teachers", commonTeachers);

        const teacherInPtm = await adminQueries.matchTeachersfromPtm(req.body.ptmId, req.body.newTeacher);
        console.log("hieeeeee", commonTeachers, teacherInPtm);
        if (commonTeachers && teacherInPtm) {

          const swapUpdateTeacher = await adminQueries.swapTeacherUpdate(req.body.newTeacher, req.body.ptmId, req.body.previousTeacher);
          console.log("swappedd", swapUpdateTeacher);
          if (swapUpdateTeacher) {
            return responses.successResponse(req, res, 200, "teacher Swaped");
          }
        }
      }
      return responses.errorResponse(req, res, 400, "unable to swap teacher");
    }
    catch (err) {
      return responses.serverResponse(res, 500, "internal server error");
    }
  },


  getAllParentsWithChildrenDetails: async (req, res) => {


    //try {
    const data = await adminQueries.getAllParentsWithChildrenDetails(req.body.isActive);

    if (data) {
      return responses.successResponse(req, res, 200, data);
    }
    return responses.errorResponse(req, res, 400, "no data found")
    // }

    // catch (err) {
    //   return responses.serverResponse(res, 500, "internal server error");
    // }
  },
}                                                                                                                                                             