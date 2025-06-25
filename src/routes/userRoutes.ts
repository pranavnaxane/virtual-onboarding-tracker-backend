import express from "express";
import { validateToken } from "../middleware/validateToken";
import {
  createUser,
  getUserById,
  getUsers,
} from "../controllers/userController";

const router = express.Router();

router.post("/create", validateToken, createUser);
router.get("/list", validateToken, getUsers);
router.get("/:id", validateToken, getUserById);

export default router;
