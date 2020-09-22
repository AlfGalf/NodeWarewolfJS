
var game = require('./game');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/makeGame', (req, res) => {
    var code = game.makeNewGame()
    console.log(code);
    res.send(code.toString());
})

app.post('/joinGame', (req, res) => {
    uuid = game.addToGame(req.body.code);
    console.log(req.body.code);
    res.send(code.toString());
})

module.exports = app;
