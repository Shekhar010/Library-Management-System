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



// functionality to issue the book
exports.issue = (request, response) => {

    // first we have to fetch the user id from the useremail
    const email = request.body.email;
    console.log(email);

    // and from the isbn fetch the book id
    const isbn = request.body.ISBN;
    console.log(isbn);

    // check if both feilds are available
    if (!email || !isbn) {
        return response.render('dashboard', { message: "Email and ISBN are required!" });
    }

    // 1. fetch the user id from the email
    db.query('SELECT id from users where email = ?', [email], (error, results) => {
        //if query fails 
        if (error) {
            return response.render('dashboard', {
                message: "error ! try again"
            })
        }
        if (results.length == 0) {
            return response.render('dashboard', {
                message: "no such user"
            })
        }
        // store the userid  
        const userID = results[0].id;
        // for testing 
        console.log(userID);

        // 2. fetch the book id from the isbn
        db.query('SELECT book_id from bookisbn where isbn = ?', [isbn], (error, results) => {
            // if query fails
            if (error) {
                return response.render('dashboard', {
                    message: "error occured during isbn fetch"
                })
            }

            // if no such element found
            if (results.length == 0) {
                return response.render('dashboard', {
                    message: "no such book with this isbn"
                })
            }

            // if the isbn found 
            const bookid = results[0].book_id;
            console.log(bookid);

            // 3. now when both the information are fetched now just insert the data into the transaction table \
            try {
                // fucntion to get the current date 
                const getCurrentDate = () => {
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                    const day = String(today.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };
                const issued = "issued";
                db.query('INSERT INTO transactions (user_id, book_id, issue_date, status) VALUES (?, ?, ?, ?)', [userID, bookid, getCurrentDate(), 'issued'], (error, results) => {
                    if (error) {
                        return response.render('dashboard', {
                            message: "error occured in insertion of record"
                        })
                    }

                    return response.render('dashboard', {
                        message: "successfully issued"
                    })
                });

            } catch (excpetion) {
                return response.render('dashboard', {
                    message: excpetion
                })
            }




        });

    });

};
