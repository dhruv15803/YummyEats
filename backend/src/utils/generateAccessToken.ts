import { Response } from 'express';
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

const generateAccessToken = (id:Types.ObjectId,res:Response) => {
    const token = jwt.sign({
        "id":id
    },process.env.JWT_SECRET as string);
    res.cookie('accessToken',token,{
        httpOnly:true,
        expires:new Date(Date.now() + 1000*60*60*24),
        secure:process.env.NODE_ENV==="production",
        sameSite:process.env.NODE_ENV==="production" ? 'none' : 'strict',
    })
}

export {
    generateAccessToken,
}