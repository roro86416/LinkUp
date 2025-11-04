import app from "./app";

// --- 伺服器設定 ---
const port = process.env.PORT || 3001;

// --- 中間件 (Middlewares) ---
app.use(cors());
app.use(express.json());

// --- 啟動伺服器 ---
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
