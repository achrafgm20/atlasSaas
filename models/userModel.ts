import mongoose, { Document, Schema } from "mongoose";
export interface IUser extends Document {
    name:string
    email:string
    password:string
    role:"Seller"|"Buyer"|"admin"
    statutCompte:Boolean
}
const userSchema =new  Schema<IUser>(
    {
        name : {
            type : String,
            required : true
        },
        
        email : {
            type:String,
            required : true ,
            unique : true ,
            lowercase : true 
        },
        password : {
            type:String,
            required : true 
        },
        role: {
            type: String,
            enum : ["Seller","Buyer","admin"],
            required : true 
        },
        statutCompte : {
            type:Boolean,
            default: false
        }
    },
    {
        timestamps : true 
    }
)
userSchema.pre("save",function(next){
    if(this.role === "Buyer"){
        this.statutCompte = true
    }else if(this.role ="Seller"){
        this.statutCompte = false
    }
})

export default mongoose.model<IUser>("User",userSchema)