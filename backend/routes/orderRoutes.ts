import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getAllBuyerOrders, getDetailsOrderSeller, getSellerOrders } from "../controllers/orderController";

const OrderRouter = express.Router()
OrderRouter.get("/SellersOrders",protect,getSellerOrders)
OrderRouter.get("/BuyerSOrders",protect,getAllBuyerOrders)
OrderRouter.get("/getDetailsOrder/:orderId",protect,getDetailsOrderSeller)
export default OrderRouter