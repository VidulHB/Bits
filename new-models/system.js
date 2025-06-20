const mongoose = require("mongoose");
const Log = require("../Modules/logger");
const Schema = mongoose.Schema;

(systemSchema = new Schema({
    IPList: {
        type: [String],
        default: [],
    },
    banned_IPList: {
        type: [String],
        default: [],
    },
})),
    systemSchema.pre('save', async function(next) {
        Log(`System Collection Updated: ${JSON.stringify(this.toObject())}`)
        next();
    });
    (System = mongoose.model("System", systemSchema));

module.exports = System;
