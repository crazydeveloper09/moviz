const mongoose = require("mongoose");

let questionSchema = new mongoose.Schema({
    title: String,
    file: String,
    category: String,
    type: String,
    answers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer"
        }
    ],
    timeToAnswer: Number,
    quote: String,
    heroType: String,
    dataType: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
})

module.exports = mongoose.model("Question", questionSchema)