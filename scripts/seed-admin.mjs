#!/usr/bin/env node
// Seed the first SUPER_ADMIN account from env vars.
// Run with (Node 20.6+): node --env-file=.env.local scripts/seed-admin.mjs

import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME ?? "midas";
const email = (process.env.SEED_SUPERADMIN_EMAIL ?? "").toLowerCase().trim();
const password = process.env.SEED_SUPERADMIN_PASSWORD ?? "";
const name = process.env.SEED_SUPERADMIN_NAME ?? "Midas Admin";

if (!URI) {
  console.error("MONGODB_URI is required");
  process.exit(1);
}
if (!email || !password) {
  console.error("SEED_SUPERADMIN_EMAIL and SEED_SUPERADMIN_PASSWORD are required");
  process.exit(1);
}
if (password.length < 12) {
  console.error("SEED_SUPERADMIN_PASSWORD must be at least 12 characters");
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true },
    passwordHash: String,
    role: { type: String, enum: ["SUPER_ADMIN", "EDITOR"], default: "EDITOR" },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

await mongoose.connect(URI, { dbName: DB_NAME });

const existing = await User.findOne({ email });
const passwordHash = await bcrypt.hash(password, 12);

if (existing) {
  existing.name = name;
  existing.role = "SUPER_ADMIN";
  existing.isActive = true;
  existing.passwordHash = passwordHash;
  await existing.save();
  console.log(`Updated existing SUPER_ADMIN: ${email}`);
} else {
  await User.create({ name, email, passwordHash, role: "SUPER_ADMIN", isActive: true });
  console.log(`Created SUPER_ADMIN: ${email}`);
}

await mongoose.disconnect();
process.exit(0);
