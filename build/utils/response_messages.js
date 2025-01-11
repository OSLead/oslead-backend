"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUCCESS_MESSAGE = exports.ERRORS_MESSAGE = void 0;
const ERRORS_MESSAGE = {
    ERROR_404: "The content you are looking for is not found",
    ERROR_500: " Try again, Internal server error",
    ERROR_400: "Bad request, Incomplete data provided",
    ERROR_401: "You are not authorized to access this content",
    ERROR_403: "Forbidden",
    ERROR_NOT_MAINTAINER: "Maintainer role is required to access this content",
    ERROR_NOT_ADMIN: "You are not an admin",
    ERROR_NOT_CONTRIBUTOR: "Contributor role is required to access this content",
    ERROR_NOT_OWNER: "You are not the owner of this content",
    ERROR_NOT_FOUND: "The content you are looking for is not found",
    INVALID_TOKEN: "Authentication failed! Invalid token provided.",
    DUPLICATE_GITHUB_REPO_LINK: "This github project already registered",
    REPOSITORY_NOT_FOUND: "The repository not found or not owned by you",
    GITHUB_API_REPO_NOT_FOUND: "Not Found",
    ALREADY_ENROLLED: "User is already enrolled in the project",
    PULL_REQUEST_EVALUATED: "The pull request has been already registered",
    NO_REPO_FOUND: "The repository not found or have been deleted",
    PULL_REQUEST_NOT_CLOSED: "The pull request must be merged and closed to evaluate the points",
    PULL_REQUEST_NOT_MERGED: "The pull request must be merged to evaluate the points",
    MERGE_REQUEST_EXPIRED: "The merge request is expired, Maximum time limit is 7 days",
    MAX_PROJECTS: "You have reached the maximum limit of projects to enroll",
    CONTRIBUTOR_NOT_FOUND: "The contributor not registered in the platform",
};
exports.ERRORS_MESSAGE = ERRORS_MESSAGE;
const SUCCESS_MESSAGE = {
    SUCCESS_200: "Success",
    SUCCESS_201: "Created",
    SUCCESS_204: "No content",
    SUCCESS_202: "Accepted",
    SUCCESS_203: "Non-Authoritative Information",
    SUCCESS_205: "Reset Content",
    SUCCESS_206: "Partial Content",
    PROJECT_CREATED_SUCCESS: "The project has been published.",
    ENROLLED_PROJECT_SUCCESS: "You have been enrolled in the project.",
    POINTS_CREDITED: "The points have been credited successfully.",
};
exports.SUCCESS_MESSAGE = SUCCESS_MESSAGE;
