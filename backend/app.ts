import express from "express";
import router from "./routes/userRoutes";
import ProductRouter from "./routes/producrRoutes";

const app = express();

app.use(express.json());

app.use("/api/users",router)
app.use("/api/products", ProductRouter);

export default app;
