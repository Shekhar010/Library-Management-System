const dotenv = require('dotenv');
dotenv.config({ path: './.env' });


// require mysql to use 
const mysql = require('mysql');
// we have to require the bcrypt because it is used for hashing the password 
const bcrypt = require('bcryptjs');
// require jwt for the token
const jwt = require('jsonwebtoken');
const { use } = require('../Routes/route');
const { request } = require('http');

// connection with the database 
// no need to connect with db as it is already connected
const db = mysql.createConnection({
    host: process.env.Database_Host,
    user: process.env.Database_User,
    password: process.env.Database_Password,
    database: process.env.Database_Name,
    port: 3306,
});

exports.deleteUser = (request, response) => {
    // get the user email entered in the section 
    // now query and delete the user 
    const email = request.body.email;
    console.log(email);

    // now we have to query to delete the user from the table of users
    db.query('DELETE FROM users WHERE email = ?', [email], (error, result) => {
        // if error occured 
        if (error) {
            return response.render('dashboard', {
                message: "error occured during the deletion of the user"
            })
        }

        // if no error show user deleted successfully by checking if the user is actually deleted 
        // Check if any rows were affected (user deleted)
        if (result.affectedRows > 0) {
            return response.render('dashboard', {
                message: "User deleted successfully"
            });
        } else {
            return response.render('dashboard', {
                message: "No user found with the provided email"
            });
        }

    })
}