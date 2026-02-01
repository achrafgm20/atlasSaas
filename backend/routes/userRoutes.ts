import express = require("express")
import {registerUser,loginUser,getMe, checkAllSellersStatus, refreshStripeOnboarding, editSellerProfile}  from "../controllers/userController"
import { protect } from "../middleware/authMiddleware"
const router = express.Router()
router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/me",protect,getMe)
router.get('/seller/onboarding/refresh', refreshStripeOnboarding); 
router.put("/editSellerProfile",protect,editSellerProfile)
router.get("/sellerReady",checkAllSellersStatus)
export default router