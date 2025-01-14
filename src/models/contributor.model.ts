import mongoose from "mongoose";

interface IUser {
  name: string;
  github_id: string;
  username: string;
  email: string;
  linked_in: string;
  userId: string;
  college_name: string;
  contact_number: string;
  course_stream: string;
  profile_picture: string;
  roles: any;
  enrolledProjects: EnrolledProject[];
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
}

type EnrolledProject = {
  projectId: string;
  projectName: string;
  projectUrl: string;
  apiUrl: string;
};

interface userModelInterface extends mongoose.Model<UserDoc> {
  build(attr: IUser): UserDoc;
}

interface UserDoc extends mongoose.Document {
  name: string;
  github_id: string;
  username: string;
  email: string;
  linked_in: string;
  userId: string;
  profile_picture: string;
  college_name: string;
  contact_number: string;
  course_stream: string;
  enrolledProjects: EnrolledProject[];
  isBanned: boolean;
  roles: any;
  delivery_details: {
    city: string;
    state: string;
    pincode: string;
    tshirt: {
      size: string;
      color: string;
    };
  };
}

const userSchema = new mongoose.Schema({
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
  profile_picture: {
    type: String,
    required: false, // In future, we can make it required
  },
  linked_in: {
    type: String,
  },
  college_name: {
    type: String,
  },
  course_stream: {
    type: String,
  },
  contact_number: {
    type: String,
  },
  enrolledProjects: [
    {
      projectId: {
        type: String,
      },
      projectName: {
        type: String,
      },
      projectUrl: {
        type: String,
      },
      apiUrl: {
        type: String,
      },
    },
  ],
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  isBanned: {
    type: Boolean,
    default: false,
  },
  delivery_details: {
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    pincode: {
      type: String,
      required: false,
    },
    tshirt: {
      size: String,
      color: String,
    },
  },
});

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

const User = mongoose.model<UserDoc, userModelInterface>(
  "Contributor",
  userSchema
);

export { User };
