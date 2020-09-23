
var uuid = "";
var socket;
var room_code;
var num_players = 0;

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

const min_players = 6;
const max_players = 24;

$(document).ready(() => {
    $('#connect_div').show();
    $('#player_div').hide();
    $('#host_div').hide();
})

function makeGame() {
    axios.post("/makeGame").then(response => {
        console.log(response.data);
        room_code = response.data;
        $('#connect_div').hide();
        $('#host_div').show();
        $('#room_code').text(response.data);
        socket = io.connect();
        socket.emit('host_sign_up', {
            room_code: room_code
        });

        updateRoles(0);

        socket.on('player_number_update', (res) => {
            $('#num_participants').text("Number of participants: " + res.num.toString());
            num_players = res.num;
            updateRoles(res.num);
            if(res.start_possible) {
                $('#num_participants_error').hide();
            } else {
                $('#num_participants_error').show().text("Not a valid number of players");
            }
            $('#start_game_button').prop('disabled', res.start_possible);
        });

        socket.on('disconnect', () => {
            $('#error').text("Server disconnected!").show();
            console.log("Server disconected!")
        });
    });
}

function joinGame() {
    axios.post("/joinGame", {
        code: parseInt($('#game_code').val())
    }).then(response => {
        if(response.data.success === true) {
            uuid = response.data.uuid;
            room_code = response.data.room_code;
            $('#connect_div').hide();
            $('#player_div').show();
            $('#role').hide();
            $('#desc').hide();

            socket = io.connect();
            socket.emit('player_sign_up', {
                uuid: uuid,
                room_code: room_code
            });

            socket.on("assign_role", (res) => {
                console.log(res);
                $('#role').text(res.role)
                    .show();
                $('#desc').text(res.description)
                    .show();
                $('#wait_label').hide();
            });

            socket.on("host_disconnect", () => {
                $('#error').text("Host disconnected. Please reload the page.")
                    .show();
                $('#wait_label').hide();
            });

            socket.on('disconnect', () => {
                $('#error').text("Server disconnected!");
                console.log("Server disconnected");
            });

        } else {
            $('#error').text("Unable to find room").show();
        }
    });

}

function updateRoles(num) {
    if(num_players >= min_players && num_players <= max_players) {
        var rolesArr = roles[num - 6];
        for (let i = 0; i < 7; i++) {
            var num_of_role = rolesArr[i];
            if(num_of_role === 0) {
                //$('#role' + i).hide();
            } else {
                $('#role' + i).show()
                $('#role' + i.toString() + 'num').text(num_of_role);
            }

        }
    } else {
        for (let i = 0; i < 7; i++) {
            //$('#role' + i).hide();
        }
        console.log("Removed all");
    }
}

function startGame() {
    socket.emit("start_game");
    $('#start_game_button').hide();
    $('#has_game_started').text("Game Started");
}
