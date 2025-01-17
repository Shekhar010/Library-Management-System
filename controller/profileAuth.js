// server 
const app = require('express');

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


exports.profile = (request, response) => {
    // take the email from the token stroed in the browser
    const email = request.email;
    console.log(email);

    // query the database to get the username , role 
    db.query('SELECT id,username, email, role FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            return response.status(404).send("databse error");
        }

        const ob = results[0];
        console.log(ob);
        const userid = ob.id;
        // another query to obtain the books issued by the user 
        // 1 we need to the userid 
        // now we want to search in the transaction table and get all the books_id where user_id = userid 
        db.query('SELECT book_id, status FROM transactions WHERE user_id = ?', [userid], (error, results) => {
            if (error) {
                return response.send("Error in fetching book ids");
            }


            //extract the status
            const status = results.status;
            console.log("status");

            // Extract the book_ids from the results
            const bookIds = results.map(row => row.book_id);

            if (bookIds.length === 0) {
                // for the user who has not issued any book
                if (ob.role === "user") {
                    return response.render('profile', {
                        username: ob.username,
                        email: ob.email,
                    });
                }
                // for the admin who has not issued any book
                return response.render('profile', {
                    username: ob.username,
                    email: ob.email,
                    role: ob.role,
                });

            }

            // Now fetch book details for the extracted book_ids
            db.query('SELECT isbn, authors, title FROM bookisbn WHERE book_id IN (?)', [bookIds], (error, bookResults) => {
                if (error) {
                    return response.send("Error in fetching book details");
                }

                console.log(bookResults);  // Display book details

                // Send back the response with the fetched book details
                // but check if the role is user or admin 
                // if user then send the books
                // dont send the role to the user
                if (ob.role === "user") {
                    return response.render('profile', {
                        username: ob.username,
                        email: ob.email,
                        books: bookResults
                    })
                }
                // else return the role to the admin
                return response.render('profile', {
                    username: ob.username,
                    email: ob.email,
                    books: bookResults,
                    role: ob.role
                })


            });
        });
    });
}