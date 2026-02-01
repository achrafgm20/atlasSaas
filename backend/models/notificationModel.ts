import mongoose, { Schema, Types ,Document} from "mongoose"

export interface INotifaction extends Document {
    user:Types.ObjectId,
    type:"order"| "message",
    title:string
    body:string
    link?:string 
    isRead:boolean
    
}

const notificationSchema = new Schema<INotifaction>({
    user:{type:Schema.Types.ObjectId,ref:"User",required:true},
    type:{type:String,enum:["order","message"],required:true},
    title:{type:String,required:true},
    body:{type:String,required:true},
    link:{type:String},
    isRead:{type:Boolean,default:false}
},
{
    timestamps:true,
}
)

export default mongoose.model<INotifaction>("Notification",notificationSchema)