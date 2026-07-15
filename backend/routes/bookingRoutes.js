import express from "express";
import { getBookings, createBooking, cancelBooking } from "../controllers/bookingController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All booking routes require JWT validation
router.get("/", authenticateToken, getBookings);
router.post("/", authenticateToken, createBooking);
router.put("/:id/cancel", authenticateToken, cancelBooking);

export default router;
