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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const admin_model_1 = require("../models/admin.model");
const models_1 = __importDefault(require("../models"));
const Role = models_1.default.roles;
dotenv_1.default.config();
const manageAdmin = (action) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(`${process.env.MONGODB_URL}`);
        console.log("Connected to the database.");
        const existingAdmin = yield admin_model_1.Admin.findOne({
            username: process.env.ADMIN_USERNAME,
        });
        if (action === "delete") {
            if (existingAdmin) {
                yield admin_model_1.Admin.deleteOne({ username: process.env.ADMIN_USERNAME });
                console.log("Admin user deleted successfully.");
            }
            else {
                console.log("Admin user does not exist. Skipping deletion.");
            }
        }
        else if (action === "create") {
            if (existingAdmin) {
                console.log("Admin user already exists. Skipping creation.");
            }
            else {
                let adminRole = yield Role.findOne({ name: "admin" });
                if (!adminRole) {
                    adminRole = yield Role.create({ name: "admin" });
                    console.log("Admin role created:", adminRole);
                }
                const newAdmin = admin_model_1.Admin.build({
                    username: process.env.ADMIN_USERNAME,
                    password: process.env.ADMIN_PASSWORD,
                    roles: [adminRole._id],
                });
                yield newAdmin.save();
                console.log("Admin user created successfully:", newAdmin);
            }
        }
        else {
            console.log("Invalid action. Please specify 'create' or 'delete'.");
        }
    }
    catch (error) {
        console.error("Error managing admin user:", error);
    }
    finally {
        yield mongoose_1.default.disconnect();
        console.log("Database connection closed.");
    }
});
const action = process.argv[2];
if (action !== "create" && action !== "delete") {
    console.error("Please specify an action: 'create' or 'delete'.");
    process.exit(1);
}
manageAdmin(action);
