var
    express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser");

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


/**
 * ROUTES DEFINITION
 */

var app = express();

app.use(bodyParser.json());

app.get("/questions/(:amount)?", (req, res, next) => {
    var amount = parseInt(req.params.amount) || 6;

    Question.find().limit(amount).exec((err, questions) => {
        res.status(200).json(questions);
    });
});

app.post("/questions", (req, res, next) => {
    var question = new Question(req.body);

    question
        .save()
        .then((question) => {
            res
                .status(200)
                .json(question);
        }, () => {
            res
                .status(400)
                .json({
                    message: "Question not in the proper format."
                });
        })
});

app.get("/players", (req, res, next) => {
    Player.find((err, players) => {
        res.status(200).json(players);
    });
});

app.get("/player/:id", (req, res, next) => {
    Player.findById(req.params.id, (err, player) => {
        if (err) {
            res
                .status(404)
                .json({message: "Player not found."});
        } else {
            res
                .status(200)
                .json(player);
        }
    });
});

app.post("/players", (req, res, next) => {
    var player = new Player(req.body);

    player
        .save()
        .then((player) => {
            res
                .status(200)
                .json(player);
        }, () => {
            res
                .status(400)
                .json({
                    message: "Player not in the proper format."
                });
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
