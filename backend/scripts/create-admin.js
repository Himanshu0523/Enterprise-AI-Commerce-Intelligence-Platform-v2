require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const User = require("../src/models/user.model");
const bcrypt = require("bcrypt");

const createAdminUsers = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();

    // Check for existing superadmin
    const existingSuperAdmin = await User.findOne({ role: "superadmin" });
    if (!existingSuperAdmin) {
      console.log("Creating superadmin user...");
      const hashedPassword = await bcrypt.hash("adminpassword", 10);
      await User.create({
        name: "Super Admin",
        email: "superadmin@example.com",
        password: hashedPassword,
        role: "superadmin"
      });
      console.log("Superadmin user created successfully (superadmin@example.com / adminpassword)");
    } else {
      console.log("Superadmin user already exists.");
    }

    // Check for existing admin
    const existingAdmin = await User.findOne({ role: "admin" });
    if (!existingAdmin) {
      console.log("Creating admin user...");
      const hashedPassword = await bcrypt.hash("adminpassword", 10);
      await User.create({
        name: "Test Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin"
      });
      console.log("Admin user created successfully (admin@example.com / adminpassword)");
    } else {
      console.log("Admin user already exists.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin users:", error);
    process.exit(1);
  }
};

createAdminUsers();
