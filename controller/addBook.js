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

// connection with the database 
// no need to connect with db as it is already connected
const db = mysql.createConnection({
    host: process.env.Database_Host,
    user: process.env.Database_User,
    password: process.env.Database_Password,
    database: process.env.Database_Name,
    port: 3306,
});

exports.addBook = (request, response) => {

    // now take all the parameters
    const isbn = request.body.ISBN;
    const title = request.body.Title;
    const bookAuthor = request.body.Author;
    console.log(isbn, title, bookAuthor); // This should print all three values.

    // we need to query the database and insert the isbn title booksAuthor
    db.query('INSERT INTO bookisbn (isbn, authors, original_title) VALUES (?,?,?)', [isbn, bookAuthor, title], (error, result) => {
        // if error occured 
        if(error){
            return response.render('dashboard',{
                message : error
            })
        }

        // if no error so show successful message
        return response.render('dashboard',{
            message : "book added successfully"
        })
    })
}