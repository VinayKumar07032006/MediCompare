"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { SERVICES, ADMIN_ANALYTICS } from "@/data/mockData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { 
  LayoutDashboard, 
  Layers, 
  CalendarCheck, 
  TrendingUp, 
  PieChartIcon, 
  Settings, 
  Check, 
  Clock, 
  XSquare, 
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Coins,
  Hospital
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboardPage() {
  const { adminHospitals, bookings, updateAdminHospitalServicePrice } = useApp();
  
  // Tabs: 'dashboard' | 'services' | 'appointments' | 'analytics' | 'settings'
  const [activeTab, setActiveTab] = useState<"dashboard" | "services" | "appointments" | "analytics" | "settings">("dashboard");

  // Edit price states
  const [editingPriceServiceId, setEditingPriceServiceId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState<number>(0);
  const [updateAlert, setUpdateAlert] = useState(false);

  // Target Hospital: Apollo Navi Mumbai is the mock admin hospital
  const targetHospitalId = "apollo-mumbai";
  const targetHospital = useMemo(() => {
    return adminHospitals.find((h) => h.id === targetHospitalId) || adminHospitals[0];
  }, [adminHospitals]);

  // Appointments for this hospital
  const hospitalAppointments = useMemo(() => {
    return bookings.filter((b) => b.hospitalId === targetHospitalId);
  }, [bookings]);

  // Total earnings calculations
  const totalEarnings = useMemo(() => {
    return hospitalAppointments
      .filter((b) => b.status === "Completed" || b.paymentStatus === "Paid")
      .reduce((sum, b) => sum + b.price, 0);
  }, [hospitalAppointments]);

  const handlePriceUpdateSubmit = (serviceId: string) => {
    updateAdminHospitalServicePrice(targetHospitalId, serviceId, editingPriceValue);
    setEditingPriceServiceId(null);
    setUpdateAlert(true);
    setTimeout(() => setUpdateAlert(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        
        {/* BANNER NOTIFICATION */}
        <AnimatePresence>
          {updateAlert && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4.5 flex items-center justify-between"
            >
              <div className="flex items-center space-x-2.5 text-secondary">
                <Check className="h-4.5 w-4.5" />
                <span className="text-xs font-bold">Diagnostic test price updated. Changes are now live on search results.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO AREA */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1 bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
                <Hospital className="h-3.5 w-3.5 text-primary" />
                <span>Partner Portal</span>
              </div>
              <h1 className="font-display text-2xl font-extrabold leading-none">
                {targetHospital?.name || "Hospital Admin"}
              </h1>
              <p className="text-xs text-slate-400 font-light leading-none">
                Manage scan pricing lists, approve slots bookings, and examine analytics.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/10 p-3 rounded-2xl text-center min-w-[80px]">
                <span className="block text-base font-extrabold">{hospitalAppointments.length}</span>
                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Bookings</span>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl text-center min-w-[90px]">
                <span className="block text-base font-extrabold">₹{totalEarnings.toLocaleString()}</span>
                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Revenue</span>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl text-center min-w-[80px]">
                <span className="block text-base font-extrabold">{targetHospital?.rating}</span>
                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* ADMIN SIDEBAR & CONTENT VIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="lg:col-span-3 flex flex-row lg:flex-col bg-white border border-slate-200/60 rounded-2xl p-2 gap-1 overflow-x-auto w-full">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "services", label: "Manage Pricing", icon: Layers },
              { id: "appointments", label: "Booking Queue", icon: CalendarCheck },
              { id: "analytics", label: "Analytics Charts", icon: PieChartIcon },
              { id: "settings", label: "Portal Settings", icon: Settings }
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

          {/* MAIN WORKSPACE PANEL */}
          <div className="lg:col-span-9 space-y-6">
            <AnimatePresence mode="wait">
              
              {/* Dashboard Tab */}
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Quick Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="p-4 border-slate-200 bg-white">
                      <div className="flex justify-between items-start text-xs">
                        <div>
                          <span className="block text-slate-400 font-bold uppercase tracking-wider">Today's Revenue</span>
                          <span className="block text-xl font-extrabold text-slate-900 mt-2">₹12,400</span>
                        </div>
                        <div className="bg-blue-50 text-primary p-2 rounded-xl">
                          <Coins className="h-5 w-5" />
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4 border-slate-200 bg-white">
                      <div className="flex justify-between items-start text-xs">
                        <div>
                          <span className="block text-slate-400 font-bold uppercase tracking-wider">Active Queue</span>
                          <span className="block text-xl font-extrabold text-slate-900 mt-2">
                            {hospitalAppointments.filter(a => a.status === "Upcoming").length} Scans
                          </span>
                        </div>
                        <div className="bg-emerald-50 text-secondary p-2 rounded-xl">
                          <CalendarCheck className="h-5 w-5" />
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 border-slate-200 bg-white">
                      <div className="flex justify-between items-start text-xs">
                        <div>
                          <span className="block text-slate-400 font-bold uppercase tracking-wider">Average Ticket</span>
                          <span className="block text-xl font-extrabold text-slate-900 mt-2">₹3,450</span>
                        </div>
                        <div className="bg-amber-50 text-amber-600 p-2 rounded-xl">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Pricing table quick display */}
                  <Card className="border-slate-200">
                    <CardHeader className="p-5 border-b">
                      <CardTitle className="text-sm font-bold text-slate-800">Current Diagnostics Pricing</CardTitle>
                      <CardDescription className="text-xs text-slate-400">View diagnostic rates. Switch to 'Manage Pricing' to edit them.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <th className="py-2.5 px-5">Diagnostic Service</th>
                            <th className="py-2.5 px-5">Machine Details</th>
                            <th className="py-2.5 px-5 text-right">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {SERVICES.map((s) => {
                            const details = targetHospital?.services[s.id];
                            return (
                              <tr key={s.id} className="border-b hover:bg-slate-50/50">
                                <td className="py-3.5 px-5 font-bold text-slate-800">{s.name}</td>
                                <td className="py-3.5 px-5 text-slate-500 font-medium">{details?.machineType || "Standard Machine"}</td>
                                <td className="py-3.5 px-5 text-right font-extrabold text-slate-900">₹{details?.price.toLocaleString() || "—"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Pricing Management Tab */}
              {activeTab === "services" && (
                <motion.div
                  key="services-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="pb-2 border-b border-slate-150">
                    <h2 className="font-display text-base font-bold text-slate-800">Manage Diagnostic Pricing</h2>
                    <p className="text-xs text-slate-400 font-light mt-0.5">Edit diagnostic rates inline. Price changes update instantly across user listings.</p>
                  </div>

                  <div className="space-y-3">
                    {SERVICES.map((s) => {
                      const details = targetHospital?.services[s.id];
                      const isEditing = editingPriceServiceId === s.id;
                      
                      return (
                        <Card key={s.id} className="p-4.5 border-slate-200 bg-white">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                            <div>
                              <h3 className="font-bold text-slate-800 text-sm leading-snug">{s.name}</h3>
                              <span className="text-[10px] text-slate-400 font-light leading-none mt-1 block">
                                Scanner Spec: {details?.machineType || "Standard Equipment"}
                              </span>
                            </div>

                            {isEditing ? (
                              <div className="flex items-center space-x-2 w-full sm:w-auto">
                                <div className="relative flex items-center bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 shrink-0">
                                  <span className="text-xs font-bold text-slate-400 mr-1.5">₹</span>
                                  <input
                                    type="number"
                                    required
                                    value={editingPriceValue}
                                    onChange={(e) => setEditingPriceValue(Number(e.target.value))}
                                    className="w-20 text-xs font-bold text-slate-800 border-none outline-none focus:ring-0"
                                  />
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handlePriceUpdateSubmit(s.id)}
                                  className="h-8 py-1.5 px-3 text-[10px] font-bold bg-secondary hover:bg-secondary-hover text-white shadow-none cursor-pointer"
                                >
                                  Save
                                </Button>
                                <button
                                  onClick={() => setEditingPriceServiceId(null)}
                                  className="text-slate-400 hover:text-slate-700 text-xs font-semibold cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto border-t sm:border-0 pt-2 sm:pt-0">
                                <div className="text-left sm:text-right">
                                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Active Rate</span>
                                  <span className="text-base font-extrabold text-slate-900">₹{details?.price.toLocaleString() || "—"}</span>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingPriceServiceId(s.id);
                                    setEditingPriceValue(details?.price || 0);
                                  }}
                                  className="h-8 text-[10px] font-bold cursor-pointer"
                                >
                                  Update Rate
                                </Button>
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Booking Queue Tab */}
              {activeTab === "appointments" && (
                <motion.div
                  key="appointments-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="pb-2 border-b border-slate-150">
                    <h2 className="font-display text-base font-bold text-slate-800">Booking Queue</h2>
                    <p className="text-xs text-slate-400 font-light mt-0.5">Review appointment slots booked by patients.</p>
                  </div>

                  {hospitalAppointments.length > 0 ? (
                    <div className="space-y-3.5">
                      {hospitalAppointments.map((b) => (
                        <Card key={b.id} className="p-4.5 border-slate-200 bg-white">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                            <div className="space-y-1.5">
                              <div className="flex items-center space-x-2">
                                <Badge variant="primary">{b.id}</Badge>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                                  b.status === "Upcoming" ? "bg-blue-50 text-primary" : "bg-slate-100 text-slate-500"
                                }`}>
                                  {b.status}
                                </span>
                              </div>
                              <h4 className="font-bold text-slate-800 text-sm leading-snug">{b.patientName} ({b.patientAge} Yrs, {b.patientGender})</h4>
                              <p className="text-slate-500 font-semibold">{b.serviceName}</p>
                              <p className="text-[10px] text-slate-400">Scheduled: {b.date} at {b.slot}</p>
                            </div>

                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0">
                              <div className="text-left sm:text-right">
                                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Total Charge</span>
                                <span className="text-base font-extrabold text-slate-900">₹{b.price.toLocaleString()}</span>
                              </div>
                              
                              {b.status === "Upcoming" && (
                                <div className="flex space-x-1.5">
                                  <Button size="sm" className="h-7.5 text-[9px] font-bold bg-secondary hover:bg-secondary-hover text-white shadow-none px-3 cursor-pointer">
                                    Confirm Check-in
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white border border-slate-200/60 rounded-2xl">
                      <CalendarCheck className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                      <span className="text-xs text-slate-500 font-bold block">No Bookings Recorded</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Analytics Tab */}
              {activeTab === "analytics" && (
                <motion.div
                  key="analytics-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="pb-2 border-b border-slate-150">
                    <h2 className="font-display text-base font-bold text-slate-800">Clinical Analytics & Insights</h2>
                    <p className="text-xs text-slate-400 font-light mt-0.5">Analyze revenue streams and diagnostic service demand distributions.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Revenue Area Chart */}
                    <Card className="border-slate-200 p-4">
                      <CardHeader className="p-0 pb-3 border-b mb-4">
                        <CardTitle className="text-xs font-bold text-slate-800">Monthly Revenue Growth (INR)</CardTitle>
                      </CardHeader>
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={ADMIN_ANALYTICS.monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="100%">
                                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                            <YAxis tick={{ fontSize: 9 }} />
                            <Tooltip contentStyle={{ fontSize: 10 }} />
                            <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    {/* Popular Services Pie Chart */}
                    <Card className="border-slate-200 p-4">
                      <CardHeader className="p-0 pb-3 border-b mb-4">
                        <CardTitle className="text-xs font-bold text-slate-800">Diagnostic Service Share (%)</CardTitle>
                      </CardHeader>
                      <div className="h-56 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={ADMIN_ANALYTICS.popularServices}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {ADMIN_ANALYTICS.popularServices.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ fontSize: 10 }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-wrap justify-center gap-3.5 text-[9px] font-semibold mt-2">
                        {ADMIN_ANALYTICS.popularServices.map((item) => (
                          <div key={item.name} className="flex items-center space-x-1">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-slate-600">{item.name} ({item.value}%)</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </motion.div>
              )}

              {/* Portal Settings Tab */}
              {activeTab === "settings" && (
                <motion.div
                  key="settings-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="pb-2 border-b border-slate-150">
                    <h2 className="font-display text-base font-bold text-slate-800">Portal Configurations</h2>
                    <p className="text-xs text-slate-400 font-light mt-0.5">Configure hospital group settings and notification triggers.</p>
                  </div>

                  <Card className="p-6 border-slate-200/60 bg-white">
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hospital Name</span>
                          <span className="block font-bold text-slate-800 text-xs py-2 bg-slate-50 px-3 rounded-xl border border-slate-150">{targetHospital?.name}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location city</span>
                          <span className="block font-bold text-slate-800 text-xs py-2 bg-slate-50 px-3 rounded-xl border border-slate-150">{targetHospital?.city}, India</span>
                        </div>
                        <div className="space-y-1">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Admin Email</span>
                          <span className="block font-bold text-slate-800 text-xs py-2 bg-slate-50 px-3 rounded-xl border border-slate-150">admin.navi@apollo.co.in</span>
                        </div>
                        <div className="space-y-1">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hospital Accreditation</span>
                          <span className="block font-bold text-slate-800 text-xs py-2 bg-slate-50 px-3 rounded-xl border border-slate-150">JCI & NABH Accredited (India)</span>
                        </div>
                      </div>
                      
                      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 flex items-start space-x-2.5">
                        <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-800 block leading-normal">Operational Security Notice</span>
                          <span className="text-slate-500 block mt-1 font-light leading-relaxed">
                            Accreditation updates require submission of verified certifications to support@medicompare.in. Inline changes are disabled.
                          </span>
                        </div>
                      </div>
                    </div>
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
