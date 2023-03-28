import express from "express";
import {
  createPostHandler,
  deletePostHandler,
  getPostHandler,
  getPostsHandler,
  parsePostFormData,
  updatePostHandler,
  getPostsRender,
  getPostEditHandler,
  generatePostsHandler,
} from "../controllers/post.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import {
  createPostSchema,
  deletePostSchema,
  getPostSchema,
  updatePostSchema,
} from "../schema/post.schema";
import {
  resizePostImage,
  uploadPostImage,
} from "../upload/single-upload-sharp";

const router = express.Router();

router.use(deserializeUser, requireUser);

// Render UI
router.route("/:page").get(getPostsRender);
router.route("/editPost/:postId").get(getPostEditHandler);

// Return JSON
router.route("/generatePosts").post(generatePostsHandler);

router
  .route("/data/:page")
  .post(
    uploadPostImage,
    resizePostImage,
    parsePostFormData,
    validate(createPostSchema),
    createPostHandler
  )
  .get(getPostsHandler);

router
  .route("/manager/:postId")
  .get(validate(getPostSchema), getPostHandler)
  .patch(
    uploadPostImage,
    resizePostImage,
    parsePostFormData,
    validate(updatePostSchema),
    updatePostHandler
  )
  .delete(validate(deletePostSchema), deletePostHandler);

export default router;
