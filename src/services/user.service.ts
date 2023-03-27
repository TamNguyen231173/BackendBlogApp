import { omit, get } from "lodash";
import { FilterQuery, QueryOptions } from "mongoose";
import config from "config";
import userModel, { User } from "../models/user.model";
import { excludedFields } from "../controllers/auth.controller";
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
  let perpage = 10;
  const count = await userModel.countDocuments();
  const users = await userModel
    .find()
    .skip(perpage * page - perpage)
    .limit(perpage)
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
    expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
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
