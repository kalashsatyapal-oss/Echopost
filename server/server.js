import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import chalk from "chalk";
import morgan from "morgan"; // ✅ Dev-friendly logging

import authRoutes from "./routes/auth.js";
import superadminRoutes from "./routes/superadmin.js";
import blogRoutes from "./routes/blogRoutes.js";
import User from "./models/User.js";

dotenv.config();
const app = express();

// 🌍 Environment
const isDev = process.env.NODE_ENV !== "production";

// 🛡️ Middleware
app.use(cors());
app.use(express.json());
if (isDev) app.use(morgan("dev")); // ✅ Log requests in dev

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' http://localhost:5000"
  );
  next();
});

// ✅ Validate required env vars
["MONGO_URI", "SUPERADMIN_EMAIL", "SUPERADMIN_PASSWORD"].forEach((key) => {
  if (!process.env[key]) {
    console.error(chalk.red(`❌ Missing env variable: ${key}`));
    process.exit(1);
  }
});

// 🌟 Superadmin Seeder
const seedSuperAdmin = async () => {
  try {
    const existing = await User.findOne({ role: "superadmin" });
    if (existing) {
      console.log(chalk.blue("ℹ️ Superadmin already exists"));
      return;
    }

    const hashed = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD, 10);
    const superadmin = new User({
      name: "Super Admin",
      email: process.env.SUPERADMIN_EMAIL,
      password: hashed,
      role: "superadmin",
    });

    await superadmin.save();
    console.log(chalk.green("🌟 Superadmin created successfully"));
  } catch (err) {
    console.error(chalk.red("❌ Error seeding superadmin:"), err.message);
  }
};

// 🔁 MongoDB Connection with retry
const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(chalk.green("✅ MongoDB connected"));
    await seedSuperAdmin();
  } catch (err) {
    console.error(chalk.red(`MongoDB connection failed: ${err.message}`));
    if (retries > 0) {
      console.log(chalk.yellow(`🔄 Retrying in 3s... (${retries} left)`));
      setTimeout(() => connectDB(retries - 1), 3000);
    } else {
      console.error(chalk.red("❌ Could not connect to MongoDB"));
      process.exit(1);
    }
  }
};

// 📡 Routes
app.use("/api/auth", authRoutes);
app.use("/api/superadmin", superadminRoutes);
app.use("/api/blogs", blogRoutes);

// 🧪 Dev-only test route
if (isDev) {
  app.get("/api/dev/ping", (req, res) => {
    res.json({ message: "Server is alive 🚀" });
  });
}

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    chalk.cyan(
      `🚀 Server running on port ${PORT} [${isDev ? "development" : "production"}] at ${new Date().toLocaleTimeString()}`
    )
  );
  connectDB();
});