import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import postModel, { Post } from "../models/post.model";
import commentModel from "../models/comment.model";

// Create a new post
export const createPost = async ({
  input,
  user_id,
}: {
  input: Partial<Post>;
  user_id: string;
}) => {
  return postModel.create({ ...input, user: user_id });
};

// Find a post by id
export const findPostById = async (id: string) => {
  return postModel.findById(id).lean();
};

// Find all posts
export const findAllPosts = async (page: number) => {
  let perpage = 10;

  const posts = await postModel
    .find()
    .sort({ _id: -1 })
    .skip(perpage * page - perpage)
    .limit(perpage)
    .lean();

  const count = await postModel.countDocuments();
  return { posts, count };
};

// Find post by query
export const findPost = async (
  query: FilterQuery<Post>,
  options: QueryOptions = {}
) => {
  return await postModel.findOne(query, {}, options);
};

// Find post and update
export const findAndUpdatePost = async (
  query: FilterQuery<Post>,
  update: UpdateQuery<Post>,
  options: QueryOptions
) => {
  return await postModel.findOneAndUpdate(query, update, options);
};

// Find post and delete
export const findOneAndDelete = async (
  query: FilterQuery<Post>,
  options: QueryOptions = {}
) => {
  return await postModel.findOneAndDelete(query, options);
};

// Find post by category
export const findPostsByCategory = async (id: string, page: number) => {
  let perpage = 10;
  const posts = await postModel
    .find({ "category.id": id })
    .sort({ _id: -1 })
    .skip(perpage * page - perpage)
    .limit(perpage)
    .lean();

  const count = await postModel.countDocuments();
  return { posts, count };
};

// Find post by user
export const findPostsByUser = async (id: string, page: number) => {
  let perpage = 10;
  const posts = await postModel
    .find({ "userInfo._id": id })
    .sort({ _id: -1 })
    .skip(perpage * page - perpage)
    .limit(perpage)
    .lean();

  const count = await postModel.countDocuments();
  return { posts, count };
};

// Create comment for post
export const createComment = async ({
  post_id,
  user_id,
  comment,
}: {
  post_id: string;
  user_id: string;
  comment: string;
}) => {
  const commentCreated = await commentModel.create({ users: user_id, comment });
  return await postModel.findByIdAndUpdate(
    post_id,
    {
      $push: {
        comments: commentCreated,
      },
    },
    { new: true }
  );
};

// Create comment reply for post
export const createCommentReply = async ({
  post_id,
  comment_id,
  user_id,
  comment,
}: {
  post_id: string;
  comment_id: string;
  user_id: string;
  comment: string;
}) => {
  const commentCreated = await commentModel.create({ users: user_id, comment });

  const commentPostUpdate = await postModel
    .findByIdAndUpdate(
      post_id,
      {
        $push: {
          "comments.$[comment].replies": commentCreated,
        },
      },
      {
        upsert: true,
        new: true,
        arrayFilters: [{ "comment.id": comment_id }],
      }
    )
    .select("comments");
    
  console.log("commentCreated", commentPostUpdate);

  return commentPostUpdate;
};

// Get comments of post with user info
export const findCommentsByPostId = async (post_id: string) => {
  return await postModel
    .findById(post_id)
    .populate({
      path: "comments",
      populate: {
        path: "users",
        model: "User",
        select: "name avatar",
      },
    })
    .populate({
      path: "comments",
      populate: {
        path: "replies",
        populate: {
          path: "users",
          model: "User",
          select: "name avatar",
        },
      },
    })
    .select("comments");
};
