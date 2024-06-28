import { Cuisine } from "../models/cuisines.model.js";
import { User } from "../models/users.model.js";
import { City } from "../models/cities.model.js";
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
const addCity = async (req, res) => {
    try {
        const { cityName } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user?.isAdmin) {
            return res.status(400).json({
                "success": false,
                "message": "user is not authorized for this action"
            });
        }
        if (cityName.trim() === "") {
            res.status(400).json({
                "success": false,
                "message": "Please enter a city"
            });
            return;
        }
        // check if  city already exists
        const isCity = await City.findOne({ cityName: cityName.trim().toLowerCase() });
        if (isCity) {
            res.status(400).json({
                "success": false,
                "message": "city already exists"
            });
            return;
        }
        // insert new ciyt
        const newCity = await City.create({ cityName: cityName.trim().toLowerCase() });
        res.status(201).json({
            "success": true,
            newCity,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const deleteCity = async (req, res) => {
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
        const city = await City.findById(id);
        if (!city) {
            res.status(400).json({
                "success": false,
                "message": "invalid city id"
            });
            return;
        }
        await City.deleteOne({ _id: city._id });
        res.status(200).json({
            "success": true,
            "message": "city deleted successfully"
        });
    }
    catch (error) {
        console.log(error);
    }
};
const editCity = async (req, res) => {
    try {
        const { newCityName, id } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user?.isAdmin) {
            return res.status(400).json({
                "success": false,
                "message": "user is not authorized for this action"
            });
        }
        if (newCityName.trim() === "") {
            res.status(400).json({
                "success": false,
                "message": "please enter a city"
            });
            return;
        }
        // check if other cites with new city name already exist.
        const isCity = await City.findOne({ cityName: newCityName.trim().toLowerCase() });
        if (isCity) {
            res.status(400).json({
                "success": false,
                'message': "city already exists"
            });
            return;
        }
        await City.updateOne({ _id: id }, { $set: { cityName: newCityName.trim().toLowerCase() } });
        const updatedCity = await City.findOne({ _id: id });
        res.status(200).json({
            "success": true,
            updatedCity,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const getCities = async (req, res) => {
    try {
        const cities = await City.find({});
        res.status(200).json({
            "success": true,
            cities,
        });
    }
    catch (error) {
        console.log(error);
    }
};
// const getCuisines = async (req:Request,res:Response) => {
//     try {
//         const cuisines = await Cuisine.find({});
//         res.status(200).json({
//             "success":true,
//             cuisines,
//         })
//     } catch (error) {
//         console.log(error);
//     }
// }
export { getCuisines, addCuisine, deleteCuisine, editCuisine, addCity, getCities, deleteCity, editCity, };
