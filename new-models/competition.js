const mongoose = require("mongoose");
const Schema = mongoose.Schema;

(competitionSchema = new Schema({
    competition_enabled: { type: Boolean, default: true },
    quizzes_enabled: { type: Boolean, default: true },
    leaderboard_enabled: { type: Boolean, default: true },
    analytics: {
        views: { type: Number, default: 1 },
        signups: { type: Number, default: 0 },
        coding_tasks: { type: Number, default: 0 },
        design_tasks: { type: Number, default: 0 },
        explore_tasks: { type: Number, default: 0 },
        time_spent: { type: Number, default: 1 },
        page_clicks: { type: Number, default: 1 },
        unique_visitors: { type: Number, default: 1 }
    },
    pending_tasks: [{
        id: Number,
        user_id: Number,
        submissionDate: { type: Date, default: Date.now },
        task_category: {
            type: Number,
            enum: [0, 1, 2], // 0: Coding, 1: Design, 2: Explore
            default: 0
        },
        material: String,
        info: String
    }],
})),

    (Competition = mongoose.model("Competition", competitionSchema));

module.exports = Competition;
