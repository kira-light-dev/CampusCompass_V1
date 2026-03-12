import mongoose, { Schema } from "mongoose"

const VideoSchema = new Schema({
  videoId: String,
  playlistId: String,
  title: String,
  channel: String,
  thumbnail: String,
  viewCount: String,
  videoCount: Number,
  url: String,
  type: { type: String, enum: ["video", "playlist"], default: "video" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

export default mongoose.models.Video || mongoose.model("Video", VideoSchema)