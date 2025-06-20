const mongoose = require("mongoose");
const Schema = mongoose.Schema;

(testSchema = new Schema({
    test_id: Number,
    test_name: String,
    test_description: String,
    test_link: String,
    test_dateTime: String,
    test_endDateTime: String,
    test_type: String,
    test_venue: String,
    evaluated: Boolean,
    questions: [{ question: String, answers: Array, correct_answer: String, media_attachment: String }],
    user_submissions: [{ unique_id: Number, email: String, position: Number, started_time: String, user_answers : Array, marks_scored : String, penalties: Number }],
})),
  (Test = mongoose.model("Test", testSchema));

module.exports = Test;
