"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { HOSPITALS, SERVICES, Hospital } from "@/data/mockData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  Star, 
  MapPin, 
  Clock, 
  Sparkles, 
  ChevronLeft, 
  ShieldCheck, 
  Bookmark, 
  CalendarCheck, 
  CircleDollarSign,
  ArrowRight,
  TrendingDown
} from "lucide-react";
import { motion } from "framer-motion";

export default function ComparePage() {
  const router = useRouter();
  const { selectedCompareIds, toggleCompare, searchService, clearCompare } = useApp();
  const [sortBy, setSortBy] = useState<"cheapest" | "nearest" | "highest-rated">("cheapest");

  // Load details of selected hospitals
  const comparedHospitals = useMemo(() => {
    const list = HOSPITALS.filter((h) => selectedCompareIds.includes(h.id));
    
    // Sort logic
    return [...list].sort((a, b) => {
      const aService = a.services[searchService];
      const bService = b.services[searchService];
      const aPrice = aService ? aService.price : 99999;
      const bPrice = bService ? bService.price : 99999;

      if (sortBy === "cheapest") {
        return aPrice - bPrice;
      }
      if (sortBy === "nearest") {
        return a.distance - b.distance;
      }
      if (sortBy === "highest-rated") {
        return b.rating - a.rating;
      }
      return 0;
    });
  }, [selectedCompareIds, sortBy, searchService]);

  // Current service details
  const currentService = useMemo(() => {
    return SERVICES.find((s) => s.id === searchService) || SERVICES[0];
  }, [searchService]);

  // If no hospitals are selected
  if (comparedHospitals.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-16 px-4">
          <div className="text-center space-y-5 max-w-md bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">Comparison is Empty</h2>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              You haven't selected any hospitals for comparison yet. Select up to 3 hospitals from our search listings to compare their pricing, slots, and specifications.
            </p>
            <Link href="/search">
              <Button size="sm" className="font-bold text-xs mt-3">
                <ChevronLeft className="h-4 w-4 mr-1.5" /> Back to Search Results
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Savings math
  const cheapestOption = comparedHospitals[0];
  const mostExpensiveOption = comparedHospitals[comparedHospitals.length - 1];
  const maxSavings = useMemo(() => {
    if (comparedHospitals.length < 2) return 0;
    const cheapestPrice = cheapestOption.services[searchService]?.price || 0;
    const maxPrice = Math.max(...comparedHospitals.map(h => h.services[searchService]?.price || 0));
    return maxPrice - cheapestPrice;
  }, [comparedHospitals, cheapestOption, searchService]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        
        {/* Header navigation bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link href="/search" className="inline-flex items-center text-xs font-bold text-primary hover:underline">
              <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Back to Search Results
            </Link>
            <h1 className="font-display text-2xl font-extrabold text-slate-900">
              Hospital Comparison Matrix
            </h1>
            <p className="text-xs text-slate-500">
              Comparing rates, distances, and slots for: <span className="font-bold text-slate-700">{currentService.name}</span>
            </p>
          </div>

          {/* Quick Sort Options */}
          <div className="flex items-center space-x-2 shrink-0 bg-white border border-slate-200 p-1.5 rounded-xl self-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Sort by</span>
            <button
              onClick={() => setSortBy("cheapest")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                sortBy === "cheapest" ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Cheapest First
            </button>
            <button
              onClick={() => setSortBy("nearest")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                sortBy === "nearest" ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Nearest First
            </button>
            <button
              onClick={() => setSortBy("highest-rated")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                sortBy === "highest-rated" ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Top Rated
            </button>
          </div>
        </div>

        {/* SAVINGS HIGHLIGHT WIDGET */}
        {maxSavings > 0 && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200/50 p-4.5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-emerald-800">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <TrendingDown className="h-5.5 w-5.5 animate-bounce" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-emerald-950">Save up to ₹{maxSavings.toLocaleString()} on {currentService.name}!</h4>
                <p className="text-[11px] text-emerald-700 leading-none mt-1">
                  By selecting <span className="font-bold">{cheapestOption.name}</span> instead of other options.
                </p>
              </div>
            </div>
            <Link href={`/book/${cheapestOption.id}?service=${searchService}`}>
              <Button variant="secondary" size="sm" className="font-bold text-xs w-full sm:w-auto shadow-none">
                Book Cheapest Option <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        )}

        {/* COMPARISON COLUMNS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparedHospitals.map((hospital, index) => {
            const serviceDetails = hospital.services[searchService];
            
            return (
              <motion.div
                key={hospital.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex"
              >
                <Card className="w-full flex flex-col justify-between border-slate-200/60 p-6 bg-white relative overflow-hidden shadow-xs">
                  {/* Remove Compare Pin */}
                  <button
                    onClick={() => toggleCompare(hospital.id)}
                    className="absolute top-4 right-4 text-xs font-bold text-slate-400 hover:text-red-500 cursor-pointer"
                    title="Remove from comparison"
                  >
                    Remove &times;
                  </button>

                  <div className="space-y-6">
                    {/* Visual header */}
                    <div className="space-y-3">
                      {/* Logo and tag */}
                      <div className="flex items-center space-x-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 font-display text-sm font-bold">
                          {hospital.logo}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hospital Option {index + 1}</span>
                          <h3 className="font-display text-sm font-bold text-slate-900 leading-snug line-clamp-1">{hospital.name}</h3>
                        </div>
                      </div>
                      
                      {/* Rating stars block */}
                      <div className="flex items-center space-x-2 text-xs">
                        <div className="flex items-center text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/40">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-0.5" />
                          <span>{hospital.rating}</span>
                        </div>
                        <span className="text-slate-400">({hospital.reviewsCount} Patient Reviews)</span>
                      </div>
                    </div>

                    {/* COMPARISON METRICS SECTION */}
                    <div className="border-t border-b border-slate-100 py-5 space-y-4">
                      {/* Service Price Column */}
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Diagnostic Price</span>
                        <div className="text-right">
                          <span className="text-base font-extrabold text-slate-900">₹{serviceDetails?.price.toLocaleString()}</span>
                          {index === 0 && comparedHospitals.length > 1 && (
                            <span className="block text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded-xs mt-0.5">Cheapest</span>
                          )}
                        </div>
                      </div>

                      {/* Travel Distance Column */}
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Distance from Center</span>
                        <span className="font-semibold text-slate-800 flex items-center">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 mr-1" />
                          {hospital.distance} km
                        </span>
                      </div>

                      {/* Next Slot Column */}
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Next Open Slot</span>
                        <span className="font-semibold text-secondary flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {serviceDetails?.nextSlot}
                        </span>
                      </div>

                      {/* Diagnostic Machine Specs Column */}
                      <div className="flex justify-between items-start text-xs gap-3">
                        <span className="text-slate-400 font-medium whitespace-nowrap">Technical Spec</span>
                        <span className="font-bold text-slate-700 text-right leading-tight max-w-[150px]">
                          {serviceDetails?.machineType || "Standard Digital Lab"}
                        </span>
                      </div>

                      {/* Report Turnaround Column */}
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Report Delivery</span>
                        <span className="font-semibold text-slate-800">{serviceDetails?.reportTurnaround}</span>
                      </div>
                    </div>

                    {/* Amenities list */}
                    <div className="space-y-2">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hospital Amenities</span>
                      <div className="flex flex-wrap gap-1.5">
                        {hospital.amenities.slice(0, 3).map((amenity) => (
                          <Badge key={amenity} variant="neutral" className="text-[10px] bg-slate-50 border-slate-100 font-semibold px-2 py-0.5">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Column footer */}
                  <div className="mt-8 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3.5">
                    <Link href={`/hospital/${hospital.id}?service=${searchService}`} className="w-full">
                      <Button variant="outline" className="w-full text-xs py-2 h-9 font-bold">
                        View Hospital
                      </Button>
                    </Link>
                    <Link href={`/book/${hospital.id}?service=${searchService}`} className="w-full">
                      <Button className="w-full text-xs py-2 h-9 font-bold">
                        Book Test
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

      </main>

      <Footer />
    </div>
  );
}
