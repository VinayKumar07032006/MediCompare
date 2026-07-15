import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["Patient", "HospitalAdmin", "SuperAdmin"],
    default: "Patient"
  },
  city: {
    type: String
  },
  pincode: {
    type: String
  },
  refreshToken: {
    type: String
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
