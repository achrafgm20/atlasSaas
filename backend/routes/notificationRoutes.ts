import express from "express";
import { getAllNotification, markNotificationAsRead, viewDetails } from "../controllers/notificationController";
import { protect } from "../middleware/authMiddleware";

const notificationRouter  = express.Router()
notificationRouter.get("/getSellerNotifications",protect,getAllNotification)
notificationRouter.patch("/markNotifAsRead/:id",protect,markNotificationAsRead)
notificationRouter.get("/viewDetails/:id",protect,viewDetails)
export default notificationRouter