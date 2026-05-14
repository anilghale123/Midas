import mongoose from "mongoose";
import { AUDIT_ACTIONS } from "@/lib/enums";

export { AUDIT_ACTIONS };

const AuditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    userEmail: { type: String, default: "" },
    action: { type: String, enum: AUDIT_ACTIONS, required: true, index: true },
    targetCollection: { type: String, default: "" },
    targetId: { type: mongoose.Schema.Types.ObjectId, default: null },
    before: { type: mongoose.Schema.Types.Mixed, default: null },
    after: { type: mongoose.Schema.Types.Mixed, default: null },
    ipAddress: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    timestamp: { type: Date, default: () => new Date(), index: true },
  },
  { timestamps: false }
);

export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
