import express from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";

const app = express();

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

export default app;
