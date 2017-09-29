'use strict';
var express = require('express');
var router = express.Router();
var Auth = require('../passport/authenticate');
var utility = require('../service/utility');

router.get('/', Auth, function (req, res) {
    res.redirect('/chat');
});


router.get('/auth-failed', function (req, res) {

    //res.render('authfailed', { text: "AUTHENTICATION FAILED authentication failed " });

    res.send({
        token: 'invalid'
    });

});

module.exports = router;
