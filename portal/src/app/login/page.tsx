"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import SpinningWheel from "@/components/SpinningWheel";
import { Sparkles, AlertCircle } from "lucide-react";

const isDevMode =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN === "true";

function LoginCenterNode() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleDevBypassLogin = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        identifier: "client@example.com",
        password: "password123",
        callbackUrl: "/",
      });

      if (res?.error) {
        setAuthError("Dev login failed. Check backend.");
        setIsLoading(false);
      } else if (res?.url) {
        window.location.href = res.url;
      } else {
        window.location.href = "/";
      }
    } catch {
      setAuthError("Connection error. Check backend.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
      {error === "AccessDenied" && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs sm:text-sm font-semibold border border-red-100 text-center max-w-xs shadow-lg">
          Access denied. Your email is not registered.
        </div>
      )}
      {error === "SessionExpired" && (
        <div className="bg-amber-50 text-amber-800 p-3 rounded-xl text-xs sm:text-sm font-semibold border border-amber-200 text-center max-w-xs shadow-lg">
          Your session has expired. Please sign in again.
        </div>
      )}
      {authError && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 p-2.5 rounded-xl text-xs font-semibold border border-red-100 max-w-xs shadow-md">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* Primary Google SSO Button */}
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-6 py-3.5 sm:px-8 sm:py-3.5 rounded-full text-sm sm:text-md font-bold transition-transform hover:scale-105 active:scale-95 shadow-2xl cursor-pointer"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Sign in with Google
      </button>

      {/* Dev Mode 1-Click Bypass Button (Excluded in Production) */}
      {isDevMode && (
        <div className="w-full flex flex-col items-center mt-1">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleDevBypassLogin}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-all bg-white/90 hover:bg-white px-4 py-2 rounded-full border border-slate-200/90 shadow-md hover:shadow-lg backdrop-blur-sm cursor-pointer disabled:opacity-50 hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isLoading ? "Signing in..." : "⚡ 1-Click Dev Sign-In"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Provide static states for the wheel so it remains centered and spinning beautifully in the background
  const swipeTransition = { duration: 1.0, ease: [0.16, 1, 0.3, 1] as const };
  const clipStrLeft = isMobile ? 'inset(0px 0px calc(50% + 0px) 0px)' : 'inset(0px calc(50% + 0px) 0px 0px)';
  const clipStrRight = isMobile ? 'inset(calc(50% + 0px) 0px 0px 0px)' : 'inset(0px 0px 0px calc(50% + 0px))';

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50">
      
      {/* Dev Environment Banner Badge */}
      {isDevMode && (
        <div className="absolute top-4 sm:top-6 z-50 flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-900 px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Local Dev Mode</span>
          <span className="text-amber-800/70 text-[11px] font-normal hidden sm:inline">| Email sign-in enabled</span>
        </div>
      )}

      {/* Top Header - Centered with True Logo Colors */}
      <div className="absolute top-16 sm:top-24 left-0 w-full z-40 pointer-events-none flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight drop-shadow-sm">
          House<span className="text-teal-600">Force</span><span className="text-amber-500">.</span> 
        </h1>
        <p className="font-bold text-slate-400 mt-3 uppercase tracking-widest text-sm md:text-base">
          Customer Portal
        </p>
      </div>

      {/* Dynamic Background Split - Toned down to subtle pastels */}
      <div className="absolute inset-0 w-full h-full">
        {/* Construction Blue (Toned Down) */}
        <motion.div 
          className="absolute inset-0 w-full h-full bg-blue-100/50"
          initial={false}
          animate={{ clipPath: clipStrLeft }}
        />
        {/* Keyholding Teal (Toned Down) */}
        <motion.div 
          className="absolute inset-0 w-full h-full bg-teal-100/50"
          initial={false}
          animate={{ clipPath: clipStrRight }}
        />
      </div>

      {/* The Spinning Wheel sitting behind the login form */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <SpinningWheel 
          expandedSide={null}
          setExpandedSide={() => {}}
          swipeTransition={swipeTransition}
          clipStrLeft={clipStrLeft}
          clipStrRight={clipStrRight}
          isMobile={isMobile}
          orbitRadius={180}
          centerNode={
            <Suspense fallback={<div className="w-48 h-12 bg-white rounded-full animate-pulse"></div>}>
              <LoginCenterNode />
            </Suspense>
          }
        />
      </div>

    </div>
  );
}
