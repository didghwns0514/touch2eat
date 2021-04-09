/*jslint node: true */
//"use strict";


// wake up module for heroku
const https = require("https");
setInterval(function(){
  https.get("https://touch2eat.herokuapp.com/");
}, 600000); // every 10 minutes

// start express
const express = require("express");
const app = express();

// configure port number
const loc_PORT = 10040; // local debug port
const PORT = process.env.PORT || loc_PORT; // heroku port

// App setters
app.set("port", PORT);

app.set('view engine', 'ejs');
app.engine("html", require('ejs').renderFile);

// set file locations
app.set('views', __dirname + '/views');
app.use('/src', express.static(__dirname + "/src"));
app.use('/images', express.static(__dirname + "/images"));
app.use('/css', express.static(__dirname + "/css"));


// google auth
const session = require('express-session');
const passport = require('passport');
require('./routes/passport-setup')(passport);

app.use(session({ secret: 'SECRET_CODE', 
                  cookie: { maxAge: 10 * 60 * 1000 },
                  resave: false, //overrride existing login session
                  saveUninitialized: false })); // put empty value when there is no session?
app.use(passport.initialize());
app.use(passport.session());


// routers
// add like middlewares that are routers
// to handle endpoints
const homepage = require("./routes/homepage");
//app.use("/homepage", homepage);
app.get('/{1}', (req, res)=>{
  //res.send("you are at the init page")
  res.redirect('/homepage');
})
app.use("/homepage", homepage);
const login = require("./routes/login");
app.use("/login", login(app, passport));
const map = require("./routes/map");
app.use("/map", map);


// check live server by console log
app.listen(PORT, err => {
  console.log("Listening on", PORT);
  if(err){
      return console.log("ERROR", err);
    }
  }
  );

module.exports = app;