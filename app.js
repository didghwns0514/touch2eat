/*jslint node: true */
"use strict";

// wake up module
const http = require("http");
setInterval(function(){
  http.get("http://touch2eat.herokuapp.com");
}, 600000); // every 10

const express = require("express");
const PORT = process.env.PORT; // heroku port


const app = express();

const port = 10040;

app.set("port", port);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(PORT, () => console.log("Listening on", PORT));

module.exports = app;