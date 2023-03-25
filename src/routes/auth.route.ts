import express from "express";
import {
  loginHandler,
  registerHandler,
  login,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { createUserSchema, loginUserSchema } from "../schema/user.schema";

const router = express.Router();

// Register user route
router.post("/register", validate(createUserSchema), registerHandler);

// Login user route
router.post("/login", validate(loginUserSchema), loginHandler);
router.get("/login", login);

export default router;
