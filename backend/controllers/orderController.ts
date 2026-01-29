import { Request,Response } from 'express';
import  asyncHandler  from 'express-async-handler';
import User from '../models/userModel';
import Order from '../models/ordersModel';
export const getSellerOrders = asyncHandler(async(req:Request,res:Response) =>{
    try {
        const sellerId = req.user as string
        const sellerExist = await User.findById(sellerId)
        if(!sellerExist || sellerExist.role !== "Seller"){
            res.status(403).json({message:"this seller is not exist"})
            return
        }
        const orders = await Order.find({"items.sellerId":sellerId,status:"paid"}).populate({path:"buyer",select:"name"})
        res.status(200).json({
            orders,
            // amount:stripeAccountSeller

        })
    }catch(err){
        res.status(400).json({message:"error while fetchng orders "})
        console.error("error while fetchng orders ",err)
    }
})


export const getAllBuyerOrders = asyncHandler(async(req:Request,res:Response) => {
    try{
        const buyerId= req.user as string
        const buyerExist = await User.findById(buyerId)
        if(!buyerExist || buyerExist.role !== "Buyer"){
            res.status(403).json({message:"this buyer is not exist "})
            return 
        }
        const orders = await Order.find({buyer:buyerId,status:"paid"}).populate({path:"items.sellerId",select:"name email"})
        res.status(200).json({
            orders,
            // creditCart:,
            // transationId:,
            // payementDate:,
            // paymemetStatus:,

        })
    }catch(err){
        res.status(404).json({message:"err while ferching buyers order"})
        console.error(err)
    }
})