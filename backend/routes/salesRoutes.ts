import express from "express";
import { protect } from "../middleware/authMiddleware";
import { cardsOverview, Trend } from "../controllers/salesController";


const SalesRoutes = express.Router()
SalesRoutes.get("/Trend",protect,Trend)
SalesRoutes.get("/cardOverviw",protect,cardsOverview)
export default SalesRoutes