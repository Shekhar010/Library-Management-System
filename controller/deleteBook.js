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

exports.deleteBook = (results, response) => {
    // get the book isbn 
    const isbn = results.body.ISBN;
    console.log(isbn);

    // query to delete the book with isbn 
    db.query('DELETE FROM bookisbn WHERE isbn = ?', [isbn], (error, result) => {
        // if error 
        if (error) {
            return response.render('dashboard', {
                message: "error occured while deleting the book"
            })
        }

        // if no error occured and book was deleted 
        if (result.affectedRows > 0) {
            // whenver we delete a book from the data base we have to remove the book from the issued section in the transactions
            // ?

            // render the page 
            return response.render('dashboard', {
                message: "book deleted successfully"
            });
        } else {
            return response.render('dashboard', {
                message: "No user found with the provided email"
            });
        }
    })

}