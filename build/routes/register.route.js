"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyjwt_middleware_1 = require("../middlewares/verifyjwt.middleware");
const register_controller_1 = require("../controllers/contributor/register.controller");
const datavalidation_middleware_1 = require("../middlewares/datavalidation.middleware");
const router = express_1.default.Router();
router.post("/register", [verifyjwt_middleware_1.VERIFY_TOKEN, datavalidation_middleware_1.VALIDATE_REGISTER], register_controller_1.USER_REGISTER);
exports.default = router;
