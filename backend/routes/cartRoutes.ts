import express from "express";
import { protect } from "../middleware/authMiddleware";
import { addCart, clearCart, deleteProductCart, getCart } from "../controllers/cartController";

const CartRouter = express.Router()
CartRouter.post("/addCard",protect,addCart)
CartRouter.get("/getCart",protect,getCart)
CartRouter.delete("/deleteProductCart/:productId",protect,deleteProductCart)
CartRouter.delete("/clearCart",protect,clearCart)
export default CartRouter