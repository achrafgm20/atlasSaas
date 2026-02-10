import { Request,Response } from 'express';
import  asyncHandler  from 'express-async-handler';
import User from '../models/userModel';
import Order from '../models/ordersModel';
import dotenv = require("dotenv")
import PDFDocument from "pdfkit"
dotenv.config()
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const getSellerOrders = asyncHandler(async(req:Request,res:Response) =>{
    try {
        const sellerId = req.user as string
        const sellerExist = await User.findById(sellerId)
        if(!sellerExist || sellerExist.role !== "Seller"){
            res.status(403).json({message:"this seller is not exist"})
            return
        }
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit
        const totalOrders = await Order.countDocuments({"items.sellerId":sellerId,status:"paid"})

        const orders = await Order.find({"items.sellerId":sellerId,status:"paid"}).populate({path:"buyer",select:"name"})
                                .sort({createdAt:-1})
                                .skip(skip)
                                .limit(limit)
        res.status(200).json({
            orders,
            page,
            limit,
            totalOrders,
            totalPages:Math.ceil(totalOrders / limit)
            
            // amount:stripeAccountSeller

        })
    }catch(err){
        res.status(400).json({message:"error while fetchng orders "})
        console.error("error while fetchng orders ",err)
    }
})


export const getAllBuyerOrders = asyncHandler(async(req:Request,res:Response) => {
    try{
        const buyerId= req.user as string
        const buyerExist = await User.findById(buyerId)
        if(!buyerExist || buyerExist.role !== "Buyer"){
            res.status(403).json({message:"this buyer is not exist "})
            return 
        }
        const orders = await Order.find({buyer:buyerId}).populate({path:"items.sellerId",select:"name email"})
        const orderPayementDetails = await Promise.all(orders.map(async (or) => {
            let paymenetDetails = null
            if(or.stripePayementIntentIdf){
                try{
                    console.log("feching payement intent",or.stripePayementIntentIdf)
                    const paymentIntent = await stripe.paymentIntents.retrieve(or.stripePayementIntentIdf,{expand:["latest_charge"]})
                    const charge = paymentIntent.latest_charge as Stripe.Charge
                    console.log("this is charge",charge.id)

                    if(charge){
                        paymenetDetails = {
                        transactionId:charge.id,
                        paymenetIntentId:paymentIntent.id,
                        amount:paymentIntent.amount / 100,
                        paymenetStatus:paymentIntent.status,
                        paymenetDate:new Date(charge.created * 1000),
                        creditCard: {
                            last4: charge.payment_method_details?.card?.last4,
                            brand: charge.payment_method_details?.card?.brand,
                            expMonth: charge.payment_method_details?.card?.exp_month,
                            expYear: charge.payment_method_details?.card?.exp_year,
                            fingerprint: charge.payment_method_details?.card?.fingerprint,
                        },
                    }
                    console.log(paymenetDetails)
                    }else {
                        console.log("no chnage found in pyement intent")
                    }
                    
                }catch(err){
                    console.error("error failting stripe payement ",err)
                }
            }
            return {...or.toObject(),paymenetDetails}

        }))
        res.status(200).json({
            orders:orderPayementDetails

        })
    }catch(err){
        res.status(404).json({message:"err while ferching buyers order"})
        console.error(err)
    }
})


export const getDetailsOrderSeller = asyncHandler(async(req:Request,res:Response)=> {
    try {
        const sellerId = req.user as string
        const sellerExist = await User.findById(sellerId)
        if(!sellerExist || sellerExist.role !== "Seller"){
            res.status(403).json({message:"this seller is not exist"})
            return
        }
        const {orderId} = req.params
        const orders = await Order.findById(orderId)
                .populate({path:"items.productId",select:"images"})
        res.status(200).json({orders})
        return 

    }catch(err){
        console.error("error fetching details order",err)
        res.status(404).json({message:"err while ferching details order",err})
    }
})


export const getAllOders = asyncHandler(async(req:Request,res:Response) => {
    const orders = await Order.find().populate("buyer","name email").populate("items.sellerId","name email")
    res.status(200).json({message:"all orders fetched succufly",orders})
})


export const editOrderStatus = asyncHandler(async(req:Request,res:Response) => {
    const {orderId} = req.params
    const {status} = req.body

    const allowedStatuses = ["pending", "paid", "shipped", "delivered", "cancelled", "failed"]
    if(!status || !allowedStatuses.includes(status)){
        res.status(400).json("Invalid status value")
        return 
    }
    const order = await Order.findById(orderId)
    if(!order){
        res.status(404).json("order not found")
        return
    }
    order.status = status
    await order.save()
    res.status(200).json({message:`order status updated succc to ${status}`,order})
})





// export const generateInvoice = asyncHandler(async(req:Request,res:Response) => {
//     try {
//         const {orderId} = req.params
//         const order = await Order.findById(orderId).populate("items.productId")
//         if(!order){
//             res.status(404).json({message:"order nott found"})
//             return
             
//         }
//         const doc = new PDFDocument({size:"A4",margin:50})
//         res.setHeader("Content-Type","application/pdf");
//         res.setHeader("Content-Disposition",`attachment; filename=invoice-${orderId}.pdf`);
//         doc.pipe(res);
//         doc.fontSize(20).text("Invoice",275,50,{align:"right"})
//         doc.fontSize(10).text(`Order ID : ${order?._id}`,{align:"right"}).text(`Date : ${(order as any).createdAt.toDateString()}`,{align:"right"}).moveDown()
//         doc.fontSize(12).text("Product",50).text("Price",400).text("Total",520).moveDown()
//         order?.items.forEach((it:any) => {
//             doc
//             .text(it.productName,50)
//             .text(`$${it.price}`,400)
//             .moveDown()            
//         })
//         const totalAmount = order?.items.reduce((sum:number,item:any) => sum + item.price,0)
//         doc.fontSize(14).text(`Total: $${totalAmount}`,{align:"right"})
//         doc.end()

//     }catch(err){
//         console.error(err);
//         res.status(500).json({ message: 'Failed to generate invoice' });
//     }
// })




export const generateInvoice = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("items.productId");

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${orderId}.pdf`
    );
    doc.pipe(res);

    // ================= HEADER =================
    doc
      .image("path/to/logo.png", 50, 45, { width: 120 }) // optional: company logo
      .fontSize(20)
      .text("AtlasTech", 200, 50, { align: "right" })
      .fontSize(10)
      .text(`Order ID: ${order._id}`, { align: "right" })
      .text(`Date: ${(order as any).createdAt.toDateString()}`, {
        align: "right",
      })
      .moveDown();

    doc
      .fillColor("#444444")
      .fontSize(20)
      .text("Invoice", 50, 150);

    // ================= BILLING INFO =================
    doc
      .fontSize(10)
      .text("Billing Address:", 50, 200)
      .text(order.billingAddress?.line1 || "", 50, 215)
      .text(order.billingAddress?.line2 || "", 50, 230)
      .text(
        `${order.billingAddress?.city || ""}, ${order.billingAddress?.country || ""} ${order.billingAddress?.postal_code || ""}`,
        50,
        245
      )
      .moveDown();

    // ================= TABLE HEADER =================
    const tableTop = 300;
    const itemX = 50;
    const priceX = 350;
    const totalX = 450;

    doc
      .fontSize(12)
      .fillColor("black")
    //   .text("Product", itemX, tableTop, { bold: true })
      .text("Price", priceX, tableTop)
      .text("Total", totalX, tableTop);

    // Draw line under header
    doc.moveTo(50, tableTop + 20).lineTo(550, tableTop + 20).stroke();

    // ================= TABLE ROWS =================
    let i = 0;
    const rowHeight = 25;
    order.items.forEach((item: any, idx: number) => {
      const y = tableTop + 30 + i * rowHeight;

      // alternate row background color
      if (i % 2 === 0) {
        doc.rect(50, y - 5, 500, rowHeight).fill("#f5f5f5").fillColor("black");
      }

      doc
        .fillColor("black")
        .fontSize(10)
        .text(item.productName, itemX, y)
        .text(`$${item.price}`, priceX, y)
        .text(`$${item.price}`, totalX, y);

      i++;
    });

    // ================= TOTAL =================
    const totalAmount = order.items.reduce(
      (sum: number, item: any) => sum + item.price,
      0
    );

    doc
      .fontSize(14)
      .fillColor("black")
      .text(`Total: $${totalAmount}`, totalX, tableTop + 30 + i * rowHeight + 20, {
        align: "right",
      });

    // ================= FOOTER =================
    doc
      .fontSize(10)
      .fillColor("gray")
      .text(
        "Thank you for your purchase! If you have any questions, contact us at support@atlastech.com",
        50,
        750,
        { align: "center", width: 500 }
      );

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
});