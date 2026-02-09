import express from "express";
import { adminOnly, protect } from "../middleware/authMiddleware";
import { editOrderStatus, getAllBuyerOrders, getAllOders, getDetailsOrderSeller, getSellerOrders } from "../controllers/orderController";

const OrderRouter = express.Router()
OrderRouter.get("/SellersOrders",protect,getSellerOrders)
OrderRouter.get("/BuyerSOrders",protect,getAllBuyerOrders)
OrderRouter.get("/getDetailsOrder/:orderId",protect,getDetailsOrderSeller)
OrderRouter.get("/AllOrderAdmin",protect,adminOnly,getAllOders)
OrderRouter.patch("/editOrderStatus/:orderId",protect,adminOnly,editOrderStatus)
export default OrderRouter