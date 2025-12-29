import asyncHandler = require("express-async-handler");
import type { Request,Response,NextFunction } from 'express';
import jwt,{ JwtPayload } from "jsonwebtoken";

export const protect = asyncHandler(async(req:Request,res:Response,next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        res.status(401).json({message:"Not authorized , no token"})
        return 
    }
    const token = authHeader.split(" ")[1]
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET!) as JwtPayload & {id:string}
        req.user = decoded.id 
        next()
    }catch{
        res.status(401).json({message:"Not authorized , token failed"})
    }
})