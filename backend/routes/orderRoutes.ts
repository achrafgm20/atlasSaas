import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getAllBuyerOrders, getSellerOrders } from "../controllers/orderController";

const OrderRouter = express.Router()
OrderRouter.get("/SellersOrders",protect,getSellerOrders)
OrderRouter.get("/BuyerSOrders",protect,getAllBuyerOrders)
export default OrderRouter