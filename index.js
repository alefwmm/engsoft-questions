var
    express    = require("express"),
    bodyParser = require("body-parser"),
    session    = require("express-session"),
    cors       = require("cors"),
    connection = require("./models.js").connection,
    Question   = require("./models.js").Question,
    Player     = require("./models.js").Player;

/* CAMADA DE COMUNICAÇÃO */

// Intância da camada de comunicação
var app = express();

// Acesso aos pontos de comunicação de qualquer origem
app.use(cors());

// Camada intermediária responsável por decodificar o conteúdo das requisições
app.use(bodyParser.json());

// Camada responsável pela autenticação dos jogadores
app.use(session({
    cookie: {
        maxAge: 60 * 60 * 5                 // 5 horas de duração
    },
    rolling:           true,                // maxAge atualizado automaticamente
    secret:            "engsoft-questions", // Segredo
    saveUninitialized: false,               // Não gerar sessão automaticamente
    resave:            false                // Salvar automaticamente bloquado
}));

/* ROTAS */

// Rota resposável por gerar uma sessão de jogo
app.get("/init(/:amount)?", (req, res, next) => {
    var amount = parseInt(req.params.amount) || 6;

    req.session.regenerate((err) => {
        if (err) {
            var message = "Falhou ao gerar uma nova sessão.";

            console.error(message);

            // Resposta de falha
            res
                .status(500)
                .json({
                    message: message
                });

            next();
        } else {
            console.log("Sessão iniciada, ID: " + req.session.id);
            console.log("Escolhendo perguntas aleatórias.");

            Question.findRandom({}, {}, {limit: amount}, (err, results) => {
                if (err) {
                    var message = "Falhou ao escolher perguntas aleatórias.";

                    console.error(message);

                    res
                        .status(500)
                        .json({
                            message: message
                        });

                    next();
                } else {
                    console.log("Perguntas escolhidas com sucesso.");
                    req.session.questions = results;
                    req.session.save();

                    // Resposta de sucesso
                    res
                        .status(200)
                        .json({
                            message : "Sessão iniciada com sucesso."
                        });

                    next();
                }
            });
        }
    });
});

// Pede pela próxima pergunta
app.get("/question", (req, res, next) => {
    console.log(req.session.questions);

    if (req.session.questions.length > 0) {
        var question = req.session.questions.shift();

        req.session.save();

        console.log("Enviando uma pergunta: " + question._id);
        console.log("\tRestantes: " + req.session.questions.length);

        res
            .status(200)
            .json(question);

        next();
    } else {
        var message = "Nenhuma pergunta restante."

        console.error(message);

        res
            .status(500)
            .json({
                message: message
            });

        next();
    }
});

// Pede pela próxima dica
app.get("/hint", (req, res, next) => {
    if (
        req.session.questions.length > 0 &&
        req.session.questions[0].hints.length > 0)
    {
        var hint = req.session.questions[0].hints.shift();

        req.session.save();

        console.log(
            "Enviando uma dica da pergunta: " + req.session.questions[0]._id);
        console.log("Restantes: " + req.session.questions[0].hints.length);

        res
            .status(200)
            .json(hint);

        next();
    } else {
        var message = "Nenhuma dica restante."

        console.error(message);

        res
            .status(500)
            .json({
                message: message
            });

        next();
    }
});

// Retorna lista de jogares que completaram o jogo e sua pontuação
app.get("/players", (req, res, next) => {
    Player.find().sort([["score", "descending"]]).limit(10).exec((err, players) => {
        console.log(
            "Retornando os jogadores e suas pontuações: ", players.length);

        res
            .status(200)
            .json(players);

        next();
    });
});

app.post("/players", (req, res, next) => {
    var player = new Player(req.body);

    player
        .save()
        .then((player) => {
            console.log("Jogador e pontuação salvos.");
            console.log(player);

            res
                .status(200)
                .json(player);

            next();
        }, () => {
            var message = "Falha ao salvar o jogador."

            console.error(message);

            res
                .status(500)
                .json({
                    message: message
                });

            next();
        });
});

/* INICIANDO O SERVIDOR */

connection.once("open", () => {
    var port = 3000;

    console.log("Banco de dados conectado.");

    app.listen(port, () => {
        console.log("Servidor escutando na porta " + port + ".");
    });
});
