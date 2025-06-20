const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Log = require("../Modules/logger");

(taskSchema = new Schema({
    id: Number,
    title: String,
    description: String,
    instructions: String,
    debug: {
        type: Boolean,
        default: false
    },
    task_category: {
        type: Number,
        enum: [0, 1, 2], // 0: Coding, 1: Design, 2: Explore
        default: 0
    },
    advanced: {
        type: Boolean,
        default: false
    },
    max_marks: {
        type: Number,
        enum: [10, 100],
        default: 10
    },
    logs: [{
        id: Number,
        date: Date,
        material: String,
        info: String,
        points: Number,
        status: {
            type: String,
            enum: [0, 1, 2], // 0: Pending, 1: Declined, 2: Approved
            default: 0
        },
        reviewer: Number,
    }],
    pending: [{
        id: Number,
        date: Date,
        material: String,
        info: String,
        points: Number,
    }],
})),
    taskSchema.pre('save', async function(next) {
        Log(`Task Collection Updated: ${JSON.stringify(this.toObject())}`)
        if (this.isNew) {
            const lastTask = await this.constructor.findOne().sort({id: -1 });
            this.id = lastTask ? lastTask.id + 100 : 100;
        }
        next();
    });
    (Task = mongoose.model("Task", taskSchema));

module.exports = Task;