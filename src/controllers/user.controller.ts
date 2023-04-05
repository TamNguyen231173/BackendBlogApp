import { NextFunction, Request, Response } from "express";
import {
  findAllUsers,
  createUser,
  findUserById,
  findAndUpdateUser,
  findOneAndDelete,
} from "../services/user.service";
import { faker } from "@faker-js/faker";
import {
  DeleteUserInput,
  GetUserInput,
  UpdateUserInput,
} from "../schema/user.schema";
import AppError from "../utils/appError";

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
