import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();

// Connect DB inside request lifecycle (important)
let isConnected = false;

const startServer = async () => {
  if (!isConnected) {
    await connectDb();
    await connectCloudinary();
    isConnected = true;
  }
};

app.use(async (req, res, next) => {
  await startServer();
  next();
});

// middlewares
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Api is Working..");
});

// routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

export default app;