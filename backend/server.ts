import express = require("express")
import cors = require("cors");
import connctDB from "./config/db"
import dotenv = require("dotenv")
import router from "./routes/userRoutes"
import ProductRouter from "./routes/producrRoutes";
import path from "path";
import fs from "fs"
dotenv.config()
const app = express()
const port = process.env.PORT  || 5000
connctDB()
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}))

const uploadsPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("📁 uploads folder created");
}


app.use(express.json())
app.use("/api/users",router)
app.use("/api/product",ProductRouter)


//this for uplaod images 
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/uploads",express.static(path.join(__dirname, "uploads")));



app.listen(port , () => console.log(`connected successfully ${port}`))