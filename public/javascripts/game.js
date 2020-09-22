
var uuid = "";

function makeGame() {
    axios.post("/makeGame").then(response => {
        console.log(response.data)
    })
}

function joinGame() {
    axios.post("/joinGame", {
        code: parseInt($('#game_code').val())
    }).then(response => {
        uuid = response;
        console.log(response);
    });
}