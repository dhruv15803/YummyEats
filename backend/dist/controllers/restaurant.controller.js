import { User } from "../models/users.model.js";
import { Restaurant } from "../models/restaurants.model.js";
import { getCloudinaryUrl } from "../utils/getCloudinaryUrl.js";
import fs from "fs";
import { City } from "../models/cities.model.js";
import { MenuItem } from "../models/MenuItems.model.js";
import { Cuisine } from "../models/cuisines.model.js";
const getMyRestaurants = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            res.status(400).json({
                success: false,
                message: "invalid user id",
            });
            return;
        }
        const restaurants = await Restaurant.find({ restaurantOwner: user._id })
            .populate("cityId")
            .populate("restaurantCuisines");
        res.status(200).json({
            success: true,
            restaurants,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const getFileUrl = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: "no file available",
            });
            return;
        }
        const localFilePath = req.file?.path;
        const url = await getCloudinaryUrl(localFilePath);
        res.status(200).json({
            success: true,
            url,
        });
        fs.unlinkSync(localFilePath);
    }
    catch (error) {
        console.log(error);
    }
};
const registerRestaurant = async (req, res) => {
    try {
        const { restaurantThumbnailUrl, restaurantName, restaurantCity, addressLine1, addressLine2, restaurantCuisines, } = req.body;
        const userId = req.userId;
        const city = await City.findOne({
            cityName: restaurantCity.trim().toLowerCase(),
        });
        if (!city) {
            res.status(400).json({
                success: false,
                message: "Please enter a valid city",
            });
            return;
        }
        const cuisines = restaurantCuisines.map((c) => c._id);
        const restaurant = await Restaurant.create({
            restaurantName,
            cityId: city._id,
            addressLine1,
            addressLine2,
            restaurantThumbnail: restaurantThumbnailUrl,
            restaurantCuisines: cuisines,
            restaurantOwner: userId,
        });
        res.status(200).json({
            success: true,
            restaurant,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const removeRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            res.status(400).json({
                success: false,
                message: "invalid restaurant id",
            });
            return;
        }
        if (String(restaurant.restaurantOwner) !== userId) {
            res.status(400).json({
                success: false,
                message: "unauthorized user",
            });
            return;
        }
        await MenuItem.deleteMany({ restaurant_id: restaurant._id });
        await Restaurant.deleteOne({ _id: restaurant._id });
        res.status(200).json({
            success: true,
            message: "restaurant removed",
        });
    }
    catch (error) {
        console.log(error);
    }
};
const getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id)
            .populate("cityId")
            .populate("restaurantCuisines");
        if (!restaurant) {
            res.status(400).json({
                success: false,
                message: "invalid restaurant id",
            });
            return;
        }
        res.status(200).json({
            success: true,
            restaurant,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const getMenuItems = async (req, res) => {
    try {
        const { id } = req.params;
        const menuItems = await MenuItem.find({ restaurant_id: id }).populate("item_cuisine");
        res.status(200).json({
            success: true,
            menuItems,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const addMenuItem = async (req, res) => {
    try {
        const { itemName, itemDescription, itemPrice, itemCuisine, restaurantId, } = req.body;
        const userId = req.userId;
        const cuisine = await Cuisine.findOne({ cuisineName: itemCuisine });
        if (!cuisine) {
            res.status(400).json({
                success: false,
                message: "cuisine not found",
            });
            return;
        }
        const restaurant = await Restaurant.findOne({ _id: restaurantId });
        if (!restaurant) {
            res.status(400).json({
                success: false,
                message: "invalid restaurant id",
            });
            return;
        }
        if (String(restaurant.restaurantOwner) !== userId) {
            res.status(400).json({
                success: false,
                message: "user not owner of restaurant",
            });
            return;
        }
        const menuItem = await MenuItem.create({
            item_name: itemName,
            item_description: itemDescription,
            item_price: itemPrice,
            item_cuisine: cuisine._id,
            restaurant_id: restaurant._id,
        });
        const newMenuItem = await MenuItem.findOne({ _id: menuItem._id }).populate("item_cuisine");
        res.status(200).json({
            success: true,
            newMenuItem,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const menuItem = await MenuItem.findOne({ _id: id });
        if (!menuItem) {
            res.status(400).json({
                success: false,
                message: "invalid menu item id",
            });
            return;
        }
        await MenuItem.deleteOne({ _id: menuItem._id });
        res.status(200).json({
            success: true,
            message: "menu item deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
    }
};
const editMenuItem = async (req, res) => {
    try {
        const { newMenuItemName, newMenuItemDescription, newMenuItemCuisine, newMenuItemPrice, id, } = req.body;
        const menuItem = await MenuItem.findOne({ _id: id });
        if (!menuItem) {
            res.status(400).json({
                success: false,
                message: "invalid menu item id",
            });
            return;
        }
        const cuisine = await Cuisine.findOne({
            cuisineName: newMenuItemCuisine.trim().toLowerCase(),
        });
        if (!cuisine) {
            res.status(400).json({
                success: false,
                message: "invalid cuisine name",
            });
            return;
        }
        await MenuItem.updateOne({ _id: menuItem._id }, {
            $set: {
                item_name: newMenuItemName,
                item_description: newMenuItemDescription,
                item_cuisine: cuisine._id,
                item_price: newMenuItemPrice,
            },
        });
        const updatedItem = await MenuItem.findOne({ _id: menuItem._id }).populate("item_cuisine");
        res.status(200).json({
            success: true,
            updatedItem,
        });
    }
    catch (error) {
        console.log(error);
    }
};
export { getMyRestaurants, getFileUrl, registerRestaurant, getRestaurantById, getMenuItems, addMenuItem, deleteMenuItem, editMenuItem, removeRestaurant, };
