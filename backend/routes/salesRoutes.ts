import express from "express";
import { adminOnly, protect } from "../middleware/authMiddleware";
import { cardsOverview, getAdmiCards, getAdminGains, Trend, trendLastDaysAdmin, trendMonthAdmin } from "../controllers/salesController";


const SalesRoutes = express.Router()
SalesRoutes.get("/Trend",protect,Trend)
SalesRoutes.get("/cardOverviw",protect,cardsOverview)
SalesRoutes.get("/trendMonthAdmin",protect,adminOnly,trendMonthAdmin)
SalesRoutes.get("/trendDailyAdmin",protect,adminOnly,trendLastDaysAdmin)
SalesRoutes.get("/adminGain",protect,adminOnly,getAdminGains)
SalesRoutes.get("/getCardAdmin",protect,adminOnly,getAdmiCards)
export default SalesRoutes