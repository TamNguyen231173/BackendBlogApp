import { faker } from "@faker-js/faker";
import { NextFunction, Request, Response } from "express";
import { Category } from "../models/category.model";
import {
  CreateCategoryInput,
  DeleteCategoryInput,
  GetAllCategoriesInput,
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

export const generateCategoryHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = [
      "Technology",
      "Business",
      "Politics",
      "Sports",
      "Entertainment",
      "Health",
      "Science",
      "Lifestyle",
      "Travel",
      "Food",
      "Fashion",
      "Education",
    ];
    for (let i = 0; i < categories.length; i++) {
      let category = await createCategory({
        image: faker.image.imageUrl(1920, 1080) + "?random=" + i,
        name: categories[i],
      });
    }

    res.status(201).json({
      status: "success",
      data: {
        message: "Categories generated successfully",
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const addCategoryHandler = async (
  req: Request<{}, {}, CreateCategoryInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await createCategory(req.body);

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
    const category = await findCategoryById(req.params.categoryId);

    if (!category) {
      return next(new AppError("Category with that ID not found", 404));
    }

    res.status(200).json({
      status: "success",
      category,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getCategoriesRender = async (
  req: Request<GetAllCategoriesInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    let page = req.params.page;
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
      categories,
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteCategoryHandler = async (
  req: Request<DeleteCategoryInput>,
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
