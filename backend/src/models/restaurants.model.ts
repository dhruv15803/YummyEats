import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: true,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
      required: true,
    },
    restaurantThumbnail: {
      type: String,
      required: true,
    },
    restaurantImages: [
      {
        type: String,
      },
    ],
    restaurantCuisines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cuisine",
        required: true,
      },
    ],
    restaurantOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
