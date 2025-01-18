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

exports.issueRequest = (request, response)=>{

    // now we have to fetch the data from the table issuerequest from the data base and show it on this page about the users requested for the book
    // query the database too get the details
    // query 
    const STATUS = "Pending" ;
    db.query('SELECT * FROM issueRequest Where status = ?', [STATUS], (error, result)=>{
        // if error occured 
        console.log("w1");
        if(error){
            return response.render('issueRequest', {
                message : "error occured"
            })
        }
        console.log("w2");
        if(result.length == 0){
            return response.render('issueRequest', {
                message : "no pending issue request by any user"
            })
        }

        // if query successfully execute
        console.log("w3");
        return response.render('issueRequest', {
            message: "there are pending requests" ,
            issueRequest : result 
        })
    });

};