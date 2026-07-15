"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { HOSPITALS, SERVICES, Hospital } from "@/data/mockData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  Star, 
  MapPin, 
  Clock, 
  SlidersHorizontal, 
  TrendingDown, 
  Brain, 
  ChevronRight, 
  ArrowRight,
  Info,
  Layers,
  Sparkles,
  Inbox
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function SearchResultsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    selectedCompareIds, 
    toggleCompare, 
    clearCompare,
    searchService,
    searchCity,
    setSearchService,
    setSearchCity
  } = useApp();

  // URL query values
  const urlService = searchParams.get("service") || "mri";
  const urlCity = searchParams.get("city") || "Mumbai";

  useEffect(() => {
    if (urlService) setSearchService(urlService);
    if (urlCity) setSearchCity(urlCity);
  }, [urlService, urlCity]);

  // UI States
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [maxDistance, setMaxDistance] = useState<number>(15);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedAvailability, setSelectedAvailability] = useState<string>("all"); // all, today, tomorrow
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Trigger loading effect on search param changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [urlService, urlCity]);

  // Current service metadata
  const currentServiceMeta = useMemo(() => {
    return SERVICES.find((s) => s.id === searchService) || SERVICES[0];
  }, [searchService]);

  // Reset filter ranges based on service average pricing
  useEffect(() => {
    if (currentServiceMeta) {
      // Set default price limit based on average service cost
      setPriceRange(currentServiceMeta.averagePrice * 1.5);
    }
  }, [currentServiceMeta]);

  // Filter Logic
  const filteredHospitals = useMemo(() => {
    return HOSPITALS.filter((hospital) => {
      // 1. City Filter
      if (hospital.city.toLowerCase() !== searchCity.toLowerCase()) return false;

      // 2. Service check
      const serviceDetail = hospital.services[searchService];
      if (!serviceDetail || !serviceDetail.available) return false;

      // 3. Price Filter
      if (serviceDetail.price > priceRange) return false;

      // 4. Distance Filter
      if (hospital.distance > maxDistance) return false;

      // 5. Rating Filter
      if (hospital.rating < minRating) return false;

      // 6. Availability Filter
      if (selectedAvailability === "today") {
        if (!serviceDetail.nextSlot.toLowerCase().includes("today")) return false;
      } else if (selectedAvailability === "tomorrow") {
        if (!serviceDetail.nextSlot.toLowerCase().includes("tomorrow")) return false;
      }

      return true;
    });
  }, [searchCity, searchService, priceRange, maxDistance, minRating, selectedAvailability]);

  // Get selected compare hospital names
  const selectedCompareHospitals = useMemo(() => {
    return HOSPITALS.filter((h) => selectedCompareIds.includes(h.id));
  }, [selectedCompareIds]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* TOP COMPACT SEARCH BAR BAR */}
      <section className="bg-white border-b border-slate-200/80 py-4 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Search</span>
              <h1 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                <span>{currentServiceMeta.name}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                <span className="text-slate-500 font-medium">{searchCity}</span>
              </h1>
            </div>
            
            <div className="w-full lg:max-w-xl">
              <SearchBar compact />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* FILTERS SIDEBAR (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-slate-200/70 p-5 space-y-6">
            <div className="flex justify-between items-center pb-3.5 border-b border-slate-100">
              <h3 className="font-display text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <span>Filters</span>
              </h3>
              <button 
                onClick={() => {
                  setPriceRange(currentServiceMeta.averagePrice * 1.5);
                  setMaxDistance(15);
                  setMinRating(0);
                  setSelectedAvailability("all");
                }}
                className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-wider">Max Price</span>
                <span className="text-primary font-bold">₹{priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="300"
                max="10000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>₹300</span>
                <span>₹10,000</span>
              </div>
            </div>

            {/* Distance Filter */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-wider">Max Distance</span>
                <span className="text-primary font-bold">{maxDistance} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>1 km</span>
                <span>20 km</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Minimum Rating
              </label>
              <div className="flex flex-col space-y-1.5">
                {[0, 4.0, 4.5, 4.7].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(stars)}
                    className={`flex items-center space-x-2 text-xs font-medium px-2 py-1.5 rounded-lg border text-left cursor-pointer transition-colors ${
                      minRating === stars
                        ? "bg-blue-50 border-blue-200 text-primary font-bold"
                        : "border-slate-150 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Star className={`h-3.5 w-3.5 ${minRating === stars ? "fill-primary text-primary" : "text-slate-400"}`} />
                    <span>{stars === 0 ? "Any Rating" : `${stars.toFixed(1)} & above`}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Availability Slots
              </label>
              <div className="flex flex-col space-y-1.5">
                {[
                  { id: "all", label: "Anytime slots" },
                  { id: "today", label: "Available Today" },
                  { id: "tomorrow", label: "Available Tomorrow" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedAvailability(item.id)}
                    className={`flex items-center justify-between text-xs font-medium px-2.5 py-1.5 rounded-lg border text-left cursor-pointer transition-colors ${
                      selectedAvailability === item.id
                        ? "bg-blue-50 border-blue-200 text-primary font-bold"
                        : "border-slate-150 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Assistant Recommender Quick Widget */}
            <div className="rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white p-4 border border-slate-800/80 shadow-md">
              <div className="flex items-center space-x-1 text-emerald-400 text-xs font-bold">
                <Brain className="h-4.5 w-4.5 shrink-0" />
                <span>AI Recommender</span>
              </div>
              <p className="text-[10px] text-slate-300 font-light mt-2 leading-relaxed">
                Struggling to find the optimal balance of rating, slots, and cost? Let our AI recommend the absolute best hospital for your conditions.
              </p>
              <Link href="/ai-recommend" className="inline-flex items-center text-[10px] font-bold text-emerald-400 hover:underline mt-3">
                <span>Compute Recommendation</span>
                <ChevronRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>
          </aside>

          {/* LISTINGS PANEL */}
          <section className="lg:col-span-9 space-y-6">
            
            {/* Header info */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-600">
                Found <span className="text-slate-900">{filteredHospitals.length} verified providers</span> in {searchCity}
              </h2>
              
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
                className="lg:hidden flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-white border rounded-lg px-3.5 py-1.5"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                <span>Filters</span>
              </button>
            </div>

            {/* Mobile Filters Drawer Modal */}
            {isFilterSidebarOpen && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
                <motion.div
                  initial={{ x: 200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="w-80 bg-white h-full p-6 overflow-y-auto space-y-6 shadow-xl"
                >
                  <div className="flex justify-between items-center pb-3 border-b">
                    <h3 className="font-bold text-slate-800">Filter Listings</h3>
                    <button 
                      onClick={() => setIsFilterSidebarOpen(false)}
                      className="text-xs text-slate-500 font-bold hover:underline"
                    >
                      Close
                    </button>
                  </div>
                  {/* Copy of desktop filters for mobile */}
                  <div className="space-y-6 pt-2">
                    {/* Price range */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">MAX PRICE</span>
                        <span className="text-primary">₹{priceRange.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="300"
                        max="10000"
                        step="100"
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    {/* Distance range */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">MAX DISTANCE</span>
                        <span className="text-primary">{maxDistance} km</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="0.5"
                        value={maxDistance}
                        onChange={(e) => setMaxDistance(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    {/* Ratings */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Min Rating</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[0, 4.0, 4.5, 4.7].map((stars) => (
                          <button
                            key={stars}
                            onClick={() => setMinRating(stars)}
                            className={`px-2 py-1.5 rounded-lg border text-xs font-medium text-center ${
                              minRating === stars ? "bg-blue-50 border-primary text-primary" : "bg-white"
                            }`}
                          >
                            {stars === 0 ? "Any" : `${stars.toFixed(1)}+`}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Slots availability */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Slots</label>
                      <div className="flex flex-col space-y-1.5">
                        {[
                          { id: "all", label: "Anytime slots" },
                          { id: "today", label: "Today" },
                          { id: "tomorrow", label: "Tomorrow" }
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setSelectedAvailability(item.id)}
                            className={`px-2 py-1.5 rounded-lg border text-xs text-left ${
                              selectedAvailability === item.id ? "bg-blue-50 border-primary text-primary font-bold" : "bg-white"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button className="w-full text-xs py-2 mt-4" onClick={() => setIsFilterSidebarOpen(false)}>
                    Apply Filters
                  </Button>
                </motion.div>
              </div>
            )}

            {/* SKELETON LOADER AND CARDS CONTAINER */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {loading ? (
                  // Rendering skeleton loaders
                  <motion.div
                    key="skeletons"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="h-44 w-full bg-white border rounded-2xl animate-pulse p-5 space-y-4">
                        <div className="flex justify-between">
                          <div className="space-y-2">
                            <div className="h-4 w-48 bg-slate-200 rounded-md" />
                            <div className="h-3.5 w-32 bg-slate-100 rounded-md" />
                          </div>
                          <div className="h-5 w-16 bg-slate-200 rounded-md" />
                        </div>
                        <div className="h-0.5 w-full bg-slate-100" />
                        <div className="flex justify-between items-center">
                          <div className="h-4 w-32 bg-slate-100 rounded-md" />
                          <div className="flex space-x-2">
                            <div className="h-9 w-24 bg-slate-200 rounded-xl" />
                            <div className="h-9 w-28 bg-slate-200 rounded-xl" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : filteredHospitals.length > 0 ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {filteredHospitals.map((hospital) => {
                      const serviceInfo = hospital.services[searchService];
                      const isCompareChecked = selectedCompareIds.includes(hospital.id);
                      
                      return (
                        <Card
                          key={hospital.id}
                          className="hover:shadow-md border-slate-200/60 p-5 relative overflow-hidden transition-all duration-300"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                            
                            {/* Hospital Logo / Info */}
                            <div className="md:col-span-8 space-y-2">
                              <div className="flex items-start space-x-3.5">
                                {/* Visual Badge */}
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-display text-sm font-bold text-slate-800">
                                  {hospital.logo}
                                </div>
                                
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-display text-base font-bold text-slate-900 leading-snug">
                                      {hospital.name}
                                    </h3>
                                    <div className="flex items-center text-amber-500 bg-amber-50 border border-amber-200/50 rounded-md px-1.5 py-0.5 text-[10px] font-bold">
                                      <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-0.5" />
                                      <span>{hospital.rating}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium">
                                      ({hospital.reviewsCount} reviews)
                                    </span>
                                  </div>
                                  
                                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-light">
                                    <span className="flex items-center">
                                      <MapPin className="h-3.5 w-3.5 text-slate-400 mr-0.5" />
                                      {hospital.distance} km away ({hospital.city})
                                    </span>
                                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-sm">
                                      {serviceInfo?.machineType || "Standard Machine"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Slot speed details */}
                              <div className="pt-2 flex items-center space-x-2 text-xs font-semibold text-secondary">
                                <Clock className="h-4.5 w-4.5" />
                                <span>Next Available Slot: {serviceInfo?.nextSlot}</span>
                              </div>
                            </div>

                            {/* Price / Booking */}
                            <div className="md:col-span-4 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-150 pt-4 md:pt-0 md:pl-5">
                              <div className="text-left md:text-right">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price</div>
                                <div className="text-xl font-extrabold text-slate-900">₹{serviceInfo?.price.toLocaleString()}</div>
                                <span className="text-[10px] text-slate-400 font-medium">Includes free Radiologist Review</span>
                              </div>

                              <div className="flex flex-col space-y-1.5 w-auto sm:w-28">
                                <Link href={`/hospital/${hospital.id}?service=${searchService}`} className="w-full">
                                  <Button variant="outline" size="sm" className="w-full text-[11px] font-bold h-8">
                                    View Details
                                  </Button>
                                </Link>
                                
                                <Link href={`/book/${hospital.id}?service=${searchService}`} className="w-full">
                                  <Button size="sm" className="w-full text-[11px] font-bold h-8">
                                    Book Slot
                                  </Button>
                                </Link>
                              </div>
                            </div>

                          </div>

                          {/* Compare Checkbox footer */}
                          <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                            <label className="inline-flex items-center space-x-2 text-xs text-slate-600 font-semibold cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={isCompareChecked}
                                onChange={() => toggleCompare(hospital.id)}
                                className="h-4 w-4 rounded-sm border-slate-300 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                              />
                              <span>Add to Side-by-Side Comparison</span>
                            </label>
                            
                            <span className="text-[11px] text-slate-400">Reports ready in: <b className="text-slate-700">{serviceInfo?.reportTurnaround}</b></span>
                          </div>
                        </Card>
                      );
                    })}
                  </motion.div>
                ) : (
                  // Rendering nice empty states
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 px-4 bg-white border border-slate-200/60 rounded-3xl"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-4.5">
                      <Inbox className="h-7 w-7" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-800">No Hospitals Found</h3>
                    <p className="text-slate-500 text-xs mt-1.5 max-w-sm mx-auto leading-relaxed font-light">
                      We couldn't find any diagnostic providers matching your filters in {searchCity}. Try adjusting your maximum price boundary or widening the distance slider.
                    </p>
                    <Button
                      size="sm"
                      className="mt-5 text-xs font-bold"
                      onClick={() => {
                        setPriceRange(10000);
                        setMaxDistance(15);
                        setMinRating(0);
                        setSelectedAvailability("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </section>

        </div>
      </main>

      {/* STICKY COMPARE BAR (Bottom Drawer) */}
      <AnimatePresence>
        {selectedCompareIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 inset-x-0 z-40 bg-slate-900 border-t border-slate-800 text-white p-4 shadow-2xl shadow-slate-900/40"
          >
            <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <Badge variant="primary" className="bg-primary hover:bg-primary text-white border-none py-1">
                  {selectedCompareIds.length} Chosen
                </Badge>
                <div>
                  <h4 className="text-xs font-bold">Comparing Hospitals Side-by-Side</h4>
                  <p className="text-[10px] text-slate-400 leading-none mt-1">Comparing prices for {currentServiceMeta.name}</p>
                </div>
              </div>

              {/* Selected List */}
              <div className="flex items-center space-x-3 overflow-x-auto max-w-full">
                {selectedCompareHospitals.map((h) => (
                  <div key={h.id} className="flex items-center space-x-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
                    <span className="font-bold text-[10px] text-slate-400">{h.logo}</span>
                    <span className="font-semibold text-slate-200 whitespace-nowrap">{h.name.split(',')[0]}</span>
                    <button
                      onClick={() => toggleCompare(h.id)}
                      className="text-slate-400 hover:text-white ml-1 font-bold cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-3.5 shrink-0">
                <button
                  onClick={clearCompare}
                  className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Clear Selection
                </button>
                <Link href="/compare">
                  <Button size="sm" className="bg-gradient-to-r from-primary to-blue-500 text-xs font-bold border-none shadow-md shadow-primary/10">
                    <span>Compare Now</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading Search Results...</div>}>
      <SearchResultsPageContent />
    </React.Suspense>
  );
}
