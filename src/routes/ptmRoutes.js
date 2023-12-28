const Router = require('express').Router();
const ptmController = require('../controllers/ptmController');
const auth = require('../middleware/auth');



Router.post('/ptm/addPtm', auth.userAuth, ptmController.addPtm);
Router.get('/ptm/getPtm', auth.userAuth, ptmController.getPtm);


module.exports = Router;