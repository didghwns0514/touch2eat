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
    return res.render('wait.html',{info_disp: "You are not an authenticaed user, please retry logging in...", redirect:"/homepage"});
  }
};


module.exports = function(app, passport) {

  const express = require("express");
  const router = express.Router();

  router.use(function(req, res, next){
    console.log("Router - login : ",req.url, "@", Date.now());
    next();
  });

  router
    .route('/')
    .get((req, res, next) => {
      console.log('r-1');
      //res.redirect('/login/google');
      //return res.render('wait.html', {info_disp: `Now taking you to google login...`, redirect:"/login/google"});
      return res.render('wait.html', {info_disp: `Now taking you to google login...`, redirect:"/login/loginpage"});
    });

  router
    .route('/loginpage')
    .get((req, res, next)=>{

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


  router
    .route('/fail')
    .get((req, res, next)=>{

      return res.render('wait.html',{info_disp: "You have failed to log in...", redirect:"/homepage"});
    });

  router
    .route('/success')
    .get( authenticateUser, (req, res, next)=>{

      return res.render('wait.html', {info_disp: `Welcome user ${req.user.displayName}!!`, redirect:"/homepage"});
    });

  router
    .route('/logout')
    .get((req, res) => {
        if(req.session){ // session exists
          console.log("your session exists");
          let name = req.user.displayName;
          req.session = null;
          req.logout();
          //res.redirect('/homepage');
          return res.render('wait.html', {info_disp: `User ${name} is logged out!`, redirect:"/homepage"});
        }else{
          console.log("your session does not exist");
          return res.render('wait.html', {info_disp: `You havent logged in yet!`, redirect:"/homepage"});
        }
      });
  
  return router;
}