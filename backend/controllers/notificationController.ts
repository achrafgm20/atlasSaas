import { Response } from 'express';
import { Request } from 'express';
import  asyncHandler  from 'express-async-handler';
import User from '../models/userModel';
import Notification from '../models/notificationModel';
export const getAllNotification = asyncHandler(async(req:Request,res:Response) => {
    try {
        const sellerId = req.user
        const sellerExist = await User.findById(sellerId)
        if(!sellerExist || sellerExist.role != "Seller"){
            res.status(403).json({message:"seller is not found"})
            return
        }
        const notifications = await Notification.find({user:sellerId,isRead:false}).sort({ createdAt: -1 })
        res.status(200).json({message:"get your notification succufully  ",notifications})
    }catch(err){
        res.status(404).json({message:"error fetching notifications",err})
        console.error(err)
    }
})

export const markNotificationAsRead = asyncHandler(async(req:Request,res:Response) => {
    try{
        const userId = req.user 
        const {id} = req.params
        const not = await Notification.findOneAndUpdate({_id:id,user:userId},{isRead:true},{new:true})
        if(!not){
            res.status(404).json({message:"notification not found"})
            return 
        }
        res.status(200).json({message:"notification marked as read ",not})
    }catch(err){
        res.status(404).json({message:"error marking notification as read",err})
        console.error(err)
    }
})