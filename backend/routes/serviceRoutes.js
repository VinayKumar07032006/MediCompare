import express from "express";
import Service from "../models/Service.js";

const router = express.Router();

// GET /api/services - Retrieve all diagnostic services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({});
    return res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({ error: "Failed to fetch diagnostic services" });
  }
});

export default router;
