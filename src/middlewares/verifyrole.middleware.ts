import { Request, Response, NextFunction } from "express";
import db from "../models";
import { User } from "../models/contributor.model";
import { Maintainer } from "../models/maintainer.model";
import { ERRORS_MESSAGE } from "../utils/response_messages";
import { Admin } from "../models/admin.model";
const Role = db.roles;
const selectChoice = ["roles", "_id", "name", "username", "email", "github_id"];

const VERIFY_ROLE_CONTRIBUTOR = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.userId).select(selectChoice);

    const roles = await Role.find({ _id: { $in: user?.roles } });

    const isContributorExist = roles.find(
      (role: { name: string }) => role.name === "contributor"
    );

    if (isContributorExist) {
      res.locals.userDetails = user;
      next();
    } else
      return res
        .status(401)
        .send({ message: ERRORS_MESSAGE.ERROR_NOT_CONTRIBUTOR });
  } catch (error) {
    return res.status(500).send({ message: ERRORS_MESSAGE.ERROR_500 });
  }
};

const VERIFY_ROLE_MAINTAINER = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await Maintainer.findById(res.locals.userId).select(
      selectChoice
    );

    const roles = await Role.find({ _id: { $in: user?.roles } });

    const isMaintainerExist = roles.find(
      (role: { name: string }) => role.name === "maintainer"
    );

    if (isMaintainerExist) {
      res.locals.userDetails = user;
      next();
    } else
      return res
        .status(401)
        .send({ message: ERRORS_MESSAGE.ERROR_NOT_MAINTAINER });
  } catch (error) {
    return res.status(500).send({ message: ERRORS_MESSAGE.ERROR_500 });
  }
};
const VERIFY_ROLE_ADMIN = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await Admin.findById(res.locals.userId).select(["roles","_id","username"]);
console.log(user)
    const roles = await Role.find({ _id: { $in: user?.roles } });

    const isAdminExist = roles.find(
      (role: { name: string }) => role.name === "admin"
    );

    if (isAdminExist) {
      res.locals.userDetails = user;
      next();
    } else
      return res
        .status(401)
        .send({ message: ERRORS_MESSAGE.ERROR_NOT_ADMIN });
  } catch (error) {
    return res.status(500).send({ message: ERRORS_MESSAGE.ERROR_500 });
  }
};

export { VERIFY_ROLE_MAINTAINER, VERIFY_ROLE_CONTRIBUTOR, VERIFY_ROLE_ADMIN };
