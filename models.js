var
    mongoose   = require("mongoose"),
    random     = require("mongoose-simple-random");

/* DEFINIÇÕES DO BANCO DE DADOS E MODELAGEM */

// Conexão
mongoose.connect("mongodb://localhost/engsoft");

// Esquema das perguntas
var QuestionSchema = mongoose.Schema({
    text:      String,   // Texto da pergunta
    correct:   String,   // Resposta correta da pergunta
    incorrect: [String], // Respostas incorretas da pergunta
    hints:     [String], // Dicas relacionadas à pergunta
    points:    Number    // Número de pontos da pergunta
});

// Habilita a possibilidade de encontrar perguntas aleatórias
QuestionSchema.plugin(random);

// Modelo das perguntas
var Question = mongoose.model("Question", QuestionSchema);

// Esquema do jogador
var PlayerSchema = mongoose.Schema({
    name:  String, // Nome do jogador
    score: Number  // Número de pontos acumulados por ele
});

// Modelo do jogador
var Player = mongoose.model("Player", PlayerSchema);

module.exports = {
    connection: mongoose.connection,
    Question: Question,
    Player: Player
};
