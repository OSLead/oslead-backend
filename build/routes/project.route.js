"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project_controller_1 = require("../controllers/project/project.controller");
const verifyjwt_middleware_1 = require("../middlewares/verifyjwt.middleware");
const verifyrole_middleware_1 = require("../middlewares/verifyrole.middleware");
const project_middleware_1 = require("../middlewares/project.middleware");
const router = express_1.default.Router();
router.post("/create-project", [verifyjwt_middleware_1.VERIFY_TOKEN, verifyrole_middleware_1.VERIFY_ROLE_MAINTAINER, project_middleware_1.CHECK_DUPLICATE_GITHUB_REPO_LINK], project_controller_1.CREATE_PROJECT_MAINTAINER);
router.post("/create-project-by-admin", [verifyjwt_middleware_1.VERIFY_TOKEN, verifyrole_middleware_1.VERIFY_ROLE_ADMIN], project_controller_1.CREATE_PROJECT_ADMIN);
router.post("/get-project-by-id", [verifyjwt_middleware_1.VERIFY_TOKEN], project_controller_1.GET_PROJECT_BY_ID);
router.post("/get-projects", [verifyjwt_middleware_1.VERIFY_TOKEN], project_controller_1.GET_PROJECTS);
router.post("/get-published-projects", [verifyjwt_middleware_1.VERIFY_TOKEN, verifyrole_middleware_1.VERIFY_ROLE_MAINTAINER], project_controller_1.GET_PUBLISHED_PROJECTS);
router.post("/enroll-project", [verifyjwt_middleware_1.VERIFY_TOKEN, verifyrole_middleware_1.VERIFY_ROLE_CONTRIBUTOR], project_controller_1.ENROLL_PROJECT);
router.post("/enrolled-projects", [verifyjwt_middleware_1.VERIFY_TOKEN, verifyrole_middleware_1.VERIFY_ROLE_CONTRIBUTOR], project_controller_1.GET_ENROLLED_PROJECTS);
router.post("/analyze-pull-points", [verifyjwt_middleware_1.VERIFY_TOKEN, verifyrole_middleware_1.VERIFY_ROLE_MAINTAINER], project_controller_1.EVALUATE_PULL_REQUEST);
router.get("/leaderboard", project_controller_1.GET_LEADERBOARD);
exports.default = router;
