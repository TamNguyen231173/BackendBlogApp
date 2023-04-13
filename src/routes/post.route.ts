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
  getPostsByCategoryHandler,
  getPostsByUserHandler,
  createCommentHandler,
  createReplyHandler,
} from "../controllers/post.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import {
  createPostSchema,
  deletePostSchema,
  getPostSchema,
  updatePostSchema,
  createCommentSchema,
  createReplySchema,
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
  .route("/getPostsByCategory/:categoryId/:page")
  .get(getPostsByCategoryHandler);

router.route("/getPostsByUser/:userId/:page").get(getPostsByUserHandler);

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

router
  .route("/comments/:postId/:page")
  .post(validate(createCommentSchema), createCommentHandler);

router
  .route("/replies/:postId/:commentId/:page")
  .post(validate(createReplySchema), createReplyHandler);

export default router;
