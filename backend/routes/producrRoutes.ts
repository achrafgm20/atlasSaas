import express from "express";
import { addProduct, getSellersProducts } from "../controllers/productController";
import { protect } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const ProductRouter = express.Router()
ProductRouter.post("/addProduct",protect,upload.array("images",5),addProduct)
ProductRouter.get("/getSellerProduct",protect,getSellersProducts)
export default ProductRouter