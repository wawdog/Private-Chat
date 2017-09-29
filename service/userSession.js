var utility = require('../service/utility');
var User = require('../models/userSession');

var Users = function(){

    this.getOnline = function(callback){

        // User.find({},function(err, user){
        //     if(err) console.log("\x1b[31m", ' Get user online ------------------> fail');
        //     callback(user);
        // });

        User.find({}).sort({status : -1}).exec(function(err, result) {
            if (err) throw err;
            callback(result);
          });
    };

    this.online = function(userLogin, callback){
  
        User.findOne({email: userLogin.email}, function (err, user) {

            if(user){

                user.status = "Y";
                user.datetime = new Date();
                user.save(function(error){
                    if(error){
                        callback(error, null);
                    }else{
                        callback(err, user);
                    }
                });
              
            }else{

                var online = new User({
                    id : utility.uniqid(),
                    email : userLogin.email,
                    people_id : userLogin.id,
                    datetime : new Date(),
                    avatar : userLogin.Namepic,
                    status : "Y"
                });
        
                online.save(function(error){
                    if(error){
                        callback(error, null);
                    }else{
                        callback(err, user);
                    }
                });
  
            }
        });
    };

    this.offline = function(condition,callback){
        User.findOne(condition, function (err, user) {
            if(user){
                user.status = "N";
                user.save(callback);
            }else{
                callback(null);
            }0
        });
    };
};

module.exports = new Users;