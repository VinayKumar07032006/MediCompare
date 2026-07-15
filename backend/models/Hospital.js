import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  date: { type: String, required: true }
});

const hospitalServiceDetailSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
  nextSlot: { type: String, required: true },
  slots: [{ type: String }],
  machineType: { type: String },
  reportTurnaround: { type: String, required: true }
});

const hospitalSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  logo: { type: String, required: true },
  rating: { type: Number, required: true },
  reviewsCount: { type: Number, required: true },
  city: { type: String, required: true },
  pincode: { type: String },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [72.8777, 19.0760]
    }
  },
  distance: { type: Number, required: true }, // in km (fallback static)
  address: { type: String, required: true },
  about: { type: String, required: true },
  images: [{ type: String }],
  availability: { type: String, enum: ["High", "Medium", "Limited"], required: true },
  amenities: [{ type: String }],
  services: {
    type: Map,
    of: hospitalServiceDetailSchema
  },
  reviews: [reviewSchema]
}, { timestamps: true });

hospitalSchema.index({ location: "2dsphere" });

const Hospital = mongoose.model("Hospital", hospitalSchema);
export default Hospital;
