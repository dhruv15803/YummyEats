import { User } from "../models/users.model.js";
import Stripe from "stripe";
import { Order } from "../models/orders.model.js";
import { Address } from "../models/addresses.model.js";
import { City } from "../models/cities.model.js";
import mongoose from "mongoose";
import { Restaurant } from "../models/restaurants.model.js";
const stripe = new Stripe(process.env.STRIPE_API_KEY);
const orderCheckout = async (req, res) => {
    try {
        const { cart, restaurantId, addressLine1, cityName, addressLine2, pin_code, shipping_id, } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            res.status(400).json({
                success: false,
                message: "invalid userid",
            });
            return;
        }
        const lineItems = cart.map((cartItem) => {
            return {
                price_data: {
                    currency: "inr",
                    unit_amount: cartItem.itemPrice * 100,
                    product_data: {
                        name: cartItem.itemName,
                    },
                },
                quantity: cartItem.itemQty,
            };
        });
        const orderItems = cart.map((cartItem) => {
            return {
                ...cartItem,
                itemId: new mongoose.Types.ObjectId(cartItem.itemId),
            };
        });
        const city = await City.findOne({ cityName: cityName });
        let address;
        if (shipping_id === "") {
            address = await Address.create({
                addressLine1,
                addressLine2,
                cityId: city?._id,
                pin_code,
                userId: user._id,
            });
        }
        else {
            address = await Address.findOne({ _id: shipping_id });
        }
        const order = await Order.create({
            user_id: user._id,
            shipping_address: address?._id,
            orderItems,
            orderStatus: "PAID",
            restaurant_id: new mongoose.Types.ObjectId(restaurantId),
        });
        const session = await stripe.checkout.sessions.create({
            currency: "inr",
            line_items: lineItems,
            mode: "payment",
            metadata: {
                orderId: String(order._id),
            },
            success_url: `${process.env.CLIENT_URL}`,
            cancel_url: `${process.env.CLIENT_URL}/restaurants/menu/${restaurantId}`,
        });
        res.status(200).json({
            success: true,
            url: session.url,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const webHookHandler = async (req, res) => {
    console.log("webhook endpoint");
    let event;
    try {
        const signature = req.headers["stripe-signature"];
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(`Webhook error:${error.message}`);
    }
    if (event.type === "checkout.session.completed") {
        const order = await Order.findById(event.data.object.metadata?.orderId);
        console.log(order);
        if (!order) {
            res.status(400).json({
                success: false,
                message: "metadata orderid invalid",
            });
            return;
        }
        await Order.updateOne({ _id: order?._id }, {
            $set: {
                orderStatus: "PLACED",
                orderTotal: event.data.object.amount_total,
            },
        });
        console.log("order updated");
    }
    res.status(200).send();
};
const getMyOrders = async (req, res) => {
    try {
        const { sortByOrder } = req.params;
        const userId = new mongoose.Types.ObjectId(req.userId);
        let orders;
        if (sortByOrder === "-1") {
            // Latest to newest
            orders = await Order.find({ user_id: userId })
                .populate({
                path: "shipping_address",
                populate: { path: "cityId", model: "City" },
            })
                .populate("restaurant_id")
                .sort({ createdAt: -1 });
        }
        else {
            orders = await Order.find({ user_id: userId })
                .populate({
                path: "shipping_address",
                populate: { path: "cityId", model: "City" },
            })
                .populate("restaurant_id")
                .sort({ createdAt: +1 });
        }
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const getRestaurantOrders = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            res.status(400).json({
                success: false,
                message: "invalid restaurant id",
            });
            return;
        }
        const orders = await Order.find({ restaurant_id: restaurant._id })
            .populate({
            path: "shipping_address",
            populate: { path: "cityId", model: "City" },
        })
            .populate("restaurant_id");
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const updateOrderStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        const order = await Order.findById(id);
        if (!order) {
            res.status(400).json({
                success: false,
                message: "invalid orderid",
            });
            return;
        }
        await Order.updateOne({ _id: order._id }, { $set: { orderStatus: status } });
        res.status(200).json({
            success: true,
            message: "Status updated successfully",
        });
    }
    catch (error) {
        console.log(error);
    }
};
export { orderCheckout, webHookHandler, getMyOrders, getRestaurantOrders, updateOrderStatus, };
