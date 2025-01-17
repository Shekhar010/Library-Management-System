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

exports.searchpage = (request, response) => {

    // get the name or isbn entered by the user
    const nameOrIsbn = request.body.booknameorisbn ;
    console.log(nameOrIsbn);

    // now query the database to search the book with the name or the isbn 
    // we want name or book author isbn , bookid also
    db.query('SELECT book_id, isbn, authors, original_title FROM bookisbn WHERE original_title = ? OR isbn = ?', [nameOrIsbn, nameOrIsbn], (error,result)=>{
        if(error){
            return response.render('search', {
                message : "error occured while searching"
            })
        }

        // if no result are found 
        if(result.length == 0){
            return response.render('search', {
                message : "no such book with the BOOK TITLE or ISBN exist"
            })
        }
        // for testing check if the result give the name of the book and other data 
        console.log(result);
        console.log(result[0].book_id);

        return response.render('search', {
            message : "book found", 
            bookid : result[0].book_id,
            isbn : result[0].isbn,
            bookAuthor : result[0].authors,
            bookTitle : result[0].original_title
        }) ;
    });
}