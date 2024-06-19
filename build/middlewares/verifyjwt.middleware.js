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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERIFY_TOKEN = void 0;
const jsonWebToken_1 = require("../utils/jsonWebToken");
const VERIFY_TOKEN = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.token) {
        res.status(401).send({
            message: "No token provided!",
        });
    }
    else {
        const result = (0, jsonWebToken_1.verifyJsonToken)(req.body.token);
        if (result === null) {
            res.status(403).send({
                message: "Unauthorized!",
            });
            return;
        }
        res.locals.userId = result.payload;
        next();
    }
});
exports.VERIFY_TOKEN = VERIFY_TOKEN;
