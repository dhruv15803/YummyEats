import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  itemPrice: {
    type: Number,
    required: true,
  },
  itemQty: {
    type: Number,
    required: true,
    default: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shipping_address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    orderItems: [orderItemSchema],
    orderStatus: {
      type: String,
      enum: ["PAID", "PLACED", "IN-PROGRESS", "OUT FOR DELIVERY", "DELIVERED"],
      required: true,
    },
    orderTotal: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
