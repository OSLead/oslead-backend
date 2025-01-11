"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/admin/auth.controller");
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET_KEY || "SubhranshuChoudhury";
router.post("/login", [
    (0, express_validator_1.body)("username").notEmpty().withMessage("Username is required"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
], auth_controller_1.login_ADMIN);
exports.default = router;
