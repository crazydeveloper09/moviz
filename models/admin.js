const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

let adminSchema = new mongoose.Schema({
    username: {
		type: String,
		unique: true
	},
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