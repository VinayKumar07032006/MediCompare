import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  actorId: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
