'use strict';
var express = require('express');
var router = express.Router();
var Auth = require('../passport/authenticate');
var ChatService = require('../service/chatService');

router.get('/',Auth , function (req, res) {
    res.render('chat');
});


router.get('/notify', Auth, function(req, res){

    ChatService.getNotify(req.user.id, function(data){
        res.send(data);
    });

});

module.exports = router;
