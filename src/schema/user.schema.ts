import { object, string, TypeOf } from "zod";

const params = {
  params: object({
    userId: string(),
  }),
};

// Create user schema
export const createUserSchema = object({
  body: object({
    name: string({ required_error: "Name is required" }),
    email: string({ required_error: "Email is required" }).email(
      "Invalid email"
    ),
    password: string({ required_error: "Password is required" })
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    passwordConfirm: string({ required_error: "Please confirm your password" }),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  }),
});

// Login user schema
export const loginUserSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Invalid email or password"
    ),
    password: string({ required_error: "Password is required" }).min(
      8,
      "Invalid email or password"
    ),
  }),
});

// Verify email schema
export const verifyEmailSchema = object({
  params: object({
    verificationCode: string(),
  }),
});

export const getUserSchema = object({
  ...params,
});

export const updateUserSchema = object({
  ...params,
  body: object({
    name: string(),
    email: string().email("Invalid email"),
    avatar: string(),
    role: string(),
  }).partial(),
});

// Resend verification code schema
export const resendVerificationCodeSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Invalid email"
    ),
  }),
});

// Delete user schema
export const deleteUserSchema = object({
  ...params,
});

// Toggle bookmark schema
export const toggleBookmarkSchema = object({
  body: object({
    postId: string({ required_error: "Post id is required" }),
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
export type LoginUserInput = TypeOf<typeof loginUserSchema>["body"];
export type GetUserInput = TypeOf<typeof getUserSchema>["params"];
export type UpdateUserInput = TypeOf<typeof updateUserSchema>;
export type DeleteUserInput = TypeOf<typeof deleteUserSchema>["params"];
export type VerifyEmailInput = TypeOf<typeof verifyEmailSchema>["params"];
export type ResendVerificationCodeInput = TypeOf<
  typeof resendVerificationCodeSchema
>["body"];
export type ToggleBookmarkInput = TypeOf<typeof toggleBookmarkSchema>["body"];
