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
exports.createAccount_PROJECTOWNER = exports.createAccount_CONTRIBUTOR = void 0;
const jsonWebToken_1 = require("../../utils/jsonWebToken");
const cookieToken_1 = __importDefault(require("../../utils/cookieToken"));
const contributor_model_1 = require("../../models/contributor.model");
const maintainer_model_1 = require("../../models/maintainer.model");
const models_1 = __importDefault(require("../../models"));
const Role = models_1.default.roles;
const FE_USER_AUTH = process.env.FE_USER_AUTH ||
    "https://os-lead.vercel.app/auth/user/github/token";
const FE_PO_AUTH = process.env.FE_PO_AUTH ||
    "https://os-lead.vercel.app/auth/projectowner/github/token";
const createAccount_CONTRIBUTOR = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const user = req.user;
        const userExists = yield checkIfUserExists(req, res);
        if (userExists === null || userExists === void 0 ? void 0 : userExists.id) {
            res.redirect(`${FE_USER_AUTH}/${userExists.token}`);
            return;
        }
        const projectOwnerExists = yield checkIfProjectOwnerExists(req, res);
        if (projectOwnerExists === null || projectOwnerExists === void 0 ? void 0 : projectOwnerExists.id) {
            res.redirect(`${FE_PO_AUTH}/${projectOwnerExists.token}`);
            return;
        }
        const contributor = new contributor_model_1.User({
            name: user === null || user === void 0 ? void 0 : user.displayName,
            email: (_c = (_b = (_a = user === null || user === void 0 ? void 0 : user.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : "nomail@gmail.com",
            github_id: user.id,
            username: user.username,
            profile_picture: (_e = (_d = user.photos) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.value,
        });
        const roles = yield Role.find({
            name: { $in: "contributor" },
        });
        contributor.roles = roles.map((role) => role._id);
        yield contributor.save();
        const token = (0, jsonWebToken_1.createJsonToken)(contributor._id);
        (0, cookieToken_1.default)(token, res);
        res.redirect(`${FE_USER_AUTH}/${token}`);
    }
    catch (error) {
        console.error(error);
        res.redirect(`https://os-lead.vercel.app/server-error?message=${error}`);
        return;
    }
});
exports.createAccount_CONTRIBUTOR = createAccount_CONTRIBUTOR;
const createAccount_PROJECTOWNER = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g, _h;
    try {
        const user = req.user;
        const userExists = yield checkIfUserExists(req, res);
        if (userExists === null || userExists === void 0 ? void 0 : userExists.id) {
            res.redirect(`${FE_USER_AUTH}/${userExists.token}`);
            return;
        }
        const projectOwnerExists = yield checkIfProjectOwnerExists(req, res);
        if (projectOwnerExists === null || projectOwnerExists === void 0 ? void 0 : projectOwnerExists.id) {
            console.log("Maintainer Token", projectOwnerExists.token);
            res.redirect(`${FE_PO_AUTH}/${projectOwnerExists.token}`);
            return;
        }
        const powner = new maintainer_model_1.Maintainer({
            name: user === null || user === void 0 ? void 0 : user.displayName,
            email: (_h = (_g = (_f = user === null || user === void 0 ? void 0 : user.emails) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.value) !== null && _h !== void 0 ? _h : "noemail@gmail.com",
            github_id: user.id,
            username: user.username,
        });
        const roles = yield Role.find({
            name: { $in: "maintainer" },
        });
        powner.roles = roles.map((role) => role._id);
        yield powner.save();
        const token = (0, jsonWebToken_1.createJsonToken)(powner._id);
        (0, cookieToken_1.default)(token, res);
        res.redirect(`${FE_PO_AUTH}/${token}`);
    }
    catch (error) {
        console.error(error);
        res.redirect(`https://os-lead.vercel.app/auth/projectowner/github/error`);
        return;
    }
});
exports.createAccount_PROJECTOWNER = createAccount_PROJECTOWNER;
const checkIfUserExists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (user === null || user === void 0 ? void 0 : user.id) {
            const doc = yield contributor_model_1.User.findOne({ github_id: user.id });
            if (doc)
                return {
                    id: doc._id,
                    token: (0, jsonWebToken_1.createJsonToken)(doc._id),
                };
            else
                return {
                    id: null,
                    token: null,
                };
        }
    }
    catch (error) {
        console.log(error);
    }
});
const checkIfProjectOwnerExists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (user === null || user === void 0 ? void 0 : user.id) {
            const doc = yield maintainer_model_1.Maintainer.findOne({ github_id: user.id });
            if (doc)
                return {
                    id: doc._id,
                    token: (0, jsonWebToken_1.createJsonToken)(doc._id),
                };
            else
                return {
                    id: null,
                    token: null,
                };
        }
    }
    catch (error) {
        console.log(error);
    }
});
