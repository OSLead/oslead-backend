import express, { Request, Response } from "express";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import db from "./models/index";
dotenv.config();
const app = express();
const Role = db.roles;
// * Cors

app.use((req, res, next) => {
  res.header({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PUT, POST, GET, DELETE",
  });
  next();
});

app.use(cors());
app.use(json());
app.use(cookieParser());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: `${process.env.SESSION_SECRET}`,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (obj: any, cb) {
  cb(null, obj);
});

import authRoutes from "./routes/auth.route";
import maintainerRoutes from "./routes/maintainer.route";
import errorRoutes from "./routes/error.route";
import userRegisterRoutes from "./routes/register.route";
import projectRoutes from "./routes/project.route";
import contributorRoutes from "./routes/contributor.route";
import pingRoutes from "./routes/ping.route";

// old routes (will remove in prod)
app.use("/api/auth", authRoutes);
app.use("/api/auth/projectowner", maintainerRoutes);
app.use("/api/error", errorRoutes);
app.use("/api/user", userRegisterRoutes); // This will be change to /api/contributor

// new routes
app.use("/", pingRoutes);
app.use("/api/maintainer", maintainerRoutes);
app.use("/api/contributor", contributorRoutes);
app.use("/api/projects", projectRoutes);

const createRoles = async () => {
  try {
    const countROLES = await Role.estimatedDocumentCount();
    if (countROLES === 0) {
      const contributorRole = new Role({
        name: "contributor",
      });

      const maintainerRole = new Role({
        name: "maintainer",
      });

      console.log("Creating ROLES...");

      await contributorRole.save();
      await maintainerRole.save();

      console.log("ROLES created successfully ✅");
    } else {
      console.log("ROLES already created ✅");
    }
  } catch (error) {
    console.log("ERROR creating ROLES ❌", error);
  }
};

db.mongoose
  .connect(`${process.env.MONGODB_URL}`)
  .then(async () => {
    console.log("DB connected ✅");
    await createRoles();
  })
  .catch((err) => {
    console.log("Failed to connect to DB ❌", err);
    process.exit();
  });

const PORT: number = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log("We are running on PORT ✅: " + PORT);
});
