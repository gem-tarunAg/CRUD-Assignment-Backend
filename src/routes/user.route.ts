import express from "express";
import {
  addUser,
  loginUser,
  getProfile,
  authenticateToken,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const router = express.Router();

//  POST
router.post("/signup", addUser);

router.post("/login", authenticateToken, loginUser);

// GET
router.get("/profile/:username", getProfile);

// PUT
router.put("/profile/:id", updateUser);

// DELETE
router.delete("/profile/:id", deleteUser);

export default router;
