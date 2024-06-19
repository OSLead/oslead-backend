import mongoose from "mongoose";

interface IProject {
  projectDetails: Object;
  applied_contributors: [Contributor];
  points_history: [PointsDistributeHistory];
  ownedBy: {
    userId: String;
    github_id: String;
  };
}

type Contributor = {
  name: String;
  username: String;
  userId: String;
  github_id: String;
};

enum Points {
  HARD = 100,
  MEDIUM = 60,
  EASY = 40,
}

type PointsDistributeHistory = {
  pullId: String;
  user: Contributor;
  point: Points;
  github_id: String;
};

interface projectModelInterface extends mongoose.Model<ProjectDoc> {
  build(attr: IProject): ProjectDoc;
}

interface ProjectDoc extends mongoose.Document {
  projectDetails: Object;
  applied_contributors: [Contributor];
  points_history: PointsDistributeHistory;
  ownedBy: {
    userId: String;
    github_id: String;
  };
}

const projectSchema = new mongoose.Schema({
  projectDetails: {
    type: Object,
    required: true,
  },
  ownedBy: {
    userId: { type: String, required: true },
    github_id: { type: String, required: true },
  },
  applied_contributors: [
    {
      name: { type: String },
      username: { type: String },
      userId: { type: String },
      github_id: { type: String },
    },
  ],
  points_history: [
    {
      pullId: { type: String },
      user: {
        name: { type: String },
        username: { type: String },
        userId: { type: String },
        github_id: { type: String },
      },
      point: {
        type: Number,
      },
    },
  ],
});

projectSchema.statics.build = (attr: IProject) => {
  return new Project(attr);
};

const Project = mongoose.model<ProjectDoc, projectModelInterface>(
  "Project",
  projectSchema
);

export { Project };
