const mongoose = require("mongoose");

let answerSchema = new mongoose.Schema({
    text: String,
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    },
    type: Boolean
})

module.exports = mongoose.model("Answer", answerSchema)