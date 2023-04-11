import crypto from "crypto";
import config from "config";
import { CookieOptions, NextFunction, Request, Response } from "express";
import {
  CreateUserInput,
  LoginUserInput,
  VerifyEmailInput,
} from "../schema/user.schema";
import { createUser, findUser, signToken } from "../services/user.service";
import AppError from "../utils/appError";
import Email from "../utils/email";

// Exclude this fields from the response
export const excludedFields = ["password"];

// Cookie options
const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + config.get<number>("accessTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

// Only set secure to true in production
if (process.env.NODE_ENV === "production")
  accessTokenCookieOptions.secure = true;

export const registerHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await createUser(req.body);

    const verificationCode = user.createVerificationCode();
    await user.save({ validateBeforeSave: false });

    // Send Verification Email
    const redirectUrl = `${config.get<string>(
      "origin"
    )}/verifyemail/${verificationCode}`;

    try {
      await new Email(
        user,
        redirectUrl,
        verificationCode
      ).sendVerificationCode();
      res.status(201).json({
        status: "success",
        message:
          "An email with a verification code has been sent to your email",
      });
    } catch (error) {
      user.verificationCode = null;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        status: "error",
        message: "There was an error sending email, please try again",
      });
    }
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({
        status: "fail",
        message: "Email already exist",
      });
    }
    next(err);
  }
};

export const login = (req: Request, res: Response) => {
  res.render("login");
};

export const loginHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user from the collection
    const user = await findUser({ email: req.body.email });

    // Check if user exist and password is correct
    if (
      !user ||
      !(await user.comparePasswords(user.password, req.body.password))
    ) {
      return next(new AppError("Invalid email or password", 401));
    }

    // Create an Access Token
    const { access_token } = await signToken(user);

    // Send Access Token in Cookie
    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // Send Access Token
    res.status(200).json({
      status: "success",
      access_token,
    });
  } catch (err: any) {
    next(err);
  }
};

// Verify email handler
export const verifyEmailHandler = async (
  req: Request<VerifyEmailInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const verificationCode = crypto
      .createHash("sha256")
      .update(req.params.verificationCode)
      .digest("hex");

    const user = await findUser({ verificationCode });

    if (!user) {
      return next(new AppError("Could not verify email", 401));
    }

    user.verified = true;
    user.verificationCode = null;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (err: any) {
    next(err);
  }
};

// Resend verification code handler
export const resendVerificationCodeHandler = async (
  req: Request<{}, {}, { email: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUser({ email: req.body.email });

    if (!user) {
      return next(new AppError("Could not verify email", 401));
    }

    const verificationCode = user.createVerificationCode();
    await user.save({ validateBeforeSave: false });

    // Send Verification Email
    const redirectUrl = `${config.get<string>(
      "origin"
    )}/api/verifyEmail/${verificationCode}`;

    try {
      await new Email(
        user,
        redirectUrl,
        verificationCode
      ).sendVerificationCode();
      res.status(201).json({
        status: "success",
        message:
          "An email with a verification code has been sent to your email",
      });
    } catch (error) {
      user.verificationCode = null;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        status: "error",
        message: "There was an error sending email, please try again",
      });
    }
  } catch (err: any) {
    next(err);
  }
};
