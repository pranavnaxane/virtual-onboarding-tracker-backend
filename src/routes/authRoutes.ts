import express from "express";
import {
  userLogin,
  hrLogin,
  getUserProfile,
  getHRProfile,
} from "../controllers/authController";
import { validateToken } from "../middleware/validateToken";

const router = express.Router();

router.post("/user/login", userLogin);
router.post("/hr/login", hrLogin);
router.get("/user", validateToken, getUserProfile);
router.get("/hr", validateToken, getHRProfile);

export default router;
