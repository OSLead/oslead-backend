import mongoose from "mongoose";
mongoose.Promise = global.Promise;

const db = {
  ROLES: ["contributor", "maintainer"],
  roles: require("./roles.model"),
  mongoose,
};

export default db;
