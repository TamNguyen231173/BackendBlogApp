import express from "express";
import {
  loginHandler,
  registerHandler,
  login,
  verifyEmailHandler,
  resendVerificationCodeHandler,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import {
  createUserSchema,
  loginUserSchema,
  verifyEmailSchema,
  resendVerificationCodeSchema,
} from "../schema/user.schema";

const router = express.Router();

// Register user route
router.post("/register", validate(createUserSchema), registerHandler);

// Login user route
router.post("/login", validate(loginUserSchema), loginHandler);
router.get("/login", login);

router.get(
  "/verifyEmail/:verificationCode",
  validate(verifyEmailSchema),
  verifyEmailHandler
);

router.post(
  "/resendVerificationCode",
  validate(resendVerificationCodeSchema),
  resendVerificationCodeHandler
);
export default router;
