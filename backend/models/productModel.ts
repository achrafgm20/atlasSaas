import mongoose, { Document,model,Schema, Types } from "mongoose";

export interface IProduct extends Document {
    productName:string;
    battery?:string;
    category:"Phone"| "Laptop";
    color?:string;
    condition:"Brand New"|"Grade A" | "Grade B" | "Fair";
    costPrice:number;
    description:string;
    images: {
        url: string;
        public_id: string;
    }[];   
    listingPrice:number;
    status:"Active"|"Draft"|"Sold";
    storage?:"64GB"|"128GB"|"256GB"|"512GB"|"1TB";
    seller:Types.ObjectId;
    createdAt: Date;
    updatedAt: Date; 
}

const ProductSchema = new Schema<IProduct> (
    {
        productName:{type:String,required:true,trim:true},
        battery:{type:String},
        category:{type:String,enum:["Phone","Laptop"],required:true},
        color:{type:String},
        condition:{type:String,enum:["Brand New","Grade A","Grade B","Fair"],required:true},
        costPrice:{type:Number,required:true,min:0},
        description:{type:String},
        images:{type:[{url:{type:String,required:true},public_id:{type:String,required:true}}],default:[]},
        listingPrice:{type:Number,required:true,min:0},
        status:{type:String,enum:["Active","Draft","Sold"],default:"Active"},
        storage:{type:String,enum:["64GB","128GB","256GB","512GB","1TB"]},
        seller:{type:Schema.Types.ObjectId,ref:"User",required:true,index:true},
    },
    {timestamps:true}
)

export default mongoose.model<IProduct>("Product",ProductSchema)