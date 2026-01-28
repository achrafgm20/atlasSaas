import express = require("express")
import {registerUser,loginUser,getMe, checkAllSellersStatus, refreshStripeOnboarding}  from "../controllers/userController"
import { protect } from "../middleware/authMiddleware"
const router = express.Router()
router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/me",protect,getMe)
router.get('/seller/onboarding/refresh', refreshStripeOnboarding); // ✅ Correct - no protect

router.get("/sellerReady",checkAllSellersStatus)
export default router