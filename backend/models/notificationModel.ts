import mongoose, { Schema, Types ,Document} from "mongoose"

export interface INotifaction extends Document {
    user:Types.ObjectId,
    type:"order"| "message",
    title:string
    body:string
    isRead:boolean
    targetType:"product" | "order"
    targetId:Types.ObjectId
    conversationId?:Types.ObjectId
    
}

const notificationSchema = new Schema<INotifaction>({
    user:{type:Schema.Types.ObjectId,ref:"User",required:true},
    type:{type:String,enum:["order","message"],required:true},
    title:{type:String,required:true},
    body:{type:String,required:true},
    isRead:{type:Boolean,default:false},
    targetType:{type:String,enum:["product","order"]},
    targetId:{type:Schema.Types.ObjectId},
    conversationId:{type:Schema.Types.ObjectId,required:false}
},
{
    timestamps:true,
}
)

export default mongoose.model<INotifaction>("Notification",notificationSchema)