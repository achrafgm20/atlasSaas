import { Request,Response } from 'express';
import Product from "../models/productModel"
import asyncHandler  from 'express-async-handler';
import Discussion from '../models/discussion';
import User from "../models/userModel"
import Message from '../models/message';
import mongoose from 'mongoose';
export const getCreatedDiscussion = asyncHandler(async(req:Request,res:Response) => {
    const userId = req.user
     if (!userId) {
  res.status(401).json({ message: "User not authenticated" });
  return;
}
    const user = await User.findById(userId)
   if (!user) {
  res.status(404).json({ message: "User not found" });
  return;
}

    const userRole = user.role;

    const product = await Product.findById(req.params.id)
    if(!product){
        res.status(404).json({message:"product is not fount"})
        return
    }
    console.log(product._id);
    
    let discussion = await Discussion.findOne({product:product._id})
    if(!discussion){
        discussion = await Discussion.create({
            product:product._id,
            seller:product.seller as mongoose.Types.ObjectId,
            buyers:[]
        })
    }
    //const userObjectId = new mongoose.Types.ObjectId(userId)
    if(userRole == "Buyer"){
        // if(!discussion.buyers.includes(userObjectId)){
        //     discussion.buyers.push(userObjectId)
        //     await discussion.save()
        // }
        const exist = discussion.buyers.some((id) => id.toString() == userId)
        if(!exist){
            discussion.buyers.push(new mongoose.Types.ObjectId(userId))
            await discussion.save()
        }
    }
    if(userRole == "Seller"){
        if(product.seller.toString() !== userId){
            res.status(403).json({message:"not your product "})
            return
        }
    }
    res.status(200).json({message:"u are in this discussion",discussion})

})


// export const getMessage = asyncHandler(async(req:Request,res:Response) => {
//     const getMessage = await Message.find({
//         discussion:req.params.discussionId
//     }).populate("sender","name")
//     res.json(getMessage)
// })
export const getMessage = asyncHandler(async(req:Request,res:Response) => {
    const messages = await Message.find({
        discussion: req.params.discussionId
    })
    .populate("sender", "name _id") // Add _id to populated fields
    .sort({ createdAt: 1 }); // Sort by creation time
    
    res.json(messages);
})