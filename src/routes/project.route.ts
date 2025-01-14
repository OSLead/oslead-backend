import express from "express";
import {
  CREATE_PROJECT_ADMIN,
  CREATE_PROJECT_MAINTAINER,
  ENROLL_PROJECT,
  EVALUATE_PULL_REQUEST,
  GET_ENROLLED_PROJECTS,
  GET_LEADERBOARD,
  GET_PROJECTS,
  GET_PROJECT_BY_ID,
  GET_PUBLISHED_PROJECTS,
} from "../controllers/project/project.controller";
import { VERIFY_TOKEN } from "../middlewares/verifyjwt.middleware";
import {
  VERIFY_ROLE_ADMIN,
  VERIFY_ROLE_CONTRIBUTOR,
  VERIFY_ROLE_MAINTAINER,
} from "../middlewares/verifyrole.middleware";
import { CHECK_DUPLICATE_GITHUB_REPO_LINK } from "../middlewares/project.middleware";
const router = express.Router();

router.post(
  "/create-project",
  [VERIFY_TOKEN, VERIFY_ROLE_MAINTAINER, CHECK_DUPLICATE_GITHUB_REPO_LINK],
  CREATE_PROJECT_MAINTAINER
);

router.post(
  "/create-project-by-admin",[VERIFY_TOKEN,VERIFY_ROLE_ADMIN],
  CREATE_PROJECT_ADMIN
)

router.post("/get-project-by-id", [VERIFY_TOKEN], GET_PROJECT_BY_ID);

router.post("/get-projects", [VERIFY_TOKEN], GET_PROJECTS);

router.post(
  "/get-published-projects",
  [VERIFY_TOKEN, VERIFY_ROLE_MAINTAINER],
  GET_PUBLISHED_PROJECTS
);

router.post(
  "/enroll-project",
  [VERIFY_TOKEN, VERIFY_ROLE_CONTRIBUTOR],
  ENROLL_PROJECT
);

router.post(
  "/enrolled-projects",
  [VERIFY_TOKEN, VERIFY_ROLE_CONTRIBUTOR],
  GET_ENROLLED_PROJECTS
);

router.post(
  "/analyze-pull-points",
  [VERIFY_TOKEN, VERIFY_ROLE_MAINTAINER],
  EVALUATE_PULL_REQUEST
);

router.get("/leaderboard", GET_LEADERBOARD);

export default router;
