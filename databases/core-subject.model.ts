import mongoose, { Schema } from "mongoose"

const CoreSubjectSchema = new Schema({
  name: String,
}, { timestamps: true })

export default mongoose.models.CoreSubject || mongoose.model("CoreSubject", CoreSubjectSchema)