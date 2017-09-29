
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({

    id : String,
    email : String,
    people_id : String,
    datetime : Date,
    status : String,
    avatar : String

});

var User = mongoose.model('user', UserSchema);
module.exports = User;