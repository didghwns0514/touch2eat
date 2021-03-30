"use strict";
// https://velog.io/@cyranocoding/PASSPORT.js-%EB%A1%9C-%EC%86%8C%EC%85%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0
// 1) session 존재 시 동작 가능한 기능 따로 분리
// 2) login 페이지에서 모든 로그인 수행
// 3) login 완료시 callback page로 홈페이지

const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    console.log('fail-redirected-1')
    res.status(301).redirect('/homepage');
  }
};


module.exports = function(app, passport) {

  const express = require("express");
  const router = express.Router();


  router
    .route('/')
    .get((req, res, next) => {
      console.log('r-1');
      res.send("you are at login page");
    });

  router
    .route('/google')
    .get( passport.authenticate('google', { scope: ['profile'] }) );

  router
    .route('/google/callback')
    .get(
      passport.authenticate('google', {
      failureRedirect: '/login/fail/',
      successRedirect: '/login/success/'})
    );
    // .get(
    //     passport.authenticate('google', {
    //     failureRedirect: '/login/fail/',
    //     successRedirect: '/login/success/'})
    //   );


  router
    .route('/fail')
    .get((req, res, next)=>{
      console.log('r-2');
      res.send("login fail");
    });

  router
    .route('/success')
    .get( authenticateUser, (req, res, next)=>{
      console.log('r-3');
      res.send(`Welcome user ${req.user.displayName}!`);
    });

  router
    .route('/logout')
    .get((req, res) => {
          req.session = null;
          req.logout();
          res.redirect('/homepage');
      });
  
  return router;
}