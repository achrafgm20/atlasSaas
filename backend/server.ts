import jwt,{verify} from 'jsonwebtoken';
import express = require("express")
import cors = require("cors");
import connctDB from "./config/db"
import dotenv = require("dotenv")
dotenv.config()

import router from "./routes/userRoutes"
import ProductRouter from "./routes/producrRoutes";
import path from "path";
import fs from "fs"
import CartRouter from "./routes/cartRoutes";
import FavoriteRouter from "./routes/favoriteRoutes";
import discussionRoute from "./routes/discussionRoute";
import Message from "./models/message";
import { createServer } from "http";
import {Server,Socket} from "socket.io"
import { CheckoutRouter, webhookRouter } from './routes/checkoutRoutes';
import OrderRouter from './routes/orderRoutes';
import Discussion from './models/discussion';
import Notifaction from './models/notificationModel';
import mongoose from 'mongoose';
import notificationRouter from './routes/notificationRoutes';
import SalesRoutes from './routes/salesRoutes';




const app = express()

const port = process.env.PORT  || 5000
connctDB()
app.use(cors({
    origin:["http://localhost:5173","http://localhost:8080"],
    credentials: true
}))

app.use("/api/checkout/webhook",express.raw({type:"application/json"}),webhookRouter)


// const uploadsPath = path.join(__dirname, "uploads");

// if (!fs.existsSync(uploadsPath)) {
//   fs.mkdirSync(uploadsPath, { recursive: true });
//   console.log("📁 uploads folder created");
// }


app.use(express.json())
app.use("/api/users",router)
app.use("/api/product",ProductRouter)
app.use("/api/cart",CartRouter)
app.use("/api/favorite",FavoriteRouter)
app.use("/api/discussion",discussionRoute)
app.use("/api/checkout",CheckoutRouter)
app.use("/api/orders",OrderRouter)
app.use("/api/notification",notificationRouter)
app.use("/api/trend",SalesRoutes)
//this for uplaod images 
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// app.use("/uploads",express.static(path.join(__dirname, "uploads")));

console.log({
  name: process.env.CLOUDINARY_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET,
});


const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173","http://localhost:8080"],
    
    methods: ["GET", "POST"],
    credentials: true,
  },
});
export {io}
io.on("connection", async(socket) => {
  try {
    const token = socket.handshake.auth.token
    if(!token) {
      socket.disconnect()
      return 
    } 

    const decoded = jwt.verify(token,process.env.JWT_SECRET!) as any
    socket.data.user = {id:decoded.id}
      console.log(`User connected ${socket.data.user.id}`);

  }catch(err){
    socket.disconnect()
  }

  socket.on("joinDiscussion", (discussionId:string) => {
    socket.join(discussionId);
    console.log(`User with id : ${socket.id} joinde room discussion with id  ${discussionId}`)
  });
  
  socket.on("joinUserRoom",(userId:string) => {
    socket.join(userId)
  })

  // socket.on("sendMessage", async ({ discussionId, content }:{discussionId:string,content:string}) => {
  //   const userId = socket.data.user.id;

  //   const message = await Message.create({
  //     discussion: discussionId,
  //     sender: userId,
  //     content:content
  //     // message:new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
  //   });

  //   io.to(discussionId).emit("receiveMessage", message);
  // });

  socket.on("sendMessage", async ({ discussionId, content }) => {
    const userId = socket.data.user.id;

    const message = await Message.create({
      discussion: discussionId,
      sender: userId,
      content: content
    });

    // Populate sender before emitting
    const populatedMessage = await Message.findById(message._id).populate("sender", "name _id");

    io.to(discussionId).emit("receiveMessage", populatedMessage);
    const discution = await Discussion.findById(discussionId).populate("product","productName")
    if(!discution) {
      console.error("discution is not found")
      return
    }
    const sellerId = discution?.seller.toString()
    const sellerObjectId = discution.seller as mongoose.Types.ObjectId
    if(!sellerId) {
      console.error("seller is not found in this discussion ")
      return 
    } 
    await Notifaction.create({
      user:sellerObjectId ,
      type:"message" as "message" ,
      title:"New Message",
      body:message.content as string,
      targetType:"product",
      targetId:discution.product,
      conversationId:discussionId
    })
    io.to(sellerId).emit("notification",{
      type:"message",
      title:"New message",
      body:message.content,
      discussionId
    })

});

  socket.on("disconnect",() => {
    console.log("User disconnected ",socket.id)
  })
});







server.listen(port , () => console.log(`connected successfully ${port}`))

