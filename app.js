const express = require ("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

//passport config
require('./config/passport')(passport)
dotenv.config({path: './config/config.env'});

const app = express();

//enable cors
app.use(cors());

//view engine
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());  

//connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });


//dB CONNECTION
const db= require("./config/keys").MongoURI;
mongoose.connect(db,{useNewUrlParser: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
.then(()=>console.log('mongoDb connected'))
.catch(err=>console.log(err));

const port = process.env.PORT || 3000;

//routes
app.use("/",require("./routes/index"));
app.use("/users",require("./routes/users"));

app.listen(port,()=>{
    console.log(`server running on port ${port}`);
})
