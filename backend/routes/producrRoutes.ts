import express from "express";
import { addProduct, deleteProduct, detailsProduct, editProduct, filterProductClient, filterProductSeller, getAllProducts, getSellersProducts, replaceImage } from "../controllers/productController";
import { protect } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const ProductRouter = express.Router()
ProductRouter.post("/addProduct",protect,upload.array("images",5),addProduct)
ProductRouter.get("/getSellerProduct",protect,getSellersProducts)
ProductRouter.get("/getAllProducts",getAllProducts)
ProductRouter.get("/filterProductSeller",protect,filterProductSeller)
ProductRouter.get("/filterProductClient",filterProductClient)
ProductRouter.delete("/deleteProduct/:id",protect,deleteProduct)
ProductRouter.put("/editProdut/:id",protect,editProduct)
ProductRouter.patch("/editImage/:productId/:imageId",protect,upload.single("file"),replaceImage)
ProductRouter.get("/getProductDetails/:id",detailsProduct)
export default ProductRouter