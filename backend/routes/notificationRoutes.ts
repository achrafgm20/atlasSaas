import express from "express";
import { getAllNotification, markNotificationAsRead, nbrPendingMessage, viewDetails } from "../controllers/notificationController";
import { protect } from "../middleware/authMiddleware";

const notificationRouter  = express.Router()
notificationRouter.get("/getSellerNotifications",protect,getAllNotification)
notificationRouter.patch("/markNotifAsRead/:id",protect,markNotificationAsRead)
notificationRouter.get("/viewDetails/:id",protect,viewDetails)
notificationRouter.get("/nbrPendingMessage",protect,nbrPendingMessage)
export default notificationRouter