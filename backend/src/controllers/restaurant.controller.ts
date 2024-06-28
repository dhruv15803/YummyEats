import { Request, Response } from "express"
import { User } from "../models/users.model.js";
import { Restaurant } from "../models/restaurants.model.js";
import { getCloudinaryUrl } from "../utils/getCloudinaryUrl.js";
import fs from 'fs'

const getMyRestaurants  = async (req:Request,res:Response) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if(!user) {
            res.status(400).json({
                "success":false,
                "message":"invalid user id"
            })
            return;
        }
        const restaurants = await Restaurant.find({restaurantOwner:user._id}).populate('cityId').populate('restaurantCuisines');
        res.status(200).json({
            "success":true,
            restaurants,
        })
    } catch (error) {
        console.log(error);
    }
}


const getFileUrl = async (req:Request,res:Response) => {
    try {
        if(!req.file) {
            res.status(400).json({
                "success":false,
                "message":"no file available"
            })
            return;
        }
        const localFilePath = req.file?.path;
        const url = await getCloudinaryUrl(localFilePath);
        res.status(200).json({
            "success":true,
            url,
        })
        fs.unlinkSync(localFilePath);
    } catch (error) {
        console.log(error);
    }
}

export {
    getMyRestaurants,
    getFileUrl,
}