import express from "express";
import cors from "cors";
import "dotenv/config";
import job from "./lib/config/cron";

import authRoutes from "./routes/auth.route";
import bookRoutes from "./routes/book.route";

import { connectDB } from "./lib/config/db";

const app = express();
const PORT = process.env.PORT || 3000;

job.start();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
