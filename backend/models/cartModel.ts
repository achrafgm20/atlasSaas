import mongoose, { Document, Schema, Types } from "mongoose";
import { truncate } from "node:fs";
import { types } from "node:util";
import { IProduct } from "./productModel";


export interface ICartProduct {
    product: Types.ObjectId | IProduct;
}


export interface ICart extends Document {
    user:Types.ObjectId
    products:ICartProduct[]
    createdAt:Date
    updatedAt:Date
}


const CartSchema = new Schema<ICart>({
    user:{type:Schema.Types.ObjectId,ref:"User",required:true,unique:true},
    products:[{product:{type: Schema.Types.ObjectId, ref: "Product", required: true },},],
    },
    {
    timestamps:true
})

export default mongoose.model<ICart>("Cart",CartSchema)