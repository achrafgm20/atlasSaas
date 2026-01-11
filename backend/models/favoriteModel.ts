import { IProduct } from './productModel';
import mongoose, { Document, Schema, Types } from "mongoose";
export interface IFavoriteProduct {
    product:Types.ObjectId | IProduct
}

export interface IFavorite extends Document {
    user:Types.ObjectId,
    products:IFavoriteProduct[],
    createdAt:Date
    updatedAt:Date
}

const FavoriteSchema = new Schema<IFavorite>({
    user:{type:Schema.Types.ObjectId,ref:"User",required:true,unique:true},
    products:[{product:{type:Schema.Types.ObjectId,ref:"Product", required: true
}}]
},
{
    timestamps:true
}
)
export default mongoose.model<IFavorite>("Favorite",FavoriteSchema)
