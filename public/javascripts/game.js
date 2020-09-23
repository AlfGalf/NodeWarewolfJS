
var uuid = "";
var socket;
var room_code;

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

        socket.on('player_number_update', (res) => {
            $('#num_participants').text(res.num);
        });
    })
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

            socket = io.connect();
            socket.emit('player_sign_up', {
                uuid: uuid,
                room_code: room_code
            });
        } else {
            $('#error').text("Unable to find room");
        }
    });
}

function startGame() {
    socket.emit("start_game");
    $('#start_game_button').hide();
    $('#has_game_started').text("Game Started");
}
