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
exports.CHECK_DUPLICATE_GITHUB_REPO_LINK = void 0;
const response_messages_1 = require("../utils/response_messages");
const projects_model_1 = require("../models/projects.model");
const githubAPIs_1 = require("../utils/githubAPIs");
const CHECK_DUPLICATE_GITHUB_REPO_LINK = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repoUrl = req.body.github_repo_link;
        const githubRepoName = (0, githubAPIs_1.GET_REPO_NAME_BY_URL)(repoUrl);
        const userRepoDetails = yield (0, githubAPIs_1.GET_REPO_DETAILS)(res.locals.userDetails.username, githubRepoName);
        if (!(userRepoDetails === null || userRepoDetails === void 0 ? void 0 : userRepoDetails.id))
            return res.status(500).send(userRepoDetails);
        const doc = yield projects_model_1.Project.findOne({
            "projectDetails.id": userRepoDetails.id,
        }).select("projectDetails.id");
        if (doc) {
            return res
                .status(400)
                .send({ message: response_messages_1.ERRORS_MESSAGE.DUPLICATE_GITHUB_REPO_LINK });
        }
        res.locals.userRepoDetails = userRepoDetails;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_500 });
    }
});
exports.CHECK_DUPLICATE_GITHUB_REPO_LINK = CHECK_DUPLICATE_GITHUB_REPO_LINK;
