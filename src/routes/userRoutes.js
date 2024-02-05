
const Router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

Router.post('/account/login', auth.loginAuth, userController.login);


Router.post('/forgetPassword', userController.forgetPassword);

Router.post('/resetPassword', auth.resetPassword, userController.resetPassword);
Router.post('/changePassword', auth.userAuth, userController.changePassword);




Router.get('/teacher/getTeachers', userController.getTeachers);

Router.get('/location/getlocations', userController.getLocations);

Router.get('/getAllTimeSlotsByTeacherIdAndPtmDateByDay', userController.getAllTimeSlotsByTeacherIdAndPtmDateByDay);
Router.get('/getAllTimeSlotsByTeacherIdAndPtmDateByMonth', userController.getAllTimeSlotsByTeacherIdAndPtmDateByMonth);

module.exports = Router;


