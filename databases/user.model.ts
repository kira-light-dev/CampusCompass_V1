import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true, // store HASHED password
        },

        branch: {
            type: String,
            required: true,
            enum: ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"],
        },

        year: {
            type: Number,
            required: true,
            min: 1,
            max: 4,
        },

        collegeId: {
            type: String,
            unique: true,
        },

        avatar: {
            type: String, // image URL
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.User ||
mongoose.model("User", UserSchema);
