import React from "react";
import Link from "next/link";
import { Activity, Mail, Phone, MapPin, Heart, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
                <Activity className="h-5.5 w-5.5" />
              </div>
              <span className="font-display text-lg font-bold text-white">
                Medi<span className="text-primary">Compare</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400 max-w-xs">
              India's first AI-powered diagnostic service comparator. Providing transparent pricing, verified hospital ratings, and real-time slot checking.
            </p>
            <div className="flex space-y-1.5 flex-col text-xs">
              <div className="flex items-center space-x-2">
                <Phone className="h-3.5 w-3.5 text-primary" />
                <span>+91 1800 200 4040 (Toll Free)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span>care@medicompare.in</span>
              </div>
            </div>
          </div>

          {/* Diagnostic Services */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-200 uppercase mb-4">
              Diagnostic Services
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/services/mri" className="hover:text-white transition-colors">MRI Scan</Link></li>
              <li><Link href="/services/ct-scan" className="hover:text-white transition-colors">CT Scan</Link></li>
              <li><Link href="/services/x-ray" className="hover:text-white transition-colors">X-Ray Imaging</Link></li>
              <li><Link href="/services/blood-test" className="hover:text-white transition-colors">Complete Blood Check</Link></li>
              <li><Link href="/services/ultrasound" className="hover:text-white transition-colors">Ultrasound Sonography</Link></li>
              <li><Link href="/services/full-body-checkup" className="hover:text-white transition-colors">Preventive Body Checkups</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-200 uppercase mb-4">
              Popular Cities
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/search?city=Mumbai" className="hover:text-white transition-colors">Mumbai</Link></li>
              <li><Link href="/search?city=Delhi+NCR" className="hover:text-white transition-colors">Delhi NCR</Link></li>
              <li><Link href="/search?city=Bengaluru" className="hover:text-white transition-colors">Bengaluru</Link></li>
              <li><Link href="/search?city=Pune" className="hover:text-white transition-colors">Pune</Link></li>
              <li><Link href="/search?city=Hyderabad" className="hover:text-white transition-colors">Hyderabad</Link></li>
            </ul>
          </div>

          {/* Trust and Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-slate-200 uppercase mb-3">
              Trusted Diagnostics
            </h3>
            <div className="rounded-xl bg-slate-800/50 p-4 border border-slate-800">
              <div className="flex items-start space-x-2.5 text-xs">
                <Shield className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">100% Verified Partners</p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    All partner labs & hospitals hold NABH or NABL certifications in India.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-slate-500">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              <span>in India. © {new Date().getFullYear()} MediCompare.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
