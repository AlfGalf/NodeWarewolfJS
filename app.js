
var game = require('./game');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(80);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

http.listen(3001, () => {
    console.log('listening on *:3001');
});

app.get('/', function(req, res) {
    res.render('index', {});
});

app.post('/makeGame', (req, res) => {
    var code = game.makeNewGame()
    console.log(code);
    res.send(code.toString());
})

app.post('/joinGame', (req, res) => {
    console.log("Received code: " + req.body.code);
    var uuid = game.addToGame(parseInt(req.body.code));
    console.log("UUID: " + uuid);
    res.send(uuid);
})

module.exports = app;