import express from "express";
import { Request, Response } from "express";

const router = express.Router();

export const chart = (req: Request, res: Response) => {
  res.render("chart");
};

export const form = (req: Request, res: Response) => {
  res.render("form");
};

router.get("/chart", chart);
router.get("/form", form);

export default router;
