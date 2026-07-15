"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { SERVICES } from "@/data/mockData";
import { Search, MapPin, Activity, Sparkles } from "lucide-react";
import { Button } from "./ui/Button";

interface SearchBarProps {
  compact?: boolean;
}

export default function SearchBar({ compact = false }: SearchBarProps) {
  const router = useRouter();
  const { searchService, searchCity, setSearchService, setSearchCity } = useApp();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?service=${searchService}&city=${encodeURIComponent(searchCity)}`);
  };

  const cities = ["Mumbai", "Delhi NCR", "Bengaluru", "Pune", "Hyderabad"];

  if (compact) {
    return (
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch gap-2 w-full">
        {/* City Input */}
        <div className="relative flex-1 flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20">
          <MapPin className="h-4 w-4 text-slate-400 shrink-0 mr-2" />
          <select
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="w-full text-xs font-medium text-slate-800 bg-transparent border-none outline-none focus:ring-0 cursor-pointer"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Service Input */}
        <div className="relative flex-2 flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20">
          <Activity className="h-4 w-4 text-slate-400 shrink-0 mr-2" />
          <select
            value={searchService}
            onChange={(e) => setSearchService(e.target.value)}
            className="w-full text-xs font-medium text-slate-800 bg-transparent border-none outline-none focus:ring-0 cursor-pointer"
          >
            {SERVICES.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <Button type="submit" size="sm" className="rounded-xl px-4 py-2 shrink-0">
          <Search className="h-4 w-4" />
        </Button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className="w-full glass shadow-xl shadow-slate-100/50 p-3 rounded-2xl sm:rounded-3xl border border-white/60 flex flex-col md:flex-row items-center gap-3"
    >
      {/* Test Select */}
      <div className="flex-1 w-full flex items-center gap-3.5 px-4 py-2.5 md:py-1 border-b md:border-b-0 md:border-r border-slate-200/60">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary">
          <Activity className="h-5 w-5" />
        </div>
        <div className="flex-1 text-left">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">
            Select Diagnostic Service
          </label>
          <select
            value={searchService}
            onChange={(e) => setSearchService(e.target.value)}
            className="w-full text-sm font-semibold text-slate-800 bg-transparent border-none outline-none focus:ring-0 cursor-pointer p-0"
          >
            {SERVICES.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} ({service.priceRange})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* City Select */}
      <div className="flex-1 w-full flex items-center gap-3.5 px-4 py-2.5 md:py-1">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-secondary">
          <MapPin className="h-5 w-5" />
        </div>
        <div className="flex-1 text-left">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">
            Choose Location
          </label>
          <select
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="w-full text-sm font-semibold text-slate-800 bg-transparent border-none outline-none focus:ring-0 cursor-pointer p-0"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}, India
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Button */}
      <div className="w-full md:w-auto px-1">
        <Button
          type="submit"
          className="w-full md:w-auto h-12 px-8 flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl sm:rounded-2xl"
        >
          <Search className="h-5 w-5" />
          <span className="font-semibold text-sm">Compare Prices</span>
        </Button>
      </div>
    </form>
  );
}
