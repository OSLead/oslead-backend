import { Response, Request } from "express";
import { User as Contributor } from "../../models/contributor.model";
import { ERRORS_MESSAGE } from "../../utils/response_messages";

const getContributorSelf = async (req: Request, res: Response) => {
  const userId = res.locals.userId;
  try {
    const result = await Contributor.findOne({ _id: userId });

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
export { getContributorSelf };
