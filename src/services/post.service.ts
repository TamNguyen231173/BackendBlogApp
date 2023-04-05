import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import postModel, { Post } from "../models/post.model";

export const createPost = async ({
  input,
  user_id,
}: {
  input: Partial<Post>;
  user_id: string;
}) => {
  return postModel.create({ ...input, user: user_id });
};

export const findPostById = async (id: string) => {
  return postModel.findById(id).lean();
};

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

export const findPost = async (
  query: FilterQuery<Post>,
  options: QueryOptions = {}
) => {
  return await postModel.findOne(query, {}, options);
};

export const findAndUpdatePost = async (
  query: FilterQuery<Post>,
  update: UpdateQuery<Post>,
  options: QueryOptions
) => {
  return await postModel.findOneAndUpdate(query, update, options);
};

export const findOneAndDelete = async (
  query: FilterQuery<Post>,
  options: QueryOptions = {}
) => {
  return await postModel.findOneAndDelete(query, options);
};

export const findPostsByCategory = async (_id: string, page: number) => {
  let perPage = 10;
  const posts = postModel
    .find({ "category.id": _id })
    .skip(perPage * page - perPage)
    .limit(perPage)
    .lean();

  const count = await postModel.countDocuments();
  return { posts, count };
};
