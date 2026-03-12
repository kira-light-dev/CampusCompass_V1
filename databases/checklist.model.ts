import mongoose, { Schema } from "mongoose"

const ChecklistSchema = new Schema({
  task: String,
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

export default mongoose.models.Checklist || mongoose.model("Checklist", ChecklistSchema)