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
const { triggerAsyncId } = require('async_hooks');
const { resourceUsage } = require('process');

// connection with the database 
// no need to connect with db as it is already connected
const db = mysql.createConnection({
    host: process.env.Database_Host,
    user: process.env.Database_User,
    password: process.env.Database_Password,
    database: process.env.Database_Name,
    port: 3306,
});

exports.issueRequestBook = (request, response) => {
    // store the email of the user from the token
    // now how i have to take the email from this
    const email = request.email;
    console.log(email);

    // and isbn or the book name user entered 
    const ISBN = request.query.isbn;
    console.log(ISBN);

    // before inserting the record in the table check if the user has already requested or not
    db.query('SELECT * FROM issueRequest WHERE email = ? AND isbn = ?', [email, ISBN], (error, result1) => {
        if (error) {
            return response.render('search', {
                messageOne: "error occured"
            })
        }
        if (result1.length != 0) {
            // means the request is already made 
            return response.render('search', {
                messageOne: "request already made..please wait until admin grant you the book"
            })
        }
        if (result1.length == 0) {
            // means no such request was earlier made 
            // now query it
            // query the database and in the issue request table enter the request
            db.query('INSERT INTO issueRequest (email, isbn) values (?, ?)', [email, ISBN], (error, result) => {
                if (error) {
                    return response.render('search', {
                        messageOne: "error occured so sorry"
                    })
                }

                // if succesffully inserted 
                return response.render('search', {
                    messageOne: "Successfully request send .."
                })
            });
        }
    })

}