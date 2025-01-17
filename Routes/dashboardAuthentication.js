// requrie the express server 
const app = require('express');
const router = app.Router();

// require from the controller 
const controller = require('../controller/dashboardAuth');


// first verify the token then only render the page
// to verify the token we need the middle ware function 
// use have to require it first 
const verifyToken = require('../middle_wares/verifyToken');


// first check if the admin is logged in or not
router.get('/', verifyToken.verifyToken, controller.dashboard);


module.exports = router;