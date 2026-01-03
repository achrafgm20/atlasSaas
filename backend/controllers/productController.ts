import asyncHandler from "express-async-handler";
import type { Request,Response } from "express";
import User from "../models/userModel";
import Product from "../models/productModel"
export const addProduct = asyncHandler(async(req:Request,res:Response)=> {
    const {productName,battery,category,color,condition,costPrice,description,listingPrice,status,storage} = req.body
    if(!productName || !category || !condition || !costPrice || !listingPrice){
        res.status(400).json("product name , category , condition , cost price , listing price are required")
        return 
    }
    if (!costPrice || !listingPrice || isNaN(costPrice) || isNaN(listingPrice)) {
    res.status(400).json({ message: "Cost price and listing price must be numbers" });
    return;
    }

    //handle image upload
    let imgsArray:{url:string,publicId:string}[] = [] 
    const files = req.files as Express.Multer.File[] | undefined
    if(files && files.length > 0){
        imgsArray = files.map((file:Express.Multer.File) => ({
            url:`/uploads/${file.filename}`,
            publicId:file.filename
        }))
    }
    // console.log("req.files:", req.files);


    const sellerId = req.user as string
    // const sellerId = (req.user as any)._id || (req.user as any).id;

    const sellerExist = await User.findById(sellerId)
    if(!sellerExist || sellerExist.role !== "Seller"){
        res.status(403).json({message:"Only sellers can create product"})
        return
    }
    const product = await Product.create({productName,battery,category,color,condition,costPrice,listingPrice,description,status,storage,seller: sellerId,images: imgsArray})
    res.status(201).json(product)
})


export const getSellersProducts = asyncHandler(async(req:Request,res:Response) => {
    const sellerId = req.user as string 
    const sellerExist = await User.findById(sellerId)
    if(!sellerExist || sellerExist.role !== "Seller"){
        res.status(403).json({message:"this seller is not exist"})
        return
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1)*limit
    const totalProducts = await Product.countDocuments({seller:sellerId})

    const products = await Product.find({seller:sellerId}).sort({createdAt:-1}).skip(skip).limit(limit)
    res.status(200).json({
        products,
        pagination:{
            totalProducts,
            currentPage:page,
            totalPages:Math.ceil(totalProducts / limit),
            limit
        }})
})