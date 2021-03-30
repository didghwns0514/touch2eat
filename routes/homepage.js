"use strict";
// https://www.youtube.com/watch?v=iM_S4RczozU 참고

const express = require("express");

let router = express.Router();


//middle ware
router.use(function(req, res, next){
    console.log("Router - homepage : ",req.url, "@", Date.now());
    next();
});

router
    .get('/', (req, res, next)=>{
        return res.render('homepage.html');
    });

module.exports = router;
