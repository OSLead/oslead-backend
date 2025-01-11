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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login_ADMIN = void 0;
const express_validator_1 = require("express-validator");
const admin_model_1 = require("../../models/admin.model");
const models_1 = __importDefault(require("../../models"));
const jsonWebToken_1 = require("../../utils/jsonWebToken");
const cookieToken_1 = __importDefault(require("../../utils/cookieToken"));
const Role = models_1.default.roles;
const login_ADMIN = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    const admin = yield admin_model_1.Admin.findOne({ username });
    if (!admin) {
        return res.status(401).json({ message: "Invalid username or password" });
    }
    const isPasswordMatch = yield admin.comparePassword(password);
    if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = (0, jsonWebToken_1.createJsonToken)(admin._id);
    (0, cookieToken_1.default)(token, res);
    res.status(200).json({ message: "Login successful", token });
});
exports.login_ADMIN = login_ADMIN;
