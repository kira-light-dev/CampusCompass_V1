import mongoose, { Schema } from "mongoose"

const PracticeLinkSchema = new Schema({
  name: String,
  url: String,
  description: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

export default mongoose.models.PracticeLink || mongoose.model("PracticeLink", PracticeLinkSchema)