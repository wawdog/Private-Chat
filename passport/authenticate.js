var passport = require('passport');
var utility = require('../service/utility');
var userService = require('../service/userService');
var userSession = require('../service/userSession');

module.exports = function (req, res, next) {
    console.log('isAuthenticated ===================> ' + req.isAuthenticated());
    if (!req.isAuthenticated()) {
        return res.redirect('/users/login');
    }

    userSession.online(req.user,function(err,user){
        if(!err){         
            console.log("\x1b[32m",req.user.email + ' ------------------ is online');
        }   
    });

    return next();

};

module.exports.Login = function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    passport.authenticate('login', function (err, user, info) {

        if (err) { return next(err); }
        if (!user) { return res.redirect('/users/login'); }
        delete user.password;
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            
            return res.redirect('/chat');

        });
    })(req, res, next);

};
