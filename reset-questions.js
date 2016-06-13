var
    samples    = require("./sample-questions.json"),
    connection = require("./models.js").connection,
    Question   = require("./models.js").Question;

// Remove todas as perguntas
Question.remove({}, () => {
    console.log("Todas as perguntas apagados da base de dados.");
    console.log("Inserindo perguntas em 'sample-questions.json'.");

    Question.collection.insert(samples, (err, docs) => {
        if (err)
            console.log("Falhou ao carregar as perguntas.");
        else
            console.log("Inseriu as perguntas: " + samples.length);

        connection.close();
    });
});
