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



export const getAllProducts = asyncHandler(async(req:Request,res:Response) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1)*limit
        const products = await Product.find({status:"Active"}).skip(skip).limit(limit).sort({createdAt: -1})
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
        let filter:any = {status:"Active"}
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