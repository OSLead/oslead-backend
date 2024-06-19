import mongoose from "mongoose";

interface IEvaluatedPulls {
  github_id: string;
  username: string;
  userId: string;
  pullUrl: string;
  pointGivenTo: {
    github_id: string;
    points: number;
    username: string;
  };
}

interface evaluatedPullsInterface extends mongoose.Model<EvaluatedDoc> {
  build(attr: IEvaluatedPulls): EvaluatedDoc;
}

interface EvaluatedDoc extends mongoose.Document {
  github_id: string;
  username: string;
  userId: string;
  pullUrl: string;
  pointGivenTo: {
    github_id: string;
    points: number;
    username: string;
  };
}

const evaluatedSchema = new mongoose.Schema({
  github_id: { type: String, required: true },
  username: { type: String, required: true },
  userId: { type: String, required: false },
  pullUrl: { type: String, required: true },
  pointGivenTo: {
    github_id: { type: String, required: true },
    points: { type: Number, required: true },
    username: { type: String, required: true },
  },
});

evaluatedSchema.statics.build = (attr: IEvaluatedPulls) => {
  return new EvaluatedStorage(attr);
};

const EvaluatedStorage = mongoose.model<EvaluatedDoc, evaluatedPullsInterface>(
  "EvaluatedStorageHistory",
  evaluatedSchema
);

export { EvaluatedStorage };
