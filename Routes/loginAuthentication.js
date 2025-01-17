// require the express server 
const app = require('express');
const router = app.Router();

// we need to specify the controller 
const controller = require('../controller/loginAuth');

// we need to specify the route
router.post('/login', controller.login);
// instead of passing the call back function and define all the functionality we created a controller and in that 
// controller we specified the functinality how backend will contact to the database and handle the errors  

// export the router 
module.exports = router;