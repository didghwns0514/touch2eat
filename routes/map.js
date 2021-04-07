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
//console.log('GOOGLE_MAP_KEY in serverside : ', GOOGLE_MAP_KEY)

const express = require("express");
let router = express.Router();

router.use(function(req, res, next){
    console.log("Router - map : ",req.url, "@", Date.now());
    next();
});

router
    .get('/',(req, res, next)=>{
        //return res.render('map.html',{googlemapkey:GOOGLE_MAP_KEY});
        return res.render('wait.html', {info_disp: `Now taking you to map page...`, redirect:"/map/real"});
    })
    .get('/form', (req, res, next)=>{
        console.log(req.query);
        res.send('hello!')
    })
    .get('/real', (req, res, next)=>{
      console.log('req from homepage : ', req);
      return res.render('map.html',{googlemapkey:GOOGLE_MAP_KEY});
    });

module.exports = router;
