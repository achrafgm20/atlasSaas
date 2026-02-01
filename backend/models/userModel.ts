import mongoose, { Document, Schema } from "mongoose";
export interface IUser extends Document {
    name:string
    email:string
    password:string
    role:"Seller"|"Buyer"|"admin"
    statutCompte:Boolean,
    stripeAccountId?: string;
    stripeOnboardingUrl?:string;
    stripeOnboardingCompleted?:boolean
    stripeDetailsSubmitted?:boolean
    canReceiveTransfers?:boolean
    transfersCapability?:"inactive" | "pending" | "active";
    lastStripeSync?:Date,
    phone:string,
    storeName:string,
    storeDescription:string,
    adresse:string,
    city:string,
    postalCode:string,
    Country:string
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
        },
        stripeAccountId: { type: String, required: false },
        stripeOnboardingUrl: { type: String },
        stripeOnboardingCompleted: { type: Boolean, default: false },
        stripeDetailsSubmitted: { type: Boolean, default: false },
        canReceiveTransfers: { type: Boolean, default: false },
        transfersCapability: { 
            type: String, 
            enum: ["inactive", "pending", "active"],
            default: "inactive"
        },
        lastStripeSync: { type: Date },
        phone:{type:String,required:false},
        storeName:{type:String,required:false},
        storeDescription:{type:String,required:false},
        adresse:{type:String,required:false},
        city:{type:String,required:false},
        postalCode:{type:String,required:false},
        Country:{type:String,required:false},

    },
    {
        timestamps : true 
    }
)
userSchema.pre("save",function(next){
    if(this.role === "Buyer"){
        this.statutCompte = true
    }else if(this.role ==="Seller"){
        this.statutCompte = false
    }
    // next()
})

export default mongoose.model<IUser>("User",userSchema)