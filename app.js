'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
global.rootPath = __dirname;
//connect database
var Database = require('./config/database');
global.Mysql = Database.Mysql();
Database.Mongo();

//Keep session to database
var SessionStore = require('express-mysql-session');
var sessionStore = new SessionStore(Database.MysqlSetting.PeopleDB());

var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');

var loginRule = require('./passport/login');



var app = express();
var server  = require('http').Server(app);
var io = require('socket.io').listen(server);

var routes = require('./routes/index');
var users = require('./routes/users');
var chat = require('./routes/chat');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('json spaces', 4);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));


app.use(flash());
//Setup session
app.use(require('express-session')({
    secret: 'Production customer',
    resave: true,
    saveUninitialized: true,
    store: sessionStore //Save session to database
}));
app.use(passport.initialize());
app.use(passport.session());


//Setup Passport
passport.serializeUser(function serializeUser(user, done) {
    done(null, user);
});

passport.deserializeUser(function deserializeUser(sessionUser, done) {
    done(null, sessionUser);
});

loginRule(passport);
//Setup Passport



require("./service/SocketService")(io);

app.use('/', routes);
app.use('/users', users);
app.use('/chat', chat);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 8888);
server.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

console.log('Express server listening on port ' + server.address().port);