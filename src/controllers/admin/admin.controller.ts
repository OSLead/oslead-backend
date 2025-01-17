import { Request, Response } from "express";
import { ERRORS_MESSAGE } from "../../utils/response_messages";
import { EvaluationStorage } from "../../models/evaluation.model";

const ASSIGN_POINTS_FOR_EVENTS = async (req: Request, res: Response) => {
  try {
    const { contributorId } = req.params;
    const { points } = req.body;

    // Validate inputs
    if (!points) {
      return res
        .status(400)
        .json({ message: "Points and description are required." });
    }

    // Fetch the contributor
    const contributor = await EvaluationStorage.findById(contributorId);
    if (!contributor) {
      return res.status(404).json({ message: "Contributor not found." });
    }

    // Update total points and admin-assigned history
    contributor.totalPoints += points;
    contributor.adminAssignedPointsHistory.push({
      points,
      date: new Date(),
    });

    // Save the contributor's updated data
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
