import mongoose from "mongoose";
import bcrypt from "bcryptjs";

interface IAdmin {
  username: string;
  password: string;
  roles: any;
}

interface AdminModelInterface extends mongoose.Model<AdminDoc> {
  build(attr: IAdmin): AdminDoc;
}

interface AdminDoc extends mongoose.Document {
  username: string;
  password: string;
  roles: any;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
});

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


AdminSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

AdminSchema.statics.build = (attr: IAdmin) => {
  return new Admin(attr);
};

const Admin = mongoose.model<AdminDoc, AdminModelInterface>("Admin", AdminSchema);

export { Admin };
