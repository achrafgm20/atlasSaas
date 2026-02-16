import type { Request,Response } from 'express';
import asyncHandler = require("express-async-handler");
import User, { IUser } from "../models/userModel"
import bcrypt = require("bcrypt");
import jwt = require("jsonwebtoken");
import Stripe from 'stripe';
import message from '../models/message';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
// function register 
// export const registerUser = asyncHandler(async (req:Request,res:Response) => {
//     const {name,email,password,role,statutCompte} = req.body 
//     if(!name  || !email || !password || !role ) {
//         res.status(400).json("remplir tous les champs")
//         return 
//     }
//     const userExist = await User.findOne({email})
//     if(userExist) {
//         res.status(400).json("user has alredy exist ")
//         return 
//     }
//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password,salt)
//     const user = await User.create({
//         name,email,password:hashedPassword,role,statutCompte
//     })
//     if(!user){
//         res.status(404).json({message:"User creating failed"})
//         return
//     }
//     if(role === "Seller"){
//         try{
//             const stripeAccount = await stripe.accounts.create({
//             type:"express",
//             country:"US",
//             email:user.email,
//             capabilities: {
//         card_payments: { requested: true },
//         transfers: { requested: true } // ✅ This is what's missing!
//     },
//     business_type: 'individual'
//         })
       
//         user.stripeAccountId = stripeAccount.id
        

//        const accountLink = await stripe.accountLinks.create({
//     account: stripeAccount.id,
//     refresh_url: `${process.env.BACKEND_URL}/api/users/seller/onboarding/refresh?userId=${user._id}`, // ✅ Add userId
//     return_url: `${process.env.CLIENT_URL}/dashboard/settings`,
//     type: "account_onboarding",
// })
//         user.stripeAccountId = stripeAccount.id;
//         user.stripeOnboardingUrl = accountLink.url;
//         user.stripeOnboardingCompleted = false;
//         user.canReceiveTransfers = false;
//         user.transfersCapability = "inactive";
//         await user.save();
//         res.status(201).json({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             role: user.role,
//             statutCompte: user.statutCompte,
//             token: generateToken(user._id?.toString() as string),
//             stripeAccountId: user.stripeAccountId,
//             stripeOnboardingUrl: user.stripeOnboardingUrl,
//             stripeOnboardingCompleted: user.stripeOnboardingCompleted,
//             canReceiveTransfers: user.canReceiveTransfers,
//             transfersCapability: user.transfersCapability
//         })
//         return
//         }catch(err:any){
//             console.error("error creating stripe account ",err);
            
//         }
//         return 
        
    
    
//     }

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       statutCompte: user.statutCompte,
//       token: generateToken(user._id?.toString() as string),

//     })   
    



// })


export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role, statutCompte } = req.body;
    
    if (!name || !email || !password || !role) {
        res.status(400).json({ message: "Fill all fields" });
        return;
    }
    
    const userExist = await User.findOne({ email });
    if (userExist) {
        res.status(400).json({ message: "User already exists" });
        return;
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        statutCompte
    });
    
    if (!user) {
        res.status(404).json({ message: "User creation failed" });
        return;
    }
    
    if (role === "Seller") {
        try {
            // Create Stripe account
            const stripeAccount = await stripe.accounts.create({
                type: "express",
                country: "US",
                email: user.email,
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true }
                },
                business_type: 'individual'
            });
            
            user.stripeAccountId = stripeAccount.id;
            
            // Create onboarding link
            const accountLink = await stripe.accountLinks.create({
                account: stripeAccount.id,
                refresh_url: `${process.env.BACKEND_URL}/api/users/seller/onboarding/refresh?userId=${user._id}`,
                // return_url: `${process.env.CLIENT_URL}/dashboard/settings`, // ✅ They return here
                return_url: `${process.env.BACKEND_URL}/api/users/seller/onboarding/refresh?userId=${user._id}`, // 🔥 CHANGED: Backend URL instead of frontend
                type: "account_onboarding",
            });
            
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
            });
            return;
            
        } catch (err: any) {
            console.error("Error creating Stripe account:", err);
            res.status(500).json({ message: "Error creating Stripe account" });
            return;
        }
    }
    
    // For Buyers
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        statutCompte: user.statutCompte,
        token: generateToken(user._id?.toString() as string),
    });
});


// function generate jwt 
const generateToken = (id:string):string => {
    return jwt.sign({id},process.env.JWT_SECRET as string, {expiresIn : '30d'})
}

// function login 
export const loginUser = asyncHandler (async (req:Request,res:Response) => {
    const {email,password} = req.body 
    const user = await User.findOne({email})
    if(user && user.password && (await bcrypt.compare(password,user.password as string))){
        res.status(200).json({
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




export const editSellerProfile = asyncHandler(async(req:Request,res:Response)=> {
    try{
        const userId = req.user
        const userExist = await User.findById(userId)
        if(!userExist || userExist.role !== "Seller"){
            res.status(404).json({message:"seller not found"})
            return
        }
        const {name,email,phone,storeName,storeDescription,adresse,city,postalCode,Country} = req.body
        const editedProfile = await User.findByIdAndUpdate(userId,{name,email,phone,storeName,storeDescription,adresse,city,postalCode,Country},{new:true,runValidators:true}).select("-password")
        res.status(200).json({message:"seller edited succefully",editedProfile})
    }catch(err){
        res.status(400).json({message:"error while editing seller s profile ",err})
        console.error(err)
    }
    
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


// export const refreshStripeOnboarding = asyncHandler(async (req: Request, res: Response) => {
//     const userId = req.query.userId as string; 
    
//     if (!userId) {
//         res.status(400).json({ message: "User ID missing" });
//         return;
//     }

//     const user = await User.findById(userId);
    
//     if (!user?.stripeAccountId) {
//         res.status(404).json({ message: "Stripe account not found" });
//         return;
//     }

//     const accountLink = await stripe.accountLinks.create({
//         account: user.stripeAccountId,
//         refresh_url: `${process.env.BACKEND_URL}/api/users/seller/onboarding/refresh?userId=${userId}`, // ✅ Pass userId again
//         return_url: `${process.env.CLIENT_URL}/dashboard/settings`,
//         type: "account_onboarding",
//     });

//     // Redirect directly to the new onboarding URL
//     res.redirect(accountLink.url);
// });


export const refreshStripeOnboarding = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.query.userId as string; 
    
    if (!userId) {
        res.status(400).json({ message: "User ID missing" });
        return;
    }

    const user = await User.findById(userId);
    
    if (!user?.stripeAccountId) {
        res.status(404).json({ message: "Stripe account not found" });
        return;
    }

    // 🔥 AUTO-SYNC: Check Stripe account status when user returns
    try {
        console.log("🔄 Auto-syncing Stripe account for:", user.email);
        
        const account = await stripe.accounts.retrieve(user.stripeAccountId);
        
        console.log("📊 Account status from Stripe:", {
            details_submitted: account.details_submitted,
            transfers: account.capabilities?.transfers
        });
        
        // Update database with current Stripe status
        user.stripeDetailsSubmitted = account.details_submitted;
        user.stripeOnboardingCompleted = account.details_submitted;
        user.canReceiveTransfers = 
            account.capabilities?.transfers === "active" && account.details_submitted;
        user.transfersCapability = account.capabilities?.transfers || "inactive";
        user.statutCompte = 
            account.details_submitted && account.capabilities?.transfers === "active"
                ? "Approved" : "Pending";
        
        await user.save();
        
        console.log("✅ User auto-synced successfully:", user.email);
        
        // If onboarding is complete, redirect to dashboard
        if (account.details_submitted) {
            console.log("✅ Onboarding complete - redirecting to settings");
            res.redirect(`${process.env.CLIENT_URL}/dashboard/settings`);
            return;
        }
        
        // If not complete, create new onboarding link
        console.log("⚠️ Onboarding incomplete - creating new link");
        
    } catch (err: any) {
        console.error("❌ Error auto-syncing account:", err.message);
        // Continue to create new onboarding link even if sync fails
    }

    // Create new onboarding link if needed
    const accountLink = await stripe.accountLinks.create({
        account: user.stripeAccountId,
        refresh_url: `${process.env.BACKEND_URL}/api/users/seller/onboarding/refresh?userId=${userId}`,
        return_url: `${process.env.CLIENT_URL}/dashboard/settings`,
        type: "account_onboarding",
    });

    // Redirect to onboarding
    res.redirect(accountLink.url);
});



export const getAllUsers = asyncHandler(async(req:Request,res:Response) => {
    const users = await User.find({role:{$in:["Buyer","Seller"]}}).select("-password")
    res.status(200).json(users)
})


export const deleteUser = asyncHandler(async(req:Request,res:Response) => {
    const {userIdToDelete} = req.params
    const user = await User.findById(userIdToDelete)
    if(!user){
        res.status(404).json("user not found")
        console.error("user not found");
    }
    if(user?.role === "Admin"){
        res.status(403).json("you can t delete an admin account ")
    }
    await user?.deleteOne()
    res.status(200).json({message:"User deleted successfully"})

})

export const getAllSellers = asyncHandler(async(req:Request,res:Response) => {
    const sellers = await User.find({role:"Seller"}).select("-password")
    res.status(200).json(sellers)

})


export const editStatusSeller = asyncHandler(async(req:Request,res:Response) => {
    const SellerId = req.params.SellerId
    const {statutCompte} = req.body
    const seller = await User.findById(SellerId)
    if(!seller || seller.role !== "Seller"){
         res.status(404).json("seller not found")
         return
    }
    const allowedStatus = ["Approved", "Pending", "Rejected"]

    if(!statutCompte || !allowedStatus.includes(statutCompte)){
          res.status(400).json({message:"Invalid value status "})
          return
    }
    seller.statutCompte = statutCompte
    await seller.save()
    res.status(200).json({message: "Seller status updated successfully",seller})
})


export const filterBuyerSellers = asyncHandler(async(req:Request,res:Response) => {
    const {search,role,status} = req.query
    const filter:any  ={}
    if(role){
        filter.role = role
    } 
    if(status){
        filter.statutCompte = {$regex:`^${status}$`,$options:"i"}
    }
    if(search){
        filter.$or = [
            {name:{$regex:search as string , $options :"i"}},
            {email:{$regex:search as string , $options:"i"}}
        ]
    }
    const users = await User.find(filter).select("-password")
    res.status(200).json(users)
})







export const manualSyncStripe = asyncHandler(async(req: Request, res: Response) => {
    const { email } = req.body;
    
    const user = await User.findOne({ email, role: "Seller" });
    
    if (!user || !user.stripeAccountId) {
        res.status(404).json({ message: "Seller not found" });
        return;
    }
    
    console.log("🔍 Fetching account from Stripe:", user.stripeAccountId);
    
    const account = await stripe.accounts.retrieve(user.stripeAccountId);
    
    console.log("Account status:", {
        details_submitted: account.details_submitted,
        transfers: account.capabilities?.transfers
    });
    
    user.stripeDetailsSubmitted = account.details_submitted;
    user.stripeOnboardingCompleted = account.details_submitted;
    user.canReceiveTransfers = 
        account.capabilities?.transfers === "active" && account.details_submitted;
    user.transfersCapability = account.capabilities?.transfers || "inactive";
    user.statutCompte = 
        account.details_submitted && account.capabilities?.transfers === "active"
            ? "Approved" : "Pending";
    
    await user.save();
    
    console.log("✅ User synced:", user.email);
    
    res.status(200).json({ message: "Synced successfully", user });
});