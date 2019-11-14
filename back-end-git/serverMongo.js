// app.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
//
//const db = require('./database.json')
require('dotenv').config()
const db = process.env.Server
const port = process.env.Port;
// Mongoose connection with mongodb
//mongoose.Promise = require('bluebird');
mongoose.connect(db , { useNewUrlParser: true })
    .then(() => { // if all is ok we will be here
      console.log('Start');
    })
    .catch(err => { // if error we will be here
        console.error('App starting error:', err.stack);
        process.exit(1);
    });

// Required application specific custom router module
const botRouter = require('./src/route/botRouter');
const indexRouter = require('./src/route/indexRouter');
// Use middlewares to set view engine and post json data to the server
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//Router
app.use('/training', botRouter);
app.use('/',indexRouter)
// Start the server
app.listen(port, function(){
  console.log('Server is running on Port: ',port);
});
