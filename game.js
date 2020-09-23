
uuidv4 = require('uuid').v4;
const games = [];

class Game {
    constructor(code, socket) {
        this.players = [];
        this.numCode = code;
        this.socket = socket;
        this.hasGivenRoles = false;
    }
}

class Player {
    constructor(uuid, socket) {
        this.uuid = uuid;
        this.socket = socket;
    }
}

function addGame(code, socket) {
    var game = new Game(code, socket);
    games.push(game);
    socket.on('disconnect', () => {
        for (let i = 0; i < game.players.length; i++) {
            let player = game.players[i];
            player.socket.emit("hostDisconnect");
            player.socket.disconnect();
        }
        games.pop(game);
    })

    socket.on("start_game", () => {
        // TODO: START GAME

    });
}

function doesGameExist(code) {
    for (let i = 0; i < games.length; i++) {
        if(games[i].numCode === code) {
            return true;
        }
    }
    return false;
}

function addPlayerToGame(gameCode, uuid, socket) {
    for (var i =0; i < games.length; i++)
    {
        var game = games[i];
        console.log(game.numCode);
        console.log(gameCode);
        if(game.numCode === gameCode) {
            game.players.push(new Player(uuid, socket));
            game.socket.emit('player_number_update', {
                num: game.players.length
            });
            socket.on('disconnect', () => {
                for (let j = 0; j < game.players.length; j++) {
                    if(game.players[i].uuid === uuid) {
                        game.players.pop(game.players[i]);
                        game.socket.emit('player_number_update', {
                            num: game.players.length
                        });
                    }
                }
            });

            return uuid;
        }
    }
    console.error("Attempted to join game but no game found");
    return -1;
}

module.exports = {
    game: Game,
    addGame: addGame,
    addPlayerToGame: addPlayerToGame,
    doesGameExist: doesGameExist
}

