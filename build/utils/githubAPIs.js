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
exports.GET_PULL_REQUEST_DETAILS = exports.GET_REPO_NAME_BY_URL = exports.GET_REPO_DETAILS = void 0;
const response_messages_1 = require("./response_messages");
const GET_REPO_DETAILS = (username, repoName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`);
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };
        const userRepos = yield fetch(`https://api.github.com/repos/${username}/${repoName}`, requestOptions);
        const userReposJson = yield userRepos.json();
        if (userReposJson.message === response_messages_1.ERRORS_MESSAGE.GITHUB_API_REPO_NOT_FOUND) {
            return { message: response_messages_1.ERRORS_MESSAGE.REPOSITORY_NOT_FOUND };
        }
        return userReposJson;
    }
    catch (error) {
        console.error(error);
        return { message: response_messages_1.ERRORS_MESSAGE.ERROR_500 };
    }
});
exports.GET_REPO_DETAILS = GET_REPO_DETAILS;
const GET_REPO_NAME_BY_URL = (url) => {
    try {
        const githubRepoLink = url;
        const repoName = githubRepoLink.split("/").pop();
        return repoName || "";
    }
    catch (error) {
        console.error(error);
        return "";
    }
};
exports.GET_REPO_NAME_BY_URL = GET_REPO_NAME_BY_URL;
const GET_PULL_REQUEST_DETAILS = (username, repoName, pullRequestNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`);
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };
        const pullRequest = yield fetch(`https://api.github.com/repos/${username}/${repoName}/pulls/${pullRequestNumber}`, requestOptions);
        const pullRequestJson = yield pullRequest.json();
        if (pullRequestJson.message === response_messages_1.ERRORS_MESSAGE.GITHUB_API_REPO_NOT_FOUND) {
            return { message: response_messages_1.ERRORS_MESSAGE.REPOSITORY_NOT_FOUND };
        }
        return pullRequestJson;
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.GET_PULL_REQUEST_DETAILS = GET_PULL_REQUEST_DETAILS;
