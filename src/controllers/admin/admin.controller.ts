import { Request, Response } from "express";
import { ERRORS_MESSAGE } from "../../utils/response_messages";
import { EvaluationStorage } from "../../models/evaluation.model";


const ASSIGN_POINTS_FOR_EVENTS = async (req: Request, res: Response) => {
  try {
    const { contributorGithubId } = req.params;
    const { points } = req.body;

    if (!points) {
      return res
        .status(400)
        .json({ message: "Points and description are required." });
    }
    
    
    const contributor = await EvaluationStorage.findOne({
      github_id: contributorGithubId,
    });
    if (!contributor) {
      return res.status(404).json({ message: "Contributor not found." });
    }


    contributor.totalPoints += points;
    contributor.adminAssignedPointsHistory.push({
      points,
      date: new Date(),
    });

    await contributor.save();

    res
      .status(200)
      .json({ message: "Points assigned successfully", contributor });
  } catch (error) {
    console.error("Error assigning points:", error);
    res.status(500).send({ message: ERRORS_MESSAGE.ERROR_500 });
  }
};

export { ASSIGN_POINTS_FOR_EVENTS };
