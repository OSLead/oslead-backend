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
const body_parser_1 = require("body-parser");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./models/index"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const Role = index_1.default.roles;
app.use((req, res, next) => {
    res.header({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, POST, GET, DELETE",
    });
    next();
});
app.use((0, cors_1.default)());
app.use((0, body_parser_1.json)());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    resave: false,
    saveUninitialized: false,
    secret: `${process.env.SESSION_SECRET}`,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.serializeUser(function (user, cb) {
    cb(null, user);
});
passport_1.default.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const maintainer_route_1 = __importDefault(require("./routes/maintainer.route"));
const error_route_1 = __importDefault(require("./routes/error.route"));
const project_route_1 = __importDefault(require("./routes/project.route"));
const contributor_route_1 = __importDefault(require("./routes/contributor.route"));
const ping_route_1 = __importDefault(require("./routes/ping.route"));
app.use("/api/auth", auth_route_1.default);
app.use("/api/auth/projectowner", maintainer_route_1.default);
app.use("/api/error", error_route_1.default);
app.use("/", ping_route_1.default);
app.use("/api/maintainer", maintainer_route_1.default);
app.use("/api/contributor", contributor_route_1.default);
app.use("/api/projects", project_route_1.default);
const createRoles = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countROLES = yield Role.estimatedDocumentCount();
        if (countROLES === 0) {
            const contributorRole = new Role({
                name: "contributor",
            });
            const maintainerRole = new Role({
                name: "maintainer",
            });
            console.log("Creating ROLES...");
            yield contributorRole.save();
            yield maintainerRole.save();
            console.log("ROLES created successfully ✅");
        }
        else {
            console.log("ROLES already created ✅");
        }
    }
    catch (error) {
        console.log("ERROR creating ROLES ❌", error);
    }
});
index_1.default.mongoose
    .connect(`${process.env.MONGODB_URL}`)
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("DB connected ✅");
    yield createRoles();
}))
    .catch((err) => {
    console.log("Failed to connect to DB ❌", err);
    process.exit();
});
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
    console.log("We are running on PORT ✅: " + PORT);
});
