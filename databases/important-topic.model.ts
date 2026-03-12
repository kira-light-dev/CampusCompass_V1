import mongoose, { Schema } from "mongoose"

const ImportantTopicSchema = new Schema({
  topic: String,
  subject: String,
  priority: { type: String, enum: ["high", "medium", "low"] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

export default mongoose.models.ImportantTopic || mongoose.model("ImportantTopic", ImportantTopicSchema)
