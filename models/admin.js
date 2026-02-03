import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

let adminSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  name: String,
  password: String,
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

adminSchema.plugin(passportLocalMongoose);

export default mongoose.model("Admin", adminSchema);
