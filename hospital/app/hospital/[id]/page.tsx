"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
  ShieldCheck, 
  Compass, 
  Heart, 
  Bookmark, 
  CalendarRange, 
  Phone,
  FileCheck,
  CheckCircle,
  Inbox
} from "lucide-react";
import { motion } from "framer-motion";

function HospitalDetailsPageContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const hospitalId = params.id as string;
  const urlService = searchParams.get("service") || "mri";

  // Find Hospital
  const hospital = useMemo(() => {
    return HOSPITALS.find((h) => h.id === hospitalId) || HOSPITALS[0];
  }, [hospitalId]);

  // Selected Service State (Defaults to the service passed in URL)
  const [selectedServiceId, setSelectedServiceId] = useState<string>(urlService);

  const selectedServiceDetails = useMemo(() => {
    const detail = hospital.services[selectedServiceId];
    const meta = SERVICES.find((s) => s.id === selectedServiceId);
    return {
      id: selectedServiceId,
      name: meta?.name || "Diagnostic Service",
      price: detail?.price || 0,
      nextSlot: detail?.nextSlot || "Tomorrow, 09:00 AM",
      slots: detail?.slots || [],
      machineType: detail?.machineType || "Standard Medical Grade Scan",
      available: detail?.available || false,
      overview: meta?.overview || "",
      preparation: meta?.preparation || ""
    };
  }, [selectedServiceId, hospital]);

  if (!hospital) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="text-center">Hospital details not found.</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* GALLERY/BANNER GRADIENT DISPLAY */}
      <section className="bg-slate-900 text-white relative py-12 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: hospital.images[0] }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="bg-emerald-500 hover:bg-emerald-500 text-white font-bold py-1 px-3 border-none">
                NABL Accredited
              </Badge>
              <Badge variant="primary" className="bg-primary hover:bg-primary text-white font-bold py-1 px-3 border-none">
                {hospital.availability} Slot Speed
              </Badge>
            </div>
            
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-none">
              {hospital.name}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 font-light flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-slate-400 shrink-0" />
              {hospital.address} ({hospital.distance} km from center)
            </p>

            <div className="flex items-center space-x-4 pt-1.5 text-xs">
              <div className="flex items-center text-amber-400 font-extrabold bg-white/10 px-2.5 py-1 rounded-lg">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                <span>{hospital.rating}</span>
              </div>
              <span className="text-slate-400 font-medium">({hospital.reviewsCount} verified patient reviews)</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT COLUMNS */}
      <main className="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Details, Pricing, Maps, Reviews */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* About Block */}
            <Card className="p-6 border-slate-200/60 shadow-xs bg-white space-y-4">
              <h2 className="font-display text-base font-bold text-slate-900">About Provider</h2>
              <p className="text-xs text-slate-600 leading-relaxed font-light">{hospital.about}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
                {hospital.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2 text-xs text-slate-700 font-medium">
                    <CheckCircle className="h-4 w-4 text-secondary shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Diagnostic Pricing Table */}
            <Card className="p-6 border-slate-200/60 shadow-xs bg-white space-y-4.5">
              <div className="space-y-1">
                <h2 className="font-display text-base font-bold text-slate-900">Available Diagnostic Services</h2>
                <p className="text-xs text-slate-500 font-light">Select a service to update the booking summary panel on the right.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-1">Service Name</th>
                      <th className="py-3 px-1">Next slot</th>
                      <th className="py-3 px-1 text-right">Price</th>
                      <th className="py-3 px-1 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SERVICES.map((serv) => {
                      const details = hospital.services[serv.id];
                      const isSelected = selectedServiceId === serv.id;
                      
                      return (
                        <tr 
                          key={serv.id}
                          onClick={() => details?.available && setSelectedServiceId(serv.id)}
                          className={`
                            border-b border-slate-100/60 text-xs transition-colors cursor-pointer
                            ${!details?.available ? "opacity-45 pointer-events-none" : "hover:bg-slate-50/50"}
                            ${isSelected ? "bg-blue-50/40 font-semibold" : ""}
                          `}
                        >
                          <td className="py-4.5 px-1">
                            <div className="flex items-center space-x-2">
                              <input 
                                type="radio" 
                                checked={isSelected} 
                                readOnly 
                                disabled={!details?.available}
                                className="h-3.5 w-3.5 text-primary border-slate-300 focus:ring-primary"
                              />
                              <div>
                                <span className="font-bold text-slate-800 block leading-tight">{serv.name}</span>
                                <span className="text-[10px] text-slate-400 font-light">{details?.machineType || "Digital Diagnosis"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4.5 px-1 text-slate-600 font-medium">
                            {details?.available ? details.nextSlot : "No Slot Available"}
                          </td>
                          <td className="py-4.5 px-1 text-right font-extrabold text-slate-900">
                            {details?.available ? `₹${details.price.toLocaleString()}` : "—"}
                          </td>
                          <td className="py-4.5 px-1 text-right">
                            <span className="text-[11px] font-bold text-primary hover:underline">
                              {isSelected ? "Selected" : "Select"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Preparation and details for chosen service */}
            <Card className="p-6 border-slate-200/60 shadow-xs bg-white space-y-4">
              <h2 className="font-display text-base font-bold text-slate-900">
                Important Prep Checklist for: {selectedServiceDetails.name}
              </h2>
              <div className="bg-blue-50/55 rounded-2xl border border-blue-100/50 p-4 space-y-3">
                <div className="flex items-start space-x-2.5 text-xs">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800 leading-normal">Preparation Instructions</p>
                    <p className="text-slate-600 leading-relaxed font-light mt-1">{selectedServiceDetails.preparation}</p>
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-500 font-light leading-relaxed">
                <p className="font-bold text-slate-700 mb-1">About this test:</p>
                {selectedServiceDetails.overview}
              </div>
            </Card>

            {/* Mock Map Panel */}
            <Card className="p-6 border-slate-200/60 shadow-xs bg-white space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-display text-base font-bold text-slate-900 flex items-center space-x-1">
                  <Compass className="h-4.5 w-4.5 text-primary" />
                  <span>Location Map</span>
                </h2>
                <span className="text-[11px] font-semibold text-slate-500">{hospital.distance} km from city center</span>
              </div>
              
              {/* Custom Map Drawing in SVG */}
              <div className="w-full h-56 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center relative overflow-hidden">
                <svg className="absolute inset-0 w-full h-full text-slate-300" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid Lines */}
                  <line x1="20%" y1="0" x2="20%" y2="100%" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="80%" y1="0" x2="80%" y2="100%" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="0" y1="30%" x2="100%" y2="30%" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="0" y1="70%" x2="100%" y2="70%" stroke="currentColor" strokeWidth="0.5" />
                  {/* Curved Highway */}
                  <path d="M 0 100 Q 150 10 350 120 T 700 30" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  {/* Small streets */}
                  <line x1="120" y1="30" x2="120" y2="200" stroke="#f1f5f9" strokeWidth="4" />
                  <line x1="280" y1="10" x2="280" y2="180" stroke="#f1f5f9" strokeWidth="4" />
                </svg>

                {/* Map Pins */}
                <div className="absolute top-1/3 left-1/3 flex flex-col items-center">
                  <div className="h-4.5 w-4.5 bg-primary border-2 border-white rounded-full flex items-center justify-center text-white shadow-md">
                    <MapPin className="h-2.5 w-2.5" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-700 bg-white/95 px-2 py-0.5 rounded-md border mt-1 shadow-sm">
                    {hospital.name.split(',')[0]}
                  </span>
                </div>

                <div className="absolute top-1/2 left-2/3 flex flex-col items-center opacity-75">
                  <div className="h-3.5 w-3.5 bg-slate-500 border border-white rounded-full flex items-center justify-center text-white">
                    <MapPin className="h-2 w-2" />
                  </div>
                  <span className="text-[8px] font-semibold text-slate-600 bg-white/95 px-1.5 py-0.5 rounded-md border mt-1">
                    Metro Station
                  </span>
                </div>
              </div>
            </Card>

            {/* Reviews Section */}
            <Card className="p-6 border-slate-200/60 shadow-xs bg-white space-y-5">
              <h2 className="font-display text-base font-bold text-slate-900">Patient Reviews ({hospital.reviews.length})</h2>
              
              <div className="space-y-4">
                {hospital.reviews.map((review) => (
                  <div key={review.id} className="border-b border-slate-100 pb-4.5 last:border-0 last:pb-0 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-bold text-slate-800">{review.userName}</h4>
                        <span className="text-[10px] text-slate-400 font-light mt-0.5 block">Verified Diagnostics patient • {review.date}</span>
                      </div>
                      
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3.5 w-3.5 ${i < Math.floor(review.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 font-light leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* RIGHT COLUMN: Sticky booking details panel */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            
            <Card className="p-6 border-slate-200/60 shadow-md bg-white space-y-5">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Checkout Summary</span>
                <h3 className="font-display text-base font-bold text-slate-900">Selected Diagnostics</h3>
              </div>

              {/* Chosen test block */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service</span>
                  <span className="font-bold text-slate-800">{selectedServiceDetails.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Machine</span>
                  <span className="font-medium text-slate-700 text-right leading-none max-w-[150px]">{selectedServiceDetails.machineType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Next Available</span>
                  <span className="font-bold text-secondary">{selectedServiceDetails.nextSlot}</span>
                </div>
                <div className="h-0.5 w-full bg-slate-200/50" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">Total Cost</span>
                  <span className="text-lg font-extrabold text-slate-900">₹{selectedServiceDetails.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Action */}
              <Link href={`/book/${hospital.id}?service=${selectedServiceId}`} className="block">
                <Button className="w-full py-3 text-xs font-bold bg-gradient-to-r from-primary to-blue-600 shadow-md shadow-primary/25 h-11">
                  Book Slot Now
                </Button>
              </Link>

              {/* Assurances */}
              <div className="space-y-2 text-[10px] text-slate-500 font-semibold bg-slate-50/50 p-3 rounded-xl border border-slate-150">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-secondary" />
                  <span>Free doctor consultation on report query</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-secondary" />
                  <span>Zero cancellation charges up to 2 hours prior</span>
                </div>
              </div>
            </Card>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function HospitalDetailsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading Hospital Details...</div>}>
      <HospitalDetailsPageContent />
    </React.Suspense>
  );
}
