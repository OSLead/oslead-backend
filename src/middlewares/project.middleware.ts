import { Request, Response, NextFunction } from "express";
import { ERRORS_MESSAGE } from "../utils/response_messages";
import { Project } from "../models/projects.model";
import { GET_REPO_DETAILS, GET_REPO_NAME_BY_URL } from "../utils/githubAPIs";

const CHECK_DUPLICATE_GITHUB_REPO_LINK = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const repoUrl = req.body.github_repo_link;
    const githubRepoName = GET_REPO_NAME_BY_URL(repoUrl);
    const userRepoDetails = await GET_REPO_DETAILS(
      res.locals.userDetails.username,
      githubRepoName
    );

    if (!userRepoDetails?.id) return res.status(500).send(userRepoDetails);
    const doc = await Project.findOne({
      "projectDetails.id": userRepoDetails.id,
    }).select("projectDetails.id");

    if (doc) {
      return res
        .status(400)
        .send({ message: ERRORS_MESSAGE.DUPLICATE_GITHUB_REPO_LINK });
    }

    res.locals.userRepoDetails = userRepoDetails;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: ERRORS_MESSAGE.ERROR_500 });
  }
};

export { CHECK_DUPLICATE_GITHUB_REPO_LINK };
