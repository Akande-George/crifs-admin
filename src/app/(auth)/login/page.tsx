"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Globe,
  Building2,
  Check,
  ShieldCheck as Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="flex justify-center h-screen w-full overflow-hidden bg-white">
      {/* Left Side: Form */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex w-full flex-col justify-center px-8 md:w-1/2 lg:px-24 xl:px-32"
      >
        <div className="mb-10 flex justify-center items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-neutral-900">
            CRIFS <span className="text-brand-500">Admin</span>
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Welcome back
          </h1>
          <p className="text-neutral-500">
            Enter your credentials to access the admin panel
          </p>
        </div>

        <div className="mt-10 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@crifs.ng"
                  required
                  className="h-12 pl-10 border-neutral-200 focus:ring-brand-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-neutral-700" htmlFor="password">
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs font-bold text-brand-500 hover:text-brand-600"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="h-12 pl-10 pr-10 border-neutral-200 focus:ring-brand-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none text-neutral-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Keep me logged in for 30 days
              </label>
            </div>

            <Button 
              type="submit" 
              className="h-12 w-full bg-neutral-900 text-white hover:bg-neutral-800 transition-all active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
