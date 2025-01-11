import mongoose from "mongoose";
import dotenv from "dotenv";
import { Admin } from "../models/admin.model";
import db from "../models";
const Role = db.roles
dotenv.config(); // Load environment variables

const manageAdmin = async (action: "create" | "delete") => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(`${process.env.MONGODB_URL}`);

    console.log("Connected to the database.");

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({
      username: process.env.ADMIN_USERNAME,
    });

    if (action === "delete") {
      if (existingAdmin) {
        await Admin.deleteOne({ username: process.env.ADMIN_USERNAME });
        console.log("Admin user deleted successfully.");
      } else {
        console.log("Admin user does not exist. Skipping deletion.");
      }
    } else if (action === "create") {
      if (existingAdmin) {
        console.log("Admin user already exists. Skipping creation.");
      } else {

        let adminRole = await Role.findOne({ name: "admin" });
        if (!adminRole) {
          adminRole = await Role.create({ name: "admin" }); // Create the role if it doesn't exist
          console.log("Admin role created:", adminRole);
        }

        // Create a new admin user
        const newAdmin = Admin.build({
          username: process.env.ADMIN_USERNAME!,
          password: process.env.ADMIN_PASSWORD!,
          roles: [adminRole._id], // Assign the role's ObjectId
        });

        await newAdmin.save();
        console.log("Admin user created successfully:", newAdmin);
      }
    } else {
      console.log("Invalid action. Please specify 'create' or 'delete'.");
    }
  } catch (error) {
    console.error("Error managing admin user:", error);
  } finally {
    // Close the database connection
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
};

// Execute the function based on your desired action
const action = process.argv[2]; // Pass 'create' or 'delete' as a command-line argument
if (action !== "create" && action !== "delete") {
  console.error("Please specify an action: 'create' or 'delete'.");
  process.exit(1);
}

manageAdmin(action);
