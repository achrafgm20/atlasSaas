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
        //chaneg if sttais = paid
        const totalOrders = await Order.countDocuments({"items.sellerId":sellerId})
        //chnange if status paid
        const orders = await Order.find({"items.sellerId":sellerId}).populate({path:"buyer",select:"name"})
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
    doc
      .fillColor("#2563eb")
      .fontSize(28)
      .text("INVOICE", 50, 50);

    doc
      .fillColor("#374151")
      .fontSize(10)
      .text("AtlasTech", 400, 50, { align: "right" })
      .text("123 Business Street", 400, 65, { align: "right" })
      .text("City, State 12345", 400, 80, { align: "right" })
      .text("contact@atlastech.com", 400, 95, { align: "right" });
    doc
      .fillColor("#6b7280")
      .fontSize(10)
      .text(`Invoice #: ${order._id}`, 50, 120)
      .text(`Date: ${(order as any).createdAt.toDateString()}`, 50, 135)
      .text(`Status: ${order.status.toUpperCase()}`, 50, 150);
    doc
      .fillColor("#111827")
      .fontSize(12)
      .text("Bill To:", 50, 190);

    doc
      .fillColor("#374151")
      .fontSize(10)
      .text(order.customerEmail || "Customer", 50, 210)
      .text(order.billingAddress?.line1 || "", 50, 225);
    
    if (order.billingAddress?.line2) {
      doc.text(order.billingAddress.line2, 50, 240);
    }
    
    doc.text(
      `${order.billingAddress?.city || ""}, ${order.billingAddress?.state || ""} ${order.billingAddress?.postal_code || ""}`,
      50,
      order.billingAddress?.line2 ? 255 : 240
    );
    const tableTop = 310;
    
    doc
      .rect(50, tableTop, 500, 25)
      .fillAndStroke("#2563eb", "#2563eb");

    doc
      .fillColor("#ffffff")
      .fontSize(11)
      .text("Product", 60, tableTop + 8)
      .text("Price", 380, tableTop + 8)
      .text("Total", 480, tableTop + 8);
    let yPosition = tableTop + 35;
    
    order.items.forEach((item: any, index: number) => {
      // Alternate row colors
      if (index % 2 === 0) {
        doc
          .rect(50, yPosition - 5, 500, 25)
          .fillAndStroke("#f9fafb", "#f9fafb");
      }

      doc
        .fillColor("#374151")
        .fontSize(10)
        .text(item.productName, 60, yPosition, { width: 300 })
        .text(`$${item.price.toFixed(2)}`, 380, yPosition)
        .text(`$${item.price.toFixed(2)}`, 480, yPosition);

      yPosition += 25;
    });

    doc
      .moveTo(50, yPosition)
      .lineTo(550, yPosition)
      .strokeColor("#e5e7eb")
      .stroke();

        const totalAmount = order.items.reduce(
        (sum: number, item: any) => sum + item.price,
        0
        );

        yPosition += 20;
        doc
        .fillColor("#6b7280")
        .fontSize(11)
        .text("Subtotal:", 380, yPosition, { width: 80, align: 'left' })
        .text(`$${totalAmount.toFixed(2)}`, 480, yPosition, { width: 70, align: 'right' });

        yPosition += 25;
        doc
        .rect(350, yPosition - 5, 200, 30)
        .fillAndStroke("#f0f9ff", "#f0f9ff");

        doc
        .fillColor("#111827")
        .fontSize(14)
        .text("Total Amount:", 360, yPosition + 5, { width: 100, align: 'left' });
        
        doc
        .fillColor("#2563eb")
        .fontSize(16)
        .text(`$${totalAmount.toFixed(2)}`, 480, yPosition + 5, { width: 70, align: 'right' });
    doc
      .fillColor("#6b7280")
      .fontSize(9)
      .text(
        "Thank you for your business! For questions, contact support@atlastech.com",
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