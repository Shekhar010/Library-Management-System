// this middle ware function will be used to verify the token
const jwt = require('jsonwebtoken');

// this function will be used to verify the token
exports.verifyToken = (request, response, next) => {
    // log to see the function is being called
    console.log("verifing token");

    // take the token from the cookies in the browser 
    const token = request.cookies.jwt;

    // check if the token is present or not
    // if not present then redirect to the login page with the message login to access
    if (!token) {
        return response.render('login',{
            message:"login to access"
        });
    }

    // if present then verify the token using the jwt verify method
    // use the error handling so that if any error occurs then send the message that access is denied
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decoded; // Attach user info to the request

        // now we have to attach the email from the token to the request object 
        request.email = decoded.email;

        // if the token is verified then proceed 
        // to check it log it in console 
        console.log("Token Verified");

        next(); // Proceed to the next middleware/route


    } catch (error) {
        console.error("Token verification failed:", error.message); // Log the error
        // send the error if the token verification failed
        response.render('login',{
            message : "session expired"
        })
        
    }


}