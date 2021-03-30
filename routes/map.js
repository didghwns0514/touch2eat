"use strict";

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path:path.resolve(
      process.cwd(),
      process.env.HEROKU === "true" ? ".env" : ".env.dev"
    )
  });
  
const GOOGLE_MAP_KEY = process.env.GOOGLE_MAP_KEY;


const express = require("express");
let router = express.Router();

router.use(function(req, res, next){
    console.log("Router - map : ",req.url, "@", Date.now());
    next();
});

router
    .get('/',(req, res, next)=>{
        return res.render('map.html',{google_map_key:GOOGLE_MAP_KEY});
    });

module.exports = router;
