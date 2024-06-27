import { Cuisine } from "../models/cuisines.model.js";
import { User } from "../models/users.model.js";
const getCuisines = async (req, res) => {
    try {
        const cuisines = await Cuisine.find({});
        res.status(200).json({
            "success": true,
            cuisines,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const addCuisine = async (req, res) => {
    try {
        const { cuisineName } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user?.isAdmin) {
            return res.status(400).json({
                "success": false,
                "message": "user is not authorized for this action"
            });
        }
        if (cuisineName.trim() === "") {
            res.status(400).json({
                "success": false,
                "message": "please enter a cuisine"
            });
            return;
        }
        // check if cuisinename already exists
        const isCuisine = await Cuisine.findOne({ cuisineName: cuisineName.trim().toLowerCase() });
        if (isCuisine) {
            res.status(400).json({
                "success": false,
                "message": "cuisine already exists"
            });
            return;
        }
        const newCuisine = await Cuisine.create({ cuisineName: cuisineName.trim().toLowerCase() });
        res.status(201).json({
            "success": true,
            newCuisine,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const deleteCuisine = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user?.isAdmin) {
            return res.status(400).json({
                "success": false,
                "message": "user is not authorized for this action"
            });
        }
        const cuisine = await Cuisine.findById(id);
        if (!cuisine) {
            res.status(400).json({
                "success": false,
                "message": "invalid cuisine id"
            });
            return;
        }
        await Cuisine.deleteOne({ _id: cuisine._id });
        res.status(200).json({
            "success": true,
            "message": "successfully deleted cuisine"
        });
    }
    catch (error) {
        console.log(error);
    }
};
const editCuisine = async (req, res) => {
    try {
        const { newCuisineName, id } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user?.isAdmin) {
            return res.status(400).json({
                "success": false,
                "message": "user is not authorized for this action"
            });
        }
        // check if newCuisine already exists.
        const isCuisine = await Cuisine.findOne({ cuisineName: newCuisineName.trim().toLowerCase() });
        if (isCuisine) {
            res.status(400).json({
                "success": false,
                "message": "cuisine already exists"
            });
            return;
        }
        await Cuisine.updateOne({ _id: id }, { $set: { cuisineName: newCuisineName.trim().toLowerCase() } });
        const updatedCuisine = await Cuisine.findOne({ _id: id });
        res.status(200).json({
            "success": true,
            updatedCuisine
        });
    }
    catch (error) {
        console.log(error);
    }
};
export { getCuisines, addCuisine, deleteCuisine, editCuisine, };
