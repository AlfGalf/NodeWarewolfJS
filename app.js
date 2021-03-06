
var game = require('./game');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var uuid = require('uuid').v4;
var fs = require('fs');

var http = require('http');
var https = require('https');

const roomsBeingSetup = [];
const sockets = [];

var app = express();

var server = http.createServer(app).listen(8100, () => { 
    console.log('HTTP listening on 8100');
});

var io = require('socket.io')(server);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('host_sign_up', (res) => {
        let code = res.room_code;
        for (let i = 0; i < roomsBeingSetup.length; i++) {
            let room = roomsBeingSetup[i];
            if(room.code === code) {
                game.addGame(code, socket);
                console.log("Game lobby started after host socket connection: " + code);
                return;
            }
        }
        console.log("Didnt find room for host setup,")
    })

    socket.on('player_sign_up', (res) => {
        game.addPlayerToGame(res.room_code, res.uuid, socket);
    })
});

app.get('/', function(req, res) {
    console.log("Returned index");
    res.render('index', {});
});

app.post('/makeGame', (req, res) => {
    var code = Math.floor(Math.random() * 10000);
    console.log("Game initiated: " + code);
    roomsBeingSetup.push( {
        code: code
    })

    res.send(String(code).padStart(4, '0'));
})

app.post('/joinGame', (req, res) => {
    console.log("Game join request: " + req.body.code);
    if(game.doesGameExist(req.body.code)) {
        res.send( {
            success: true,
            uuid: uuid(),
            room_code: req.body.code
        })
    } else {
        console.log("Bad join request: " + req.body.code)
        res.send( {
            success: false
        })
    }
})

module.exports = app;
