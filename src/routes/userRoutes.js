
const Router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

Router.get('/account/login', auth.loginAuth, userController.login);
Router.post('/account/register', auth.userAuth, userController.register);
Router.get('/teacher/getTeachers', userController.getTeachers);
Router.get('/location/getlocations', userController.getLocations);
Router.post('/class/addClass', auth.userAuth, userController.addClass);

module.exports = Router
