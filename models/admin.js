const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

let adminSchema = new mongoose.Schema({
    username: String,
    name: String,
    password: String,
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question"
        }
    ]
})

adminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Admin", adminSchema);