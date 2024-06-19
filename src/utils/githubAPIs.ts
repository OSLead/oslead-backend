import { Request, Response } from "express";
import { ERRORS_MESSAGE } from "./response_messages";

const GET_REPO_DETAILS = async (username: string, repoName: string) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`
    );

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const userRepos = await fetch(
      `https://api.github.com/repos/${username}/${repoName}`,
      requestOptions
    );
    const userReposJson = await userRepos.json();
    if (userReposJson.message === ERRORS_MESSAGE.GITHUB_API_REPO_NOT_FOUND) {
      return { message: ERRORS_MESSAGE.REPOSITORY_NOT_FOUND };
    }
    return userReposJson;
  } catch (error) {
    console.error(error);
    return { message: ERRORS_MESSAGE.ERROR_500 };
  }
};
const GET_REPO_NAME_BY_URL = (url: string) => {
  try {
    const githubRepoLink = url;
    const repoName = githubRepoLink.split("/").pop();
    return repoName || "";
  } catch (error) {
    console.error(error);
    return "";
  }
};

const GET_PULL_REQUEST_DETAILS = async (
  username: string,
  repoName: string,
  pullRequestNumber: number
) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`
    );

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const pullRequest = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/pulls/${pullRequestNumber}`,
      requestOptions
    );
    const pullRequestJson = await pullRequest.json();
    if (pullRequestJson.message === ERRORS_MESSAGE.GITHUB_API_REPO_NOT_FOUND) {
      return { message: ERRORS_MESSAGE.REPOSITORY_NOT_FOUND };
    }
    return pullRequestJson;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { GET_REPO_DETAILS, GET_REPO_NAME_BY_URL, GET_PULL_REQUEST_DETAILS };
