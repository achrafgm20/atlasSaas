import express from "express";
import { getCreatedDiscussion, getMessage } from "../controllers/discussionController";
import { protect } from "../middleware/authMiddleware";

const discussionRoute = express.Router()
discussionRoute.get("/getCreatedDiscusion/:id",protect,getCreatedDiscussion)
discussionRoute.get("/:discussionId/messages",protect,getMessage)
export default discussionRoute