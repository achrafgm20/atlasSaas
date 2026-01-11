import express from "express";
import { protect } from "../middleware/authMiddleware";
import { addFavorite, deleteFavorite, getFavorite } from "../controllers/favoriteController";

const FavoriteRouter = express.Router()
FavoriteRouter.post("/addFavorite",protect,addFavorite)
FavoriteRouter.get("/getFavorite",protect,getFavorite)
FavoriteRouter.delete("/deleteFav/:productId",protect,deleteFavorite)
export default FavoriteRouter