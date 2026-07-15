"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { SERVICES, HOSPITALS } from "@/data/mockData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Sparkles, 
  Brain, 
  Star, 
  ChevronRight, 
  Layers, 
  CalendarCheck, 
  TrendingDown,
  Activity,
  HeartPulse,
  FlameKindling
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();
  const { setSearchService } = useApp();

  const handleServiceClick = (serviceId: string) => {
    setSearchService(serviceId);
    router.push(`/search?service=${serviceId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-radial from-blue-50/50 via-transparent to-transparent">
          {/* Decorative Blur Orbs */}
          <div className="absolute top-1/4 left-1/10 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute top-1/3 right-1/10 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Hero Left Content */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 rounded-full border border-blue-200/50 bg-blue-50/50 px-3.5 py-1.5 text-xs font-semibold text-primary backdrop-blur-xs">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>100% Transparent Diagnostic Comparisons</span>
                </div>
                
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-none">
                  Compare Hospital <br />
                  <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Services Near You
                  </span>
                </h1>
                
                <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                  Save up to 40% on MRI Scans, CT Scans, Blood Tests, and health checkups. Contrast diagnostic costs, hospital distance, verified patient ratings, and book slots instantly.
                </p>

                {/* Main Search Widget */}
                <div className="pt-2 max-w-3xl mx-auto lg:mx-0">
                  <SearchBar />
                </div>

                {/* Badges / Metrics */}
                <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-4.5 w-4.5 text-secondary" />
                    <span>NABL/NABH Accredited Labs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4.5 w-4.5 text-secondary" />
                    <span>Instant Report Delivery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4.5 w-4.5 text-secondary" />
                    <span>Home Collection Available</span>
                  </div>
                </div>
              </div>

              {/* Hero Right: Premium CSS/SVG Mockup Illustration */}
              <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="relative w-full max-w-[420px]"
                >
                  {/* Decorative mesh */}
                  <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-primary to-secondary opacity-30 blur-lg animate-pulse-slow" />
                  
                  {/* Mockup Container */}
                  <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4.5 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center space-x-2">
                        <HeartPulse className="h-5 w-5 text-primary" />
                        <span className="text-xs font-bold text-slate-800">MediCompare Dashboard</span>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    </div>

                    {/* Filter Preview */}
                    <div className="flex space-x-1.5">
                      <div className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200">
                        Mumbai
                      </div>
                      <div className="text-[10px] font-semibold bg-blue-50 text-primary px-2.5 py-1 rounded-md border border-blue-100">
                        MRI Brain Scan
                      </div>
                    </div>

                    {/* Hospital Card Mockup 1 (Apollo) */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-2 relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Apollo Health City</h4>
                          <p className="text-[10px] text-slate-400 flex items-center mt-0.5">
                            <MapPin className="h-3 w-3 mr-0.5 text-slate-400" /> Andheri East (1.8 km)
                          </p>
                        </div>
                        <span className="text-xs font-extrabold text-slate-800">₹6,200</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-0.5" /> 4.8
                        </span>
                        <span className="text-secondary font-semibold">Today, 04:30 PM slot</span>
                      </div>
                    </div>

                    {/* Hospital Card Mockup 2 (Dr. Lal PathLabs - Recommended) */}
                    <div className="rounded-xl border-2 border-emerald-500 bg-white p-3.5 space-y-2 relative shadow-md shadow-emerald-500/5">
                      <div className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-secondary to-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-sm">
                        <Brain className="h-2.5 w-2.5" />
                        <span>AI Choice (Cheapest)</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Dr. Lal PathLabs</h4>
                          <p className="text-[10px] text-slate-400 flex items-center mt-0.5">
                            <MapPin className="h-3 w-3 mr-0.5 text-slate-400" /> Andheri East (1.2 km)
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-slate-800">₹5,400</span>
                          <p className="text-[9px] text-slate-400 line-through">₹7,000</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-0.5" /> 4.6
                        </span>
                        <span className="text-secondary font-semibold">Today, 02:00 PM slot</span>
                      </div>
                    </div>

                    {/* Hospital Card Mockup 3 (SRL) */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">SRL Diagnostics</h4>
                          <p className="text-[10px] text-slate-400 flex items-center mt-0.5">
                            <MapPin className="h-3 w-3 mr-0.5 text-slate-400" /> Andheri East (2.9 km)
                          </p>
                        </div>
                        <span className="text-xs font-extrabold text-slate-800">₹5,600</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-0.5" /> 4.5
                        </span>
                        <span className="text-secondary font-semibold">Today, 03:30 PM slot</span>
                      </div>
                    </div>

                    {/* Dynamic Savings Alert */}
                    <div className="rounded-xl bg-blue-50 border border-blue-100 p-2.5 text-center flex items-center justify-between text-[11px] font-semibold text-primary">
                      <div className="flex items-center space-x-1">
                        <TrendingDown className="h-3.5 w-3.5" />
                        <span>Potential saving: ₹1,600</span>
                      </div>
                      <span className="text-[10px] font-bold hover:underline cursor-pointer">Compare Now &rarr;</span>
                    </div>

                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* POPULAR DIAGNOSTIC SERVICES */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-12">
              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Compare Popular Diagnostic Services
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
                Click any scan or test to see live listings, filter local hospital providers, and view active slot availabilities.
              </p>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {SERVICES.map((service) => {
                // Find average count of labs or standard highlights
                return (
                  <motion.div key={service.id} variants={itemVariants} className="flex">
                    <Card
                      hoverEffect
                      className="w-full flex flex-col justify-between border-slate-100/80 hover:border-blue-100 cursor-pointer group"
                      onClick={() => handleServiceClick(service.id)}
                    >
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <Activity className="h-6 w-6" />
                          </div>
                          <Badge variant="primary" className="font-bold">
                            {service.priceRange}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">
                            {service.name}
                          </h3>
                          <p className="text-xs font-light text-slate-500 mt-1 leading-relaxed line-clamp-2">
                            {service.description}
                          </p>
                        </div>
                      </CardContent>
                      <div className="mt-5 border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
                        <span className="text-slate-400">Prep: {service.preparation.split('.')[0]}.</span>
                        <span className="font-bold text-primary flex items-center group-hover:translate-x-1 transition-transform">
                          Check Prices <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-16">
              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                How MediCompare Works
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto text-sm">
                Three easy steps to booking transparently priced diagnostics in India.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-slate-200" />
              
              {/* Step 1 */}
              <div className="text-center space-y-4 relative z-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200 text-primary shadow-sm font-display text-xl font-bold">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900">Select Test & City</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Choose from MRI, CT Scan, X-Ray, Blood Test, Ultrasound or Full Packages and select your city (e.g. Mumbai, Bengaluru).
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center space-y-4 relative z-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200 text-primary shadow-sm font-display text-xl font-bold">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900">Compare Providers</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Sort hospitals and diagnostics labs instantly by cheapest price, closest distance, slot speed, and patient ratings.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center space-y-4 relative z-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/20 font-display text-xl font-bold">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900 text-primary">Book Instantly</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Select your slot, enter patient details, complete checkout securely (UPI, Card, Net Banking), and arrive for scan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI RECOMMENDER CTA */}
        <section className="py-16 sm:py-24 bg-gradient-to-tr from-slate-900 to-slate-800 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-primary-hover border border-white/10 backdrop-blur-xs">
              <Brain className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
              <span className="text-slate-200">Introducing MediCompare Smart AI Assistant</span>
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Let Our AI Choose the Best <br />
              Hospital for Your Budget
            </h2>
            
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base font-light leading-relaxed">
              Unsure if you should pay premium rates for high-field MRI or travel 8 km to a discount diagnostic lab? Our Smart Recommendation engine ranks hospitals based on budget constraints, travel time, and machine quality.
            </p>

            <div className="pt-4 flex justify-center">
              <Link href="/ai-recommend">
                <Button size="lg" className="bg-gradient-to-r from-secondary to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold border-none shadow-lg shadow-emerald-500/25">
                  Try AI Smart Recommendation
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-16">
              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
                What Indian Patients Say
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto text-sm">
                Verified reviews from users who saved time and diagnostic costs with MediCompare.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <Card className="bg-slate-50/50 border-slate-100 flex flex-col justify-between p-6">
                <div className="space-y-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-xs font-light text-slate-600 leading-relaxed italic">
                    "My mother needed a spinal MRI scan. The local hospital quoted ₹9,000. Through MediCompare, I compared options, checked review ratings, and found Apollo in Navi Mumbai offering the scan for ₹6,200 on the same day. Booking process was seamless."
                  </p>
                </div>
                <div className="mt-6 flex items-center space-x-3 pt-4 border-t border-slate-100">
                  <div className="h-8 w-8 rounded-full bg-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center">
                    VM
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-none">Vikram Mehta</h4>
                    <span className="text-[10px] text-slate-400 mt-1 block">Mumbai</span>
                  </div>
                </div>
              </Card>

              {/* Testimonial 2 */}
              <Card className="bg-slate-50/50 border-slate-100 flex flex-col justify-between p-6">
                <div className="space-y-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-xs font-light text-slate-600 leading-relaxed italic">
                    "I compared complete lipid blood panels across three diagnostic labs. I was amazed to find Dr. Lal PathLabs was right at 1.2 km distance, and they offered next morning slot for only ₹499. Outstanding price transparency, very much needed in India!"
                  </p>
                </div>
                <div className="mt-6 flex items-center space-x-3 pt-4 border-t border-slate-100">
                  <div className="h-8 w-8 rounded-full bg-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center">
                    SD
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-none">Savitri Devi</h4>
                    <span className="text-[10px] text-slate-400 mt-1 block">Delhi NCR</span>
                  </div>
                </div>
              </Card>

              {/* Testimonial 3 */}
              <Card className="bg-slate-50/50 border-slate-100 flex flex-col justify-between p-6">
                <div className="space-y-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-xs font-light text-slate-600 leading-relaxed italic">
                    "The hospital admin portal was super useful to list our diagnostic slots. The Analytics charts show exactly where bookings are coming from. The appointment scheduling is fully digitalized."
                  </p>
                </div>
                <div className="mt-6 flex items-center space-x-3 pt-4 border-t border-slate-100">
                  <div className="h-8 w-8 rounded-full bg-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center">
                    AN
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-none">Apollo Admin Team</h4>
                    <span className="text-[10px] text-slate-400 mt-1 block">Hospital Partner</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
