
var User = require('../models/users');

var userService = function () {
    var self = this;
    this.Login = function (email, callback) {

        User.findByEmail(email, function (err, user) {
            if (err || !user) {
                callback(null);
                return;
            }

            callback(user);
        });
    };



};

module.exports = new userService();