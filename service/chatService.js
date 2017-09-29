var utility = require('../service/utility');
var chatRooms = require('../models/chatRooms');
var chatMessages = require('../models/chatMessages');
var arrayGroup = require('group-array');

var Chat = function () {


    this.messageHistory = function (room_id, callback) {
        var condition = {
            chat_room_id: room_id
        };
        chatRooms.findOne(condition, function (err, room) {

            if (room) {

                chatMessages.find(condition, null, {
                    sort: {
                        datetime: 1
                    }
                }, function (err, messages) {
                    if (err) {
                        console.log(err);
                        return false;
                    }
                    callback(messages);
                });

            } else {
                var Rooms = new chatRooms({
                    chat_room_id: room_id,
                    name: utility.uniqid(),
                    datetime: new Date()
                });

                Rooms.save(callback([]));
            }
        });
    };

    this.addMessage = function (data, callback) {

        var chat = {
            message_id: utility.uniqid(),
            chat_room_id: data.room_id,
            user_from_id: data.user_from_id,
            user_to_id: data.user_to_id,
            message: data.message,
            status: 'UR',
            datetime: new Date()
        };
        var message = new chatMessages(chat);

        message.save(function (err) {
            if (err) return console.log(err);
            callback(chat);
        });

    };

    this.readMessage = function (message_id, callback) {
        var condition = {
            message_id: message_id
        };
        chatMessages.findOne(condition, function (err, message) {
            message.status = "R";
            message.save(callback);
        });
    };

    this.getNotify = function (user, callback) {
        chatMessages.find({
            user_to_id: user,
            status: 'UR'
        }, function (err, messages) {
            if (err) {
                return console.log(err);
            }
            var data = arrayGroup(messages, "user_from_id");
            callback(data);
        });
    };

};

module.exports = new Chat();