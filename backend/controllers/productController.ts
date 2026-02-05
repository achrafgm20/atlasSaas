import asyncHandler from "express-async-handler";
import type { Request,Response } from "express";
import User from "../models/userModel";
import Product from "../models/productModel"
import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";
import mongoose from "mongoose";
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
    let images: { url: string; public_id: string }[] = [];

  const files = req.files as Express.Multer.File[];

   if (files && files.length > 0) {
    for (const file of files) {
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result!);
          }
        );
        stream.end(file.buffer); // send buffer
      });

      images.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
  }

    const sellerId = req.user as string
    // const sellerId = (req.user as any)._id || (req.user as any).id;

    const sellerExist = await User.findById(sellerId)
    if(!sellerExist || sellerExist.role !== "Seller"){
        res.status(403).json({message:"Only sellers can create product"})
        return
    }
    const product = await Product.create({productName,battery,category,color,condition,costPrice,listingPrice,description,status,storage,seller: sellerId,images})
    res.status(201).json(product)
})


export const getSellersProducts = asyncHandler(async(req:Request,res:Response) => {
    console.log(req.user);

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

    const products = await Product.find({seller:sellerId,status:"Active"}).sort({createdAt:-1}).skip(skip).limit(limit)
    res.status(200).json({
        products,
        pagination:{
            totalProducts,
            currentPage:page,
            totalPages:Math.ceil(totalProducts / limit),
            limit
        }})
})



export const getAllProducts = asyncHandler(async(req:Request,res:Response) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1)*limit
        const products = await Product.find({status:"Active"}).populate({path:"seller",select:"name"}).skip(skip).limit(limit).sort({createdAt: -1})
        const totalProduct = await Product.countDocuments({status:"Active"})
        const totalPages = Math.ceil(totalProduct / limit)
        res.status(200).json({
            products,
            pagination:{
                currentPage:page,
                totalPages,
                limit
            }})
    }catch(err:any){
        console.error("Err fetching products ",err)
        res.status(500).json({message:"server Error",error:err.message})
    }
})


// export const getAllBrands = asyncHandler(async(req:Request,res:Response) => {
//     const brands = await Product.distinct("brand")
//     res.status(200).json({brands})
// })

export const filterProductSeller = asyncHandler(async(req:Request,res:Response) => {
    const sellerId = req.user as string
    const sellerExist = await User.findById(sellerId)
    if(!sellerExist || sellerExist.role !== "Seller"){
        res.status(403).json({message:"Only sellers can create product"})
        return
    }
    try {
        const {keyword,category,minPrice,maxPrice} = req.query 
        let filter:any = {status:"Active",seller:sellerId}
        if(keyword){
            filter.$or=[
               {productName : {$regex:keyword as string,$options:"i"}},
               {category : {$regex:keyword as string,$options:"i"}}
            ]
            
        }   
        if(category){
            filter.category = {$regex:category as string ,$options:"i"}
        }
        if(minPrice || maxPrice){
            filter.listingPrice = {}
            if(minPrice){
                filter.listingPrice.$gte= Number(minPrice)
            }
            if(maxPrice){
                filter.listingPrice.$lte = Number(maxPrice)
            }
        }
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page -1)*limit
        let products = await Product.find(filter).populate({path:"seller",select:"name"}).sort({createdAt:-1}).skip(skip).limit(limit)
        const totalProducts = await Product.countDocuments(filter)
        const totalPages = Math.ceil(totalProducts / limit)

        res.status(200).json({products,pagination:{
            currentPage:page,
            totalPages,
            limit
        }})


    }catch(error){
        console.error("Err fetching products ",error)
        res.status(400).json({message:"Err fetching products"})
    }
})


export const filterProductClient = asyncHandler(async(req:Request,res:Response) =>{
    try{
        const {keyword,category,model,grade,storage,color} = req.query
        let filter:any = {status:"Active"} 
        if(keyword){
            filter.$or = [
                {productName:{$regex:keyword as string,$options:"i"}},
                {category:{$regex:keyword as string,$options:"i"}}
            ]
        }
        if (category) {
            filter.category = {$regex:category as string, $options: "i" };
        }
        if(model){
            filter.productName = {$regex:model as string , $options:"i"}
        }
        if(grade){
            filter.condition = {$regex:grade as string , $options:"i"}
        }
        if(storage){
            filter.storage = {$regex:storage as string , $options:"i"}
        }
        if(color){
            filter.color = {$regex:color as string , $options:"i"}
        }
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page -1)*limit
        let products = await Product.find(filter).sort({createdAt:-1}).skip(skip).limit(limit)
        const totalProducts = await Product.countDocuments(filter)
        const totalPages = Math.ceil(totalProducts / limit)
        res.status(200).json({products,pagination:{
            currentPage:page,
            totalPages,
            limit
        }})
    }catch(error){
        console.error("Err fetching products ",error)
        res.status(400).json({message:"Err fetching products"})
    }
})



export const deleteProduct = asyncHandler(async (req:Request,res:Response):Promise<void>=> {
    try {
        const {id} = req.params
        const product = await Product.findById(id)
        if(!product){
         res.status(404).json({message:"can not find this product"})
         return 
        }
        if(product.images && product.images.length > 0){
            for(let i = 0 ; i < product.images.length ; i++){
                try{
                    await cloudinary.uploader.destroy(product.images[i].public_id)
                }catch(err){  
                    console.error(`failde to delete image ${product.images[i].public_id}`,err);
            }
            }
        } {
        }
        await Product.findByIdAndDelete(id)
        res.status(200).json({product,message:"product deleted succesfully with related images"})

    }catch(err){
        res.status(400).json({message:"err deleting product"})
        console.error("error deleting product",err);
    }
})



export const editProduct = asyncHandler(async(req:Request,res:Response) => {
    try{
        const {id} = req.params
        const {productName,battery,category,color,condition,costPrice,description,listingPrice,status,storage} = req.body
        const product = await Product.findById(id)
        if(!product){
            res.status(404).json({message:"product not found "})
            return 
        }
        const sellerId = req.user as string 
        const sellerExist = await User.findById(sellerId)
        if(!sellerExist || sellerExist.role !== "Seller"){
            res.status(403).json({message:"Only seller with this product can edit this product"})
            return 
        }
        if (productName) product.productName = productName;
        if (battery) product.battery = battery;
        if (category) product.category = category;
        if (color) product.color = color;
        if (condition) product.condition = condition;
        if (costPrice) product.costPrice = costPrice;
        if (description) product.description = description;
        if (listingPrice) product.listingPrice = listingPrice;
        if (status) product.status = status;
        if (storage) product.storage = storage;
        await product.save()
        res.status(200).json({product,message:"product edit successfully"})
    }catch(err:any){
        console.error("failed editing product ",err.message);
        res.status(404).json({message:"failed editing product",error:err.message})
        
    }
})


export const replaceImage = asyncHandler(async(req:Request,res:Response) => {
    try{
        const {productId,imageId} = req.params
        const file = req.file as Express.Multer.File
        const product = await Product.findById(productId)
        if(!product){
            res.status(404).json({message:"Product is not foundd"})
            return
        }
        const sellerId = req.user as string 
        const sellerExist = await User.findById(sellerId)
        if(!sellerExist || sellerExist.role !== "Seller"){
            res.status(403).json({message:"Only seller with this product can edit image of this product"})
            return 
        }
        const imageIndex = product.images.findIndex((img:any)=>  img._id.toString() === imageId)
        
        if(imageIndex === -1){
            res.status(404).json({message:"Image not foundd"})
            return
        }
        //delete image
        await cloudinary.uploader.destroy(product.images[imageIndex].public_id)
        //uplaod new Image
        const uploadResult:UploadApiResponse = await new Promise((resolve,reject) => {
            const stream = cloudinary.uploader.upload_stream({folder:"products"},(err,resulat) => {
                if(err) reject(err)
                else resolve(resulat!)
            })
            stream.end(file.buffer)
        })
        //replace image in arr 
        product.images[imageIndex] = {
            url:uploadResult.secure_url,
            public_id:uploadResult.public_id
        }
        await product.save()
        res.status(200).json({message:"image replaced successfuly",product})

    } catch(err){
        res.status(404).json({message:"error while editing image api ",err})
        
    }
}) 

export const detailsProduct = asyncHandler(async(req:Request,res:Response) => {
    try {
        const {id} = req.params
        const product = await Product.findById(id).populate({path:"seller",select:"name _id"})
        res.status(200).json(product)
    }catch(err){
        console.error("failde fetched this product details");
        res.status(404).json({message:"failde fetched this product details"})
        
    }
    
    
})


export const productSellersDetails = asyncHandler(async(req:Request,res:Response) => {
    try {
        const {productId} = req.params
        const product = await Product.findOne({_id:productId}).populate("seller","-password")
        console.log(productId)
        if(!product){
            res.status(400).json({message:"product is not found"})
        }

        res.status(200).json(product?.seller)
    }catch(err){
        res.status(404).json({message:"errer getting seller details"})
        console.log("errer getting details seller")
    }
})