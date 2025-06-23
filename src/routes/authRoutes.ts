import express from "express";
import { login, getUserProfile } from "../controllers/authController";
import { validateToken } from "../middleware/validateToken";

const router = express.Router();

router.post("/login", login);
router.get("/user", validateToken, getUserProfile);

export default router;
