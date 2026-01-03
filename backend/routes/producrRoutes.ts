import express from "express";
import { addProduct, filterProductClient, filterProductSeller, getAllProducts, getSellersProducts } from "../controllers/productController";
import { protect } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const ProductRouter = express.Router()
ProductRouter.post("/addProduct",protect,upload.array("images",5),addProduct)
ProductRouter.get("/getSellerProduct",protect,getSellersProducts)
ProductRouter.get("/getAllProducts",getAllProducts)
ProductRouter.get("/filterProductSeller",protect,filterProductSeller)
ProductRouter.get("/filterProductClient",filterProductClient)

export default ProductRouter