import express from "express";
import {
  getAllUsersRender,
  getMyInfoHandler,
  generateUserHandler,
  getUsersHandler,
  getPostsInBookmarkHandler,
  toggleBookmarkHandler,
} from "../controllers/user.controller";
import {
  deleteUserHandler,
  getUserHandler,
  updateUserHandler,
} from "../controllers/user.controller";
import { validate } from "../middleware/validate";
import {
  deleteUserSchema,
  getUserSchema,
  updateUserSchema,
  toggleBookmarkSchema,
} from "../schema/user.schema";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { restrictTo } from "../middleware/restrictTo";

const router = express.Router();

router.use(deserializeUser, requireUser);

router.post("/generateUsers", generateUserHandler);

// Admin Get Users route. CRUD users
router.get("/getAllUser/:page", restrictTo("admin"), getAllUsersRender);
router.get("/data/:page", restrictTo("admin"), getUsersHandler);
router
  .route("/manager/:userId")
  .get(restrictTo("admin"), validate(getUserSchema), getUserHandler)
  .patch(restrictTo("admin"), validate(updateUserSchema), updateUserHandler)
  .delete(restrictTo("admin"), validate(deleteUserSchema), deleteUserHandler);

// Get my info route
router.get("/info/me", getMyInfoHandler);

router
  .route("/bookmarks/:page")
  .get(getPostsInBookmarkHandler)
  .post(validate(toggleBookmarkSchema), toggleBookmarkHandler);

export default router;
