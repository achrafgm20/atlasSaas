import asyncHandler from 'express-async-handler';
import User from "../models/userModel";
import Product, { IProduct } from "../models/productModel"
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
        cart = new Cart({user:clientId,products:[]})
     
    }
    const existingProduct = cart.products.find(
        (p) => (p.product as any)._id.toString() === productId
    )
    if(existingProduct){
        res.status(400).json({message:"product is alredy in cart"})
        return 
    }
    cart.products.push({product:productId})
    

    await cart.save()
    const cartObject = cart.toObject()
    res.status(200).json({message:"product added to cart",cart:cartObject})
})


export const getCart = asyncHandler(async(req:Request,res:Response) => {
    const clientId = req.user 
    const clientExist = await User.findById(clientId)
    if(!clientExist || clientExist.role !== "Buyer"){
        res.status(404).json({message:"can t find this client"})
        return
    }
    
    let cart = await Cart.findOne({user:clientId}).populate({path:"products.product",select:"productName storage color condition listingPrice images seller",populate:{path:"seller",select:"name"}})
    if(!cart){
        res.status(404).json({message:"cart is empty ",cart:null})
        return
    }
    const total = cart.products.reduce((sum, p) => {
    const product = p.product as IProduct;
    return sum + product.listingPrice;
    }, 0);



    // console.log(total)
    // console.log(cart.products);
    res.status(200).json({cart,total})
})


export const deleteProductCart = asyncHandler(async(req:Request,res:Response) => {
    const clientId = req.user  as string
    let productId= req.params.productId  as string
    const clientExist = await User.findById(clientId)
    if(!clientExist || clientExist.role !== "Buyer"){
        res.status(404).json({message:"can t find this client"})
        return
    }
    let cart = await Cart.findOne({user:clientId})
    if(!cart){
        res.status(404).json({message:"cart is empty ",cart:null})
        return
    }
    // console.log(productId);
    
    // console.log(cart.products[0].product.toString());
    
    let productExist = cart.products.findIndex((p) => p.product.toString() == productId)
    if(productExist == -1){
        res.status(404).json({message:"product in not fount ",cart})
        return
    }
    cart.products.splice(productExist,1)
    await cart.save()
    const newCart = await Cart.findById(cart._id).populate( "products.product","listingPrice productName images")
    res.status(200).json({message:"product deleted succufully ",cart:newCart})
 
})


export const clearCart = asyncHandler(async(req:Request,res:Response) => {
    const clientId = req.user  as string
    const clientExist = await User.findById(clientId)
    if(!clientExist || clientExist.role !== "Buyer"){
        res.status(404).json({message:"can t find this client"})
        return
    }
    let cart = await Cart.findOne({user:clientId})
    if(!cart){
        res.status(404).json({message:"cart is empty  ",cart:null})
        return
    }
    cart.products.splice(0,cart.products.length)
    await cart.save()
    res.status(200).json({message:"cart cleared products sucuffully"})
})