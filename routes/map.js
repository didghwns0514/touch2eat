"use strict";

const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const url = require('url');
const qs = require('querystring');

let contentFromHomepage = null;

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

// set bodyparser
router.use(bodyParser.urlencoded({extended:false}));

router.use(function(req, res, next){
    console.log("Router - map : ",req.url, "@", Date.now());
    next();
});

router
    .route('/{1}')
    .get((req, res, next)=>{
        //return res.render('map.html',{googlemapkey:GOOGLE_MAP_KEY});
        console.log('in the map root page!');
        return res.render('wait.html', {info_disp: `Now taking you to map page...`, redirect:"/map/real"});
    });

router
    .route('/form')
    .post((req, res, next)=>{
        console.log('recieved body : ', req.body);
        console.log('recieved query : ', req.query);
        console.log('recieved body.placeToSearch : ', req.body.placeToSearch);

        contentFromHomepage = req.body.placeToSearch;

        //res.redirect('/map/real');
        return res.render('wait.html', {info_disp: `Dealing with your search...`, redirect:"/map/real"});
        
    });

router
    .route('/real')
    .get((req, res, next)=>{
      console.log('inside /map/real page!');
      //console.log('req from homepage : ', req);
      return res.render('map.html',{
        googlemapkey:GOOGLE_MAP_KEY,
        placeToSearch:contentFromHomepage
      });
    });

module.exports = router;
