"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_LEADERBOARD = exports.EVALUATE_PULL_REQUEST = exports.ENROLL_PROJECT = exports.GET_PUBLISHED_PROJECTS = exports.GET_PROJECTS = exports.GET_PROJECT_BY_ID = exports.CREATE_PROJECT_MAINTAINER = void 0;
const projects_model_1 = require("../models/projects.model");
const response_messages_1 = require("../utils/response_messages");
const user_model_1 = require("../models/user.model");
const githubAPIs_1 = require("../utils/githubAPIs");
const evaluatedpulls_model_1 = require("../models/evaluatedpulls.model");
const evaluation_model_1 = require("../models/evaluation.model");
const CREATE_PROJECT_MAINTAINER = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newProject = new projects_model_1.Project({
            difficulty: req.body.difficulty,
            projectDetails: res.locals.userRepoDetails,
            ownedBy: {
                userId: res.locals.userDetails._id,
                github_id: res.locals.userDetails.github_id,
            },
        });
        const doc = yield newProject.save();
        res
            .status(200)
            .send({ message: response_messages_1.SUCCESS_MESSAGE.PROJECT_CREATED_SUCCESS, doc });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_500 });
    }
});
exports.CREATE_PROJECT_MAINTAINER = CREATE_PROJECT_MAINTAINER;
const GET_PROJECTS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const selectChoice = [
            "projectDetails.name",
            "projectDetails.html_url",
            "projectDetails.description",
            "projectDetails.language",
            "projectDetails.owner.login",
            "projectDetails.owner.avatar_url",
            "difficulty",
        ];
        const doc = yield projects_model_1.Project.find().select(selectChoice);
        res.status(200).send(doc);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_500 });
    }
});
exports.GET_PROJECTS = GET_PROJECTS;
const GET_PROJECT_BY_ID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = yield projects_model_1.Project.findById(req.body.projectId);
        res.status(200).send(doc);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_500 });
    }
});
exports.GET_PROJECT_BY_ID = GET_PROJECT_BY_ID;
const GET_PUBLISHED_PROJECTS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const selectChoice = [
            "projectDetails.name",
            "projectDetails.html_url",
            "projectDetails.description",
            "projectDetails.language",
            "projectDetails.owner.login",
            "projectDetails.owner.avatar_url",
            "difficulty",
        ];
        const doc = yield projects_model_1.Project.find({
            "projectDetails.owner.id": Number(res.locals.userDetails.github_id),
        }).select(selectChoice);
        res.status(200).send(doc);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_500 });
    }
});
exports.GET_PUBLISHED_PROJECTS = GET_PUBLISHED_PROJECTS;
const ENROLL_PROJECT = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.body;
        const localUser = res.locals.userDetails;
        const user = yield user_model_1.User.findOne({ _id: localUser._id }).select("enrolledProjects");
        if (!user) {
            return res.status(400).json({ message: response_messages_1.ERRORS_MESSAGE.ERROR_400 });
        }
        if (user.enrolledProjects.length >= 3) {
            return res.status(400).json({ message: response_messages_1.ERRORS_MESSAGE.MAX_PROJECTS });
        }
        const isEnrolledProject = user.enrolledProjects.find((project) => project.projectId === projectId);
        if (isEnrolledProject) {
            return res.status(400).json({ message: response_messages_1.ERRORS_MESSAGE.ALREADY_ENROLLED });
        }
        const updatedProject = yield projects_model_1.Project.findOne({ _id: projectId }).select("applied_contributors projectDetails");
        if (!updatedProject) {
            return res.status(400).json({ message: response_messages_1.ERRORS_MESSAGE.NO_REPO_FOUND });
        }
        const projectDetails = updatedProject.projectDetails;
        user.enrolledProjects.push({
            projectId,
            projectName: projectDetails.name,
            projectUrl: projectDetails.html_url,
            apiUrl: projectDetails.url,
        });
        yield user.save();
        updatedProject.applied_contributors.push({
            userId: localUser._id,
            username: localUser.username,
            github_id: localUser.github_id,
            name: localUser.name,
        });
        yield updatedProject.save();
        res.status(200).json({ message: response_messages_1.SUCCESS_MESSAGE.ENROLLED_PROJECT_SUCCESS });
    }
    catch (error) {
        console.error("Error enrolling user:", error);
        return res.status(500).json({ message: response_messages_1.ERRORS_MESSAGE.ERROR_500 });
    }
});
exports.ENROLL_PROJECT = ENROLL_PROJECT;
const EVALUATE_PULL_REQUEST = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = res.locals.userDetails;
        const { pullUrl } = req.body;
        const extractedData = extractGitHubInfo(pullUrl);
        if (!extractedData) {
            return res
                .status(400)
                .send({ message: response_messages_1.ERRORS_MESSAGE.REPOSITORY_NOT_FOUND });
        }
        if (extractedData.username !== userData.username) {
            return res
                .status(403)
                .send({ message: response_messages_1.ERRORS_MESSAGE.REPOSITORY_NOT_FOUND });
        }
        const project = yield projects_model_1.Project.findOne({
            "ownedBy.github_id": userData.github_id,
            "projectDetails.owner.login": extractedData.username,
            "projectDetails.name": extractedData.repoName,
        }).select("ownedBy.github_id projectDetails.owner.login projectDetails.name difficulty");
        if (!project) {
            return res
                .status(404)
                .send({ message: response_messages_1.ERRORS_MESSAGE.REPOSITORY_NOT_FOUND });
        }
        const pullRequest = yield (0, githubAPIs_1.GET_PULL_REQUEST_DETAILS)(extractedData.username, extractedData.repoName, extractedData.pullRequestNumber);
        if (!pullRequest) {
            return res.status(404).send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_500 });
        }
        if (pullRequest.state !== "closed") {
            return res
                .status(400)
                .send({ message: response_messages_1.ERRORS_MESSAGE.PULL_REQUEST_NOT_CLOSED });
        }
        if (pullRequest.merged === false) {
            return res
                .status(400)
                .send({ message: response_messages_1.ERRORS_MESSAGE.PULL_REQUEST_NOT_MERGED });
        }
        const mergedAt = new Date(pullRequest.merged_at);
        const currentTime = new Date();
        const timeDifference = currentTime.getTime() - mergedAt.getTime();
        const timeDifferenceInDays = timeDifference / (1000 * 3600 * 24);
        if (timeDifferenceInDays > 7) {
            return res
                .status(400)
                .send({ message: response_messages_1.ERRORS_MESSAGE.MERGE_REQUEST_EXPIRED });
        }
        const pullLink = pullRequest.html_url;
        const contributorDetails = pullRequest.user;
        const isContributorAvailable = yield user_model_1.User.findOne({
            github_id: contributorDetails.id,
        }).select("github_id username");
        if (!isContributorAvailable) {
            return res
                .status(400)
                .send({ message: response_messages_1.ERRORS_MESSAGE.CONTRIBUTOR_NOT_FOUND });
        }
        const evaluatedPoints = DifficultyPoints[project.difficulty];
        const evaluatedPullData = yield evaluatedpulls_model_1.EvaluatedStorage.findOne({
            pullUrl: pullLink,
        }).select("pullUrl");
        if (evaluatedPullData) {
            return res
                .status(400)
                .send({ message: response_messages_1.ERRORS_MESSAGE.PULL_REQUEST_EVALUATED });
        }
        else {
            const newEvaluatedPull = new evaluatedpulls_model_1.EvaluatedStorage({
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
            yield newEvaluatedPull.save();
        }
        const evaluateUser = yield evaluation_model_1.EvaluationStorage.findOne({
            github_id: contributorDetails.id,
        });
        const projectDetails = project.projectDetails;
        if (!evaluateUser) {
            const newEvalUser = new evaluation_model_1.EvaluationStorage({
                github_id: contributorDetails.id,
                username: contributorDetails.login,
            });
            newEvalUser.totalPoints = Number(evaluatedPoints);
            newEvalUser.pointHistory.push({
                description: `${evaluatedPoints}💰 Points given for the pull request in ${projectDetails.name}`,
                pull_url: pullLink,
                difficulty: String(project.difficulty),
                points: Number(evaluatedPoints),
            });
            yield newEvalUser.save();
        }
        else {
            evaluateUser.totalPoints += Number(evaluatedPoints);
            evaluateUser.pointHistory.push({
                description: `${evaluatedPoints}💰 Points given for the pull request in ${projectDetails.name}`,
                pull_url: pullLink,
                difficulty: String(project.difficulty),
                points: Number(evaluatedPoints),
            });
            yield evaluateUser.save();
        }
        res.status(200).send({
            message: response_messages_1.SUCCESS_MESSAGE.POINTS_CREDITED,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_500 });
    }
});
exports.EVALUATE_PULL_REQUEST = EVALUATE_PULL_REQUEST;
const GET_LEADERBOARD = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leaderboard = yield evaluation_model_1.EvaluationStorage.find().sort({
            totalPoints: -1,
        });
        res.status(200).send(leaderboard);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_500 });
    }
});
exports.GET_LEADERBOARD = GET_LEADERBOARD;
function extractGitHubInfo(url) {
    const regex = /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)$/;
    const match = url.match(regex);
    if (match) {
        const [, username, repoName, pullRequestNumber] = match;
        return {
            username,
            repoName,
            pullRequestNumber: parseInt(pullRequestNumber),
        };
    }
    else {
        return null;
    }
}
var DifficultyPoints;
(function (DifficultyPoints) {
    DifficultyPoints[DifficultyPoints["EASY"] = 25] = "EASY";
    DifficultyPoints[DifficultyPoints["MEDIUM"] = 50] = "MEDIUM";
    DifficultyPoints[DifficultyPoints["HARD"] = 75] = "HARD";
})(DifficultyPoints || (DifficultyPoints = {}));
