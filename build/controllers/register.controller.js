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
exports.userRegister = void 0;
const user_model_1 = require("../models/user.model");
const userRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.userId;
    try {
        const result = yield user_model_1.User.findOneAndUpdate({ _id: userId }, {
            linked_in: req.body.linked_in,
            college_name: req.body.college_name,
            contact_number: req.body.contact_number,
            course_stream: req.body.course_stream,
            delivery_details: {
                city: req.body.city,
                state: req.body.state,
                pincode: req.body.pincode,
                tshirt: {
                    size: req.body.tsize,
                    color: req.body.tcolor,
                },
            },
        }, {
            new: true,
            select: "-_id -github_id",
        });
        if (!result) {
            res.status(404).send({ message: "User not found" });
            return;
        }
        res.status(200).send(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error" });
    }
});
exports.userRegister = userRegister;
