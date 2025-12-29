import express = require("express")

import connctDB from "./config/db"
import dotenv = require("dotenv")
import router from "./routes/userRoutes"
dotenv.config()
const app = express()
const port = process.env.PORT  || 5000
connctDB()
app.use(express.json())
app.use("/api/users",router)
app.listen(port , () => console.log(`connected successfully ${port}`))