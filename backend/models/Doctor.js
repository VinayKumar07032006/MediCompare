import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  hospitalId: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  nextAvailable: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
