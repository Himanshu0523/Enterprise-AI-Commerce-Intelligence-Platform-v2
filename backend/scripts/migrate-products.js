require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Product = require("../src/models/product.model");
const User = require("../src/models/user.model");
const readline = require("readline");

const runMigration = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();

    // Find products without owners
    const unownedProducts = await Product.find({
      $or: [
        { seller: { $exists: false } },
        { seller: null },
        { createdBy: { $exists: false } },
        { createdBy: null }
      ]
    });

    console.log(`Found ${unownedProducts.length} products without assigned owners.`);

    if (unownedProducts.length === 0) {
      console.log("No products need migration.");
      process.exit(0);
    }

    // Find default admin or superadmin
    const defaultAdmin = await User.findOne({
      role: { $in: ["admin", "superadmin"] }
    });

    if (!defaultAdmin) {
      console.error("Error: No admin or superadmin user found in database to assign products to.");
      console.log("Please register or seed an admin user first.");
      process.exit(1);
    }

    console.log(`Default owner selected: ${defaultAdmin.name} (${defaultAdmin.email}) [ID: ${defaultAdmin._id}]`);

    // Confirmation prompt
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(
      `Are you sure you want to assign all ${unownedProducts.length} unowned products to user "${defaultAdmin.name}"? (y/yes to confirm): `,
      async (answer) => {
        rl.close();
        if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
          console.log("Starting migration...");

          const result = await Product.updateMany(
            {
              $or: [
                { seller: { $exists: false } },
                { seller: null },
                { createdBy: { $exists: false } },
                { createdBy: null }
              ]
            },
            {
              $set: {
                seller: defaultAdmin._id,
                createdBy: defaultAdmin._id,
                sellerName: defaultAdmin.name,
                isActive: true
              }
            }
          );

          console.log(`Migration successful! Updated ${result.modifiedCount} products.`);
          process.exit(0);
        } else {
          console.log("Migration cancelled by operator.");
          process.exit(0);
        }
      }
    );
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

runMigration();
