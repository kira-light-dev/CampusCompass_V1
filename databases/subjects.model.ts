import mongoose, { Schema } from "mongoose";

const TopicSchema = new Schema({
  name: String,
  completed: Boolean,
});

const SubjectSchema = new Schema(
  {
    name: String,
    progress: Number,

    topics: [TopicSchema],

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Subject ||
mongoose.model("Subject", SubjectSchema);