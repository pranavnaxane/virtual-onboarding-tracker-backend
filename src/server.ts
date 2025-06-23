import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import httpErrorHandler from "./middleware/httpErrorHandler";
import connectDB from "./config/db";
import cors from "cors";
import routes from "./routes";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
connectDB();
app.use(cors());
app.use(express.json());
app.use("/api", routes);
app.use(httpErrorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
