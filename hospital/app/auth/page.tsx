"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Shield, KeyRound, Mail, Sparkles, Phone, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const router = useRouter();
  const { loginUser } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  
  // Login Form States
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [otpMode, setOtpMode] = useState(false);
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpMode) {
      loginUser(phone + "@phone.sms", "Patient Guest");
    } else {
      loginUser(email || "patient@medicompare.in", name || "Vinay Kumar");
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-radial from-blue-50/30 via-transparent to-transparent">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Logo and Tagline */}
            <div className="text-center mb-8">
              <span className="inline-flex items-center space-x-1.5 rounded-full bg-blue-50 border border-blue-200/50 px-3 py-1 text-xs font-semibold text-primary mb-3">
                <Shield className="h-3.5 w-3.5" />
                <span>100% Encrypted & Patient-Confidential</span>
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {isLogin ? "Welcome back to MediCompare" : "Create your patient account"}
              </h2>
              <p className="text-slate-500 text-xs mt-1.5 font-light">
                {isLogin ? "Access comparisons, saved bookings and lab results." : "Compare costs, diagnostic slots and book appointments."}
              </p>
            </div>

            {/* Auth Card */}
            <Card className="shadow-xl shadow-slate-100 border-slate-200/60 p-6 sm:p-8">
              {/* Tab Selector */}
              <div className="grid grid-cols-2 bg-slate-100/80 rounded-xl p-1 mb-6 border border-slate-200/40">
                <button
                  onClick={() => { setIsLogin(true); setOtpMode(false); }}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    isLogin && !otpMode ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setIsLogin(false); setOtpMode(false); }}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    !isLogin ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Login Options Selector (Email vs Phone OTP) */}
              {isLogin && (
                <div className="flex justify-end text-[11px] font-semibold text-primary hover:underline cursor-pointer mb-4" onClick={() => setOtpMode(!otpMode)}>
                  {otpMode ? "Sign in with Email/Password" : "Sign in with mobile OTP & Phone"}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {otpMode ? (
                    <motion.div
                      key="otp"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                          Mobile Number
                        </label>
                        <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary/20">
                          <Phone className="h-4.5 w-4.5 text-slate-400 mr-2" />
                          <span className="text-xs font-semibold text-slate-400 mr-1.5">+91</span>
                          <input
                            type="tel"
                            required
                            placeholder="Enter 10-digit number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full text-xs font-medium text-slate-800 bg-transparent border-none outline-none focus:ring-0"
                          />
                        </div>
                      </div>
                      <div className="bg-slate-50 text-[10px] text-slate-500 rounded-xl border p-2.5 leading-normal">
                        We will send a 4-digit verification code to this phone number via SMS to log in securely.
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="email-pw"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-4"
                    >
                      {!isLogin && (
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                            Full Name
                          </label>
                          <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary/20">
                            <input
                              type="text"
                              required
                              placeholder="Vinay Kumar"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full text-xs font-medium text-slate-800 bg-transparent border-none outline-none focus:ring-0"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                          Email Address
                        </label>
                        <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary/20">
                          <Mail className="h-4.5 w-4.5 text-slate-400 mr-2" />
                          <input
                            type="email"
                            required
                            placeholder="vinay.kumar@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full text-xs font-medium text-slate-800 bg-transparent border-none outline-none focus:ring-0"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1.5">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Password
                          </label>
                          {isLogin && (
                            <Link href="#" className="text-[11px] font-semibold text-primary hover:underline">
                              Forgot password?
                            </Link>
                          )}
                        </div>
                        <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary/20">
                          <Lock className="h-4.5 w-4.5 text-slate-400 mr-2" />
                          <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full text-xs font-medium text-slate-800 bg-transparent border-none outline-none focus:ring-0"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Action */}
                <Button type="submit" className="w-full h-11 text-xs font-bold mt-2">
                  {isLogin 
                    ? (otpMode ? "Send OTP & Proceed" : "Sign In to Account") 
                    : "Create Patient Account"
                  }
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3.5 text-slate-400 font-medium">Or continue with</span>
                </div>
              </div>

              {/* Social Login buttons */}
              <div className="grid grid-cols-2 gap-3.5">
                <button
                  onClick={() => { loginUser("google-auth@gmail.com", "Google Patient"); router.push("/"); }}
                  className="flex items-center justify-center space-x-2 rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5.04c1.67 0 3.17.57 4.35 1.7l3.25-3.25C17.63 1.63 15.01 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.9 3c.9-2.7 3.4-4.46 6.6-4.46z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.25c0-.82-.07-1.6-.21-2.35H12v4.5h6.48c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-2 3.7-4.95 3.7-8.6z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.4 10.5c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.5 2.9C.54 4.8 0 7 0 9.25s.54 4.45 1.5 6.35l3.9-3.1z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.24 0 5.97-1.07 7.96-2.9l-3.7-2.87c-1.03.69-2.35 1.1-4.26 1.1-3.2 0-5.7-1.76-6.6-4.46l-3.9 3C3.4 20.35 7.35 23 12 23z"
                    />
                  </svg>
                  <span>Google</span>
                </button>
                
                <button
                  onClick={() => { loginUser("apple-auth@gmail.com", "Apple Patient"); router.push("/"); }}
                  className="flex items-center justify-center space-x-2 rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.63.73-1.18 1.87-1.03 2.98 1.12.09 2.27-.56 2.98-1.42" />
                  </svg>
                  <span>Apple</span>
                </button>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
