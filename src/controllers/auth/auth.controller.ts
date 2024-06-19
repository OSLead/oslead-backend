import { Response, Request } from "express";
import { createJsonToken } from "../../utils/jsonWebToken";
import attachCookieToken from "../../utils/cookieToken";
import { User } from "../../models/contributor.model";
import { Maintainer } from "../../models/maintainer.model";
import db from "../../models";
const Role = db.roles;
const FE_USER_AUTH =
  process.env.FE_USER_AUTH ||
  "https://os-lead.vercel.app/auth/user/github/token";
const FE_PO_AUTH =
  process.env.FE_PO_AUTH ||
  "https://os-lead.vercel.app/auth/projectowner/github/token";

const createAccount_CONTRIBUTOR = async (req: Request, res: Response) => {
  try {
    const user: any = req.user;
    const userExists = await checkIfUserExists(req, res);

    if (userExists?.id) {
      res.redirect(`${FE_USER_AUTH}/${userExists.token}`);
      return;
    }

    const projectOwnerExists = await checkIfProjectOwnerExists(req, res);

    if (projectOwnerExists?.id) {
      res.redirect(`${FE_PO_AUTH}/${projectOwnerExists.token}`);
      return;
    }
    const contributor = new User({
      name: user?.displayName,
      email: user?.emails?.[0]?.value ?? "nomail@gmail.com",
      github_id: user.id,
      username: user.username,
      profile_picture: user.photos?.[0]?.value,
    });
    const roles = await Role.find({
      name: { $in: "contributor" },
    });
    contributor.roles = roles.map((role: any) => role._id);
    await contributor.save();
    const token = createJsonToken(contributor._id);
    attachCookieToken(token, res);
    res.redirect(`${FE_USER_AUTH}/${token}`);
  } catch (error) {
    console.error(error);
    res.redirect(`https://os-lead.vercel.app/server-error?message=${error}`);
    return;
  }
};

const createAccount_PROJECTOWNER = async (req: Request, res: Response) => {
  try {
    const user: any = req.user;

    const userExists = await checkIfUserExists(req, res);

    if (userExists?.id) {
      res.redirect(`${FE_USER_AUTH}/${userExists.token}`);
      return;
    }

    const projectOwnerExists = await checkIfProjectOwnerExists(req, res);

    if (projectOwnerExists?.id) {
      console.log("Maintainer Token", projectOwnerExists.token);
      res.redirect(`${FE_PO_AUTH}/${projectOwnerExists.token}`);
      return;
    }

    const powner = new Maintainer({
      name: user?.displayName,
      email: user?.emails?.[0]?.value ?? "noemail@gmail.com",
      github_id: user.id,
      username: user.username,
    });
    const roles = await Role.find({
      name: { $in: "maintainer" },
    });
    powner.roles = roles.map((role: any) => role._id);
    await powner.save();
    const token = createJsonToken(powner._id);
    attachCookieToken(token, res);
    res.redirect(`${FE_PO_AUTH}/${token}`);
  } catch (error) {
    console.error(error);
    res.redirect(`https://os-lead.vercel.app/auth/projectowner/github/error`);
    return;
  }
};

const checkIfUserExists = async (req: Request, res: Response): Promise<any> => {
  try {
    const user: any = req.user;
    if (user?.id) {
      const doc = await User.findOne({ github_id: user.id });
      if (doc)
        return {
          id: doc._id,
          token: createJsonToken(doc._id),
        };
      else
        return {
          id: null,
          token: null,
        };
    }
  } catch (error) {
    console.log(error);
  }
};
const checkIfProjectOwnerExists = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const user: any = req.user;
    if (user?.id) {
      const doc = await Maintainer.findOne({ github_id: user.id });
      if (doc)
        return {
          id: doc._id,
          token: createJsonToken(doc._id),
        };
      else
        return {
          id: null,
          token: null,
        };
    }
  } catch (error) {
    console.log(error);
  }
};

export { createAccount_CONTRIBUTOR, createAccount_PROJECTOWNER };
