import express from "express";
import { getAllNotification, markNotificationAsRead } from "../controllers/notificationController";
import { protect } from "../middleware/authMiddleware";

const notificationRouter  = express.Router()
notificationRouter.get("/getSellerNotifications",protect,getAllNotification)
notificationRouter.patch("/markNotifAsRead/:id",protect,markNotificationAsRead)


export default notificationRouter