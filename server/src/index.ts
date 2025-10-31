import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./api/products-api";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "愛來自LinkUp伺服器! 🚀" });
});

app.use("/api/v1/products", productRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
