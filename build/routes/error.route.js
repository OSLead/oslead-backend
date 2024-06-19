"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/login", (req, res) => {
    res.redirect("https://colorlib.com/wp/wp-content/uploads/sites/2/404-error-template-18.png");
});
exports.default = router;
