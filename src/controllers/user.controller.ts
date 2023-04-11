import { NextFunction, Request, Response } from "express";
import {
  findAllUsers,
  createUser,
  findUserById,
  findAndUpdateUser,
  findOneAndDelete,
  addPostToBookmark,
} from "../services/user.service";
import { findPostById } from "../services/post.service";
import { faker } from "@faker-js/faker";
import {
  DeleteUserInput,
  GetUserInput,
  UpdateUserInput,
  AddBookmarkInput,
  RemoveBookmarkInput,
  GetBookmarkInput,
} from "../schema/user.schema";
import AppError from "../utils/appError";

// Generate 200 users
export const generateUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    for (let i = 0; i < 100; i++) {
      const user = await createUser({
        name: faker.name.firstName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar() + "?random=" + i,
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(["user", "admin"]),
      });
    }

    res.status(201).json({
      status: "success",
      data: {
        message: "Users generated successfully",
      },
    });
  } catch (err: any) {
    next(err);
  }
};

// Get my info
export const getMyInfoHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err: any) {
    next(err);
  }
};

// Get all users (render)
export const getAllUsersRender = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let perPage = 10;
    let page = parseInt(req.params.page);
    let users = await findAllUsers(page);

    res.render("user", {
      title: "users",
      users: users.users,
      pages: Math.ceil(users.count / perPage),
      current: page,
    });
  } catch (err: any) {
    next(err);
  }
};

// Get all users
export const getUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let perPage = 10;
    let page = parseInt(req.params.page);
    let users = await findAllUsers(page);

    res.status(200).json({
      status: "success",
      title: "users",
      users: users.users,
      pages: Math.ceil(users.count / perPage),
      current: page,
    });
  } catch (err: any) {
    next(err);
  }
};

// Get user by id
export const getUserHandler = async (
  req: Request<GetUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUserById(req.params.userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err: any) {
    next(err);
  }
};

// Update user by id
export const updateUserHandler = async (
  req: Request<UpdateUserInput["params"], {}, UpdateUserInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const updateUser = await findAndUpdateUser(
      { _id: req.params.userId },
      req.body,
      {}
    );

    if (!updateUser) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        message: "User updated successfully",
      },
    });
  } catch (err: any) {
    next(err);
  }
};

// Delete user by id
export const deleteUserHandler = async (
  req: Request<DeleteUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findOneAndDelete({ _id: req.params.userId });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        message: "User deleted successfully",
      },
    });
  } catch (err: any) {
    next(err);
  }
};

// Add post to bookmark
export const addPostToBookmarkHandler = async (
  req: Request<AddBookmarkInput>,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;
  const post = await findPostById(req.body.postId);

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  // Check if post already in bookmark
  if (user.bookmarks.length > 0) {
    const isPostInBookmark = user.bookmarks.findIndex(
      (bookmark: any) => bookmark._id.toString() === post._id.toString()
    );

    if (isPostInBookmark !== -1) {
      return next(new AppError("Post already in bookmark", 400));
    }
  }

  try {
    await addPostToBookmark(
      {
        _id: user._id,
      },
      {
        $push: { bookmarks: post },
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        message: "Post added to bookmark successfully",
      },
    });
  } catch (err: any) {
    next(err);
  }
};

// Get posts in bookmark
export const getPostsInBookmarkHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    const posts = user.bookmarks;

    console.log("what the fuck");

    res.status(200).json({
      status: "success",
      posts,
    });
  } catch (err: any) {
    next(err);
  }
};
