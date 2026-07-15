"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { HOSPITALS } from "@/data/mockData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  Calendar, 
  History, 
  Heart, 
  Settings, 
  Clock, 
  FileDown, 
  MessageSquare,
  TrendingDown,
  User,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function UserDashboardPageContent() {
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get("bookingSuccess") === "true";
  const { bookings, cancelBooking, currentUser, loginUser } = useApp();

  // Dashboard Tabs: 'upcoming' | 'history' | 'saved' | 'settings'
  const [activeTab, setActiveTab] = useState<"upcoming" | "history" | "saved" | "settings">("upcoming");
  const [successVisible, setSuccessVisible] = useState(showSuccess);

  // Profile forms
  const [profileName, setProfileName] = useState(currentUser?.name || "Vinay Kumar");
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || "vinay.kumar@gmail.com");
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || "+91 98765 43210");
  const [profileCity, setProfileCity] = useState(currentUser?.city || "Mumbai");
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name);
      setProfileEmail(currentUser.email);
      setProfilePhone(currentUser.phone);
      setProfileCity(currentUser.city);
    }
  }, [currentUser]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(profileEmail, profileName);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2000);
  };

  // Group Bookings
  const upcomingBookings = useMemo(() => {
    return bookings.filter((b) => b.status === "Upcoming");
  }, [bookings]);

  const pastBookings = useMemo(() => {
    return bookings.filter((b) => b.status === "Completed" || b.status === "Cancelled");
  }, [bookings]);

  // Saved Hospitals (Mocked list using first 2 hospitals for aesthetics)
  const savedHospitals = useMemo(() => {
    return HOSPITALS.slice(0, 2);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        
        {/* SUCCESS NOTIFICATION */}
        <AnimatePresence>
          {successVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3 text-emerald-800">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-emerald-950">Booking Confirmed!</h4>
                    <p className="text-[11px] text-emerald-700 leading-none mt-1">
                      Your appointment has been registered. The hospital has locked in your diagnostic slot.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSuccessVisible(false)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-950 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DASHBOARD HERO BANNER */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1 bg-white/15 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span>Patient Account</span>
              </div>
              <h1 className="font-display text-2xl font-extrabold text-white leading-none">
                Hello, {currentUser?.name || "Patient Guest"}
              </h1>
              <p className="text-xs text-slate-300 font-light leading-none">
                Manage your clinical checkups, download reports, and access saved providers.
              </p>
            </div>
            
            <div className="flex space-x-2 shrink-0">
              <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/5 text-center min-w-[90px]">
                <span className="block text-lg font-extrabold">{upcomingBookings.length}</span>
                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Upcoming</span>
              </div>
              <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/5 text-center min-w-[90px]">
                <span className="block text-lg font-extrabold">{pastBookings.length}</span>
                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">History</span>
              </div>
            </div>
          </div>
        </div>

        {/* TAB CONTROLS AND CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* TAB SIDEBAR (Desktop) */}
          <aside className="lg:col-span-3 flex flex-row lg:flex-col bg-white border border-slate-200/60 rounded-2xl p-2 gap-1 overflow-x-auto w-full">
            {[
              { id: "upcoming", label: "Appointments", icon: Calendar },
              { id: "history", label: "History & Reports", icon: History },
              { id: "saved", label: "Saved Clinics", icon: Heart },
              { id: "settings", label: "Profile Settings", icon: Settings }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center space-x-2.5 px-4 py-3 text-xs font-semibold rounded-xl text-left cursor-pointer transition-colors w-full whitespace-nowrap
                    ${isActive ? "bg-blue-50 text-primary font-bold" : "text-slate-600 hover:bg-slate-50"}
                  `}
                >
                  <TabIcon className={`h-4 w-4 ${isActive ? "text-primary" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </aside>

          {/* TAB CONTENT PANEL */}
          <div className="lg:col-span-9 space-y-4">
            <AnimatePresence mode="wait">
              
              {/* Upcoming Bookings Tab */}
              {activeTab === "upcoming" && (
                <motion.div
                  key="upcoming-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="pb-2 border-b border-slate-150">
                    <h2 className="font-display text-base font-bold text-slate-800">Upcoming Appointments</h2>
                    <p className="text-xs text-slate-400 font-light mt-0.5">Show active reservations that are currently verified.</p>
                  </div>

                  {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingBookings.map((b) => (
                        <Card key={b.id} className="p-5 border-slate-200/60 shadow-xs bg-white">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Badge variant="primary">{b.id}</Badge>
                                <span className="text-[10px] font-bold text-secondary bg-emerald-50 px-2 py-0.5 rounded-sm">Confirmed</span>
                              </div>
                              
                              <h3 className="font-display text-sm font-bold text-slate-900">{b.hospitalName}</h3>
                              <p className="text-xs text-slate-500 font-semibold">{b.serviceName}</p>
                              
                              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500 font-light">
                                <span className="flex items-center">
                                  <Calendar className="h-3.5 w-3.5 mr-1 text-slate-400" />
                                  {b.date}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-3.5 w-3.5 mr-1 text-slate-400" />
                                  {b.slot.split(' ')[0]} {b.slot.split(' ')[1]}
                                </span>
                                <span className="flex items-center">
                                  <User className="h-3.5 w-3.5 mr-1 text-slate-400" />
                                  Patient: {b.patientName}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0">
                              <div className="text-left sm:text-right">
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Paid Fee</span>
                                <span className="text-base font-extrabold text-slate-900">₹{b.price.toLocaleString()}</span>
                              </div>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (confirm("Are you sure you want to cancel this booking?")) {
                                    cancelBooking(b.id);
                                  }
                                }}
                                className="text-[10px] text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 h-8 font-bold cursor-pointer"
                              >
                                Cancel Booking
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white border border-slate-200/60 rounded-2xl">
                      <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-3.5" />
                      <h3 className="text-sm font-bold text-slate-800">No Upcoming Bookings</h3>
                      <p className="text-slate-400 text-xs mt-1">Book your next diagnostic checkup on our compare search panel.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* History & Reports Tab */}
              {activeTab === "history" && (
                <motion.div
                  key="history-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="pb-2 border-b border-slate-150">
                    <h2 className="font-display text-base font-bold text-slate-800">Diagnostic History & Reports</h2>
                    <p className="text-xs text-slate-400 font-light mt-0.5">Access and download verified report documents.</p>
                  </div>

                  {pastBookings.length > 0 ? (
                    <div className="space-y-4">
                      {pastBookings.map((b) => {
                        const isCancelled = b.status === "Cancelled";
                        return (
                          <Card key={b.id} className={`p-5 border-slate-200/60 shadow-xs bg-white ${isCancelled ? "opacity-60" : ""}`}>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div className="space-y-1.5">
                                <div className="flex items-center space-x-2">
                                  <Badge variant={isCancelled ? "danger" : "secondary"}>
                                    {b.status}
                                  </Badge>
                                  <span className="text-[10px] text-slate-400 font-semibold">{b.id}</span>
                                </div>
                                <h3 className="font-display text-sm font-bold text-slate-800">{b.hospitalName}</h3>
                                <p className="text-xs text-slate-500 font-medium">{b.serviceName} • Patient: {b.patientName}</p>
                                <p className="text-[10px] text-slate-400">Date: {b.date}</p>
                              </div>

                              {!isCancelled ? (
                                <div className="flex space-x-2 shrink-0">
                                  <Button variant="outline" size="sm" className="text-[10px] font-bold h-8 flex items-center space-x-1 cursor-pointer">
                                    <FileDown className="h-3.5 w-3.5" />
                                    <span>Download Report</span>
                                  </Button>
                                  <Button variant="glass" size="sm" className="text-[10px] font-bold h-8 flex items-center space-x-1 cursor-pointer border-slate-200">
                                    <MessageSquare className="h-3.5 w-3.5 text-primary" />
                                    <span>Write Review</span>
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-xs font-semibold text-slate-400">Refund Processing</span>
                              )}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white border border-slate-200/60 rounded-2xl">
                      <History className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                      <span className="text-xs text-slate-500 font-bold block">No Clinical History</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Saved Clinics Tab */}
              {activeTab === "saved" && (
                <motion.div
                  key="saved-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="pb-2 border-b border-slate-150">
                    <h2 className="font-display text-base font-bold text-slate-800">Saved Clinics & Labs</h2>
                    <p className="text-xs text-slate-400 font-light mt-0.5">Quickly access bookmarked hospital facilities.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedHospitals.map((h) => (
                      <Card key={h.id} className="p-4 hover:shadow-md border-slate-200/60 bg-white space-y-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                            {h.logo}
                          </div>
                          <div>
                            <h3 className="font-display text-xs font-bold text-slate-800 leading-snug line-clamp-1">{h.name}</h3>
                            <span className="text-[10px] text-amber-500 font-bold flex items-center">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-0.5" /> {h.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal flex items-center font-light">
                          <MapPin className="h-3 w-3 mr-0.5 shrink-0" />
                          {h.address.split(',').slice(0, 2).join(',')} ({h.distance} km)
                        </p>
                        <div className="flex gap-2 pt-1 border-t border-slate-100">
                          <Link href={`/hospital/${h.id}`} className="w-full">
                            <Button variant="outline" size="sm" className="w-full text-[10px] h-7 font-bold py-1">
                              View Clinic
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Profile Settings Tab */}
              {activeTab === "settings" && (
                <motion.div
                  key="settings-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="pb-2 border-b border-slate-150">
                    <h2 className="font-display text-base font-bold text-slate-800">Profile Settings</h2>
                    <p className="text-xs text-slate-400 font-light mt-0.5">Edit patient contact details and default locations.</p>
                  </div>

                  {isSavedAlert && (
                    <div className="bg-emerald-50 border border-emerald-200/50 p-3 rounded-xl text-xs font-semibold text-secondary flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />
                      <span>Changes saved successfully to context session!</span>
                    </div>
                  )}

                  <Card className="p-6 border-slate-200/60 bg-white">
                    <form onSubmit={handleProfileSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                        <input
                          type="text"
                          required
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full text-xs font-medium text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                        <input
                          type="email"
                          required
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          className="w-full text-xs font-medium text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone number</label>
                        <input
                          type="tel"
                          required
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          className="w-full text-xs font-medium text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">City Location</label>
                        <select
                          value={profileCity}
                          onChange={(e) => setProfileCity(e.target.value)}
                          className="w-full text-xs font-medium text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 bg-white outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        >
                          {["Mumbai", "Delhi NCR", "Bengaluru", "Pune", "Hyderabad"].map((c) => (
                            <option key={c} value={c}>
                              {c}, India
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2 pt-2 text-right">
                        <Button type="submit" size="sm" className="font-bold text-xs">
                          Save Changes
                        </Button>
                      </div>

                    </form>
                  </Card>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}

export default function UserDashboardPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading Dashboard...</div>}>
      <UserDashboardPageContent />
    </React.Suspense>
  );
}
