require("dotenv").config();
const mongoose = require("mongoose");

const dropIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await mongoose.connection.collection("users").dropIndex("username_1");
    console.log("✅ username_1 index dropped successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("✅ Connection closed");
    process.exit();
  }
};

dropIndex();
