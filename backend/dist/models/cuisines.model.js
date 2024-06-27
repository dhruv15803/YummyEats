import mongoose from "mongoose";
const cuisineSchema = new mongoose.Schema({
    cuisineName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
}, { timestamps: true });
export const Cuisine = mongoose.model("Cuisine", cuisineSchema);
