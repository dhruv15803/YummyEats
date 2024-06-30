import mongoose from "mongoose";
const MenuItemSchema = new mongoose.Schema({
    item_name: {
        type: String,
        required: true,
    },
    item_description: {
        type: String,
        required: true,
    },
    item_price: {
        type: Number,
        required: true,
    },
    item_cuisine: {
        type: mongoose.Schema.ObjectId,
        ref: "Cuisine",
        required: true,
    },
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
});
export const MenuItem = mongoose.model("MenuItem", MenuItemSchema);
