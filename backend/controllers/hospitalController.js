import Hospital from "../models/Hospital.js";
import AuditLog from "../models/AuditLog.js";
import { getAIRecommendations } from "../services/aiService.js";

// Haversine formula to compute distance between two coordinates in kilometers
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Number(d.toFixed(1));
}

export const getHospitals = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    let hospitals = await Hospital.find({});

    if (lat && lng) {
      const userLat = Number(lat);
      const userLng = Number(lng);
      
      hospitals = hospitals.map(h => {
        const hospitalObj = h.toObject();
        if (h.location && h.location.coordinates) {
          const [hLng, hLat] = h.location.coordinates;
          hospitalObj.distance = calculateHaversineDistance(userLat, userLng, hLat, hLng);
        }
        return hospitalObj;
      });
    }

    return res.status(200).json(hospitals);
  } catch (error) {
    console.error("Fetch hospitals error:", error);
    return res.status(500).json({ error: "Failed to fetch hospitals" });
  }
};

export const updateServicePrice = async (req, res) => {
  const { id, serviceId } = req.params;
  const { price } = req.body;

  if (price === undefined || isNaN(price) || price < 0) {
    return res.status(400).json({ error: "Valid price greater than or equal to 0 is required" });
  }

  try {
    const hospital = await Hospital.findOne({ id: id });
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    if (!hospital.services || !hospital.services.has(serviceId)) {
      return res.status(404).json({ error: `Service '${serviceId}' is not offered by this provider` });
    }

    const serviceDetail = hospital.services.get(serviceId);
    serviceDetail.price = Number(price);
    hospital.services.set(serviceId, serviceDetail);

    hospital.markModified("services");
    await hospital.save();

    const log = new AuditLog({
      actorId: req.user?.email || "anonymous",
      action: `UPDATE_PRICE: Hospital '${id}', Service '${serviceId}' set to ₹${price}`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });
    await log.save();

    return res.status(200).json({
      message: "Price updated successfully",
      hospital
    });
  } catch (error) {
    console.error("Update price error:", error);
    return res.status(500).json({ error: "Failed to update price" });
  }
};

export const getAIRecommendationsHandler = async (req, res) => {
  try {
    const { serviceId, userCoordinates, weightPreferences, budgetLimit, maxDistance, minRating, city } = req.body;

    if (!serviceId || !userCoordinates || !city) {
      return res.status(400).json({ error: "serviceId, userCoordinates, and city are required fields" });
    }

    const [userLng, userLat] = userCoordinates;
    let hospitals = await Hospital.find({ city: { $regex: new RegExp(`^${city}$`, "i") } });

    // Filter and compute distances
    const eligibleHospitals = hospitals
      .map(h => {
        const hospitalObj = h.toObject();
        if (h.location && h.location.coordinates) {
          const [hLng, hLat] = h.location.coordinates;
          hospitalObj.distance = calculateHaversineDistance(userLat, userLng, hLat, hLng);
        }
        return hospitalObj;
      })
      .filter(h => {
        const sDetail = h.services[serviceId];
        if (!sDetail || !sDetail.available) return false;
        if (budgetLimit && sDetail.price > budgetLimit) return false;
        if (maxDistance && h.distance > maxDistance) return false;
        if (minRating && h.rating < minRating) return false;
        return true;
      });

    if (eligibleHospitals.length === 0) {
      return res.status(200).json({ recommendations: [], source: "fallback" });
    }

    // Prepare list for AI microservice
    const microserviceList = eligibleHospitals.map(h => ({
      id: h.id,
      price: h.services[serviceId].price,
      distanceKm: h.distance,
      rating: h.rating,
      reviewsCount: h.reviewsCount || 500,
      reportTurnaround: h.services[serviceId].reportTurnaround || "12 Hours"
    }));

    // Call FastAPI Python Service
    const aiRecommendations = await getAIRecommendations(serviceId, userCoordinates, microserviceList, weightPreferences);

    if (aiRecommendations) {
      // Map ranked IDs back to full hospital objects
      const rankedHospitals = aiRecommendations.map(rec => {
        const hosp = eligibleHospitals.find(h => h.id === rec.hospitalId);
        return { ...hosp, matchScore: rec.matchScore };
      });

      return res.status(200).json({ recommendations: rankedHospitals, source: "ai-service" });
    }

    // FALLBACK: Server-side mathematical scoring if Python service is offline
    const budget = budgetLimit || 7000;
    const maxDist = maxDistance || 15;
    const weights = weightPreferences || { price: 0.3, distance: 0.3, rating: 0.4 };

    const scoredHospitals = eligibleHospitals.map(h => {
      const price = h.services[serviceId].price;
      const priceScore = (budget - price) / (budget || 1);
      const distanceScore = (maxDist - h.distance) / (maxDist || 1);
      const ratingScore = (h.rating - 4) / 1; // Scale 4.0 - 5.0

      const score = (ratingScore * weights.rating) + (priceScore * weights.price) + (distanceScore * weights.distance);
      return { ...h, matchScore: Number((score * 100).toFixed(1)) };
    });

    const sortedRecommendations = scoredHospitals.sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json({ recommendations: sortedRecommendations, source: "fallback-scoring" });
  } catch (error) {
    console.error("AI Recommendation handler error:", error);
    return res.status(500).json({ error: "Recommendation processing failed" });
  }
};
