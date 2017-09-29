var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var chatMessageSchema = new Schema({
    message_id : String,
    chat_room_id : String,
    user_from_id : String,
    user_to_id : String,
    message : String,
    status : String, 
    datetime : Date
});

var chatMessage = mongoose.model('message', chatMessageSchema);
module.exports = chatMessage;