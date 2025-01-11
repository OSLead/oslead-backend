import express, { Request, Response } from "express";

import { body } from "express-validator";
import { login_ADMIN } from "../controllers/admin/auth.controller";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET_KEY || "SubhranshuChoudhury";

router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login_ADMIN
);

export default router;
