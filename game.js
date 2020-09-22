
uuidv4 = require('uuid').v4;
const games = [];

class Game {
    constructor() {
        this.players = [];
        this.numCode = Math.floor(Math.random() * 10000); // Generates a random number between 0 and 9999
    }
}

class Player {
    constructor(uuid) {
        this.uuid = uuid;
    }
}

function makeNewGame() {
    var game = new Game();
    games.push(game);
    return game.numCode;
}

function addToGame(gameCode) {
    for (var i =0; i < games.length; i++)
    {
        var game = games[i];
        // console.log(game);
        // console.log("game.numCode = " + game.numCode);
        // console.log("gameCode = " + gameCode);
        if(game.numCode === gameCode) {
            var uuid = uuidv4();
            game.players.push(new Player(uuid));
            // console.log("Game Found, uuid= " + uuid);
            return uuid;
        }
    }
    console.error("Attempted to join game but no game found");
}

module.exports = {
    game: Game,
    makeNewGame: makeNewGame,
    addToGame: addToGame
}

