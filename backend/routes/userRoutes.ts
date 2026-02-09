import express = require("express")
import {registerUser,loginUser,getMe, checkAllSellersStatus, refreshStripeOnboarding, editSellerProfile, getAllUsers, deleteUser, getAllSellers, editStatusSeller}  from "../controllers/userController"
import { adminOnly, protect } from "../middleware/authMiddleware"
const router = express.Router()
router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/me",protect,getMe)
router.get('/seller/onboarding/refresh', refreshStripeOnboarding); 
router.put("/editSellerProfile",protect,editSellerProfile)
router.get("/sellerReady",checkAllSellersStatus)
router.get("/getAllUsers",protect,adminOnly,getAllUsers)
router.delete("/deleteUser/:userIdToDelete",protect,adminOnly,deleteUser)
router.get("/getAllSellers",protect,adminOnly,getAllSellers)
router.patch("/editStatusSeller/:SellerId",protect,adminOnly,editStatusSeller)
export default router