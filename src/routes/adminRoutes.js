const Router = require('express').Router();

const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

Router.post('/account/register', auth.userAuth, userController.register);

Router.post('/class/addClass', auth.userAuth, userController.addClass);
Router.get('/class/getAllClasses', auth.userAuth, userController.getAllClasses);



Router.post('/addLocation', auth.userAuth, userController.addLocations);

Router.post('/addSubjects', auth.userAuth, userController.addSubject);
Router.get('/getSubjects', auth.userAuth, userController.getSubjects);


//working on it

Router.get('/getAllTimeSlotsCount', userController.getAllTimeSlotsCount);
Router.get('/getUsersCount', userController.getUsersCount);

Router.get('/getTeachersWithTimeslots', userController.getTeachersWithTimeslots);

// swap routers
Router.get('/getSwapTeachers', userController.swapTeacher);
Router.post('/updateTeacherForSwap', userController.updateTeacherForSwap);


Router.get('/getAllParentsWithChildrenDetails', userController.getAllParentsWithChildrenDetails);
Router.post('/addChildrenToParent', auth.userAuth, userController.addChildrenToParent);


module.exports = Router;