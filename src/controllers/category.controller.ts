import { NextFunction, Request, Response } from "express";
import { Category } from "../models/category.model";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../schema/post.schema";
import {
  createCategory,
  findAllCategories,
  findCategoryById,
  findOneAndDeleteCategory,
  findAndUpdateCategory,
} from "../services/category.service";
import { findUserById } from "../services/user.service";
import AppError from "../utils/appError";

export const addCategoryHandler = async (
  req: Request<{}, {}, CreateCategoryInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await createCategory({ input: req.body });

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getCategoryHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await findCategoryById(req.params.postId);

    if (!categories) {
      return next(new AppError("Post with that ID not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        categories,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getCategoriesRender = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await findAllCategories();
    const user = await findUserById(res.locals.user._id);

    res.render("category", {
      title: "Categories",
      categories,
      user,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getCategoriesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await findAllCategories();

    res.status(200).json({
      status: "success",
      data: {
        categories,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteCategoryHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await findOneAndDeleteCategory({
      _id: req.params.categoryId,
    });

    if (!category) {
      return next(new AppError("Post with that ID not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateCategoryHandler = async (
  req: Request<UpdateCategoryInput["params"], {}, UpdateCategoryInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await findAndUpdateCategory(
      { _id: req.params.categoryId },
      req.body,
      {}
    );

    if (!category) {
      return next(new AppError("Post with that ID not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
