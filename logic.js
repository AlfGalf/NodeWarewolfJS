

// ids
// 0 mafia 1 in 4
// 1 villager rest
// 2 medic / doctor 1 in 8
// 3 investigator / detective 1 in 8
// 4 mayor 1 in game above 18
// 5 serial killer 1 in game with at least 20?
// 6 jester 1 in game with at least 20?
// medic is delayed by 4

var roles = [];

roles.push([1, 4, 0, 1, 0, 0, 0]); // 6 players
roles.push([1, 5, 0, 1, 0, 0, 0]); // 7 players
roles.push([2, 4, 1, 1, 0, 0, 0]); // 8 players
roles.push([2, 5, 1, 1, 0, 0, 0]); // 9 players
roles.push([2, 6, 1, 1, 0, 0, 0]); // 10 players
roles.push([2, 7, 1, 1, 0, 0, 0]); // 11 players
roles.push([3, 6, 1, 2, 0, 0, 0]); // 12 players
roles.push([3, 7, 1, 2, 0, 0, 0]); // 13 players
roles.push([3, 8, 1, 2, 0, 0, 0]); // 14 players
roles.push([3, 9, 1, 2, 0, 0, 0]); // 15 players
roles.push([4, 8, 2, 2, 0, 0, 0]); // 16 players
roles.push([4, 9, 2, 2, 0, 0, 0]); // 17 players
roles.push([4, 9, 2, 2, 0, 0, 1]); // 18 players
roles.push([4, 10, 2, 2, 0, 0, 1]); // 19 players
roles.push([5, 9, 2, 2, 0, 1, 1]); // 20 players
roles.push([5, 10, 2, 2, 0, 1, 1]); // 21 players
roles.push([5, 10, 2, 2, 1, 1, 1]); // 22 players
roles.push([5, 11, 2, 2, 1, 1, 1]); // 23 players
roles.push([6, 11, 2, 2, 1, 1, 1]); // 24 players
roles.push([0, 0, 0, 0, 0, 0, 0]); // 25 players
roles.push([0, 0, 0, 0, 0, 0, 0]); // 26 players
roles.push([0, 0, 0, 0, 0, 0, 0]); // 27 players
roles.push([0, 0, 0, 0, 0, 0, 0]); // 28 players
roles.push([0, 0, 0, 0, 0, 0, 0]); // 29 players
roles.push([0, 0, 0, 0, 0, 0, 0]); // 30 players


function assign(players) {
    var randtable = [];

    if(players.length < minplayers || players.length > maxplayers) {
        return [0, 0, 0, 0, 0, 0, 0];
    }

    for (i = 0; i < roles[0].length; i++) {
        for (j = 0; j < roles[players.length-6][i]; j++) {
            randtable.push(i);
        }
    }
    shuffleArray(randtable);

    var output = [];

    for (i = 0; i < players.length; i++) {
        output.push({uuid: players[i], role: randtable[i]});
    }

    return output;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const minplayers = 6;
const maxplayers = 24;
module.exports.assign = assign;
module.exports.maxplayers = maxplayers;
module.exports.minplayers = minplayers;