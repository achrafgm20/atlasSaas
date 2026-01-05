import asyncHandler from 'express-async-handler';
import User from "../models/userModel";
import Product from "../models/productModel"
import Cart from "../models/cartModel"
import { Request,Response } from 'express';
export const addCart = asyncHandler(async(req:Request,res:Response)=> {
    const clientId = req.user as string
    const clientExist = await User.findById(clientId)
    if(!clientExist || clientExist.role !== "Buyer"){
        res.status(404).json({message:"only client can add to cart "})
        return 
    }
    const {productId} = req.body
    const product = await Product.findById(productId)
    if(!product){
        res.status(404).json({message:"product is not found "})
        return 
    }
    let cart = await Cart.findOne({user:clientId}).populate("products.product", "listingPrice productName images");
    if (!cart) {
     res.status(200).json({ cart: null, total: 0 });
     return
    }
    const existingProduct = cart.products.find(
        (p) => (p.product as any)._id.toString() === productId
    )
    if(existingProduct){
        res.status(400).json({message:"product is alredy in cart"})
        return 
    }
    cart.products.push({product:productId})
    const total = cart.products.reduce((sum, item) => {
    const price = (item.product as any)?.listingPrice ?? 0;
    return sum + price;
    }, 0);

    await cart.save()
    res.status(200).json({message:"product added to cart",cart,total})
})


export const getCart = asyncHandler(async(req:Request,res:Response) => {
    const clientId = req.user 
    const clientExist = await User.findById(clientId)
    if(!clientExist || clientExist.role !== "Buyer"){
        res.status(404).json({message:"can t find this client"})
        return
    }
    
    let cart = await Cart.findOne({user:clientId}).populate({path:"products.product",select:"productName storage color condition listingPrice images"})
    if(!cart){
        res.status(404).json({message:"cart is empty ",cart:null})
        return
    }
    const total = cart.products.reduce((sum, item) => {
    const price = (item.product as any)?.listingPrice ?? 0;
  return sum + price;
}, 0);
    res.status(200).json({cart})

})