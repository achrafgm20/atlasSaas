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
        const notifications = await Notification.find({user:sellerId}).sort({ createdAt: -1 })
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


export const viewDetails = asyncHandler(async(req:Request,res:Response) => {
    const {id} = req.params
    const userId = req.user 
    const sellerExist = await User.findById(userId)
    if(!sellerExist){
        res.status(404).json("seller not found")
    }
    const notification = await Notification.findOne({_id:id,user:userId})
    if(!notification){
        res.status(404).json("can t find notification ")
        return
    }
    notification.isRead = true
    notification.save()
    const redirect = notification.type === "order" ? {to : "orders-details",orderId:notification.targetId} : {to:"product-chat",productId:notification.targetId,conversationId:notification.conversationId}
    res.status(200).json({message:"notofication marked as readadaaadad ",redirect})
})




export const nbrPendingMessage = asyncHandler(async(req:Request,res:Response) => {
    try {
        const sellerId = req.user 
        const seller = await User.findById(sellerId)
        if(!seller){
            res.status(400).json({message:"seller of this notification not found "})
            return
        }
        const nbrPendingMessage = await Notification.find({user:seller,isRead:false}).countDocuments()
        res.status(200).json(nbrPendingMessage)
    }catch(err){
        res.status(404).json({message:"can t get number of pending messages",err})
        console.error(err);
        
    }
})