import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./api/products-api";

dotenv.config();

const app: Express = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "愛來自LinkUp伺服器! 🚀" });
});

app.use("/api/v1/products", productRoutes);

export default app;
