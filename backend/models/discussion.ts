import { IUser } from './userModel';
import mongoose, { Schema, Types } from "mongoose";
import { Document } from "mongoose";
import { time } from 'node:console';

export interface IDiscussion extends Document{
    product:Types.ObjectId,
    seller:Types.ObjectId,
    buyers:Types.ObjectId[],
}


const discussionSchema = new Schema<IDiscussion>({
    product:{type:Types.ObjectId,ref:"Product",required:true,unique:true},
    seller:{type:Types.ObjectId,ref:"User",required:true},
    buyers:[{type:Types.ObjectId,ref:"User"}],
},
{
    timestamps:true
}
)

export default mongoose.model("Discussion",discussionSchema)