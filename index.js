var
    express = require("express"),
    mongoose = require("mongoose");

/**
 * DATABASE DEFINITIONS
 */

mongoose.connect("mongodb://localhost/engsoft");

var QuestionSchema = mongoose.Schema({
    text: String,
    correct: String,
    incorrect: [String]
});

var Question = mongoose.model("Question", QuestionSchema);

var PlayerSchema = mongoose.Schema({
    name: String,
    score: Number
});

var Player = mongoose.model("Player", PlayerSchema);

/*
var joao = new Player({name: "João", score: 300}).save();
var jose = new Player({name: "José", score: 200}).save();

var question1 = new Question({
    text: "Quais são os sintomas de organizações imaturas?",
    correct: "Pessoas mal treinadas e projetos mal definidos.",
    incorrect: [
        "Falta de eficiência de produção e desenvolvimento.",
        "Pessoas mal educadas e falta de profisionalismo."
    ]
}).save();
*/

/**
 * ROUTES DEFINITION
 */

var app = express();

app.get("/questions/:amount", (req, res, next) => {
    var amount = parseInt(req.params.amount) || 6;

    Question.find().limit(amount).exec((err, questions) => {
        res.status(2).json(questions);
    });
});

app.get("/players", (req, res, next) => {
    Player.find((err, players) => {
        res.status(200).json(players);
    });
});

/**
 * APP INIT
 */

var db = mongoose.connection;

db.on("error", console.error.bind(console, "WARNING: "));

db.once("open", () => {
    var port = 3000;

    console.log("Database conected.");

    app.listen(port, () => {
        console.log("App listening on port " + port + ".");
    });
});
