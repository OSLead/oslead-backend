import express, { Request, Response } from "express";

import { body } from "express-validator";
import { login_ADMIN } from "../controllers/admin/auth.controller";
import { VERIFY_TOKEN } from "../middlewares/verifyjwt.middleware";
import { VERIFY_ROLE_ADMIN } from "../middlewares/verifyrole.middleware";
import { ASSIGN_POINTS_FOR_EVENTS } from "../controllers/admin/admin.controller";

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

router.patch("/assign-points-for-events/:contributorGithubId",[VERIFY_TOKEN,VERIFY_ROLE_ADMIN],ASSIGN_POINTS_FOR_EVENTS);

export default router;
