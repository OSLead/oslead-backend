import { Response, Request } from "express";
import { Maintainer } from "../../models/maintainer.model";
import { ERRORS_MESSAGE } from "../../utils/response_messages";

const MAINTAINER_REGISTER = async (req: Request, res: Response) => {
  const userId = res.locals.userId;
  try {
    const result = await Maintainer.findOneAndUpdate(
      { _id: userId },
      {
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
      },
      {
        new: true,
        select: "-_id -github_id",
      }
    );

    if (!result) {
      res.status(404).send({ message: "Maintainer not found" });
      return;
    }

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: ERRORS_MESSAGE.ERROR_500 });
  }
};
export { MAINTAINER_REGISTER };
