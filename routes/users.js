'use strict';
var express = require('express');
var router = express.Router();
var Users = require('../service/userSession');
var Auth = require('../passport/authenticate');



router.get('/',Auth , function (req, res) {
    res.send('respond with a resource');
});

router.get('/online' , function (req, res) {
    Users.getOnline(function(user){
        res.send(user);
    });
    
});

router.get('/login', function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/chat');
    }
    res.render('index');
});

router.get('/login/session', Auth ,function(req, res){
    res.send(req.user);
});

router.post('/login', Auth.Login , function (req, res) {
    res.send('respond with a resource');
});

router.get('/logout', function (req, res) {
    if(!req.user){ return res.redirect('/users/login');}

    Users.offline({id : req.user.id}, function(){
        console.log("\x1b[31m", req.user.email + ' ------------------ is offline');
        req.logOut();
        res.redirect('/users/login');
    });

});


module.exports = router;
