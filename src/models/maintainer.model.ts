import mongoose from "mongoose";

interface IMaintainer {
  name: string;
  github_id: string;
  username: string;
  email: string;
  linked_in: string;
  userId: string;
  college_name: string;
  contact_number: string;
  isBanned: boolean;
  delivery_details: {
    city: string;
    state: string;
    pincode: string;
    tshirt: {
      size: string;
      color: string;
    };
  };
  roles: any;
}

interface MaintainerModelInterface extends mongoose.Model<MaintainerDoc> {
  build(attr: IMaintainer): MaintainerDoc;
}

interface MaintainerDoc extends mongoose.Document {
  name: string;
  github_id: string;
  username: string;
  email: string;
  linked_in: string;
  userId: string;
  college_name: string;
  contact_number: string;
  isBanned: boolean;
  delivery_details: {
    city: string;
    state: string;
    pincode: string;
    tshirt: {
      size: string;
      color: string;
    };
  };
  roles: any;
  projects: any[];
}

const MaintainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    github_id: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    linked_in: {
      type: String,
    },
    college_name: {
      type: String,
    },
    contact_number: {
      type: String,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    delivery_details: {
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      pincode: {
        type: String,
      },
      tshirt: {
        size: {
          type: String,
        },
        color: {
          type: String,
        },
      },
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

MaintainerSchema.virtual("projects", {
  ref: "Project", // Name of the referenced model
  localField: "github_id", // Field in Maintainer schema
  foreignField: "ownedBy.github_id", // Field in Project schema
});

MaintainerSchema.statics.build = (attr: IMaintainer) => {
  return new Maintainer(attr);
};

const Maintainer = mongoose.model<MaintainerDoc, MaintainerModelInterface>(
  "Maintainer",
  MaintainerSchema
);

export { Maintainer };
