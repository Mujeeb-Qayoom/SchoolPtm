const Router = require('express').Router();
const parentController = require('../controllers/parentController');
const auth = require('../middleware/auth');


Router.get('/pareent/getMyChildren', auth.userAuth, parentController.getMyChildren);
Router.post('/parent/bookAppoitment', auth.userAuth, parentController.bookAppoitment);
Router.get('/parent/getAppoitments', auth.userAuth, parentController.getAppoitments);
Router.get('/parent/getAllPtmTeachers', auth.userAuth, parentController.getAllPtmTeachers);







module.exports = Router; 4