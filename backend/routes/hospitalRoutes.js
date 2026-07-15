import express from "express";
import { getHospitals, updateServicePrice, getAIRecommendationsHandler } from "../controllers/hospitalController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getHospitals);
router.post("/ai-recommend", getAIRecommendationsHandler);
router.put(
  "/:id/services/:serviceId",
  authenticateToken,
  authorizeRoles("HospitalAdmin", "SuperAdmin"),
  updateServicePrice
);

export default router;
