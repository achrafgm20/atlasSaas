import { Request,Response } from 'express';
import  asyncHandler from 'express-async-handler';
import User from '../models/userModel';
import Order from '../models/ordersModel';
import mongoose from 'mongoose';
export const Trend = asyncHandler(async(req:Request,res:Response) => {
    try {
        const sellerId = req.user  as string
        const sellerExist = await User.findById(sellerId)
        if(!sellerExist){
            res.status(400).json("seller not found ")
        }
        const stats = await Order.aggregate([

            { $match: { "items.sellerId": new mongoose.Types.ObjectId(sellerId) } },
            {$group:{
                _id:{$month:"$createdAt"},
                totalRevenue : {$sum:"$totalAmount"},
                totalOrder:{$sum:1}

            }},{
                $sort:{" _id": 1}
            }
        ])
        console.log(stats)
        
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        
        const result =stats.map((itm) => ({
            month:monthNames[itm._id -1],
            revenue : itm.totalRevenue,
            orders:itm.totalOrder
        }))
        res.status(200).json(result)

    }catch(err){
        res.status(400).json({message:"error while fetching order trend ",err})
        console.log(err)
    }
})