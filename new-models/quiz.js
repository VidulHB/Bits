const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Log = require("../Modules/logger");

(quizSchema = new Schema({
    id: Number,
    title: String,
    description: String,
    link: String,
    startDateTime: Date,
    duration: Number,
    category: {
        type: Number,
        enum: [0, 1], // 0: Junior, 1: Senior
    },
    venue: String,
    evaluated: Boolean,
    questions: [{
        question: String,
        answers: Array,
        correct_answer: {
            type: Number,
            enum: [1, 2, 3, 4]
        }
    }],
    submissions: [{
        id: Number,
        position: Number,
        started_time: Date,
        answers: [{
            type: Number,
            enum: [1, 2, 3, 4]
        }],
        correct: Number,
        points: Number,
        penalties: Number
    }],
})),
    quizSchema.pre('save', async function(next) {
        Log(`Quiz Collection Upated: ${JSON.stringify(this.toObject())}`)
        if (this.isNew) {
            const lastQuiz = await this.constructor.findOne().sort({id: -1 });
            this.id = lastQuiz ? lastQuiz.id + 100 : 100;
        }
        next();
    });
    (Quiz = mongoose.model("Quiz", quizSchema));

module.exports = Quiz;
