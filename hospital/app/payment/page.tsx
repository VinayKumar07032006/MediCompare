"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  ShieldCheck, 
  CreditCard, 
  Wallet, 
  QrCode, 
  Building, 
  Info, 
  CheckCircle2,
  Lock,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const { bookings } = useApp();

  // Find target booking
  const booking = useMemo(() => {
    return bookings.find((b) => b.id === bookingId) || bookings[0];
  }, [bookings, bookingId]);

  // Payment Methods: 'upi' | 'card' | 'netbanking'
  const [method, setMethod] = useState<"upi" | "card" | "netbanking">("upi");
  
  // UPI Sub-options
  const [upiProvider, setUpiProvider] = useState("gpay");
  const [upiId, setUpiId] = useState("");

  // Card input states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // Net banking states
  const [selectedBank, setSelectedBank] = useState("hdfc");

  const [isPaying, setIsPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  useEffect(() => {
    if (!booking) {
      // If no bookings exist, send to home
      router.push("/");
    }
  }, [booking]);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaying(true);

    // Simulate gateway checkout
    setTimeout(() => {
      setIsPaying(false);
      setPaySuccess(true);
      
      // Update booking status in Context
      if (booking) {
        booking.paymentStatus = "Paid";
        let paymentLabel = "UPI";
        if (method === "upi") paymentLabel = `UPI (${upiProvider.toUpperCase()})`;
        else if (method === "card") paymentLabel = "Credit/Debit Card";
        else paymentLabel = `Net Banking (${selectedBank.toUpperCase()})`;
        
        booking.paymentMethod = paymentLabel;
      }

      // After 1.5 seconds, send to dashboard
      setTimeout(() => {
        router.push("/dashboard?bookingSuccess=true");
      }, 1500);
    }, 2000);
  };

  if (!booking) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence>
          {paySuccess ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-20 bg-white border rounded-3xl shadow-md space-y-4 max-w-md mx-auto"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-secondary">
                <CheckCircle2 className="h-10 w-10 text-secondary animate-pulse" />
              </div>
              <h2 className="font-display text-xl font-extrabold text-slate-900">Payment Successful!</h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Your diagnostic appointment has been confirmed. Redirecting you to your user dashboard to view details and receipt.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: Payment options */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="inline-flex items-center space-x-1.5 rounded-full bg-blue-50 border border-blue-200/50 px-3 py-1 text-xs font-semibold text-primary mb-3">
                    <Lock className="h-3.5 w-3.5" />
                    <span>Secure Gateway Payment Integration</span>
                  </span>
                  <h1 className="font-display text-xl font-extrabold text-slate-800">Choose Payment Method</h1>
                  <p className="text-xs text-slate-400 font-light mt-0.5">Please choose a preferred secure channel to clear diagnostic fees.</p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setMethod("upi")}
                    className={`py-3.5 px-2 border rounded-xl text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      method === "upi" ? "border-primary bg-blue-50/20 text-primary font-bold shadow-xs" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <QrCode className="h-5 w-5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">UPI / Apps</span>
                  </button>

                  <button
                    onClick={() => setMethod("card")}
                    className={`py-3.5 px-2 border rounded-xl text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      method === "card" ? "border-primary bg-blue-50/20 text-primary font-bold shadow-xs" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Cards</span>
                  </button>

                  <button
                    onClick={() => setMethod("netbanking")}
                    className={`py-3.5 px-2 border rounded-xl text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      method === "netbanking" ? "border-primary bg-blue-50/20 text-primary font-bold shadow-xs" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Building className="h-5 w-5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Net Banking</span>
                  </button>
                </div>

                <Card className="p-6 border-slate-200/60 bg-white">
                  <form onSubmit={handlePaymentSubmit} className="space-y-5">
                    
                    {method === "upi" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select UPI Provider</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: "gpay", label: "Google Pay" },
                              { id: "phonepe", label: "PhonePe" },
                              { id: "paytm", label: "Paytm" }
                            ].map((prov) => (
                              <button
                                key={prov.id}
                                type="button"
                                onClick={() => setUpiProvider(prov.id)}
                                className={`py-2 text-xs font-semibold border rounded-xl text-center cursor-pointer transition-all ${
                                  upiProvider === prov.id ? "bg-slate-900 border-slate-900 text-white shadow-sm" : "bg-white border-slate-200 text-slate-600"
                                }`}
                              >
                                {prov.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enter VPA / UPI ID</label>
                          <input
                            type="text"
                            required
                            placeholder="username@okaxis"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full text-xs font-medium text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                          />
                        </div>

                        {/* Simulated QR block */}
                        <div className="border border-slate-150 rounded-xl p-3 bg-slate-50/50 flex items-center justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <span className="font-bold text-slate-800 block text-[11px]">Scan QR code on Mobile</span>
                            <span className="text-[10px] text-slate-400 font-light">Generate QR code to scan directly via scanner apps.</span>
                          </div>
                          <Badge variant="primary" className="py-1 cursor-pointer">Generate QR</Badge>
                        </div>
                      </div>
                    )}

                    {method === "card" && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cardholder Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Vinay Kumar"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full text-xs font-medium text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Card Number</label>
                          <div className="relative flex items-center border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus-within:ring-2 focus-within:ring-primary/20">
                            <CreditCard className="h-4.5 w-4.5 text-slate-400 mr-2" />
                            <input
                              type="text"
                              required
                              placeholder="4111 2222 3333 4444"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full text-xs font-medium text-slate-800 bg-transparent border-none outline-none focus:ring-0"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expiry (MM/YY)</label>
                            <input
                              type="text"
                              required
                              placeholder="12/29"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full text-xs font-medium text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">CVV Code</label>
                            <input
                              type="password"
                              required
                              maxLength={3}
                              placeholder="•••"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="w-full text-xs font-medium text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {method === "netbanking" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Bank</label>
                          <div className="flex flex-col space-y-1.5">
                            {[
                              { id: "hdfc", name: "HDFC Bank" },
                              { id: "icici", name: "ICICI Bank" },
                              { id: "sbi", name: "State Bank of India" },
                              { id: "axis", name: "Axis Bank" }
                            ].map((bank) => (
                              <button
                                key={bank.id}
                                type="button"
                                onClick={() => setSelectedBank(bank.id)}
                                className={`flex items-center justify-between text-xs font-medium px-3.5 py-2 border rounded-xl cursor-pointer transition-all ${
                                  selectedBank === bank.id ? "bg-blue-50 border-primary text-primary font-bold" : "bg-white border-slate-200 text-slate-600"
                                }`}
                              >
                                <span>{bank.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pay Submit */}
                    <Button
                      type="submit"
                      isLoading={isPaying}
                      className="w-full h-11 text-xs font-bold bg-gradient-to-r from-secondary to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md border-none mt-4 flex items-center justify-center space-x-1.5"
                    >
                      <span>Pay Securely: ₹{booking.price.toLocaleString()}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>

                  </form>
                </Card>
              </div>

              {/* RIGHT COLUMN: Booking Recap */}
              <div className="lg:col-span-5 space-y-4">
                <Card className="p-6 border-slate-200/60 shadow-xs bg-white space-y-4">
                  <h3 className="font-display text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Booking Summary</h3>
                  
                  <div className="space-y-3 text-xs leading-normal">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Booking ID</span>
                      <span className="font-bold text-slate-700">{booking.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hospital</span>
                      <span className="font-bold text-slate-700 truncate max-w-[200px]">{booking.hospitalName.split(',')[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Diagnostic Service</span>
                      <span className="font-bold text-slate-700">{booking.serviceName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Schedule</span>
                      <span className="font-semibold text-slate-700">{booking.date} at {booking.slot.split(' ')[0]} {booking.slot.split(' ')[1]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Patient</span>
                      <span className="font-semibold text-slate-700">{booking.patientName}</span>
                    </div>
                    <div className="h-0.5 w-full bg-slate-100" />
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-slate-800">Net Fees</span>
                      <span className="text-base font-extrabold text-slate-900">₹{booking.price.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>

                <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4.5 text-xs text-blue-800 flex items-start space-x-2.5">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-800 leading-normal">MediCompare Safe booking guarantee</span>
                    <span className="text-slate-600 block mt-1 font-light leading-relaxed">
                      Your files are encrypted using AES-256. Refund request is validated within 2 hours.
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading Checkout...</div>}>
      <PaymentPageContent />
    </React.Suspense>
  );
}
