import mongoose from "mongoose";
mongoose.Promise = global.Promise;

const db = {
  ROLES: ["contributor", "maintainer","admin"],
  roles: require("./roles.model"),
  mongoose,
};

export default db;
