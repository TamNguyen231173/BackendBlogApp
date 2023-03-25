import { object, string, TypeOf } from "zod";

export const createPostSchema = object({
  body: object({
    title: string({
      required_error: "Title is required",
    }),
    content: string({
      required_error: "Content is required",
    }),
    image: string({
      required_error: "Image is required",
    }),
  }),
});

const params = {
  params: object({
    postId: string(),
  }),
};

const paramsCategory = {
  params: object({
    categoryId: string(),
  }),
};

export const getPostSchema = object({
  ...params,
});

export const updatePostSchema = object({
  ...params,
  body: object({
    title: string(),
    content: string(),
    image: string(),
  }).partial(),
});

export const deletePostSchema = object({
  ...params,
});

export const createCategorySchema = object({
  body: object({
    category: string({
      required_error: "Category name is required",
    }),
  }),
});

export const getCategorySchema = object({
  ...paramsCategory,
});

export const updateCategorySchema = object({
  ...paramsCategory,
  body: object({
    category: string(),
  }).partial(),
});

export const deleteCategorySchema = object({
  ...paramsCategory,
});

export type CreatePostInput = TypeOf<typeof createPostSchema>["body"];
export type GetPostInput = TypeOf<typeof getPostSchema>["params"];
export type UpdatePostInput = TypeOf<typeof updatePostSchema>;
export type DeletePostInput = TypeOf<typeof deletePostSchema>["params"];
export type CreateCategoryInput = TypeOf<typeof createCategorySchema>["body"];
export type GetCategoryInput = TypeOf<typeof getCategorySchema>["params"];
export type UpdateCategoryInput = TypeOf<typeof updateCategorySchema>;
export type DeleteCategoryInput = TypeOf<typeof deleteCategorySchema>["params"];
