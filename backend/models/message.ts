import mongoose, { Schema, Types } from "mongoose";

export interface IMessage {
    discussion:Types.ObjectId,
    sender:Types.ObjectId,
    content:String,

}

const messageModel = new Schema<IMessage>({
    discussion:{type:Types.ObjectId,ref:"Discussion",required:true},
    sender:{type:Types.ObjectId,ref:"User",required:true},
    content:{type:String,required:true},
},
{
    timestamps:true
}
)

export default mongoose.model("Message",messageModel)