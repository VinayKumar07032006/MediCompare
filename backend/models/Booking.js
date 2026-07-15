import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  hospitalId: { type: String, required: true },
  hospitalName: { type: String, required: true },
  serviceId: { type: String, required: true },
  serviceName: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: String, required: true },
  slot: { type: String, required: true },
  patientName: { type: String, required: true },
  patientAge: { type: Number, required: true },
  patientGender: { type: String, required: true },
  status: { type: String, enum: ["Upcoming", "Completed", "Cancelled"], default: "Upcoming" },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, enum: ["Paid", "Pending"], default: "Paid" }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
