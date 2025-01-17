// import the my sql library
const mysql = require('mysql');

// import the bcrypt and jwt for hashing the password 
const bcrypt = require('bcryptjs');


const db = mysql.createConnection({
    host: process.env.Database_Host,
    user: process.env.Database_User,
    password: process.env.Database_Password,
    database: process.env.Database_Name,
    port: 3306,
});

// no need to again connect to database as we already connected in db.js file
// for the route register we have to perform
exports.register = (request, response) => {

    console.log(request.body);
    const username = request.body.username;
    const email = request.body.email;


    const password = request.body.password;
    const role = request.body.role;

    // we have to query the database to check if the user already exists or not
    db.query('SELECT email FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error('Error selecting data:', error);
            return response.render('register', {
                message: 'An error occurred. Please try again later.'
            });
        }
        if (results.length > 0) {
            return response.render('register', {
                message: 'That email is already in use'
            });
        }

        // Proceed with the user creation if no errors and email is unique
        createUser();
    });

    // create a function createUser and call it
    const createUser = async () => {
        try {
            const hashedPassword = await bcrypt.hash(password, 8); // Hash the password
    
            db.query('INSERT INTO users SET ?', {
                username,
                email,
                password: hashedPassword, // Save the hashed password
                role
            }, (error, results) => {
                if (error) {
                    console.error('Error inserting user:', error);
                    return response.render('register', {
                        message: 'An error occurred. Please try again later.'
                    });
                }
    
                console.log('User inserted successfully:', results);
                return response.render('login', {
                    message: 'Registration successful! Please log in.'
                });
            });
        } catch (err) {
            console.error('Error hashing password:', err);
            return response.render('register', {
                message: 'An error occurred. Please try again later.'
            });
        }
    };
     


};