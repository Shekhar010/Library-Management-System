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



// for the route login we have to perform .. 
exports.login = (request, response) => {
    console.log("login in process");
    // store the credentials entered by the user 
    const email = request.body.email;
    const password = request.body.password;


    // also check if the user tries to login if still the credentials are empty
    if (!email || !password) {
        return response.render('login', {
            message: 'email or password cant be empty'
        });
    }

    // check the email in the database it it exist or not
    // alsp check all the possible errors 
    // so we will create a query for the database 
    db.query('SELECT email, password, role FROM users WHERE email = ?', [email], (error, results) => {
        // check if any error occured during the query
        if (error) {
            return response.render('login', {
                message: 'error occured please try again'
            });
        }
        // if email not in the data base 
        if (results.length === 0) {
            return response.render('login', {
                message: 'email does not exist'
            });
        }

        // till here we have check some errors that can occur and handled those errors 
        // now we have to check if the password is correct or not 
        // we have stored the hashed password in the data base so now we have to fetch the password from the data base 
        // and compare it to the password entered by the user


        // fetch the data
        // whenerver the query is executed it returns that row which matches the condition
        const user = results[0];
        // now store the role of the user 
        const role = user.role;

        // now we can compare the password 
        let matchPassword = bcrypt.compareSync(password, user.password);

        // is password doesnt matches the return with message wrong password 
        if (!matchPassword) {
            return response.render('login', {
                message: 'password is incorrect'
            });
        }
        else {
            // if the password matches then we have to create a token for the user
            // we have to create a token for the user

            // payload to encapsulate in the token
            const payload = { email: email };

            // secret key for the token
            const secret = process.env.JWT_Secret || 'defaultSecretKey';

            // token generation 
            const token = jwt.sign(payload, secret, { expiresIn: '1h' });

            // log the token generate for debugging
            console.log('token generated');

            // now we will send the token in users browser as cookie
            response.cookie('jwt', token, {
                httpOnly: true
            });
            // log in console that token is sent in browser 
            console.log('token sent in browser');
            console.log(token);



            // render the home page without dashboard section if person is user
            if (role == "admin") {
                return response.render('index', {
                    role: "admin"
                })
            } else {
                return response.render('index', {
                    message: 'login successful',
                });
            }
        }

    });

};