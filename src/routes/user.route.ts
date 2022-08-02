import express from "express";
import {
  addUser,
  loginUser,
  getProfile,
  authenticateToken,
} from "../controllers/user.controller";

const router = express.Router();

//  POST
router.post("/signup", addUser);

router.post("/login", authenticateToken, loginUser);

// GET
router.get("/profile/:username", getProfile);

// router.get("/", (req, res) => {});

export default router;
