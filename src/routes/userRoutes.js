
const Router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

Router.get('/account/login', auth.loginAuth, userController.login);

Router.get('/teacher/getTeachers', userController.getTeachers);

Router.get('/location/getlocations', userController.getLocations);

Router.get('/getAllTimeSlotsByTeacherIdAndPtmDateByDay', userController.getAllTimeSlotsByTeacherIdAndPtmDateByDay);
Router.get('/getAllTimeSlotsByTeacherIdAndPtmDateByMonth', userController.getAllTimeSlotsByTeacherIdAndPtmDateByMonth);

module.exports = Router;


