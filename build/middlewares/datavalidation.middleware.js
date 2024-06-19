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
exports.VALIDATE_REGISTER = void 0;
const zod_1 = require("zod");
const VALIDATE_REGISTER = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { linked_in, college_name, contact_number, course_stream, city, state, pincode, tsize, tcolor, } = req.body;
    const UserRegister = zod_1.z.object({
        pincode: zod_1.z.string().max(6).min(6),
    });
    const resultZod = UserRegister.safeParse(req.body);
    if (!resultZod.success) {
        return res.status(400).send({ message: resultZod.error });
    }
    if (!pincode)
        return res.status(400).send({ message: "Pincode is required" });
    next();
});
exports.VALIDATE_REGISTER = VALIDATE_REGISTER;
