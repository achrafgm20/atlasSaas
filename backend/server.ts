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
import { socketAuth } from "./middleware/socketAuth";




const app = express()

const port = process.env.PORT  || 5000
connctDB()
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}))

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
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
io.use(socketAuth)
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinDiscussion", (discussionId:string) => {
    socket.join(discussionId);
  });

  socket.on("sendMessage", async ({ discussionId, content }:{discussionId:string,content:string}) => {
    const userId = socket.data.user.id;

    const message = await Message.create({
      discussion: discussionId,
      sender: userId,
      content
    });

    io.to(discussionId).emit("newMessage", message);
  });
});




server.listen(port , () => console.log(`connected successfully ${port}`))