import type { Request,Response } from 'express';
import asyncHandler = require("express-async-handler");
import User, { IUser } from "../models/userModel"
import bcrypt = require("bcrypt");
import jwt = require("jsonwebtoken");
// function register 
export const registerUser = asyncHandler(async (req:Request,res:Response) => {
    const {name,email,password,role,statutCompte} = req.body 
    if(!name  || !email || !password || !role ) {
        res.status(400).json("remplir tous les champs")
        return 
    }
    const userExist = await User.findOne({email})
    if(userExist) {
        res.status(400).json("user has alredy exist ")
        return 
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    const user = await User.create({
        name,email,password:hashedPassword,role,statutCompte
    })

    if(user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      statutCompte: user.statutCompte,
      token: generateToken(user._id?.toString() as string)
    })    }

})


// function generate jwt 
const generateToken = (id:string):string => {
    return jwt.sign({id},process.env.JWT_SECRET as string, {expiresIn : '30d'})
}

// function login 
export const loginUser = asyncHandler (async (req:Request,res:Response) => {
    const {email,password} = req.body 
    const user = await User.findOne({email})
    if(user && user.password && (await bcrypt.compare(password,user.password as string))){
        res.json({
            _id : user._id ,
            name : user.name ,
            email:user.email ,
            role:user.role ,
            statutCompte : user.statutCompte,
            // token : generateToken(user._id.toString()) 
            token: generateToken(String(user._id))
        })
    }else {
        res.status(400).json({ message: 'Invalid login ' });
        return 
    }
})


// function retourne me 
export const getMe = asyncHandler(async (req:Request,res:Response) => {
        if(!req.user){
             res.status(400).json({message:"user id missing from request "})
             return 
        }
        const user:IUser | null = await User.findById(req.user).select("-password")
        if(!user){
            res.status(404).json({message:"user not found"})
            return
        }
        res.status(200).json(user)
})


