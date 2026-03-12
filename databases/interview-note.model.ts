import mongoose, { Schema } from "mongoose"

const InterviewNoteSchema = new Schema({
  topic: String,
  confidence: { type: Number, min: 1, max: 10, default: 5 },
  note: String,
}, { timestamps: true })

export default mongoose.models.InterviewNote || mongoose.model("InterviewNote", InterviewNoteSchema)