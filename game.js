
import { v4 as uuidv4 } from 'uuid';

const games = []

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
    return game.numCode;
}

function addToGame(gameCode) {
    for (const game in games) {
        if(game.numCode === gameCode) {
            var uuid = uuidv4();
            game.players.push(new Player(uuid));
            return uuid;
        }
    }
}

module.exports = {
    game: Game,
    makeNewGame: makeNewGame,
    addToGame: addToGame
}

