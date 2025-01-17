// require the express for the server
const app = require('express');
const router = app.Router();
const controller = require('../controller/requestBook');

const verifyToken = require('../middle_wares/verifyToken');

// specify the method for route to authentication 
router.get('', verifyToken.verifyToken, controller.issueRequestBook);
// instead of passing the call back function and define all the functionality we created a controller and in that 
// controller we specified the functinality how backend will contact to the database and handle the errors  

module.exports = router;