"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { SERVICES, HOSPITALS, DiagnosticService } from "@/data/mockData";
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
  FileText, 
  HelpCircle,
  Activity,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function ServiceDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  // Find target service
  const service = useMemo(() => {
    return SERVICES.find((s) => s.slug === slug) || SERVICES[0];
  }, [slug]);

  // Find top hospitals offering this service
  const topHospitals = useMemo(() => {
    return HOSPITALS
      .filter((h) => h.services[service.id]?.available)
      .slice(0, 3)
      .sort((a, b) => {
        // Sort by rating descending
        return b.rating - a.rating;
      });
  }, [service]);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="text-center">Service page not found.</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="space-y-1">
          <button 
            onClick={() => router.push("/")}
            className="inline-flex items-center text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Back to Home
          </button>
        </div>

        {/* SERVICE MAIN JUMBOTRON */}
        <section className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-xs">
          <div className="md:col-span-8 space-y-4">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-blue-50 border border-blue-200/50 px-3.5 py-1 text-xs font-semibold text-primary">
              <Activity className="h-3.5 w-3.5" />
              <span>Medical Information Hub</span>
            </div>
            
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {service.name} Information & Pricing guide
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
              {service.overview}
            </p>

            <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-600 font-semibold">
              <div>
                <span className="text-slate-400 font-medium">Estimated cost in India:</span>
                <span className="block text-sm font-bold text-slate-800 mt-0.5">{service.priceRange}</span>
              </div>
              <div className="w-px bg-slate-200 hidden sm:block" />
              <div>
                <span className="text-slate-400 font-medium">Avg Report turn:</span>
                <span className="block text-sm font-bold text-slate-800 mt-0.5">12 - 24 Hours</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-slate-50 border border-slate-200/50 rounded-2xl p-5 text-center space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Compare Live rates</span>
            <div className="text-2xl font-extrabold text-slate-850">₹{service.averagePrice.toLocaleString()} <span className="text-xs font-normal text-slate-400">average</span></div>
            <p className="text-[11px] text-slate-400 font-light leading-normal">Contrast rates from top JCI & NABL verified labs instantly.</p>
            
            <Button 
              onClick={() => router.push(`/search?service=${service.id}`)}
              className="w-full text-xs font-bold bg-gradient-to-r from-primary to-blue-600 h-10"
            >
              <span>Compare All Labs</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </section>

        {/* TWO COLUMN CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Top Clinics & FAQs */}
          <div className="md:col-span-8 space-y-8">
            {/* Top providers lists */}
            <div className="space-y-4">
              <h2 className="font-display text-base font-bold text-slate-900">Top Hospitals offering {service.name}</h2>
              <div className="space-y-3">
                {topHospitals.map((hospital) => {
                  const details = hospital.services[service.id];
                  return (
                    <Card key={hospital.id} className="p-4 border-slate-200 bg-white">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                        <div className="flex items-center space-x-3">
                          <div className="h-9 w-9 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-700">
                            {hospital.logo}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800">{hospital.name}</h4>
                            <span className="text-[10px] text-amber-500 font-bold flex items-center mt-0.5">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-0.5 text-amber-500" /> 
                              {hospital.rating} • {hospital.distance} km
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto border-t sm:border-0 pt-2 sm:pt-0">
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Rate</span>
                            <span className="text-base font-extrabold text-slate-900">₹{details?.price.toLocaleString()}</span>
                          </div>
                          <Link href={`/book/${hospital.id}?service=${service.id}`}>
                            <Button size="sm" className="h-8 text-[10px] font-bold">
                              Book Slot
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="space-y-4">
              <h2 className="font-display text-base font-bold text-slate-900 flex items-center space-x-1.5">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span>Frequently Asked Questions</span>
              </h2>
              
              <div className="space-y-3">
                {service.faqs.map((faq, idx) => (
                  <Card key={idx} className="p-4.5 border-slate-200 bg-white">
                    <h4 className="font-bold text-slate-800 text-xs leading-snug">{faq.question}</h4>
                    <p className="text-xs text-slate-500 font-light leading-relaxed mt-2">{faq.answer}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Prep checklist sidebar */}
          <div className="md:col-span-4 space-y-4">
            <Card className="p-5 border-slate-200 bg-white space-y-3.5">
              <h3 className="font-display text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1">
                <FileText className="h-4 w-4 text-primary" />
                <span>Required Preparation</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                {service.preparation}
              </p>
            </Card>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
