require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import config from "config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/connectDB";
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import postRouter from "./routes/post.route";
import commonRouter from "./routes/common.route";
import categoryRouter from "./routes/category.route";
const path = require("path");
const pug = require("pug");

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "./public/");
const viewsPath = path.join(__dirname, "./templates/views");
const partialsPath = path.join(__dirname, "./templates/partials");
const helpers = path.join(__dirname, "./utils/helpers");

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// Setup handlebars engine and views location
app.set("view engine", "pug");
app.set("views", viewsPath);

// Middleware

// 1. Body Parser
app.use(express.json({ limit: "10kb" }));

// 2. Cookie Parser
app.use(cookieParser());

// 3. Logger
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// 4. Cors
app.use(
  cors({
    origin: config.get<string>("origin"),
    credentials: true,
  })
);

// 5. Routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("", authRouter);
app.use("/api/posts", postRouter);
app.use("/common", commonRouter);
app.use("/api/categories", categoryRouter);

// Testing
app.get("/healthChecker", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to CodevoWeb😂😂👈👈",
  });
});

// UnKnown Routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  res.render("404Page");
  next(err);
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

const port = config.get<number>("port");
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
  // 👇 call the connectDB function here
  connectDB();
});
