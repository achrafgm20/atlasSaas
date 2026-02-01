import { Request,Response } from 'express';
import  asyncHandler  from 'express-async-handler';
import User from '../models/userModel';
import Order from '../models/ordersModel';
import dotenv = require("dotenv")
dotenv.config()
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

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
        const orderPayementDetails = await Promise.all(orders.map(async (or) => {
            let paymenetDetails = null
            if(or.stripePayementIntentIdf){
                try{
                    console.log("feching payement intent",or.stripePayementIntentIdf)
                    const paymentIntent = await stripe.paymentIntents.retrieve(or.stripePayementIntentIdf,{expand:["latest_charge"]})
                    const charge = paymentIntent.latest_charge as Stripe.Charge
                    console.log("this is charge",charge.id)

                    if(charge){
                        paymenetDetails = {
                        transactionId:charge.id,
                        paymenetIntentId:paymentIntent.id,
                        amount:paymentIntent.amount / 100,
                        paymenetStatus:paymentIntent.status,
                        paymenetDate:new Date(charge.created * 1000),
                        creditCard: {
                            last4: charge.payment_method_details?.card?.last4,
                            brand: charge.payment_method_details?.card?.brand,
                            expMonth: charge.payment_method_details?.card?.exp_month,
                            expYear: charge.payment_method_details?.card?.exp_year,
                            fingerprint: charge.payment_method_details?.card?.fingerprint,
                        },
                    }
                    console.log(paymenetDetails)
                    }else {
                        console.log("no chnage found in pyement intent")
                    }
                    
                }catch(err){
                    console.error("error failting stripe payement ",err)
                }
            }
            return {...or.toObject(),paymenetDetails}

        }))
        res.status(200).json({
            orders:orderPayementDetails

        })
    }catch(err){
        res.status(404).json({message:"err while ferching buyers order"})
        console.error(err)
    }
})


export const getDetailsOrderSeller = asyncHandler(async(req:Request,res:Response)=> {
    try {
        const sellerId = req.user as string
        const sellerExist = await User.findById(sellerId)
        if(!sellerExist || sellerExist.role !== "Seller"){
            res.status(403).json({message:"this seller is not exist"})
            return
        }
        const {orderId} = req.params
        const orders = await Order.findById(orderId)
                .populate({path:"items.productId",select:"images"})
        res.status(200).json({orders})
        return 

    }catch(err){
        console.error("error fetching details order",err)
        res.status(404).json({message:"err while ferching details order",err})
    }
})