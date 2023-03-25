import { NextFunction, Request, Response } from "express";
import {
  CreatePostInput,
  DeletePostInput,
  GetPostInput,
  UpdatePostInput,
} from "../schema/post.schema";
import {
  createPost,
  findAllPosts,
  findAndUpdatePost,
  findOneAndDelete,
  findPost,
  findPostById,
} from "../services/post.service";
import { findUserById } from "../services/user.service";
import AppError from "../utils/appError";

export const createPostHandler = async (
  req: Request<{}, {}, CreatePostInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = res.locals.user._id;

    const post = await createPost({ input: req.body, user_id });

    res.status(201).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({
        status: "fail",
        message: "Post with that title already exist",
      });
    }
    next(err);
  }
};

export const getPostHandler = async (
  req: Request<GetPostInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await findPostById(req.params.postId);

    if (!post) {
      return next(new AppError("Post with that ID not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getPostsRender = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await findAllPosts();
    const user = await findUserById(res.locals.user._id);

    res.render("post", {
      title: "Posts",
      posts,
      user,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getPostsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await findAllPosts();
    const user = await findUserById(res.locals.user._id);

    res.status(200).json({
      status: "success",
      data: {
        title: "Posts",
        posts,
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getPostEditHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await findPostById(req.params.postId);
    const user = await findUserById(res.locals.user._id);

    if (!post) {
      return next(new AppError("Post with that ID not found", 404));
    }

    res.render("edit", {
      title: "Edit Post",
      post,
      user,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updatePostHandler = async (
  req: Request<UpdatePostInput["params"], {}, UpdatePostInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedPost = await findAndUpdatePost(
      { _id: req.params.postId },
      req.body,
      {}
    );

    if (!updatedPost) {
      return next(new AppError("Post with that ID not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        post: updatedPost,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const deletePostHandler = async (
  req: Request<DeletePostInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await findOneAndDelete({ _id: req.params.postId });

    if (!post) {
      return next(new AppError("Post with that ID not found", 404));
    }

    res.status(204).json({
      status: "success",
    });
  } catch (err: any) {
    next(err);
  }
};

export const parsePostFormData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.data) return next();
    const parsedBody = { ...JSON.parse(req.body.data) };
    if (req.body.image) {
      parsedBody["image"] = req.body.image;
    }

    if (req.body.images) {
      parsedBody["images"] = req.body.images;
    }

    req.body = parsedBody;
    next();
  } catch (err: any) {
    next(err);
  }
};
