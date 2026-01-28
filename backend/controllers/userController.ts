import type { Request,Response } from 'express';
import asyncHandler = require("express-async-handler");
import User, { IUser } from "../models/userModel"
import bcrypt = require("bcrypt");
import jwt = require("jsonwebtoken");
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
// function register 
export const registerUser = asyncHandler(async (req:Request,res:Response) => {
    const {name,email,password,role,statutCompte} = req.body 
    if(!name  || !email || !password || !role ) {
        res.status(400).json("remplir tous les champs")
        return 
    }
    const userExist = await User.findOne({email})
    if(userExist) {
        res.status(400).json("user has alredy exist ")
        return 
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    const user = await User.create({
        name,email,password:hashedPassword,role,statutCompte
    })
    if(!user){
        res.status(404).json({message:"User creating failed"})
        return
    }
    if(role === "Seller"){
        try{
            const stripeAccount = await stripe.accounts.create({
            type:"express",
            country:"US",
            email:user.email,
            capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true } // ✅ This is what's missing!
    },
    business_type: 'individual'
        })
       
        user.stripeAccountId = stripeAccount.id
        

       const accountLink = await stripe.accountLinks.create({
    account: stripeAccount.id,
    refresh_url: `${process.env.BACKEND_URL}/api/users/seller/onboarding/refresh?userId=${user._id}`, // ✅ Add userId
    return_url: `${process.env.CLIENT_URL}/seller/onboarding/success`,
    type: "account_onboarding",
})
        user.stripeAccountId = stripeAccount.id;
        user.stripeOnboardingUrl = accountLink.url;
        user.stripeOnboardingCompleted = false;
        user.canReceiveTransfers = false;
        user.transfersCapability = "inactive";
        await user.save();
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            statutCompte: user.statutCompte,
            token: generateToken(user._id?.toString() as string),
            stripeAccountId: user.stripeAccountId,
            stripeOnboardingUrl: user.stripeOnboardingUrl,
            stripeOnboardingCompleted: user.stripeOnboardingCompleted,
            canReceiveTransfers: user.canReceiveTransfers,
            transfersCapability: user.transfersCapability
        })
        return
        }catch(err:any){
            console.error("error creating stripe account ",err);
            
        }
        return 
        
    
    
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      statutCompte: user.statutCompte,
      token: generateToken(user._id?.toString() as string),

    })   
    



})


// function generate jwt 
const generateToken = (id:string):string => {
    return jwt.sign({id},process.env.JWT_SECRET as string, {expiresIn : '30d'})
}

// function login 
export const loginUser = asyncHandler (async (req:Request,res:Response) => {
    const {email,password} = req.body 
    const user = await User.findOne({email})
    if(user && user.password && (await bcrypt.compare(password,user.password as string))){
        res.json({
            _id : user._id ,
            name : user.name ,
            email:user.email ,
            role:user.role ,
            statutCompte : user.statutCompte,
            // token : generateToken(user._id.toString()) 
            token: generateToken(String(user._id))
        })
    }else {
        res.status(400).json({ message: 'Invalid login ' });
        return 
    }
})


// function retourne me 
export const getMe = asyncHandler(async (req:Request,res:Response) => {
        if(!req.user){
             res.status(400).json({message:"user id missing from request "})
             return 
        }
        const user:IUser | null = await User.findById(req.user).select("-password")
        if(!user){
            res.status(404).json({message:"user not found"})
            return
        }
        console.log(user)
        res.status(200).json(user)
})






export const checkAllSellersStatus = asyncHandler(async(req: Request, res: Response) => {
    try {
        const sellers = await User.find({ 
            role: "Seller", 
            stripeAccountId: { $exists: true } 
        });
        
        const statuses = [];
        
        for(let seller of sellers) {
            const account = await stripe.accounts.retrieve(seller.stripeAccountId!);
            
            // Update using findByIdAndUpdate to ensure it saves
            await User.findByIdAndUpdate(
                seller._id,
                {
                    $set: {
                        stripeDetailsSubmitted: account.details_submitted,
                        stripeOnboardingCompleted: account.details_submitted,
                        canReceiveTransfers: account.capabilities?.transfers === 'active' && account.details_submitted,
                        transfersCapability: account.capabilities?.transfers || "inactive",
                        lastStripeSync: new Date()
                    }
                },
                { new: true }
            );
            
            statuses.push({
                sellerEmail: seller.email,
                accountId: seller.stripeAccountId,
                onboardingComplete: account.details_submitted,
                transfersActive: account.capabilities?.transfers === 'active',
                canReceiveMoney: account.capabilities?.transfers === 'active' && account.details_submitted
            });
        }
        
        res.status(200).json({ sellers: statuses });
        
    } catch(err: any) {
        res.status(500).json({ error: err.message });
    }
});


export const refreshStripeOnboarding = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.query.userId as string; // ✅ Get from query params, not req.user
    
    if (!userId) {
        res.status(400).json({ message: "User ID missing" });
        return;
    }

    const user = await User.findById(userId);
    
    if (!user?.stripeAccountId) {
        res.status(404).json({ message: "Stripe account not found" });
        return;
    }

    const accountLink = await stripe.accountLinks.create({
        account: user.stripeAccountId,
        refresh_url: `${process.env.BACKEND_URL}/api/users/seller/onboarding/refresh?userId=${userId}`, // ✅ Pass userId again
        return_url: `${process.env.CLIENT_URL}/seller/onboarding/success`,
        type: "account_onboarding",
    });

    // Redirect directly to the new onboarding URL
    res.redirect(accountLink.url);
});

