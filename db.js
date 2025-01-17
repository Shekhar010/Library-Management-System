// server.js (Node.js Backend)
const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3001;
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
dotenv.config({ path: './.env' });

// Create MySQL connection
const db = mysql.createConnection({
    host: process.env.Database_Host,
    user: process.env.Database_User,
    password: process.env.Database_Password,
    database: process.env.Database_Name,
    port: 3306,
});


// Connect to MySQL
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// parse the incoming request with the url encoded data
app.use(express.urlencoded({ extended: false }));
// to grab the data from the form we have to parse the data in json format
app.use(express.json());
// to parse the cookies we have to use the cookie parser
app.use(cookieParser());

// inside the views folder 
// we have to tell the node js about what kind of view engine we are using
// in this case we are using hbs to display our html 
app.set('view engine', 'hbs');

// we have to create a public directory from where we can access the css and js files
const publicDrirectory = path.join(__dirname, './public');

/* we have defined the public directory we have to make sure that express is using the public directory
to access the css and js files
*/

app.use(express.static(publicDrirectory));


// // now whenever the home route will be called the index.hbs file will be rendered
// app.get('/', (request, response)=>{
//     response.render('index');
// })

// // now whenever the login route will be call the login.hbs filw will be rendered
// app.get('/login',(request, response)=>{
//     response.render('login');  
// })

// // now whenever the register route will be call the register.hbs file will be rendered
// app.get('/register',(request, response)=>{
//     response.render('register');
// })

/* instead of writing the routes in the same file we can write it in another file like we have done as it 
 will decrease the readablity of the code and also the code will be more modular and less complex
*/ 
app.use('/', require('./Routes/route'));
app.use('/login', require('./Routes/route'));
app.use('/register', require('./Routes/route'));
app.use('/authentication', require('./Routes/authentication')); // this will be used for register 
app.use('/loginAuthentication', require('./Routes/loginAuthentication')); // this is used for the login 

// protected route for the profile
app.use('/profile', require('./Routes/route'));

// route for the admin to open the dashboard
app.use('/dashboard', require('./Routes/dashboardAuthentication')); 

// about section route 
app.use('/about', require('./Routes/route'));

// now routes for the admin section
// 1. route for the book issue 
app.use('/issue', require('./Routes/issueBook'));
// // 2. route for the delete user 
app.use('/deleteUser', require('./Routes/deleteuser'));
// // 3. delete book
app.use('/deleteBook', require('./Routes/deletebook'));
// // 4. route to add a book in the table
app.use('/addBook', require('./Routes/addbook'));

// route for logout
app.get('/logout', (request, response)=>{
    response.clearCookie('jwt', {
        httpOnly: true, // Ensure the cookie cannot be accessed via client-side scripts
        secure: process.env.NODE_ENV === 'production', // Use in HTTPS environments
        sameSite: 'Strict' // Prevent cross-site cookie sharing
    });

    // Redirect the user to the login page after logout
    return response.redirect('/login');
});


// give the port on which the server will be started and listen to the requests and send the response
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
