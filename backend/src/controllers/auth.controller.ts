import { Request, Response } from "express"
import { User } from "../models/users.model.js";
import bcrypt from 'bcrypt'
import { generateAccessToken } from "../utils/generateAccessToken.js";

const registerUser = async (req:Request,res:Response) => {
    try {
        const {email,firstName,lastName,password} = req.body;
        if(email.trim()==="" || firstName.trim()==="" || lastName.trim()==="" || password.trim()==="") {
            return res.status(400).json({
                "success":false,
                "message":"please enter all fields"
            })
        }
        // check if user with email already exists
        const user = await User.findOne({email:email.trim().toLowerCase()});
        if(user) {
            return res.status(400).json({
                "success":false,
                "message":"user already exists"
            })
        }
        let isAdmin = false;
        // check if admin
        if(email.trim().toLowerCase()===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD) {
            isAdmin=true;
        }
        // hashing password
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await User.create({email:email.trim().toLowerCase(),firstName:firstName,lastName:lastName,isAdmin:isAdmin,password:hashedPassword});
        generateAccessToken(newUser._id,res);
        res.status(201).json({
            "success":true,
            "message":"user registered successfully",
            newUser,
        })
    } catch (error) {
        console.log(error);
    }
}

const loginUser = async (req:Request,res:Response) => {
    try {
        const {email,password} = req.body;
        if(email.trim()==="" || password.trim()==="") {
            res.status(400).json({
                "success":false,
                "message":"please enter all fields"
            })
            return;
        }
        // check if email in db
        const user = await User.findOne({email:email.trim().toLowerCase()});
        if(!user) {
            res.status(400).json({
                "success":false,
                "message":"Check email address and password"
            })
            return;
        }
        const dbPassword = user.password;
        const isPasswordCorrect = await bcrypt.compare(password,dbPassword);
        if(!isPasswordCorrect) {
            res.status(400).json({
                "success":false,
                "message":"Check email address and password"
            })
            return;
        }
        generateAccessToken(user._id,res);
        res.status(200).json({
            "success":true,
            "message":"user logged in",
            user,
        })
    } catch (error) {
        console.log(error);
    }
}

const logoutUser = async (req:Request,res:Response) => {
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
        res.clearCookie('accessToken').status(200).json({
            "success":true,
            "message":"successfully logged out"
        });
    } catch (error) {
        console.log(error);
    }
}


const getLoggedInUser = async (req:Request,res:Response) => {
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
        res.status(200).json({
            "success":true,
            user,
        })
    } catch (error) {
        console.log(error);
    }
}

export {
    registerUser,
    loginUser,
    getLoggedInUser,
    logoutUser,
}