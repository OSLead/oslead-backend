import { Response } from "express";

const attachCookieToken = (token: string, res: Response) => {
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "none",
    secure: true,
  });
};

export default attachCookieToken;
