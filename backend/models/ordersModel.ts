import mongoose, { Document, Schema } from "mongoose";
export interface IAddress {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string;
    postal_code?: string;
    state?: string;
}
export interface IOrderItem {
    productId:mongoose.Types.ObjectId,
    productName:string,
    price:number,
    sellerId:mongoose.Types.ObjectId,
    stripeAccountId:string,

}
export interface IOrder extends Document{
    buyer : mongoose.Types.ObjectId,
    items:IOrderItem[]
    totalAmount:number,
    stripeSessionId:string,
    status:"pending" | "paid" | "failed"
    shippingAddress?: IAddress;
    billingAddress?: IAddress;
    customerEmail?: string;
}
const orderItemSchema = new Schema<IOrderItem>({
    productId:{type:Schema.Types.ObjectId,ref:"Product",required:true},
    productName:{type:String,required:true},
    price:{type:Number,required:true},
    sellerId:{type:Schema.Types.ObjectId,ref:"User",required:true},
    stripeAccountId:{type:String,required:true}
},
{
    _id:false
})

const orderSchema = new Schema<IOrder>({
    buyer : {type:Schema.Types.ObjectId,ref:"User",required:true},
    items:[orderItemSchema] ,
    totalAmount:{type:Number,required:true},
    stripeSessionId:{type:String,required:true},
    status:{type:String,enum:["pending","paid","failed"],default:"pending"},
     shippingAddress: {
        city: String,
        country: String,
        line1: String,
        line2: String,
        postal_code: String,
        state: String
    },
    billingAddress: {
        city: String,
        country: String,
        line1: String,
        line2: String,
        postal_code: String,
        state: String
    },
    customerEmail: String


},
{
    timestamps:true
}
)

export default mongoose.model<IOrder>("Order",orderSchema)