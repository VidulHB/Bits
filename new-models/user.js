const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Log = require("../Modules/logger");

(userSchema = new Schema({
    id: {type: Number, unique: true},
    username: String,
    name: String,
    email: String,
    age: Number,
    grade: Number,
    category: {
        type: Number,
        enum: [0, 1], // 0: Junior, 1: Senior
    },
    password: String,
    contact: String,
    creationDate: {type: Date, default: Date.now},
    admissionNo: {type: Number, max: 99999, min: 11111},
    admin: {type: Boolean, default: false},
    superAdmin: {type: Boolean, default: false},
    disqualified: {type: Boolean, default: false},
    competitionData: {
        points: Number,
        tasks: [{
            taskId: Number,
            points: Number,
            material: String,
            info: String,
            submissionDate: {type: Date, default: Date.now},
            status: {
                type: Number,
                enum: [0, 1, 2], // 0: Pending, 1: Declined, 2: Approved
                default: 0
            },
            reviewer: Number,
        }],
        quizzes: [{
            quizId: Number,
            points: Number,
            submission: [{
                questionNo: Number,
                answer: Number
            }],
            submissionDate: {type: Date, default: Date.now},
            status: Boolean // true: Evaluated, false: Pending
        }]
    }
})),
    userSchema.pre('save', async function(next) {
        Log(`User Collection Updated: ${JSON.stringify(this.toObject())}`)
        if (this.isNew) {
            const lastUser = await this.constructor.findOne().sort({id: -1 });
            this.id = lastUser ? lastUser.id + 1 : 1;
        }
        next();
    });
    (User = mongoose.model("User", userSchema));

module.exports = User;
