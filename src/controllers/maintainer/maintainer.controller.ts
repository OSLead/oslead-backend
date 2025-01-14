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

const GET_ALL_MAINTAINERS = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1; 
    const limit = parseInt(req.query.limit as string) || 10; 
    const skip = (page - 1) * limit; 

    const maintainers = await Maintainer.find()
      .skip(skip)
      .limit(limit);

    const totalMaintainers = await Maintainer.countDocuments();

    if (!maintainers.length) {
      res.status(404).send({ message: "No contributors found" });
      return;
    }

    res.status(200).send({
      total: totalMaintainers, 
      page, 
      limit,
      maintainers, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: ERRORS_MESSAGE.ERROR_500 });
  }
};

const BAN_MAINTAINER = async (req: Request, res: Response) => {
  try {
    const { maintainerId } = req.params;
    const maintainer = await Maintainer.findById(maintainerId);

    if (!maintainer) {
      return res.status(404).send({ message: "Maintainer not found" });
    }

    // Toggle the isBanned status
    maintainer.isBanned = !maintainer.isBanned;
    await maintainer.save();

    const action = maintainer.isBanned ? "banned" : "unbanned";

    res.status(200).send({
      message: `Maintainer has been successfully ${action}`,
      maintainer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: ERRORS_MESSAGE.ERROR_500 });
  }
}

export { GET_MAINTAINER_PERSONAL_DETAILS,GET_ALL_MAINTAINERS,BAN_MAINTAINER };
