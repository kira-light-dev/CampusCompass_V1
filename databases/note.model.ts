import mongoose, { Schema } from "mongoose"

const NoteSchema = new Schema({
  name: String,
  url: String,
  fileType: String,
  size: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

export default mongoose.models.Note || mongoose.model("Note", NoteSchema)