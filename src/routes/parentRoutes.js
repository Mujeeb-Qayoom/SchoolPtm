const Router = require('express').Router();
const parentController = require('../controllers/parentController');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');


Router.get('/pareent/getMyChildren', auth.userAuth, parentController.getMyChildren);


Router.post('/parent/bookAppoitment', auth.userAuth, parentController.bookAppoitment);

Router.get('/parent/getAppoitments', auth.userAuth, parentController.getAppoitments);

Router.get('/parent/getAllPtmTeachersbyChildId', auth.userAuth, parentController.getAllPtmTeachersbyChildId);

//working on it 

Router.post('/updateAppointment', auth.userAuth, parentController.updateAppointment);
//
Router.post('/cancelAppointment', auth.userAuth, parentController.cancelAppointment);

module.exports = Router