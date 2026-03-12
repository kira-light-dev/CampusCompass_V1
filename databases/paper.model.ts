import mongoose, { Schema } from "mongoose"

const PaperSchema = new Schema({
  name: String,
  url: String,
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  subjectName: String,
  downloaded: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

export default mongoose.models.Paper || mongoose.model("Paper", PaperSchema)