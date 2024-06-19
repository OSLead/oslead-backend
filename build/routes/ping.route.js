"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
const devQuotes = [
    "We called ourselves developers only because of some open source nerds, who taught us how to code.",
    "Hacking is cool but protecting someone from hacking is cooler.",
    "Let's be the geeks of great products.",
    "Messy codes are illegal.",
    "Haa..Ha I am writing this instead of writing code.",
];
router.get("/", (req, res) => {
    const randomQuote = devQuotes[Math.floor(Math.random() * devQuotes.length)];
    res.status(200).send(`<h1><i>${randomQuote} ~Team OSLead<i></h1>`);
});
router.get("/ping", (req, res) => {
    res.status(200).send({
        message: "pong",
        status: 200,
        success: true,
        timestamp: new Date(),
    });
});
router.get("/ping/database", (req, res) => {
    const db = mongoose_1.default.connection.readyState;
    if (db === 1) {
        res.status(200).send({
            message: "connected",
            status: 200,
            success: true,
            timestamp: new Date(),
        });
    }
    else {
        res.status(500).send({
            message: "not connected",
            status: 500,
            success: false,
            timestamp: new Date(),
        });
    }
});
exports.default = router;
