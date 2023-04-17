import { omit, get } from "lodash";
import { FilterQuery, QueryOptions } from "mongoose";
import config from "config";
import userModel, { User } from "../models/user.model";
import postModel, { Post } from "../models/post.model";
import { signJwt } from "../utils/jwt";
import redisClient from "../utils/connectRedis";
import { DocumentType } from "@typegoose/typegoose";

// CreateUser service
export const createUser = async (input: Partial<User>) => {
  return await userModel.create({ ...input });
};

// Find User by Id
export const findUserById = async (id: string) => {
  return await userModel.findById(id).lean();
};

// Find All users
export const findAllUsers = async (page: number) => {
  let perPage = 10;
  const count = await userModel.countDocuments();
  const users = await userModel
    .find()
    .sort({ createdAt: -1 })
    .skip(perPage * page - perPage)
    .limit(perPage)
    .lean();

  return { users, count };
};

// Find one user by any fields
export const findUser = async (
  query: FilterQuery<User>,
  options: QueryOptions = {}
) => {
  return await userModel.findOne(query, {}, options).select("+password");
};

// Sign Token
export const signToken = async (user: DocumentType<User>) => {
  // Sign the access token
  const access_token = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
    expiresIn: `${config.get<number>("accessTokenExpiresIn")}h`,
  });

  // Create a Session
  redisClient.set(user.id, JSON.stringify(user), {
    EX: 60 * 60,
  });

  // Return access token
  return { access_token };
};

// Find and update user
export const findAndUpdateUser = async (
  query: FilterQuery<User>,
  update: Partial<User>,
  options: QueryOptions
) => {
  return userModel.findOneAndUpdate(query, update, options);
};

// Find one and delete user
export const findOneAndDelete = async (
  query: FilterQuery<User>,
  options: QueryOptions = {}
) => {
  return await userModel.findOneAndDelete(query, options);
};

// Toggle bookmark
export const toggleBookmark = async (userId: string, postId: string) => {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const bookmarkIndex = user.bookmarks.indexOf(postId);
  if (bookmarkIndex === -1) {
    // If post is not bookmarked, add it to bookmarks
    user.bookmarks.push(postId);
  } else {
    // If post is already bookmarked, remove it from bookmarks
    user.bookmarks.splice(bookmarkIndex, 1);
  }

  return await user.save();
};

// Get user bookmarks
export const getUserBookmarks = async (userId: string) => {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const bookmarks = await postModel
    .find({ _id: { $in: user.bookmarks } })
    .lean();

  return bookmarks;
};
