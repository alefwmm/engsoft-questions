var
    connection = require("./models.js").connection,
    Player     = require("./models.js").Player;

// Remove todas as perguntas
Player.remove({}, () => {
    console.log("Todas os jogadores apagados da base de dados.");

    connection.close();
});
