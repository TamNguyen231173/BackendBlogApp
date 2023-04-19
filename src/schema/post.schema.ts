import { number, object, string, TypeOf } from "zod";

// ================ POST SCHEMA ================
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

export const getAllPostsSchema = object({
  params: object({
    page: number(),
  }),
});

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

export const getPostsByCategorySchema = object({
  params: object({
    categoryId: string(),
    page: number(),
  }),
});

export const getPostsByUser = object({
  params: object({
    userId: string(),
    page: number(),
  }),
});

// ================ CATEGORY SCHEMA ================
export const createCategorySchema = object({
  body: object({
    name: string({
      required_error: "Category name is required",
    }),
  }),
});

export const getCategorySchema = object({
  ...paramsCategory,
});

export const getAllCategoriesSchema = object({
  params: object({
    page: number(),
  }),
});

export const updateCategorySchema = object({
  ...paramsCategory,
  body: object({
    name: string(),
  }).partial(),
});

export const deleteCategorySchema = object({
  ...paramsCategory,
});

// ================ COMMENT SCHEMA ================
export const createCommentSchema = object({
  ...params,
  body: object({
    content: string({
      required_error: "Content is required",
    }),
  }),
});

const paramsReply = {
  params: object({
    postId: string(),
    commentId: string(),
  }),
};

export const createReplySchema = object({
  ...paramsReply,
  body: object({
    content: string({
      required_error: "Content is required",
    }),
  }),
});

export const editCommentSchema = object({
  ...paramsReply,
  body: object({
    content: string({
      required_error: "Content is required",
    }),
  }),
});

export const deleteCommentSchema = object({
  ...paramsReply,
});

export const getCommentsOfPostSchema = object({
  ...params,
});

export type CreatePostInput = TypeOf<typeof createPostSchema>["body"];
export type GetPostInput = TypeOf<typeof getPostSchema>["params"];
export type UpdatePostInput = TypeOf<typeof updatePostSchema>;
export type DeletePostInput = TypeOf<typeof deletePostSchema>["params"];
export type CreateCategoryInput = TypeOf<typeof createCategorySchema>["body"];
export type GetCategoryInput = TypeOf<typeof getCategorySchema>["params"];
export type UpdateCategoryInput = TypeOf<typeof updateCategorySchema>;
export type DeleteCategoryInput = TypeOf<typeof deleteCategorySchema>["params"];
export type GetAllPostsInput = TypeOf<typeof getAllPostsSchema>["params"];
export type GetAllCategoriesInput = TypeOf<
  typeof getAllCategoriesSchema
>["params"];
export type GetPostsByCategoryInput = TypeOf<
  typeof getPostsByCategorySchema
>["params"];
export type GetPostsByUserInput = TypeOf<typeof getPostsByUser>["params"];
export type CreateCommentInput = TypeOf<typeof createCommentSchema>["params"];
export type CreateReplyInput = TypeOf<typeof createReplySchema>["params"];
export type GetCommentsOfPostInput = TypeOf<
  typeof getCommentsOfPostSchema
>["params"];
export type EditCommentInput = TypeOf<typeof editCommentSchema>["params"];
export type DeleteCommentInput = TypeOf<typeof deleteCommentSchema>["params"];
