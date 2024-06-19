// remove this file in prod.
// the route already declared in contributor.route.ts

import express, { NextFunction, Request, Response } from "express";
import { createAccount_CONTRIBUTOR } from "../controllers/auth/auth.controller";
import passport from "passport";
const router = express.Router();
var GitHubStrategy = require("passport-github2").Strategy;

router.get(
  "/github",
  async function (req: Request, res: Response, next: NextFunction) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: process.env.GITHUB_CALLBACK_URL,
        },
        async function (
          accessToken: any,
          refreshToken: any,
          profile: any,
          done: any
        ) {
          return done(null, profile);
        }
      )
    );
    next();
  },
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/callback",
  passport.authenticate("github", { failureRedirect: "/api/error/login" }),
  async function (req: Request, res: Response) {
    return await createAccount_CONTRIBUTOR(req, res);
  }
);

export default router;
