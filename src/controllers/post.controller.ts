import { NextFunction, Request, Response } from "express";
import {
  CreatePostInput,
  DeletePostInput,
  GetAllPostsInput,
  GetPostInput,
  UpdatePostInput,
  GetPostsByCategoryInput,
  GetPostsByUserInput,
  CreateCommentInput,
  CreateReplyInput,
} from "../schema/post.schema";
import {
  createPost,
  findAllPosts,
  findAndUpdatePost,
  findOneAndDelete,
  findPostById,
  findPostsByCategory,
  findPostsByUser,
  createComment,
  createCommentReply,
} from "../services/post.service";
import { findAllUsers, findUserById } from "../services/user.service";
import { findAllCategories } from "../services/category.service";
import AppError from "../utils/appError";
import { faker } from "@faker-js/faker";

// Generate posts using faker
export const generatePostsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findAllUsers(1);
    const Category = await findAllCategories();
    for (let i = 0; i < 200; i++) {
      // const userFake = faker.helpers.arrayElement(user);
      // const categoryFake = faker.helpers.arrayElement(Category);
      // const post = await createPost({
      //   input: {
      //     title: faker.lorem.sentence(),
      //     content: faker.lorem.paragraph(),
      //     logo:
      //       faker.image.imageUrl(1920, 1080) +
      //       "?random=" +
      //       Math.round(Math.random() * 1000),
      //     image:
      //       faker.image.imageUrl(1920, 1080) +
      //       "?random=" +
      //       Math.round(Math.random() * 1000),
      //     category: {
      //       id: categoryFake._id.toString(),
      //       name: categoryFake.name,
      //     },
      //     userInfo: {
      //       _id: userFake._id.toString(),
      //       name: userFake.name,
      //       email: userFake.email,
      //       avatar: userFake.avatar,
      //     },
      //   },
      //   user_id: userFake._id.toString(),
      // });
    }

    res.status(201).json({
      status: "success",
      data: {
        message: "Posts generated successfully",
      },
    });
  } catch (err: any) {
    next(err);
  }
};

// Create post handler
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
      post,
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

// Get one post handler
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

// Get many posts to render in view
export const getPostsRender = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let perPage = 10;
    let page = parseInt(req.params.page);
    if (isNaN(page)) {
      page = 1;
    }
    const posts = await findAllPosts(page);
    const user = await findUserById(res.locals.user._id);
    const categories = await findAllCategories();

    res.render("post", {
      title: "posts",
      posts: posts.posts,
      current: page,
      pages: Math.ceil(posts.count / perPage),
      user,
      categories,
    });
  } catch (err: any) {
    next(err);
  }
};

// Get many posts handler return json
export const getPostsHandler = async (
  req: Request<GetAllPostsInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    let perPage = 10;
    let page = req.params.page;
    const posts = await findAllPosts(page);
    const user = await findUserById(res.locals.user._id);

    if (!posts) {
      return next(new AppError("Posts not found", 404));
    }

    res.status(200).json({
      status: "success",
      title: "posts",
      posts: posts.posts,
      current: page,
      user,
      pages: Math.ceil(posts.count / perPage),
    });
  } catch (err: any) {
    next(err);
  }
};

// Get post edit handler
export const getPostEditHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await findPostById(req.params.postId);
    const user = await findUserById(res.locals.user._id);
    const categories = await findAllCategories();

    if (!post) {
      return next(new AppError("Post with that ID not found", 404));
    }

    res.render("edit", {
      title: "Edit Post",
      post,
      user,
      categories,
    });
  } catch (err: any) {
    next(err);
  }
};

// Update post handler
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

// Delete post handler
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

// Parse post form data
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

// Get posts by category handler
export const getPostsByCategoryHandler = async (
  req: Request<GetPostsByCategoryInput>,
  res: Response,
  next: NextFunction
) => {
  let perPage = 10;
  let page = req.params.page;
  const posts = await findPostsByCategory(req.params.categoryId, page);

  if (!posts) {
    return next(new AppError("Posts not found", 404));
  }

  res.status(200).json({
    title: "posts",
    posts: posts.posts,
    current: page,
    pages: Math.ceil(posts.count / perPage),
  });
};

// Get posts by user handler
export const getPostsByUserHandler = async (
  req: Request<GetPostsByUserInput>,
  res: Response,
  next: NextFunction
) => {
  let perPage = 10;
  let page = req.params.page;

  const posts = await findPostsByUser(req.params.userId, page);

  if (!posts) {
    return next(new AppError("Posts not found", 404));
  }

  res.status(200).json({
    title: "posts",
    posts: posts.posts,
    current: page,
    pages: Math.ceil(posts.count / perPage),
  });
};

// Create comment for post handler
export const createCommentHandler = async (
  req: Request<CreateCommentInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await createComment({
      post_id: req.params.postId,
      user_id: res.locals.user._id,
      comment: req.body.content,
    });

    if (!comment) {
      return next(new AppError("Comment not created", 404));
    }

    res.status(201).json({
      status: "success",
      data: {
        comment,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

// Create reply for comment handler
export const createReplyHandler = async (
  req: Request<CreateReplyInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const reply = await createCommentReply({
      post_id: req.params.postId,
      user_id: res.locals.user._id,
      comment_id: req.params.commentId,
      comment: req.body.content,
    });

    if (!reply) {
      return next(new AppError("Reply not created", 404));
    }

    res.status(201).json({
      status: "success",
      data: {
        reply,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
