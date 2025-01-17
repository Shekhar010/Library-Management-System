const dotenv = require('dotenv');
dotenv.config({ path: './.env' });


// require mysql to use 
const mysql = require('mysql');
// we have to require the bcrypt because it is used for hashing the password 
const bcrypt = require('bcryptjs');
// require jwt for the token
const jwt = require('jsonwebtoken');

// connection with the database 
// no need to connect with db as it is already connected
const db = mysql.createConnection({
    host: process.env.Database_Host,
    user: process.env.Database_User,
    password: process.env.Database_Password,
    database: process.env.Database_Name,
    port: 3306,
});


exports.dashboard = (request, response)=>{
    // we have checked if the admin is logged in or not
    // now we have to check that the person requesting the dasboard is user or admin 

    // fist get the email from the token (we have modified the verifytoken so that we can reterive the email that we 
    // encapsulated in the token)
    const email = request.email ;
    
    console.log(email);

    // after reteriveing the email if ther is no email then render the login page
    if(!email){
        response.render('login',{
            message: "please login before trying again"
        })
    }

    // if email was reterived the query the database to get the role from the email
    db.query('SELECT role FROM users WHERE email =?', [email], (err, results) => {
        // handle the run time errors 
        if(err){
            console.error("database error");
            return response.status(500).send("error occured server down");
        }

        // error occured if no role was obtained
        if(results.length === 0){
            console.error("No user found with the given email");
            return response.status(404).send("can't verify the role");
        }

        // if role is reterived then store the role in a variable
        const role = results[0].role;
        // for debugging purpose
        console.log(role);

        // now we have to render the page of dashboard only is the person is admin 
        if(role == "admin"){
            return response.render('dashboard');
        }
        else {
            return response.send("only for admin user access restricted");
        }
    });



}