import mongoose from "mongoose";

let answerSchema = new mongoose.Schema({
  text: String,
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
  },
  isCorrect: Boolean,
});

export default mongoose.model("Answer", answerSchema);
