import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import "dotenv/config";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 解析 URL-encoded body 的中間件

app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "Hello from LinkUp server! 🚀" });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
