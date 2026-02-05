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

            { $match: {$and :[
                {$or:[
                {"items.sellerId": new mongoose.Types.ObjectId(sellerId) },
                {"items.sellerId":sellerId}
             ]},
            {status:"paid"}
            ]
            } },
            {$group:{
                _id:{$month:"$createdAt"},
                totalRevenue : {$sum:"$totalAmount"},
                totalOrder:{$sum:1}

            }},{
                $sort:{"_id": 1}
            }
        ])

        const statsMap = new Map()
        stats.forEach(stat => {
            statsMap.set(
                stat._id,{
                revenue:stat.totalRevenue,
                orders:stat.totalOrder
            })
        })
        
        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const result = []
        for(let i = 1 ; i <= 12 ; i++){
            const monthData = statsMap.get(i)
            result.push({
                month:monthNames[i-1],
                revenue:monthData ? monthData.revenue : 0,
                orders:monthData ? monthData.orders : 0,
            })
        }
        
        res.status(200).json(result)

    }catch(err){
        res.status(400).json({message:"error while fetching order trend ",err})
        console.log(err)
    }
})