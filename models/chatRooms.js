var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var chatRoomsSchema = new Schema({

    chat_room_id : String,
    name : String,
    datetime : Date
});

var chatRooms = mongoose.model('chat_room', chatRoomsSchema);
module.exports = chatRooms;