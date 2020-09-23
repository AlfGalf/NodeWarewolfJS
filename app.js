
var game = require('./game');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var uuid = require('uuid').v4;

const roomsBeingSetup = [];
const sockets = [];

var app = express();

var server = app.listen(3000, () => {
    console.log('listening');
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
                console.log("Made Game");
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
    res.render('index', {});
});

app.post('/makeGame', (req, res) => {
    var code = Math.floor(Math.random() * 10000);
    roomsBeingSetup.push( {
        code: code
    })

    res.send(code.toString());
})

app.post('/joinGame', (req, res) => {

    if(game.doesGameExist(req.body.code)) {
        res.send( {
            success: true,
            uuid: uuid(),
            room_code: req.body.code
        })
    } else {
        res.send( {
            success: false
        })
    }
})

module.exports = app;