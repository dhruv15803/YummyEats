import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User } from "../models/users.model.js";

declare global {
    namespace Express {
        interface Request {
            userId?:string;
        }
    }
}

const authenticatedUser = async (req:Request,res:Response,next:NextFunction) => {
    if(!req.cookies?.accessToken) {
        res.status(400).json({
            "success":false,
            "message":"no accessToken cookie"
        })
        return;
    }
    const decodedToken = jwt.verify(req.cookies.accessToken,process.env.JWT_SECRET as string) as JwtPayload;
    const userId = decodedToken.id;
    req.userId = userId;
    next();
}

export {
    authenticatedUser,
}