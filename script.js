// create the server 
const express = require('express');

const app = express();
const port = 3000;

// route to the server


// on which port the server will listen 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);   
});