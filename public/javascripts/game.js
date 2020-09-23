
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
            })

        } else {
            $('#error').text("Unable to find room").show();
        }
    });

    socket.on('disconnect', () => {
        $('#error').text("Server disconnected!");
        console.log("Server disconnected");
    });
}

function startGame() {
    socket.emit("start_game");
    $('#start_game_button').hide();
    $('#has_game_started').text("Game Started");
}
