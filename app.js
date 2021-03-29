/*jslint node: true */
"use strict";

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