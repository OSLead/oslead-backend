import express, { NextFunction, Request, Response } from "express";
import { VERIFY_TOKEN } from "../middlewares/verifyjwt.middleware";
import { VERIFY_ROLE_ADMIN, VERIFY_ROLE_CONTRIBUTOR } from "../middlewares/verifyrole.middleware";
import { DELETE_PROJECT_SELECTED_BY_CONTRIBUTOR, getAllContributors, getContributorSelf } from "../controllers/contributor/contributor.controller";
import { USER_REGISTER } from "../controllers/contributor/register.controller";
import { VALIDATE_REGISTER } from "../middlewares/datavalidation.middleware";
import passport from "passport";
import { createAccount_CONTRIBUTOR } from "../controllers/auth/auth.controller";
const router = express.Router();
var GitHubStrategy = require("passport-github2").Strategy;

router.get("/", (req: Request, res: Response) => {
  res.status(200).send({ message: "Contributor route is working fine." });
});
router.get(
  "/auth/github",
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

router.post(
  "/details-own",
  [VERIFY_TOKEN, VERIFY_ROLE_CONTRIBUTOR],
  getContributorSelf
);

router.post(
  "/register",
  [VERIFY_TOKEN, VALIDATE_REGISTER, VERIFY_ROLE_CONTRIBUTOR],
  USER_REGISTER
);


router.get("/get-all-contributors",[VERIFY_TOKEN,VERIFY_ROLE_ADMIN],getAllContributors)

router.delete(
  "/delete-enrolled-project/:contributorId/:projectId",
  [VERIFY_TOKEN, VERIFY_ROLE_ADMIN],
  DELETE_PROJECT_SELECTED_BY_CONTRIBUTOR
);

export default router;
