import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { RootState } from '../store';
import { ToastContainer } from './ToastContainer';
import { Leaf, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export const AuthLayout: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const location = useLocation();

  // If already authenticated, bypass login and redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 font-sans overflow-x-hidden antialiased">
      {/* LEFT SIDE: Sustainability Photo + Teal Digital-Globe Hologram Overlay */}
      <div className="hidden lg:flex lg:col-span-5 relative overflow-hidden bg-[#0a231a] flex-col justify-between p-12 text-white">
        {/* Background Image of Wind Turbines / Solar Panels */}
        <img
          src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80"
          alt="Renewable Clean Energy Infrastructure"
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay select-none"
          referrerPolicy="no-referrer"
        />

        {/* Ambient Teal Radial Glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center shadow-lg shadow-emerald-950/40">
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-mono">
              EcoSphere <span className="text-emerald-400 text-xs px-1.5 py-0.5 rounded bg-emerald-400/10 font-sans tracking-normal font-semibold">ESG</span>
            </h1>
            <p className="text-[10px] text-teal-400/80 tracking-widest uppercase font-semibold font-mono">Sustainability Ledger</p>
          </div>
        </div>

        {/* Teal Digital-Globe Hologram Container */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto py-12">
          <div className="relative w-72 h-72 flex items-center justify-center">
            {/* Hologram Rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
              className="absolute w-72 h-72 border border-dashed border-teal-500/30 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
              className="absolute w-[240px] h-[240px] border border-teal-400/20 rounded-full"
            />
            <motion.div
              animate={{ rotate: 180 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
              className="absolute w-[200px] h-[200px] border-2 border-emerald-500/20 border-t-emerald-400/40 border-b-teal-400/40 rounded-full"
            />

            {/* Glowing Globe Visual core */}
            <div className="absolute w-44 h-44 rounded-full bg-teal-500/5 border border-teal-400/30 shadow-[0_0_50px_rgba(20,184,166,0.15)] flex items-center justify-center">
              {/* Dynamic Grid Overlay inside the Globe */}
              <svg className="w-full h-full opacity-60 text-teal-400/40" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                <path d="M50,2 A48,48 0 0,0 50,98 A48,48 0 0,0 50,2" fill="none" stroke="currentColor" strokeWidth="0.7" />
                <path d="M2,50 A48,48 0 0,0 98,50 A48,48 0 0,0 2,50" fill="none" stroke="currentColor" strokeWidth="0.7" />
                <ellipse cx="50" cy="50" rx="30" ry="48" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <ellipse cx="50" cy="50" rx="14" ry="48" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <line x1="2" y1="50" x2="98" y2="50" stroke="currentColor" strokeWidth="0.5" />
                <line x1="50" y1="2" x2="50" y2="98" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="4" className="fill-teal-400 animate-pulse" />
              </svg>
            </div>

            {/* Cybernetic Tech Points */}
            <div className="absolute top-8 left-8 w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#14b8a6]" />
            <div className="absolute bottom-10 right-10 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <div className="absolute top-1/2 right-4 w-1 h-1 rounded-full bg-teal-400/60" />
            <div className="absolute top-1/4 right-1/4 text-[9px] font-mono text-teal-400/80 tracking-widest bg-emerald-950/80 px-2 py-0.5 rounded border border-teal-500/20 backdrop-blur-sm shadow-md">
              LAT: 51.5074° N
            </div>
            <div className="absolute bottom-1/4 left-6 text-[9px] font-mono text-emerald-400/80 tracking-widest bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/20 backdrop-blur-sm shadow-md">
              ESG CERTIFIED
            </div>
          </div>
          
          <div className="text-center mt-12 max-w-sm">
            <h3 className="text-lg font-bold tracking-tight text-white font-mono">Decarbonization Engine</h3>
            <p className="text-xs text-teal-400/70 mt-1.5">Enterprise carbon ledger auditing and employee-led action challenge networks.</p>
          </div>
        </div>

        {/* Footer Policy Branding */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-teal-500/60 font-mono border-t border-teal-500/10 pt-6">
          <span>SECURE PROTOCOL v4.11</span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-teal-400" /> ZERO TRUST PLATFORM
          </span>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Rounded Auth forms */}
      <div className="col-span-1 lg:col-span-7 flex flex-col items-center justify-center bg-[#f8fafc] p-6 sm:p-12 md:p-16 min-h-screen relative">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Logo fallback for small/mobile devices */}
          <div className="lg:hidden flex items-center gap-2 mb-8 bg-emerald-950 px-4 py-2.5 rounded-2xl shadow-md border border-emerald-900/40">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <span className="text-base font-bold text-white font-mono">EcoSphere ESG</span>
          </div>

          {/* Form Holder Card with smooth entry animations */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full bg-white p-8 sm:p-10 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden"
          >
            <Outlet />
          </motion.div>

          {/* Compliance Tagline */}
          <p className="mt-6 text-center text-xs text-slate-400 font-medium">
            EcoSphere Platform is carbon-neutral, SOC2 certified & ISO 14064 compliant.
          </p>
        </div>

        {/* Toast Notification Container */}
        <ToastContainer />
      </div>
    </div>
  );
};
