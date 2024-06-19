"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const attachCookieToken = (token, res) => {
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "none",
        secure: true,
    });
};
exports.default = attachCookieToken;
