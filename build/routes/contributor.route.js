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
const verifyjwt_middleware_1 = require("../middlewares/verifyjwt.middleware");
const verifyrole_middleware_1 = require("../middlewares/verifyrole.middleware");
const contributor_controller_1 = require("../controllers/contributor/contributor.controller");
const register_controller_1 = require("../controllers/contributor/register.controller");
const datavalidation_middleware_1 = require("../middlewares/datavalidation.middleware");
const passport_1 = __importDefault(require("passport"));
const auth_controller_1 = require("../controllers/auth/auth.controller");
const router = express_1.default.Router();
var GitHubStrategy = require("passport-github2").Strategy;
router.get("/", (req, res) => {
    res.status(200).send({ message: "Contributor route is working fine." });
});
router.get("/auth/github", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        passport_1.default.use(new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
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
        return yield (0, auth_controller_1.createAccount_CONTRIBUTOR)(req, res);
    });
});
router.post("/details-own", [verifyjwt_middleware_1.VERIFY_TOKEN, verifyrole_middleware_1.VERIFY_ROLE_CONTRIBUTOR], contributor_controller_1.getContributorSelf);
router.post("/register", [verifyjwt_middleware_1.VERIFY_TOKEN, datavalidation_middleware_1.VALIDATE_REGISTER, verifyrole_middleware_1.VERIFY_ROLE_CONTRIBUTOR], register_controller_1.USER_REGISTER);
exports.default = router;
