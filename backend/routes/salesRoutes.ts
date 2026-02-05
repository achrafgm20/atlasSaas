import express from "express";
import { protect } from "../middleware/authMiddleware";
import { Trend } from "../controllers/salesController";


const SalesRoutes = express.Router()
SalesRoutes.get("/Trend",protect,Trend)
export default SalesRoutes