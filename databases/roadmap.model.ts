import mongoose, { Schema } from "mongoose"

const RoundSchema = new Schema({
  name: String,
  description: String,
  topics: [String],
  tip: String,
})

const RoadmapSchema = new Schema({
  company: String,
  role: String,
  overview: String,
  difficulty: String,
  rounds: [RoundSchema],
  keyTopics: [String],
  focusAreas: [String],
}, { timestamps: true })

export default mongoose.models.Roadmap || mongoose.model("Roadmap", RoadmapSchema)
