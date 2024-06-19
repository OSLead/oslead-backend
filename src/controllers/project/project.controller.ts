import { Response, Request } from "express";
import { Project } from "../../models/projects.model";
import { ERRORS_MESSAGE, SUCCESS_MESSAGE } from "../../utils/response_messages";
import { User } from "../../models/contributor.model";
import { GET_PULL_REQUEST_DETAILS } from "../../utils/githubAPIs";
import { EvaluatedStorage } from "../../models/evaluatedpulls.model";
import { EvaluationStorage } from "../../models/evaluation.model";

const CREATE_PROJECT_MAINTAINER = async (req: Request, res: Response) => {
  try {
    const newProject = new Project({
      projectDetails: res.locals.userRepoDetails,
      ownedBy: {
        userId: res.locals.userDetails._id,
        github_id: res.locals.userDetails.github_id,
      },
    });

    const doc = await newProject.save();
    res
      .status(200)
      .send({ message: SUCCESS_MESSAGE.PROJECT_CREATED_SUCCESS, doc });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: ERRORS_MESSAGE.ERROR_500 });
  }
};

const GET_PROJECTS = async (req: Request, res: Response) => {
  // we need limit and skip for pagination
  try {
    const selectChoice = [
      "projectDetails.name",
      "projectDetails.html_url",
      "projectDetails.description",
      "projectDetails.language",
      "projectDetails.owner.login",
      "projectDetails.owner.avatar_url",
    ];
    const doc = await Project.find().select(selectChoice);
    res.status(200).send(doc);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: ERRORS_MESSAGE.ERROR_500 });
  }
};

const GET_PROJECT_BY_ID = async (req: Request, res: Response) => {
  try {
    const doc = await Project.findById(req.body.projectId);
    res.status(200).send(doc);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: ERRORS_MESSAGE.ERROR_500 });
  }
};

const GET_PUBLISHED_PROJECTS = async (req: Request, res: Response) => {
  try {
    const selectChoice = [
      "projectDetails.name",
      "projectDetails.html_url",
      "projectDetails.description",
      "projectDetails.language",
      "projectDetails.owner.login",
      "projectDetails.owner.avatar_url",
    ];

    const doc = await Project.find({
      "projectDetails.owner.id": Number(res.locals.userDetails.github_id),
    }).select(selectChoice);
    res.status(200).send(doc);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: ERRORS_MESSAGE.ERROR_500 });
  }
};

const ENROLL_PROJECT = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.body;
    const localUser = res.locals.userDetails;

    const user = await User.findOne({ _id: localUser._id }).select(
      "enrolledProjects"
    );

    if (!user) {
      return res.status(400).json({ message: ERRORS_MESSAGE.ERROR_400 });
    }

    if (user.enrolledProjects && user.enrolledProjects.length >= 3) {
      // max 3 projects
      return res.status(400).json({ message: ERRORS_MESSAGE.MAX_PROJECTS });
    }

    const isEnrolledProject = user.enrolledProjects.find(
      (project) => project.projectId === projectId
    );

    if (isEnrolledProject) {
      return res.status(400).json({ message: ERRORS_MESSAGE.ALREADY_ENROLLED });
    }

    // If the user is not already enrolled, add them to the applied_contributors field

    const updatedProject = await Project.findOne({ _id: projectId }).select(
      "applied_contributors projectDetails"
    );

    if (!updatedProject) {
      return res.status(400).json({ message: ERRORS_MESSAGE.NO_REPO_FOUND });
    }

    const projectDetails: any = updatedProject.projectDetails;

    // update the user's enrolledProjects field

    user.enrolledProjects.push({
      projectId,
      projectName: projectDetails.name,
      projectUrl: projectDetails.html_url,
      apiUrl: projectDetails.url,
    });

    await user.save();

    // update the project's applied_contributors field

    updatedProject.applied_contributors.push({
      userId: localUser._id,
      username: localUser.username,
      github_id: localUser.github_id,
      name: localUser.name,
    });

    await updatedProject.save();

    res.status(200).json({ message: SUCCESS_MESSAGE.ENROLLED_PROJECT_SUCCESS });
  } catch (error) {
    console.error("Error enrolling user:", error);
    return res.status(500).json({ message: ERRORS_MESSAGE.ERROR_500 });
  }
};

const GET_ENROLLED_PROJECTS = async (req: Request, res: Response) => {
  try {
    const localUser = res.locals.userDetails;
    const user = await User.findOne({ _id: localUser._id }).select(
      "enrolledProjects"
    );

    if (!user) {
      return res.status(400).json({ message: ERRORS_MESSAGE.ERROR_400 });
    }

    res.status(200).json(user.enrolledProjects);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: ERRORS_MESSAGE.ERROR_500 });
  }
};

const EVALUATE_PULL_REQUEST = async (req: Request, res: Response) => {
  /*
  - We are not checking if the user is a "applied contributor" or not.
  - Currently we are accepting it but in future we can add a check for it.
  */

  try {
    const userData = res.locals.userDetails;
    const { pullUrl, difficulty } = req.body;
    const extractedData = extractGitHubInfo(pullUrl);

    if (!extractedData) {
      return res
        .status(400)
        .send({ message: ERRORS_MESSAGE.REPOSITORY_NOT_FOUND });
    }

    if (extractedData.username !== userData.username) {
      return res
        .status(403)
        .send({ message: ERRORS_MESSAGE.REPOSITORY_NOT_FOUND });
    }

    const project = await Project.findOne({
      "ownedBy.github_id": userData.github_id,
      "projectDetails.owner.login": extractedData.username,
      "projectDetails.name": extractedData.repoName,
    }).select(
      "ownedBy.github_id projectDetails.owner.login projectDetails.name"
    );

    if (!project) {
      return res
        .status(404)
        .send({ message: ERRORS_MESSAGE.REPOSITORY_NOT_FOUND });
    }

    const pullRequest = await GET_PULL_REQUEST_DETAILS(
      extractedData.username,
      extractedData.repoName,
      extractedData.pullRequestNumber
    );

    if (!pullRequest) {
      return res.status(404).send({ message: ERRORS_MESSAGE.ERROR_500 });
    }

    if (pullRequest.state !== "closed") {
      return res
        .status(400)
        .send({ message: ERRORS_MESSAGE.PULL_REQUEST_NOT_CLOSED });
    }

    if (pullRequest.merged === false) {
      return res
        .status(400)
        .send({ message: ERRORS_MESSAGE.PULL_REQUEST_NOT_MERGED });
    }

    const mergedAt = new Date(pullRequest.merged_at);
    // const mergedAt = new Date("2024-04-21T15:40:51.000Z"); // for testing

    // check if it is under the time limit (1 week)
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - mergedAt.getTime();
    const timeDifferenceInDays = timeDifference / (1000 * 3600 * 24);

    if (timeDifferenceInDays > 7) {
      return res
        .status(400)
        .send({ message: ERRORS_MESSAGE.MERGE_REQUEST_EXPIRED });
    }

    const pullLink = pullRequest.html_url;

    const contributorDetails = pullRequest.user;

    // check if the user not registered in our platform

    const isContributorAvailable = await User.findOne({
      github_id: contributorDetails.id,
    }).select("github_id username");

    if (!isContributorAvailable) {
      return res
        .status(400)
        .send({ message: ERRORS_MESSAGE.CONTRIBUTOR_NOT_FOUND });
    }

    const evaluatedPoints = DifficultyPoints[difficulty];
    // check if the pull is already evaluated
    const evaluatedPullData = await EvaluatedStorage.findOne({
      pullUrl: pullLink,
    }).select("pullUrl");

    if (evaluatedPullData) {
      return res
        .status(400)
        .send({ message: ERRORS_MESSAGE.PULL_REQUEST_EVALUATED });
    } else {
      const newEvaluatedPull = new EvaluatedStorage({
        github_id: userData.github_id,
        username: userData.username,
        userId: userData._id,
        pullUrl: pullLink,
        pointGivenTo: {
          github_id: pullRequest.user.id,
          points: evaluatedPoints,
          username: pullRequest.user.login,
        },
      });

      await newEvaluatedPull.save();
    }

    const evaluateUser = await EvaluationStorage.findOne({
      github_id: contributorDetails.id,
    }); // This is because we will also show the users who are not even not registered in our platform.

    const projectDetails: any = project.projectDetails;
    if (!evaluateUser) {
      const newEvalUser = new EvaluationStorage({
        github_id: contributorDetails.id,
        username: contributorDetails.login,
      });

      newEvalUser.totalPoints = Number(evaluatedPoints);
      newEvalUser.pointHistory.push({
        description: `${evaluatedPoints}💰 Points given for the pull request in ${projectDetails.name}`,
        pull_url: pullLink,
        difficulty: String(difficulty).toUpperCase(),
        points: Number(evaluatedPoints),
      });

      await newEvalUser.save();
    } else {
      evaluateUser.totalPoints += Number(evaluatedPoints);
      evaluateUser.pointHistory.push({
        description: `${evaluatedPoints}💰 Points given for the pull request in ${projectDetails.name}`,
        pull_url: pullLink,
        difficulty: String(difficulty).toUpperCase(),
        points: Number(evaluatedPoints),
      });

      await evaluateUser.save();
    }

    res.status(200).send({
      message: SUCCESS_MESSAGE.POINTS_CREDITED,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: ERRORS_MESSAGE.ERROR_500 });
  }
};

const GET_LEADERBOARD = async (req: Request, res: Response) => {
  try {
    const leaderboard = await EvaluationStorage.find().sort({
      totalPoints: -1,
    });

    res.status(200).send(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: ERRORS_MESSAGE.ERROR_500 });
  }
};

// Function to extract username, repository name, and pull request number from URL
function extractGitHubInfo(url: string) {
  const regex = /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)$/;
  const match = url.match(regex);
  if (match) {
    const [, username, repoName, pullRequestNumber] = match;
    return {
      username,
      repoName,
      pullRequestNumber: parseInt(pullRequestNumber),
    };
  } else {
    return null;
  }
}

enum DifficultyPoints {
  "EASY" = 25,
  "MEDIUM" = 50,
  "HARD" = 75,
}

export {
  CREATE_PROJECT_MAINTAINER,
  GET_PROJECT_BY_ID,
  GET_PROJECTS,
  GET_PUBLISHED_PROJECTS,
  ENROLL_PROJECT,
  GET_ENROLLED_PROJECTS,
  EVALUATE_PULL_REQUEST,
  GET_LEADERBOARD,
};
