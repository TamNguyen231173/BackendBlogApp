import express from "express";
import {
  addCategoryHandler,
  deleteCategoryHandler,
  getCategoriesHandler,
  getCategoriesRender,
  getCategoryHandler,
  updateCategoryHandler,
} from "../controllers/category.controller";
import { validate } from "../middleware/validate";
import {
  createCategorySchema,
  deleteCategorySchema,
  getCategorySchema,
  updateCategorySchema,
} from "../schema/post.schema";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";

const router = express.Router();

router.use(deserializeUser, requireUser);

router.route("/getAllCategories").get(getCategoriesRender);

router
  .route("/")
  .post(validate(createCategorySchema), addCategoryHandler)
  .get(getCategoriesHandler);

router
  .route("/:postId")
  .get(validate(getCategorySchema), getCategoryHandler)
  .patch(validate(updateCategorySchema), updateCategoryHandler)
  .delete(validate(deleteCategorySchema), deleteCategoryHandler);

export default router;
