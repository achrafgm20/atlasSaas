import express from "express";
import { protect } from "../middleware/authMiddleware";
import { createCheckoutSession, webHook } from "../controllers/CheckoutController";

export const CheckoutRouter = express.Router()
CheckoutRouter.post("/createSession",protect,createCheckoutSession)

export const webhookRouter = express.Router()
webhookRouter.post("/",webHook)

