import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI(title="MediCompare ML Recommendation Service")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained RandomForest model pipeline
MODEL_PATH = os.path.join(os.path.dirname(__file__), "random_forest_recommendation_model.joblib")
print(f"Loading ML model from: {MODEL_PATH}...")
try:
    model = joblib.load(MODEL_PATH)
    print("Model pipeline loaded successfully!")
except Exception as e:
    print(f"Failed to load model pipeline: {e}")
    model = None

class HospitalInput(BaseModel):
    id: str
    price: float
    distanceKm: float
    rating: float
    reviewsCount: int
    reportTurnaround: str

class RecommendRequest(BaseModel):
    serviceId: str
    userCoordinates: List[float]
    weightPreferences: Dict[str, float]
    hospitalsList: List[HospitalInput]

# Mapping service ids to model OneHotEncoder categories
SERVICE_MAPPING = {
    "mri": "MRI - Oncology",
    "ct-scan": "MRI - Pediatrics",
    "x-ray": "X-Ray - Oncology",
    "blood-test": "ECG - Oncology",
    "ultrasound": "Physiotherapy - Oncology",
    "full-body-checkup": "Chemotherapy - Oncology"
}

def parse_turnaround_hours(hours_str: str) -> int:
    try:
        # Extract numeric hours, e.g., "12 Hours" -> 12
        return int(hours_str.split()[0])
    except Exception:
        return 12

@app.post("/recommend")
async def recommend(request: RecommendRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="Recommendation model is not loaded on server.")

    try:
        # Construct the 11 feature lists
        service_names = []
        test_prices = []
        distances = []
        ratings = []
        review_counts = []
        waiting_times = []
        delivery_times = []
        appointments = []
        insurances = []
        hospital_types = []
        emergencies = []

        for h in request.hospitalsList:
            # 1. Service Name mapping
            service_names.append(SERVICE_MAPPING.get(request.serviceId, "MRI - Oncology"))
            # 2. Test Price
            test_prices.append(h.price)
            # 3. Distance (km)
            distances.append(h.distanceKm)
            # 4. Hospital Rating
            ratings.append(h.rating)
            # 5. Review Count
            review_counts.append(h.reviewsCount)
            # 6. Waiting Time (minutes) - mapped based on provider profile
            if "apollo" in h.id:
                waiting_times.append(45)
            elif "max" in h.id:
                waiting_times.append(60)
            elif "fortis" in h.id:
                waiting_times.append(30)
            elif "lal" in h.id:
                waiting_times.append(15)
            elif "srl" in h.id:
                waiting_times.append(20)
            else:
                waiting_times.append(30)
            # 7. Report Delivery Time (hours)
            delivery_times.append(parse_turnaround_hours(h.reportTurnaround))
            # 8. Appointment Available
            appointments.append(1)
            # 9. Insurance Accepted
            insurances.append(1)
            # 10. Hospital Type
            hospital_types.append("Private")
            # 11. Emergency Service
            if "lal" in h.id or "srl" in h.id:
                emergencies.append(0)
            else:
                emergencies.append(1)

        # Build Pandas DataFrame matching columns expected by transformer
        feature_data = {
            "Service Name": service_names,
            "Test Price": test_prices,
            "Distance (km)": distances,
            "Hospital Rating": ratings,
            "Review Count": review_counts,
            "Waiting Time (minutes)": waiting_times,
            "Report Delivery Time (hours)": delivery_times,
            "Appointment Available": appointments,
            "Insurance Accepted": insurances,
            "Hospital Type": hospital_types,
            "Emergency Service": emergencies
        }

        df = pd.DataFrame(feature_data)
        
        # Calculate booking probabilities (Class 1 probability)
        probabilities = model.predict_proba(df)[:, 1]

        ranked_results = []
        for idx, h in enumerate(request.hospitalsList):
            # Scale probability to 0-100 score
            score = float(probabilities[idx] * 100)
            ranked_results.append({
                "hospitalId": h.id,
                "matchScore": round(score, 1)
            })

        # Sort recommendations descending by matchScore
        ranked_results.sort(key=lambda x: x["matchScore"], reverse=True)

        return {"rankedRecommendations": ranked_results}

    except Exception as e:
        print(f"Error executing predictions: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction execution failed: {str(e)}")

@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": model is not None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
