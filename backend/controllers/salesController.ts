import { Request,Response } from 'express';
import  asyncHandler from 'express-async-handler';
import User from '../models/userModel';
import Order from '../models/ordersModel';
import mongoose from 'mongoose';
import Product from '../models/productModel';
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
                {"items.sellerId":sellerId},
                {"status":"paid"},
                {"status":"delivered"}
             ]}
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


export const cardsOverview =  asyncHandler(async(req:Request,res:Response) =>{
    try {
        const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear() , now.getMonth(),1)
    const endOfThisMonth = new Date(now.getFullYear(),now.getMonth() + 1 , 0 , 23,59,59)
    const startOfLastMonth = new Date(now.getFullYear(),now.getMonth() -1,1)
    const endOfLastMonth = new Date(now.getFullYear(),now.getMonth(),0,23,59,59)
    const thisMonthStats = await Order.aggregate([
        {$match:{createdAt:{$gte:startOfThisMonth,$lte:endOfThisMonth}}},
        {$group:{
            _id:null,
            totalRevenue:{$sum:"$totalAmount"},
            totalOrders:{$sum:1},
            productsSold:{$sum:{$size:"$items"}}

        }}
    ])
    const lastMonthStats = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfThisMonth, $lte: endOfThisMonth } } },
        {$group:{
            _id:null,
            totalRevenue:{$sum:"$totalAmount"},
            totalOrders:{$sum:1},
            productsSold:{$sum:{$size:"$items"}}

        }}
    ])

    const thisMonth = thisMonthStats[0] || {totalRevenue: 0, totalOrders: 0, productsSold: 0 }
    const lastMonth = lastMonthStats[0] || {totalRevenue: 0, totalOrders: 0, productsSold: 0 }
    const thisAvg = thisMonth.totalOrder ? thisMonth.totalRevenue / thisMonth.totalOrder : 0
    const lastAvg = lastMonth.totalOrder ? lastMonth.totalRevenue / lastMonth.totalOrder : 0
    const calcGrowth = (current:number,preview:number) => {
        if(preview === 0 ) return current === 0 ? 0 : 100
        return ((current - preview) / preview) * 100
    }
    res.status(200).json({
            totalRevenue: {
            value: thisMonth.totalRevenue,
            growth: calcGrowth(thisMonth.totalRevenue, lastMonth.totalRevenue)
        },
            totalOrders: {
            value: thisMonth.totalOrders,
            growth: calcGrowth(thisMonth.totalOrders, lastMonth.totalOrders)
        },
            avgOrderValue: {
            value: thisAvg,
            growth: calcGrowth(thisAvg, lastAvg)
        },
            productsSold: {
            value: thisMonth.productsSold,
            growth: calcGrowth(thisMonth.productsSold, lastMonth.productsSold)
        }
    })
    }catch(err){
        res.status(400).json({message:"error while getting cards salles over view",err})
        console.error(err)
    }
    
})



export const trendMonthAdmin = asyncHandler(async(req:Request,res:Response) => {
    try {
        const stats = await Order.aggregate([
         { $match: 
            {status:"paid"}        
            },
            {$group:{
                _id:{$month:"$createdAt"},
                totalRevenue : {$sum:"$totalAmount"},
            }},{
                $sort:{"_id": 1}
            }
   ] )
    const statsMap = new Map()
        stats.forEach(stat => {
            statsMap.set(
                stat._id,{
                revenue:stat.totalRevenue,
            })
        })

   const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const result = []
        for(let i = 1 ; i <= 12 ; i++){
            const monthData = statsMap.get(i)
            result.push({
                month:monthNames[i-1],
                revenue:monthData ? monthData.revenue : 0,
            })
        }
        
        res.status(200).json(result)
    }catch(err){
        console.error("error fetching trend months for admin")
    }
})


export const trendLastDaysAdmin = asyncHandler(async(req:Request,res:Response) => {
    try {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() -7)

        const orders =await Order.aggregate([
            {$match: {
      $or: [{ status: "paid" }, { status: "delivered" }],
      createdAt: { $gte: sevenDaysAgo }
    }},
            {$group:{
                _id:{
                $dateToString:{format: "%Y-%m-%d" ,date:"$createdAt"}
            },
            totalOrders:{$sum:1},
            totalRevenue:{$sum:"$totalAmount"}
        },

    },
    {$sort:{_id:1}}
        ])
        res.status(200).json(orders)
    }catch(err){
        console.error("error fetching daily trends for admin",err)
    }
})



export const getAdminGains = asyncHandler(async(req:Request,res:Response) => {
    try {
        const adminPercent = 10 
        const stats = await Order.aggregate([
            {$match:{$or:[{"status":"paid"},{"status":"delivered"}]}},
            {$unwind:"$items"}, 
            {$group:{
                _id:null,
                totalPlateFormGain:{
                    $sum:{
                        $multiply:[
                            "$items.price",
                            adminPercent / 100
                        ]
                    }

                }
            }}
        ])
        const totalGain = stats[0]?.totalPlateFormGain || 0
        res.status(200).json({adminPercent,totalPlateFormGain:Math.round(totalGain * 100) / 100})
    }catch(err){
        console.error("errer calculating admin gains",err);
        res.status(404).json({message:"Errer calculing admin gain"})
        
    }
}) 




export const getAdmiCards = asyncHandler(async(req:Request,res:Response) => {
    try {
        const totalUsers = await User.countDocuments()
        const totalVenders = await User.countDocuments({role:"Seller"})
        //change to status = "paid"
        const totalOrders = await Order.countDocuments()
        const totalProducts = await Product.countDocuments()
        const revenueResult = await Order.aggregate([
            //change this line 
            {$match:{status:"paid"}},
            {$group:{
                _id:null,
                total:{$sum:"$totalAmount"}
            }}
        ])
        const totalRevenue = revenueResult[0]?.total || 0
        res.status(200).json({totalUsers,totalOrders,totalVenders,totalProducts,totalRevenue})
    }catch(err){
        res.status(404).json({message:"failed to load card dahsboard admin",err})
        console.error(err)
    }
})


