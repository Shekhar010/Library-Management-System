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

exports.home = (request, response) => {
    // here i will check if the user is admin or not 
    // if admin then the dashboard section will be shown
    // it not then no dashboard section will be shown
    // we will reterive the email from the token stored in the cookie 
    const email = request.email;
    console.log(email);

    // now we will query and see the role of the person with email 
    db.query('SELECT role FROM users WHERE email =?', [email], (err, results) => {
        const role = results[0].role;
        console.log(role);

        // if the role is admin then the dashboard section will be shown
        if (role == `admin`) {
            return response.render('index', {
                role: role
            })
        }
        else {
            return response.render('index');
        }
    });


}