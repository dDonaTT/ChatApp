import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";

import cookieParser from "cookie-parser";
import connectMongoDB from "./db/connectMongoDB.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);



app.get("/", (req, res) => {
  res.send("hello");
});
app.listen(PORT, () => {
  connectMongoDB();
  console.log(`Server running on port ${PORT}`);
});
