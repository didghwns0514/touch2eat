"use strict";

const express = require("express");
let router = express.Router();

router.use(function(req, res, next){
    console.log("Router - map : ",req.url, "@", Date.now());
    next();
});

router
    .get('/',(req, res, next)=>{
        return res.render('map.html');
    });

module.exports = router;
