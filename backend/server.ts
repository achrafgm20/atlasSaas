import express = require("express")
import cors = require("cors");
import connctDB from "./config/db"
import dotenv = require("dotenv")
import router from "./routes/userRoutes"
import ProductRouter from "./routes/producrRoutes";
dotenv.config()
const app = express()
const port = process.env.PORT  || 5000
connctDB()
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}))
app.use(express.json())
app.use("/api/users",router)
app.use("/api/product",ProductRouter)
//this for uplaod images 
app.use("/uploads", express.static("uploads"));

app.listen(port , () => console.log(`connected successfully ${port}`))