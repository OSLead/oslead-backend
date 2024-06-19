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
exports.MAINTAINER_REGISTER = void 0;
const maintainer_model_1 = require("../../models/maintainer.model");
const response_messages_1 = require("../../utils/response_messages");
const MAINTAINER_REGISTER = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.userId;
    try {
        const result = yield maintainer_model_1.Maintainer.findOneAndUpdate({ _id: userId }, {
            linked_in: req.body.linked_in,
            college_name: req.body.college_name,
            contact_number: req.body.contact_number,
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
            res.status(404).send({ message: "Maintainer not found" });
            return;
        }
        res.status(200).send(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: response_messages_1.ERRORS_MESSAGE.ERROR_500 });
    }
});
exports.MAINTAINER_REGISTER = MAINTAINER_REGISTER;
