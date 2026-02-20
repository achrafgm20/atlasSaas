import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../models/userModel";
import Product from "../models/productModel";
import dotenv = require("dotenv");
dotenv.config();
import Stripe from "stripe";
import Cart from "../models/cartModel";
import Order from "../models/ordersModel";
import Notification from "../models/notificationModel";
import { io } from "../server";
import { sendOrderPaidEmail } from "../services/emailService";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export const createCheckoutSession = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const clientId = req.user;
      const clientExisit = await User.findById(clientId);
      if (!clientExisit || clientExisit.role !== "Buyer") {
        res.status(404).json({ message: "Buyer not fount" });
        return;
      }
      const cart = await Cart.findOne({ user: clientId }).populate({
        path: "products.product",
        select:
          "productName storage color condition listingPrice images seller",
        populate: { path: "seller", select: "name stripeAccountId" },
      });
      if (!cart || cart.products.length === 0) {
        res.status(400).json({ message: "Cart is empty or not found" });
        return;
      }
      // build line items for striep
      const line_items = cart.products.map((p) => {
        const product = p.product as any;
        return {
          price_data: {
            currency: "usd",
            product_data: { name: product.productName },
            unit_amount: product.listingPrice * 100,
          },
          quantity: 1,
        };
      });
      // calcule fee admi
      const totalAmout = cart.products.reduce((sum, p) => {
        const product = p.product as any;
        return sum + product.listingPrice;
      }, 0);
      const sellers = cart.products.map((p) => {
        const product = p.product as any;
        return {
          sellerId: product.seller._id,
          stripeAccountId: product.seller.stripeAccountId,
          price: product.listingPrice,
        };
      });
      for (let s of sellers) {
        if (!s.stripeAccountId) {
          res
            .status(400)
            .json({ message: "one seller is not onboarded to stripe " });
          return;
        }
      }
      const orderItems = cart.products.map((p) => {
        const product = p.product as any;
        return {
          productId: product._id,
          productName: product.productName,
          price: product.listingPrice,
          sellerId: product.seller._id,
          stripeAccountId: product.seller.stripeAccountId,
        };
      });

      //craete sessio strioe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        // payment_intent_data:{
        //     application_fee_amount:adminFee,
        //     transfer_data:{
        //         destination:sellerStripeAccountId
        //     }
        // },
        shipping_address_collection: {
          allowed_countries: ["US", "CA", "GB", "FR", "MA", "DE", "IT", "ES"],
        },
        billing_address_collection: "required",
        payment_intent_data: {
          transfer_group: `ORDER_${clientId}_${Date.now()}`, // unique per order
        },
        success_url: `${process.env.CLIENT_URL}/PaymentSuccess`,
        cancel_url: `${process.env.CLIENT_URL}/PaymentFailed`,
      });
      const order = await Order.create({
        buyer: clientId,
        items: orderItems,
        totalAmount: totalAmout,
        stripeSessionId: session.id,
        status: "pending",
      });
      // for(let item of order.items){
      //     const sellerId = item.sellerId.toString()
      //     await Notification.create({
      //         user:item.sellerId,
      //         type:"order",
      //         title:"New Order",
      //         body:"You received a new order",
      //         targetType:"order",
      //         targetId:order._id
      //     })
      //     io.to(sellerId).emit("notification",{
      //         type:"order",
      //         title:"New Order",
      //         body:`You received a new Order for ${item.productName}`,
      //         orderId:order._id,
      //     })
      // }

      res.status(200).json({ url: session.url });
    } catch (err) {
      res
        .status(404)
        .json({ message: "error while creating session of stripe ", err });
      return;
    }
  },
);

export const webHook = asyncHandler(async (req: Request, res: Response) => {
  console.log("🔔 Webhook received!");
  console.log("Headers:", req.headers);
  console.log("Body type:", typeof req.body);
  const sign = req.headers["stripe-signature"];
  console.log(sign);
  if (!sign) {
    res.status(400).json("missing stripe signature");
    return;
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sign!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.log("web signature verification fialed", err.message);
    res.status(404).send(`webhook error : ${err.message}`);
    return;
  }
  if (event.type === "checkout.session.completed") {
    // const session = event.data.object as Stripe.Checkout.Session

    const session = event.data.object as Stripe.Checkout.Session;

    // Access shipping and billing details directly from the session
    // No need to retrieve or expand - they're already there!
    const shippingAddress = (session as any).shipping_details?.address || null;
    const billingAddress = (session as any).customer_details?.address || null;
    const customerEmail = (session as any).customer_details?.email || null;
    console.log("Shipping Address:", shippingAddress);
    console.log("Billing Address:", billingAddress);
    console.log("Customer Email:", customerEmail);

    // find order. y stripe session id
    const order = await Order.findOneAndUpdate(
      { stripeSessionId: session.id },
      {
        shippingAddress,
        billingAddress,
        customerEmail,
        status: "paid",
        stripePayementIntentIdf: session.payment_intent as string,
      },
      { new: true },
    );
    if (!order) {
      res.status(400).json({ message: "order not found" });
      return;
    }
    for (let item of order.items) {
      const sellerId = item.sellerId.toString();
      await Notification.create({
        user: item.sellerId,
        type: "order",
        title: "New Order",
        body: "You received a new order",
        targetType: "order",
        targetId: order._id,
      });
      io.to(sellerId).emit("notification", {
        type: "order",
        title: "New Order",
        body: `You received a new Order for ${item.productName}`,
        orderId: order._id,
      });
    }
    const admin_perct = 10;
    for (let item of order.items) {
      const adminFee = Math.round((item.price * 100 * admin_perct) / 100);
      const sellerAmount = item.price * 100 - adminFee;
      if (!item.stripeAccountId) continue;
      await stripe.transfers.create({
        amount: sellerAmount,
        currency: "usd",
        destination: item.stripeAccountId,
        transfer_group: session.payment_intent as string,
      });
    }
    if (!order?.customerEmail) {
      console.log("customer email missing for order", order);
    } else {
      await sendOrderPaidEmail(order.customerEmail, order._id.toString());
    }

    //update status of products to sold
    const productsIds = order.items.map((it) => it.productId);
    await Product.updateMany(
      { _id: { $in: productsIds } },
      { $set: { status: "Sold" } },
    );
    console.log(`market product as sold are ${productsIds.length}`);
    //clear client cart
    const cart = await Cart.findOne({ user: order.buyer });
    if (cart && cart.products.length > 0) {
      cart.products = [];
      await cart.save();
    }
    //update order stats
    // const updatedOrder = await Order.findByIdAndUpdate(
    //     order._id,
    //     {$set:{status:"paid"}},
    //     {new:true}
    // )
    // console.log(`order changeed status to ${updatedOrder?.status}`)
    res.status(200).json({ message: "Payment processed successfully" });
    return;
  }
  res.status(200).json({ receiveed: true });
});

// import asyncHandler from "express-async-handler";
// import { Request,Response } from 'express';
// import User from "../models/userModel";
// import Product from "../models/productModel"
// import dotenv = require("dotenv")
// dotenv.config()
// import Stripe from "stripe"
// import Cart from "../models/cartModel";
// import Order from "../models/ordersModel";
// import Notification from "../models/notificationModel";
// import { io } from "../server";
// import { sendOrderPaidEmail } from "../services/emailService";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// export const createCheckoutSession = asyncHandler(async(req:Request,res:Response) => {
//     try {
//         const clientId = req.user
//         const clientExisit = await User.findById(clientId)
//         if(!clientExisit || clientExisit.role !== "Buyer"){
//             res.status(404).json({message:"Buyer not fount"})
//             return
//         }
//         const cart = await Cart.findOne({user:clientId}).populate({
//             path:"products.product",
//             select:"productName storage color condition listingPrice images seller",
//             populate:{path:"seller",select:"name stripeAccountId"}
//         })
//         if(!cart || cart.products.length === 0){
//             res.status(400).json({message:"Cart is empty or not found"})
//             return
//         }
//         // build line items for striep
//         const line_items = cart.products.map((p) => {
//             const product = p.product as any
//             return {
//                 price_data:{
//                     currency :"usd",
//                     product_data :{name:product.productName},
//                     unit_amount:product.listingPrice * 100
//                 },
//                 quantity:1
//             }
//         })
//         // calcule fee admi
//         const totalAmout = cart.products.reduce((sum,p) => {
//             const product = p.product as any
//             return sum + product.listingPrice

//         },0)
//         const sellers = cart.products.map((p) => {
//             const product = p.product as any
//             return {
//                 sellerId:product.seller._id,
//                 stripeAccountId:product.seller.stripeAccountId,
//                 price:product.listingPrice
//             }
//         })
//         for(let s of sellers){
//             if(!s.stripeAccountId){
//                 res.status(400).json({message:"one seller is not onboarded to stripe "})
//                 return
//             }
//         }
//         const orderItems = cart.products.map((p) => {
//             const product = p.product as any
//             return {
//                 productId:product._id,
//                 productName:product.productName,
//                 price:product.listingPrice,
//                 sellerId:product.seller._id,
//                 stripeAccountId:product.seller.stripeAccountId
//             }
//         })

//         //craete sessio strioe
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types:["card"],
//             line_items,
//             mode:"payment",
//             // payment_intent_data:{
//             //     application_fee_amount:adminFee,
//             //     transfer_data:{
//             //         destination:sellerStripeAccountId
//             //     }
//             // },
//              shipping_address_collection: {
//                 allowed_countries: ['US', 'CA', 'GB', 'FR', 'MA', 'DE', 'IT', 'ES']
//             },
//             billing_address_collection: "required",
//             payment_intent_data: {
//                 transfer_group: `ORDER_${clientId}_${Date.now()}`, // unique per order
//             },
//             success_url: `${process.env.CLIENT_URL}/PaymentSuccess`,
//             cancel_url: `${process.env.CLIENT_URL}/PaymentFailed`,
//         })
//         const order = await Order.create({
//             buyer:clientId,
//             items:orderItems,
//             totalAmount:totalAmout,
//             stripeSessionId:session.id,
//             status:"pending"
//         })
//         for(let item of order.items){
//             const sellerId = item.sellerId.toString()
//             await Notification.create({
//                 user:item.sellerId,
//                 type:"order",
//                 title:"New Order",
//                 body:"You received a new order",
//                 targetType:"order",
//                 targetId:order._id
//             })
//             io.to(sellerId).emit("notification",{
//                 type:"order",
//                 title:"New Order",
//                 body:`You received a new Order for ${item.productName}`,
//                 orderId:order._id,
//             })
//         }

//             res.status(200).json({url:session.url})

//     }catch(err){
//         res.status(404).json({message:"error while creating session of stripe ",err})
//         return
//     }

// })

// export const webHook = asyncHandler(async (req: Request, res: Response): Promise<void> => {
//     const signature = req.headers["stripe-signature"];

//     if (!signature) {
//         res.status(400).json({ message: "Missing Stripe signature" });
//         return;
//     }

//     let event: Stripe.Event;

//     try {
//         event = stripe.webhooks.constructEvent(
//             req.body,
//             signature,
//             process.env.STRIPE_WEBHOOK_SECRET!
//         );
//     } catch (err: any) {
//         console.log("Webhook signature verification failed:", err.message);
//         res.status(400).send(`Webhook Error: ${err.message}`);
//         return;
//     }

//     console.log("========================================");
//     console.log("📩 WEBHOOK EVENT RECEIVED:", event.type);
//     console.log("========================================");

//     // ==========================
//     // 1️⃣ HANDLE SELLER UPDATE
//     // ==========================
//     if (event.type === "account.updated") {
//         const account = event.data.object as Stripe.Account;

//         console.log("🔍 EVENT TYPE: account.updated");
//         console.log("🔍 Account ID from Stripe:", account.id);
//         console.log("🔍 Account details_submitted:", account.details_submitted);
//         console.log("🔍 Account transfers capability:", account.capabilities?.transfers);

//         console.log("🔍 Searching database for user with stripeAccountId:", account.id);

//         const user = await User.findOne({ stripeAccountId: account.id });

//         console.log("🔍 Database search result:", user ? `FOUND - ${user.email}` : "NOT FOUND");

//         if (!user) {
//             console.log("⚠️ No matching user found in database");
//             console.log("⚠️ Skipping update - returning 200 to acknowledge event");
//             res.status(200).json({ received: true });
//             return;
//         }

//         console.log("✅ User found! Starting update...");
//         console.log("📝 Current user data:", {
//             email: user.email,
//             currentStripeAccountId: user.stripeAccountId,
//             currentOnboardingCompleted: user.stripeOnboardingCompleted,
//             currentCanReceiveTransfers: user.canReceiveTransfers
//         });

//         user.stripeDetailsSubmitted = account.details_submitted;
//         user.stripeOnboardingCompleted = account.details_submitted;
//         user.canReceiveTransfers =
//             account.capabilities?.transfers === "active" &&
//             account.details_submitted;

//         user.transfersCapability =
//             account.capabilities?.transfers || "inactive";

//         user.statutCompte =
//             account.details_submitted &&
//             account.capabilities?.transfers === "active"
//                 ? "Approved"
//                 : "Pending";

//         await user.save();

//         console.log("✅ USER UPDATED SUCCESSFULLY!");
//         console.log("📝 New user data:", {
//             email: user.email,
//             stripeDetailsSubmitted: user.stripeDetailsSubmitted,
//             stripeOnboardingCompleted: user.stripeOnboardingCompleted,
//             canReceiveTransfers: user.canReceiveTransfers,
//             transfersCapability: user.transfersCapability,
//             statutCompte: user.statutCompte
//         });
//         console.log("========================================");

//         res.status(200).json({ received: true });
//         return;
//     }

//     // ==========================
//     // 2️⃣ HANDLE PAYMENT
//     // ==========================
//     if (event.type === "checkout.session.completed") {
//         const session = event.data.object as Stripe.Checkout.Session;

//         console.log("💳 PAYMENT EVENT: checkout.session.completed");
//         console.log("💳 Session ID:", session.id);

//         const order = await Order.findOneAndUpdate(
//             { stripeSessionId: session.id },
//             {
//                 status: "paid",
//                 stripePayementIntentIdf: session.payment_intent as string,
//             },
//             { new: true }
//         );

//         if (!order) {
//             console.log("❌ Order not found for session:", session.id);
//             res.status(400).json({ message: "Order not found" });
//             return;
//         }

//         console.log("✅ Payment processed for order:", order._id);
//         console.log("========================================");

//         res.status(200).json({ received: true });
//         return;
//     }

//     console.log("ℹ️ Event type not handled:", event.type);
//     console.log("========================================");
//     res.status(200).json({ received: true });
// });
