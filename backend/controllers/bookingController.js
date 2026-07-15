import Booking from "../models/Booking.js";
import AuditLog from "../models/AuditLog.js";

export const getBookings = async (req, res) => {
  try {
    let query = {};
    
    // Role-based filtering
    if (req.user.role === "Patient") {
      // Patients only see their own bookings (matching user email/id)
      query = { patientName: req.user.name }; 
    } else if (req.user.role === "HospitalAdmin") {
      // Hospital admins only see bookings for their hospital (e.g. apollo-mumbai)
      // For the mock admin, we scope to apollo-mumbai
      query = { hospitalId: "apollo-mumbai" };
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    const { hospitalId, serviceId, date, slot, patientName } = bookingData;

    if (!hospitalId || !serviceId || !date || !slot || !patientName) {
      return res.status(400).json({ error: "Missing required booking details" });
    }

    // Concurrency guard: check if slot is already booked
    const existing = await Booking.findOne({
      hospitalId,
      serviceId,
      date,
      slot,
      status: "Upcoming"
    });

    if (existing) {
      return res.status(409).json({ error: "This slot is already booked. Please choose another slot." });
    }

    const bookingId = `MC-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = new Booking({
      ...bookingData,
      id: bookingId,
      status: "Upcoming",
      paymentStatus: bookingData.paymentStatus || "Paid"
    });

    await newBooking.save();

    // Log the creation
    const log = new AuditLog({
      actorId: req.user?.email || "anonymous",
      action: `CREATE_BOOKING: ${bookingId}`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });
    await log.save();

    return res.status(201).json(newBooking);
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({ error: "Failed to process booking" });
  }
};

export const cancelBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findOne({ id: id });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Role check: patients can only cancel their own bookings
    if (req.user.role === "Patient" && booking.patientName !== req.user.name) {
      return res.status(403).json({ error: "Access denied. You can only cancel your own bookings." });
    }

    booking.status = "Cancelled";
    await booking.save();

    // Log the cancellation
    const log = new AuditLog({
      actorId: req.user?.email || "anonymous",
      action: `CANCEL_BOOKING: ${id}`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });
    await log.save();

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return res.status(500).json({ error: "Failed to cancel booking" });
  }
};
