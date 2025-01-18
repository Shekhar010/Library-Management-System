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
const { response } = require('express');

// connection with the database 
// no need to connect with db as it is already connected
const db = mysql.createConnection({
    host: process.env.Database_Host,
    user: process.env.Database_User,
    password: process.env.Database_Password,
    database: process.env.Database_Name,
    port: 3306,
});

exports.grantRequest = (request, response) => {
    // now we have to get the isbn that has send 
    const ISBN = request.query.isbn;
    console.log(ISBN);

    // now we have to query the issuerequest table and change the status for the isbn to granted
    db.query('UPDATE issuerequest SET status = ? WHERE isbn = ?', ['granted', ISBN], (error, result) => {
        if (error) {
            return response.render('issueRequest', {
                message: error
            });
        }
        return response.render('issueRequest', {
            message: "Request granted successfully"
        });
    });

}