var LocalStrategy = require('passport-local').Strategy;
var User = require('../service/userService');
var md5 = require('crypto-js/md5');
var userSession = require('../service/userSession');
var strategySetting = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
};


module.exports = function (passport) {

    /**
     * Check password
    */
    var isValidPassword = function(user, password){
         return md5(password).toString() === user.password;
    };

    passport.use('login', new LocalStrategy(strategySetting,

        function (req, email, password, done) {

            User.Login(email, function (user) {

                /**
                 * Check user
                 */
                
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                    if (!user || user.length <= 0) {
                        console.log('User Not Found with username ' + username);
                        return done(null, false, req.flash('message', 'User Not found.'));
                    }


                    /**
                     * Check password
                    */
                    
                    if (!isValidPassword(user[0], password)) {
                        console.log('Invalid Password');
                        return done(null, false, req.flash('message', 'Invalid Password'));
                    }


                    /**
                     * Status online
                    */
                    userSession.online(user[0],function(err,user){
                        if(!err){
                            return done(null, user);
                        }   else{
                            return done(null, false, req.flash('message', 'User Not found.'));
                        }
                    });
                    
                    
            });
        })
    );


};