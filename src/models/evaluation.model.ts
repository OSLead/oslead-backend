import mongoose from "mongoose";

interface IEvaluation {
  github_id: string;
  username: string;
  userId: string;
  totalPoints: number;
  pointHistory: [
    {
      pull_url: string;
      points: number;
      description: string;
      difficulty: string;
    }
  ];
}

interface evaluationModelInterface extends mongoose.Model<EvalDoc> {
  build(attr: IEvaluation): EvalDoc;
}

interface EvalDoc extends mongoose.Document {
  github_id: string;
  username: string;
  userId: string;
  totalPoints: number;
  pointHistory: [
    {
      pull_url: string;
      points: number;
      description: string;
      difficulty: string;
    }
  ];
}

const evalSchema = new mongoose.Schema({
  github_id: { type: String, required: true },
  username: { type: String, required: true },
  userId: { type: String, required: false }, // This is because we will also show the users who are not even not registered in our platform.
  totalPoints: { type: Number, required: true, default: 0 },
  pointHistory: [
    {
      pull_url: { type: String, required: true },
      points: { type: Number, required: true },
      description: { type: String, required: true },
      difficulty: { type: String, required: true },
    },
  ],
});

evalSchema.statics.build = (attr: IEvaluation) => {
  return new EvaluationStorage(attr);
};

const EvaluationStorage = mongoose.model<EvalDoc, evaluationModelInterface>(
  "leaderBoard",
  evalSchema
);

export { EvaluationStorage };
