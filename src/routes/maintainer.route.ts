import express, { NextFunction, Request, Response } from "express";
import { createAccount_PROJECTOWNER } from "../controllers/auth/auth.controller";
import passport from "passport";
import { VERIFY_TOKEN } from "../middlewares/verifyjwt.middleware";
import { VALIDATE_REGISTER } from "../middlewares/datavalidation.middleware";
import { VERIFY_ROLE_ADMIN, VERIFY_ROLE_MAINTAINER } from "../middlewares/verifyrole.middleware";
import { MAINTAINER_REGISTER } from "../controllers/maintainer/register.controller";
import { GET_ALL_MAINTAINERS, GET_MAINTAINER_PERSONAL_DETAILS } from "../controllers/maintainer/maintainer.controller";
const router = express.Router();
var GitHubStrategy = require("passport-github2").Strategy;

router.get("/", (req: Request, res: Response) => {
  res.status(200).send({ message: "Maintainer route is working fine." });
});
router.get(
  "/auth/github",
  async function (req: Request, res: Response, next: NextFunction) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: process.env.GITHUB_CALLBACK_URL_PO,
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
    return await createAccount_PROJECTOWNER(req, res);
  }
);

router.post(
  "/register",
  [VERIFY_TOKEN, VALIDATE_REGISTER, VERIFY_ROLE_MAINTAINER],
  MAINTAINER_REGISTER
);

router.post(
  "/profile-details",
  [VERIFY_TOKEN, VERIFY_ROLE_MAINTAINER],
  GET_MAINTAINER_PERSONAL_DETAILS
);

router.get(
  "/get-all-maintainers",
  [VERIFY_TOKEN, VERIFY_ROLE_ADMIN],
  GET_ALL_MAINTAINERS
);

export default router;
