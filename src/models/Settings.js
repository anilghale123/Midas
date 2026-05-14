import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    _id: { type: String, default: "global" },
    siteName: { type: String, default: "MIDAS Stock Broking" },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    headOfficeAddress: { type: String, default: "" },
    branchAddresses: { type: [String], default: [] },
    sebonLicenseNumber: { type: String, default: "" },
    nepseMembershipNumber: { type: String, default: "" },
    tradingHours: { type: String, default: "" },
    supportEmail: { type: String, default: "" },
    maintenanceMode: { type: Boolean, default: false },
    socialLinks: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: { createdAt: false, updatedAt: true }, _id: false }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
