import express from "express";
import { protect } from "../middleware/authMiddleware";
import { addCart, getCart } from "../controllers/cartController";

const CartRouter = express.Router()
CartRouter.post("/addCard",protect,addCart)
CartRouter.get("/getCart",protect,getCart)
export default CartRouter