import { Response, Request } from "express";
import { ERRORS_MESSAGE } from "../../utils/response_messages";
import { Maintainer } from "../../models/maintainer.model";

const GET_MAINTAINER_PERSONAL_DETAILS = async (req: Request, res: Response) => {
  const userId = res.locals.userId;
  try {
    const result = await Maintainer.findOne({ _id: userId }).select("-roles");

    if (!result) {
      res.status(404).send({ message: ERRORS_MESSAGE.ERROR_404 });
      return;
    }

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: ERRORS_MESSAGE.ERROR_500 });
  }
};
export { GET_MAINTAINER_PERSONAL_DETAILS };
