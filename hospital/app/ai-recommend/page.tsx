"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// Removed external mockData imports and defined them below
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { 
  Brain, 
  Sliders, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Clock, 
  Sparkles,
  Award,
  Wallet,
  Compass,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- DUMMY DATA STARTS HERE ---

export interface Hospital {
  id: string;
  name: string;
  city: string;
  rating: number;
  distance: number; // in km
  services: Record<string, { price: number }>;
}

const SERVICES = [
  { id: "mri", name: "MRI Scan", averagePrice: 6000 },
  { id: "ct-scan", name: "CT Scan", averagePrice: 3500 },
  { id: "ultrasound", name: "Ultrasound", averagePrice: 1500 },
  { id: "blood-test", name: "Full Body Checkup", averagePrice: 2000 },
  { id: "x-ray", name: "Digital X-Ray", averagePrice: 800 },
];

const HOSPITALS: Hospital[] = [
  {
    id: "1",
    name: "City Diagnostics & Research",
    city: "Mumbai",
    rating: 4.8,
    distance: 2.4,
    services: { mri: { price: 5500 }, "ct-scan": { price: 3200 }, ultrasound: { price: 1200 } }
  },
  {
    id: "2",
    name: "Metro Health Hub",
    city: "Mumbai",
    rating: 4.2,
    distance: 1.1,
    services: { mri: { price: 4800 }, "ct-scan": { price: 3000 }, ultrasound: { price: 1100 } }
  },
  {
    id: "3",
    name: "Precision Imaging Center",
    city: "Mumbai",
    rating: 4.9,
    distance: 8.5,
    services: { mri: { price: 7500 }, "ct-scan": { price: 4500 }, ultrasound: { price: 2000 } }
  },
  {
    id: "4",
    name: "Care Plus Lab",
    city: "Delhi NCR",
    rating: 4.5,
    distance: 3.2,
    services: { mri: { price: 5200 }, "ct-scan": { price: 3100 }, "blood-test": { price: 1800 } }
  },
  {
    id: "5",
    name: "Modern Scan Solutions",
    city: "Bengaluru",
    rating: 4.7,
    distance: 4.0,
    services: { mri: { price: 6200 }, ultrasound: { price: 1600 } }
  },
  {
    id: "6",
    name: "Apex Diagnostic Wing",
    city: "Mumbai",
    rating: 4.0,
    distance: 12.0,
    services: { mri: { price: 4200 }, "ct-scan": { price: 2800 } }
  }
];

// --- DUMMY DATA ENDS HERE ---

const CITY_COORDINATES: Record<string, [number, number]> = {
  "Mumbai": [72.8777, 19.0760],
  "Delhi NCR": [77.2185, 28.5283],
  "Bengaluru": [77.5997, 12.8953],
  "Pune": [73.8567, 18.5204],
  "Hyderabad": [78.4867, 17.3850]
};

export default function AIRecommenderPage() {
  const router = useRouter();

  const [selectedService, setSelectedService] = useState("mri");
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [budgetLimit, setBudgetLimit] = useState<number>(7000);
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [minRating, setMinRating] = useState<number>(4.0);
  
  const [generating, setGenerating] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<any>(null);
  const [gpsCoordinates, setGpsCoordinates] = useState<[number, number] | null>(null);
  const [gpsActive, setGpsActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const serviceMeta = useMemo(() => {
    return SERVICES.find(s => s.id === selectedService) || SERVICES[0];
  }, [selectedService]);

  useEffect(() => {
    if (serviceMeta) {
      setBudgetLimit(Math.round(serviceMeta.averagePrice * 1.3));
    }
  }, [serviceMeta]);

  const requestGPSLocation = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      setGenerating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoordinates([pos.coords.longitude, pos.coords.latitude]);
          setGpsActive(true);
          setGenerating(false);
        },
        (err) => {
          setGpsActive(false);
          setGenerating(false);
          alert("GPS Location access denied. Using city default.");
        }
      );
    }
  };

  // MOCKED FETCH FUNCTION
  const fetchRecommendations = async () => {
    setGenerating(true);
    setErrorMsg(null);
    
    // Simulate API Delay
    setTimeout(() => {
      try {
        // FILTER LOCAL DUMMY DATA BASED ON UI INPUTS
        const filtered = HOSPITALS.filter(h => 
          h.city === selectedCity &&
          h.services[selectedService] &&
          h.services[selectedService].price <= budgetLimit &&
          h.distance <= maxDistance &&
          h.rating >= minRating
        );

        if (filtered.length === 0) {
          setRecommendationResult(null);
          setGenerating(false);
          return;
        }

        // Simple scoring algorithm for "Best Overall"
        const ranked = filtered.map(h => ({
          ...h,
          matchScore: (h.rating * 20) + (100 - (h.distance * 5)) + (100 - (h.services[selectedService].price / 100))
        })).sort((a, b) => b.matchScore - a.matchScore);

        const cheapest = [...ranked].sort((a, b) => a.services[selectedService].price - b.services[selectedService].price)[0];
        const closest = [...ranked].sort((a, b) => a.distance - b.distance)[0];
        const bestOverall = ranked[0];

        const chartData = ranked.map((h: any) => ({
          name: h.name.split(' ')[0],
          price: h.services[selectedService]?.price || 0,
          rating: h.rating,
          distance: h.distance,
          score: h.matchScore || 0
        })).sort((a: any, b: any) => a.price - b.price);

        setRecommendationResult({
          cheapest,
          closest,
          bestOverall,
          chartData,
          source: "ai-service" // Simulation tag
        });
      } catch (err) {
        setErrorMsg("Failed to load recommendations.");
      } finally {
        setGenerating(false);
      }
    }, 800);
  };

  useEffect(() => {
    fetchRecommendations();
  }, [selectedCity, selectedService, budgetLimit, maxDistance, minRating, gpsCoordinates]);

  const triggerAIRecommendation = () => {
    fetchRecommendations();
  };

  const recommendations = recommendationResult;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* PAGE HEADER */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-semibold text-emerald-600">
              <Brain className="h-4 w-4" />
              <span>AI Recommendation Engine</span>
            </div>

          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
            Smart Diagnostic Choice recommendations
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SIDEBAR FILTERS */}
          <Card className="lg:col-span-4 p-5 bg-white border-slate-200/60 shadow-sm space-y-6">
            <h3 className="font-display text-sm font-bold text-slate-900 flex items-center space-x-2 border-b pb-3.5">
              <Sliders className="h-4.5 w-4.5 text-primary" />
              <span>Input constraints</span>
            </h3>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Device GPS Location</label>
              <Button
                type="button"
                variant={gpsActive ? "primary" : "outline"}
                onClick={requestGPSLocation}
                className="w-full text-xs font-bold flex items-center justify-center space-x-2 h-10"
              >
                <MapPin className={`h-4 w-4 ${gpsActive ? "text-white" : "text-slate-400"}`} />
                <span>{gpsActive ? "GPS Tracking Active" : "Detect My Location"}</span>
              </Button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Diagnostic test</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 bg-white"
              >
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 bg-white"
              >
                {["Mumbai", "Delhi NCR", "Bengaluru", "Pune", "Hyderabad"].map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-wider">Budget limit</span>
                <span className="text-primary">₹{budgetLimit.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="400"
                max="10000"
                step="100"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(Number(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-wider">Max distance</span>
                <span className="text-primary">{maxDistance} km</span>
              </div>
              <input
                type="range"
                min="2"
                max="20"
                step="0.5"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <Button
              onClick={triggerAIRecommendation}
              className="w-full h-11 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md border-none"
            >
              Compute AI Recommendations
            </Button>
          </Card>

          {/* RESULTS AREA */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              {generating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-slate-200 p-12 rounded-3xl text-center space-y-4"
                >
                  <Brain className="h-10 w-10 text-primary animate-pulse mx-auto" />
                  <h3 className="font-bold text-slate-800 text-sm">Evaluating Local Providers...</h3>
                </motion.div>
              ) : recommendations ? (
                <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Best Overall */}
                    <Card className="border-2 border-emerald-500 bg-white p-5 flex flex-col justify-between shadow-md relative">
                       <div className="absolute -top-3 left-4 bg-emerald-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                        AI BEST MATCH
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-bold text-xs text-slate-900">{recommendations.bestOverall.name}</h4>
                        <div className="text-xs bg-slate-50 p-2 rounded-lg border space-y-1">
                          <div className="flex justify-between"><span>Price:</span><span className="font-bold">₹{recommendations.bestOverall.services[selectedService].price}</span></div>
                          <div className="flex justify-between"><span>Distance:</span><span className="font-bold">{recommendations.bestOverall.distance} km</span></div>
                        </div>
                      </div>
                      <Button className="mt-4 w-full text-[10px] bg-emerald-600 h-8">Book Choice</Button>
                    </Card>

                    {/* Cheapest */}
                    <Card className="border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-sm">
                      <div className="space-y-3">
                        <Badge className="bg-blue-50 text-blue-700 text-[9px]">CHEAPEST</Badge>
                        <h4 className="font-bold text-xs text-slate-900">{recommendations.cheapest.name}</h4>
                        <div className="text-xs bg-slate-50 p-2 rounded-lg border">
                          <div className="flex justify-between"><span>Price:</span><span className="font-bold">₹{recommendations.cheapest.services[selectedService].price}</span></div>
                        </div>
                      </div>
                      <Button className="mt-4 w-full text-[10px] h-8" variant="outline">Book Choice</Button>
                    </Card>

                    {/* Closest */}
                    <Card className="border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-sm">
                      <div className="space-y-3">
                        <Badge className="bg-amber-50 text-amber-700 text-[9px]">CLOSEST</Badge>
                        <h4 className="font-bold text-xs text-slate-900">{recommendations.closest.name}</h4>
                        <div className="text-xs bg-slate-50 p-2 rounded-lg border">
                          <div className="flex justify-between"><span>Distance:</span><span className="font-bold">{recommendations.closest.distance} km</span></div>
                        </div>
                      </div>
                      <Button className="mt-4 w-full text-[10px] h-8" variant="outline">Book Choice</Button>
                    </Card>
                  </div>

                  {/* CHART */}
                  <Card className="p-5 border-slate-200 bg-white">
                    <CardHeader className="p-0 pb-3 mb-4 border-b">
                      <CardTitle className="text-sm font-bold">Cost Comparison (INR)</CardTitle>
                    </CardHeader>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={recommendations.chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip cursor={{fill: '#f8fafc'}} />
                          <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                            {recommendations.chartData.map((entry: any, index: number) => (
                              <Cell key={index} fill={entry.name === recommendations.bestOverall.name.split(' ')[0] ? "#10B981" : "#3B82F6"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <div className="bg-white border p-12 rounded-3xl text-center">
                  <ShieldCheck className="h-10 w-10 text-amber-500 mx-auto mb-4" />
                  <p className="text-sm font-bold text-slate-800">No labs match these filters.</p>
                  <p className="text-xs text-slate-500">Try increasing your budget or distance.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}