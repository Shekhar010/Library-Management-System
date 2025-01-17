// require the express 
const app = require('express');

// require the express router
const router = app.Router();

// route to the login page
router.get('/login', (request, response) => {
    response.render('login');
});

// route to the register page
router.get('/register', (request, response) => {
    response.render('register');
});

// for the about section page 
router.get('/about' , (request, response)=>{
    response.render('about');
});


// require the controller
const profileController = require('../controller/profileAuth');
// route to the profile page
// first verify the token then only render the page
// to verify the token we need the middle ware function 
// use have to require it first 
const verifyToken = require('../middle_wares/verifyToken');

// now use the middle ware function to verify the token
router.get('/profile', verifyToken.verifyToken, profileController.profile);

// route to the home page this route is protected and will only open wehn the user is logged in
// use the controllee to render the page 
const homeController = require('../controller/homeAuth');
router.get('/', verifyToken.verifyToken, homeController.home);







module.exports = router;
