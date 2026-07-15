"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { HOSPITALS, SERVICES, Booking } from "@/data/mockData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  CalendarRange, 
  Clock, 
  User, 
  FileText, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Sparkles,
  Upload,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function BookingPageContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const hospitalId = params.id as string;
  const urlService = searchParams.get("service") || "mri";

  const { addBooking, currentUser } = useApp();

  // Find Hospital & Service
  const hospital = useMemo(() => {
    return HOSPITALS.find((h) => h.id === hospitalId) || HOSPITALS[0];
  }, [hospitalId]);

  const service = useMemo(() => {
    return SERVICES.find((s) => s.id === urlService) || SERVICES[0];
  }, [urlService]);

  const hospitalServiceDetails = useMemo(() => {
    return hospital.services[service.id];
  }, [hospital, service]);

  // Wizard Steps: 1: Service, 2: Slot, 3: Patient, 4: Summary
  const [step, setStep] = useState(1);

  // Step States
  const [selectedService, setSelectedService] = useState(service.id);
  const [homeCollection, setHomeCollection] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Tomorrow, Jun 26");
  const [selectedSlot, setSelectedSlot] = useState("");
  
  // Patient details state (Prefills with logged-in user if available)
  const [patientName, setPatientName] = useState(currentUser?.name || "");
  const [patientAge, setPatientAge] = useState<number>(45);
  const [patientGender, setPatientGender] = useState("Male");
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || "");
  const [prescriptionFile, setPrescriptionFile] = useState<string | null>(null);

  // Mock slot data
  const dateOptions = [
    "Today, Jun 25",
    "Tomorrow, Jun 26",
    "Saturday, Jun 27",
    "Sunday, Jun 28",
    "Monday, Jun 29"
  ];

  const morningSlots = ["07:30 AM", "08:30 AM", "09:30 AM", "10:30 AM"];
  const afternoonSlots = ["12:30 PM", "01:30 PM", "02:30 PM", "03:30 PM"];
  const eveningSlots = ["05:30 PM", "06:30 PM", "07:30 PM"];

  // Cost breakdown
  const pricing = useMemo(() => {
    const base = hospital.services[selectedService]?.price || 0;
    const homeFee = homeCollection ? 150 : 0;
    const cgst = Math.round(base * 0.025); // 2.5% CGST
    const sgst = Math.round(base * 0.025); // 2.5% SGST
    const total = base + homeFee + cgst + sgst;
    return { base, homeFee, cgst, sgst, total };
  }, [selectedService, homeCollection, hospital]);

  const handleBookingSubmit = async () => {
    const chosenServiceMeta = SERVICES.find(s => s.id === selectedService);
    
    // Save to App State
    const bookingId = await addBooking({
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      serviceId: selectedService,
      serviceName: chosenServiceMeta?.name || "Diagnostic Test",
      price: pricing.total,
      date: selectedDate,
      slot: selectedSlot || "09:30 AM - 10:00 AM",
      patientName,
      patientAge,
      patientGender,
      status: "Upcoming",
      paymentMethod: "Pending Selection",
      paymentStatus: "Pending"
    });

    // Navigate to payment page with details
    router.push(`/payment?bookingId=${bookingId}`);
  };

  const stepsList = [
    { number: 1, label: "Service", icon: FileText },
    { number: 2, label: "Slot Selection", icon: CalendarRange },
    { number: 3, label: "Patient Info", icon: User },
    { number: 4, label: "Summary & Invoice", icon: Sparkles }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* PROGRESS WIZARD INDICATOR */}
        <div className="bg-white border border-slate-200/60 p-4.5 rounded-2xl shadow-xs">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-100 z-0 -translate-y-1/2" />
            <div className="absolute top-1/2 left-4 h-0.5 bg-primary z-0 -translate-y-1/2 transition-all duration-300" 
                 style={{ width: `${((step - 1) / (stepsList.length - 1)) * 100}%` }} />

            {stepsList.map((s) => {
              const StepIcon = s.icon;
              const isCompleted = step > s.number;
              const isActive = step === s.number;
              
              return (
                <div key={s.number} className="flex flex-col items-center relative z-10 space-y-1.5">
                  <div
                    className={`
                      h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 font-bold text-xs border
                      ${isCompleted ? "bg-primary border-primary text-white" : ""}
                      ${isActive ? "bg-white border-2 border-primary text-primary shadow-sm" : ""}
                      ${!isCompleted && !isActive ? "bg-white border-slate-200 text-slate-400" : ""}
                    `}
                  >
                    {isCompleted ? <Check className="h-4.5 w-4.5" /> : s.number}
                  </div>
                  <span className={`text-[10px] font-bold tracking-wider uppercase ${isActive ? "text-primary" : "text-slate-400"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* WIZARD CONTENT BOX */}
        <Card className="border-slate-200/60 p-6 sm:p-8 bg-white min-h-[320px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-display text-base font-bold text-slate-800">Select Diagnostic Service</h2>
                  <p className="text-xs text-slate-400 font-light mt-0.5">Check service prices for {hospital.name}.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {SERVICES.map((s) => {
                    const priceDetail = hospital.services[s.id];
                    if (!priceDetail?.available) return null;
                    const isSelected = selectedService === s.id;
                    
                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedService(s.id)}
                        className={`
                          p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between
                          ${isSelected ? "border-primary bg-blue-50/20" : "border-slate-150 hover:bg-slate-50"}
                        `}
                      >
                        <div className="flex items-center space-x-3 text-xs">
                          <input 
                            type="radio" 
                            checked={isSelected}
                            readOnly
                            className="h-4.5 w-4.5 text-primary border-slate-300 focus:ring-primary"
                          />
                          <div>
                            <span className="font-bold text-slate-800 block text-xs">{s.name}</span>
                            <span className="text-[10px] text-slate-400 font-light">Machines: {priceDetail.machineType || "Standard Digital"}</span>
                          </div>
                        </div>
                        <span className="text-sm font-extrabold text-slate-900">₹{priceDetail.price.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Home collection option for blood/checkups */}
                {(selectedService === "blood-test" || selectedService === "full-body-checkup") && (
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-4.5">
                    <label className="inline-flex items-center space-x-3 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={homeCollection}
                        onChange={() => setHomeCollection(!homeCollection)}
                        className="h-4.5 w-4.5 rounded-sm border-slate-300 text-primary"
                      />
                      <div>
                        <span className="block font-bold">Add Home Sample Collection (+₹150)</span>
                        <span className="text-[10px] text-slate-400 font-light">Phlebotomist arrives at your doorstep to collect samples.</span>
                      </div>
                    </label>
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-display text-base font-bold text-slate-800">Select Date & Time Slot</h2>
                  <p className="text-xs text-slate-400 font-light mt-0.5">Choose your preferred date and arrival window.</p>
                </div>

                {/* Dates Carousels */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Date</span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {dateOptions.map((date) => {
                      const isSelected = selectedDate === date;
                      return (
                        <button
                          key={date}
                          type="button"
                          onClick={() => setSelectedDate(date)}
                          className={`
                            py-3 px-2 border rounded-xl text-center text-xs font-medium cursor-pointer transition-all leading-tight
                            ${isSelected ? "bg-primary border-primary text-white font-bold" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}
                          `}
                        >
                          <span className="block text-[10px] opacity-75">{date.split(',')[0]}</span>
                          <span className="block text-xs font-extrabold mt-0.5">{date.split(',')[1]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Slots Grid */}
                <div className="space-y-4">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Appointment Slot</span>
                  
                  {/* Morning */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500">Morning Slots</span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {morningSlots.map((slot) => {
                        const isSelected = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 text-xs font-medium border rounded-xl text-center cursor-pointer transition-all ${
                              isSelected ? "border-primary bg-blue-50 text-primary font-bold shadow-xs" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Afternoon */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500">Afternoon Slots</span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {afternoonSlots.map((slot) => {
                        const isSelected = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 text-xs font-medium border rounded-xl text-center cursor-pointer transition-all ${
                              isSelected ? "border-primary bg-blue-50 text-primary font-bold shadow-xs" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-display text-base font-bold text-slate-800">Enter Patient Details</h2>
                  <p className="text-xs text-slate-400 font-light mt-0.5">Please fill details of the patient arriving at the clinic.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="Enter patient full name"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full text-xs font-medium text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 bg-white outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Age */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Age (Years)</label>
                    <input 
                      type="number"
                      required
                      min="1"
                      max="120"
                      value={patientAge}
                      onChange={(e) => setPatientAge(Number(e.target.value))}
                      className="w-full text-xs font-medium text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 bg-white outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Gender Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gender</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Male", "Female", "Other"].map((gender) => (
                        <button
                          key={gender}
                          type="button"
                          onClick={() => setPatientGender(gender)}
                          className={`py-2.5 text-xs font-semibold border rounded-xl text-center cursor-pointer transition-all ${
                            patientGender === gender 
                              ? "bg-primary border-primary text-white shadow-sm"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {gender}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Phone</label>
                    <input 
                      type="tel"
                      required
                      placeholder="Patient phone number"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full text-xs font-medium text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 bg-white outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Upload Prescription Mock */}
                <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-5 text-center cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setPrescriptionFile("prescription.pdf")}>
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-primary mb-2">
                    <Upload className="h-5 w-5" />
                  </div>
                  {prescriptionFile ? (
                    <div>
                      <span className="block text-xs font-bold text-slate-800">{prescriptionFile} uploaded successfully</span>
                      <span className="block text-[10px] text-slate-400 mt-1">Click to upload a different PDF or image</span>
                    </div>
                  ) : (
                    <div>
                      <span className="block text-xs font-bold text-slate-800">Upload Doctor Prescription (Optional)</span>
                      <span className="block text-[10px] text-slate-400 mt-1">PDF or image file formats under 5MB.</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-display text-base font-bold text-slate-800">Review Booking Invoice</h2>
                  <p className="text-xs text-slate-400 font-light mt-0.5">Please crosscheck all parameters before proceeding to secure payment.</p>
                </div>

                {/* Booking summary specs */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-150 rounded-2xl p-4.5 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hospital</span>
                    <span className="font-bold text-slate-800">{hospital.name.split(',')[0]}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Diagnostic Test</span>
                    <span className="font-bold text-slate-800">{SERVICES.find(s => s.id === selectedService)?.name}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date & Time</span>
                    <span className="font-bold text-slate-800">{selectedDate} at {selectedSlot || "09:30 AM"}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patient</span>
                    <span className="font-bold text-slate-800">{patientName} ({patientAge} Yrs, {patientGender})</span>
                  </div>
                </div>

                {/* Taxes details */}
                <div className="space-y-2 border-t border-slate-200 pt-4.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Base Diagnostic Fee</span>
                    <span className="font-semibold text-slate-800">₹{pricing.base.toLocaleString()}</span>
                  </div>
                  {homeCollection && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Home Sample Collection</span>
                      <span className="font-semibold text-slate-800">₹150</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">CGST (2.5%)</span>
                    <span className="font-semibold text-slate-800">₹{pricing.cgst}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">SGST (2.5%)</span>
                    <span className="font-semibold text-slate-800">₹{pricing.sgst}</span>
                  </div>
                  <div className="h-0.5 w-full bg-slate-200/50 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-800">Net Total Payable</span>
                    <span className="text-xl font-extrabold text-slate-900">₹{pricing.total.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CONTROL ACTIONS FOR STEPPING */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="text-xs font-bold h-10 px-4 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button
                disabled={step === 2 && !selectedSlot}
                onClick={() => setStep(step + 1)}
                className="text-xs font-bold h-10 px-6 cursor-pointer"
              >
                Continue <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleBookingSubmit}
                className="text-xs font-bold h-10 px-6 bg-gradient-to-r from-secondary to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md border-none cursor-pointer"
              >
                <span>Confirm & Proceed</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            )}
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading Booking Wizard...</div>}>
      <BookingPageContent />
    </React.Suspense>
  );
}
