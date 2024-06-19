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
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth/auth.controller");
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
var GitHubStrategy = require("passport-github2").Strategy;
router.get("/github", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        passport_1.default.use(new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL_PO,
        }, function (accessToken, refreshToken, profile, done) {
            return __awaiter(this, void 0, void 0, function* () {
                return done(null, profile);
            });
        }));
        next();
    });
}, passport_1.default.authenticate("github", { scope: ["user:email"] }));
router.get("/callback", passport_1.default.authenticate("github", { failureRedirect: "/api/error/login" }), function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, auth_controller_1.createAccount_PROJECTOWNER)(req, res);
    });
});
exports.default = router;
