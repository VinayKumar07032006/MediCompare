import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

const serviceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  iconName: { type: String, required: true },
  description: { type: String, required: true },
  priceRange: { type: String, required: true },
  averagePrice: { type: Number, required: true },
  preparation: { type: String, required: true },
  overview: { type: String, required: true },
  faqs: [faqSchema]
}, { timestamps: true });

const Service = mongoose.model("Service", serviceSchema);
export default Service;
