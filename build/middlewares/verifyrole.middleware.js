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
exports.VERIFY_ROLE_CONTRIBUTOR = exports.VERIFY_ROLE_MAINTAINER = void 0;
const models_1 = __importDefault(require("../models"));
const contributor_model_1 = require("../models/contributor.model");
const maintainer_model_1 = require("../models/maintainer.model");
const response_messages_1 = require("../utils/response_messages");
const Role = models_1.default.roles;
const selectChoice = ["roles", "_id", "name", "username", "email", "github_id"];
const VERIFY_ROLE_CONTRIBUTOR = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield contributor_model_1.User.findById(res.locals.userId).select(selectChoice);
        const roles = yield Role.find({ _id: { $in: user === null || user === void 0 ? void 0 : user.roles } });
        const isContributorExist = roles.find((role) => role.name === "contributor");
        if (isContributorExist) {
            res.locals.userDetails = user;
            next();
        }
        else
            return res
                .status(401)
                .send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_NOT_CONTRIBUTOR });
    }
    catch (error) {
        return res.status(500).send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_500 });
    }
});
exports.VERIFY_ROLE_CONTRIBUTOR = VERIFY_ROLE_CONTRIBUTOR;
const VERIFY_ROLE_MAINTAINER = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield maintainer_model_1.Maintainer.findById(res.locals.userId).select(selectChoice);
        const roles = yield Role.find({ _id: { $in: user === null || user === void 0 ? void 0 : user.roles } });
        const isMaintainerExist = roles.find((role) => role.name === "maintainer");
        if (isMaintainerExist) {
            res.locals.userDetails = user;
            next();
        }
        else
            return res
                .status(401)
                .send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_NOT_MAINTAINER });
    }
    catch (error) {
        return res.status(500).send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_500 });
    }
});
exports.VERIFY_ROLE_MAINTAINER = VERIFY_ROLE_MAINTAINER;
