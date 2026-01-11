import { Request,Response } from 'express';
import asyncHandler  from 'express-async-handler';
import User from "../models/userModel"
import Product, { IProduct } from "../models/productModel"
import Favorite from "../models/favoriteModel"
export const addFavorite = asyncHandler(async(req:Request,res:Response)=> {
    const clientId = req.user as string
        const clientExist = await User.findById(clientId)
        if(!clientExist || clientExist.role !== "Buyer"){
            res.status(404).json({message:"only client can add to favorite "})
            return 
        }
        const {productId} = req.body
        const product = await Product.findById(productId)
        if(!product){
            res.status(404).json({message:"product is not found "})
            return 
        }
        let favorite = await Favorite.findOne({user:clientId}).populate("products.product", "listingPrice productName images");
        if (!favorite) {
            favorite = new Favorite({user:clientId,products:[]})
         
        }
        const existingProduct = favorite.products.find(
            (p) => (p.product as any)._id.toString() === productId
        )
        if(existingProduct){
            res.status(400).json({message:"product is alredy in favorite"})
            return 
        }
        favorite.products.push({product:productId})
        
    
        await favorite.save()
        const favoriteObject = favorite.toObject()
        res.status(200).json({message:"product added to favorite",favorite:favoriteObject}) 
})


export const getFavorite = asyncHandler(async(req:Request,res:Response) => {
   const clientId = req.user 
       const clientExist = await User.findById(clientId)
       if(!clientExist || clientExist.role !== "Buyer"){
           res.status(404).json({message:"can t find this client"})
           return
       }
       
       let favorite = await Favorite.findOne({user:clientId}).populate({path:"products.product",select:"productName storage color condition listingPrice images seller",populate:{path:"seller",select:"name"}})
       if(!favorite){
           res.status(404).json({message:"favorite is empty ",favorite:null})
           return
       }
   
       // console.log(total)
       // console.log(favorite.products);
       res.status(200).json({favorite})
})


export const deleteFavorite = asyncHandler(async(req:Request,res:Response) => {
    const clientId = req.user  as string
        let productId= req.params.productId  as string
        const clientExist = await User.findById(clientId)
        if(!clientExist || clientExist.role !== "Buyer"){
            res.status(404).json({message:"can t find this client"})
            return
        }
        let favorite = await Favorite.findOne({user:clientId})
        if(!favorite){
            res.status(404).json({message:"favorite is empty ",favorite:null})
            return
        }
        // console.log(productId);
        
        // console.log(favorite.products[0].product.toString());
        
        let productExist = favorite.products.findIndex((p) => p.product.toString() == productId)
        if(productExist == -1){
            res.status(404).json({message:"product in not fount ",favorite})
            return
        }
        favorite.products.splice(productExist,1)
        await favorite.save()
        const newfavorite = await Favorite.findById(favorite._id).populate( "products.product","listingPrice productName images")
        res.status(200).json({message:"product deleted succufully ",favorite:newfavorite})
})