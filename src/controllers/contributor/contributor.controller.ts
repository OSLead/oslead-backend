import { Response, Request } from "express";
import { User as Contributor } from "../../models/contributor.model";
import { ERRORS_MESSAGE } from "../../utils/response_messages";
import { Project } from "../../models/projects.model";

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

const getAllContributors = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1; 
    const limit = parseInt(req.query.limit as string) || 10; 
    const skip = (page - 1) * limit; 

    const contributors = await Contributor.find()
      .skip(skip)
      .limit(limit);

    const totalContributors = await Contributor.countDocuments();

    if (!contributors.length) {
      res.status(404).send({ message: "No contributors found" });
      return;
    }

    res.status(200).send({
      total: totalContributors, 
      page, 
      limit,
      contributors, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: ERRORS_MESSAGE.ERROR_500 });
  }
};


const DELETE_PROJECT_SELECTED_BY_CONTRIBUTOR = async (req: Request, res: Response)=>{
  try {
    const { contributorId, projectId } = req.params;

    if (!contributorId || !projectId) {
      return res.status(400).send({ message: "Contributor ID and Project ID are required." });
    }


    const updatedContributor = await Contributor.findOneAndUpdate(
      { _id: contributorId },
      { $pull: { enrolledProjects: { projectId } } },
      { new: true }
    );

    if (!updatedContributor) {
      return res
        .status(404)
        .send({ message: "Contributor not found or unauthorized." });
    }

    return res.status(200).send({
      message: "Enrolled project deleted successfully.",
      updatedContributor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error." });
  }
}

export { getContributorSelf, getAllContributors,DELETE_PROJECT_SELECTED_BY_CONTRIBUTOR };
