"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Stethoscope, Brain, User, LayoutDashboard, LogOut, Menu, X, ArrowRight, Activity } from "lucide-react";
import { Button } from "./ui/Button";

export default function Navbar() {
  const { currentUser, selectedCompareIds, logoutUser } = useApp();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-500 text-white shadow-md shadow-primary/20">
            <Activity className="h-6.5 w-6.5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900">
            Medi<span className="text-primary">Compare</span>
            <span className="ml-1 text-xs font-semibold text-secondary bg-emerald-50 border border-emerald-200/50 px-1.5 py-0.5 rounded-sm">AI</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/search"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/search") ? "text-primary" : "text-slate-600"
            }`}
          >
            Find Diagnostic Tests
          </Link>
          
          <Link
            href="/ai-recommend"
            className={`flex items-center space-x-1.5 text-sm font-medium transition-colors hover:text-primary ${
              isActive("/ai-recommend") ? "text-primary" : "text-slate-600"
            }`}
          >
            <Brain className="h-4 w-4 text-primary animate-pulse" />
            <span>AI Recommendation</span>
          </Link>

          <Link
            href="/admin"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/admin") ? "text-primary" : "text-slate-600"
            }`}
          >
            Hospital Portal
          </Link>
        </nav>

        {/* Right Nav Options (Auth / User Action) */}
        <div className="hidden md:flex items-center space-x-4">
          {selectedCompareIds.length > 0 && (
            <Link href="/compare">
              <Button variant="glass" size="sm" className="relative text-primary border-primary/20 bg-blue-50/50 hover:bg-blue-50">
                Compare Dashboard
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {selectedCompareIds.length}
                </span>
              </Button>
            </Link>
          )}

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2.5 rounded-full border border-slate-200 bg-slate-50 py-1.5 pr-4 pl-1.5 text-left text-sm transition-all hover:bg-slate-100 cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-blue-400 text-white font-semibold">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold leading-none text-slate-800">{currentUser.name}</span>
                  <span className="text-[10px] text-slate-500 leading-none mt-0.5">{currentUser.city}</span>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg ring-1 ring-black/5">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-xs font-medium text-slate-800 truncate">{currentUser.email}</p>
                  </div>
                  
                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>My Dashboard</span>
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>

                  <button
                    onClick={() => {
                      logoutUser();
                      setUserDropdownOpen(false);
                    }}
                    className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth">
              <Button size="sm" className="flex items-center space-x-1.5">
                <span>Sign In</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-2">
          {selectedCompareIds.length > 0 && (
            <Link href="/compare">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {selectedCompareIds.length}
              </span>
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pt-2 pb-6 md:hidden space-y-4">
          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-700 py-2 border-b border-slate-100"
          >
            Find Diagnostic Tests
          </Link>
          <Link
            href="/ai-recommend"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 text-base font-semibold text-slate-700 py-2 border-b border-slate-100"
          >
            <Brain className="h-5 w-5 text-primary" />
            <span>AI Recommendation</span>
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-700 py-2 border-b border-slate-100"
          >
            Hospital Portal
          </Link>

          {currentUser ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">{currentUser.name}</h4>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-xs py-2">
                    My Dashboard
                  </Button>
                </Link>
                <button
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-xs text-red-600 bg-red-50 hover:bg-red-100 py-2 rounded-xl font-medium cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link href="/auth" onClick={() => setMobileMenuOpen(false)} className="block pt-2">
              <Button className="w-full">Sign In</Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
