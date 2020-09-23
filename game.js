
var uuidv4 = require('uuid').v4;
var logic = require('./logic');

const games = [];

const roleList =
    [
        {name: 'Mafia', desc: 'You are a member of the Mafia. You will soon find out who the other Mafia are, and your collective job is to be the only ones alive at the end. During the Night phase, you will decide who you want to kill. During the Day phase, you need to stay hidden and pretend you are not a Mafia member. You may not show this screen at any point during the game.'},
        {name: 'Civilian', desc: 'You are a Civilian. Your job is to find out who the Mafia are, and vote to kill them during the Day phase. You may not show this screen at any point during the game.'},
        {name: 'Doctor', desc: 'You are a Doctor. During the Night phase, you may choose one person to protect from the Mafia. You may not protect yourself.Your job is to find out who the Mafia are, and vote to kill them during the Day phase. You may not show this screen at any point during the game.'},
        {name: 'Detective', desc: 'You are a Detective. During the Night phase, you may find out the role of one person (thumbs up means Mafia, thumbs down means not Mafia). Your job is to find out who the Mafia are, and vote to kill them during the Day phase. You may not show this screen at any point during the game.'},
        {name: 'Mayor', desc: 'You are the Mayor. During a Day phase, you may show this screen to prove that you are the Mayor. When you do this, your vote counts for three votes for the rest of the game, however you can no longer be protected by doctors. Your job is to find out who the Mafia are, and vote to kill them during the Day phase.'},
        {name: 'Serial Killer', desc: 'You are the Serial Killer. During the Night phase, you may choose one person to kill. Your job is to be the last person alive at the end of the game. You may not show this screen at any point during the game.'},
        {name: 'Jester', desc: 'You are the Jester. Your job is to confuse the game, and to be killed by a vote during the Day phase. If you do, you may kill any one person during the next night phase. You may not show this screen at any point during the game.'}
    ]

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
        this.role = 0;
    }
}

function addGame(code, socket) {
    console.log("Added game lobby: " + code);
    var game = new Game(code, socket);
    games.push(game);

    socket.on('disconnect', () => {
        if(!game.hasGivenRoles) {
            console.log("Host disconnected before game started, Game: " + game.numCode);
            for (let i = 0; i < game.players.length; i++) {
                let player = game.players[i];
                player.socket.emit("host_disconnect");
                player.socket.disconnect();
            }
            games.pop(game);
        }
    })

    socket.on("start_game", () => {
        if(game.hasGivenRoles) {
            console.error("Attempted to give roles when already given.")
        } else {
            console.log("Game: " + game.numCode + " starting");
            var playerUuidList = []

            game.players.forEach(player => {
                playerUuidList.push(player.uuid);
            })

            var roleAssignment = logic.assign(playerUuidList);

            for (let i = 0; i < game.players.length; i++) {

                var role;

                roleAssignment.forEach((roleAssign) => {
                    if(roleAssign.uuid === game.players[i].uuid) {
                        role = roleAssign.role;
                    }
                })

                game.players[i].socket.emit("assign_role", {
                    role: roleList[role].name,
                    description: roleList[role].desc
                })
            }
            game.hasGivenRoles = true;
            console.log("Game: " + game.numCode + " started.");
        }
    });
}

function doesGameExist(code) {
    for (let i = 0; i < games.length; i++) {
        if(games[i].numCode === code && games[i].hasGivenRoles === false) {
            return true;
        }
    }
    return false;
}

function addPlayerToGame(gameCode, uuid, socket) {
    for (var i =0; i < games.length; i++)
    {
        const game = games[i];
        if(game.numCode === gameCode && game.hasGivenRoles === false) {
            game.players.push(new Player(uuid, socket));
            game.socket.emit('player_number_update', {
                num: game.players.length
            });

            socket.on('disconnect', () => {
                console.log("Player socket closed for game: " + game.numCode);
                for (let j = 0; j < game.players.length; j++) {
                    if(game.players[j].uuid === uuid) {
                        console.log("Player disconnected from game: " + game.numCode);
                        game.players.pop(game.players[j]);
                        game.socket.emit('player_number_update', {
                            num: game.players.length,
                            start_possible: game.players.length >= logic.minplayers && game.players.length <= logic.maxplayers
                        });
                    }
                }
            });
            console.log("Added player:  to game: " + game.numCode);
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

