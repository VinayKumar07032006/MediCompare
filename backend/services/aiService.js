const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000/recommend";

/**
 * Dispatches a recommendation query to the external Python FastAPI AI service.
 * Configured with a 2-second timeout window and automatic fallback.
 * 
 * @param {string} serviceId - The ID of the diagnostic scan (e.g. 'mri')
 * @param {Array<number>} userCoordinates - [Latitude, Longitude] of the user
 * @param {Array<object>} hospitalsList - List of eligible hospitals with price, rating, and distance
 * @param {object} weights - Preference weights: { price: number, distance: number, rating: number }
 * @returns {Promise<Array<object>|null>} - Returns ranked recommendations array or null on failure (triggering fallback)
 */
export const getAIRecommendations = async (serviceId, userCoordinates, hospitalsList, weights) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second timeout limit

  try {
    console.log(`Forwarding query to Python AI service at ${AI_SERVICE_URL}...`);
    
    const response = await fetch(AI_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        serviceId,
        userCoordinates,
        weightPreferences: weights || { price: 0.3, distance: 0.3, rating: 0.4 },
        hospitalsList
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return data.rankedRecommendations;
    } else {
      console.warn(`Python AI service returned status: ${response.status}. Triggering rule-based fallback.`);
      return null;
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      console.warn("Python AI service request timed out (limit: 2000ms). Triggering rule-based fallback.");
    } else {
      console.warn("Python AI service is offline or unreachable. Triggering rule-based fallback.", error.message);
    }
    return null;
  }
};
