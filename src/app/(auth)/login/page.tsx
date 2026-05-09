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
          <Image 
            src="/logo.svg" 
            alt="CRIFS Admin" 
            width={120} 
            height={40} 
            priority
          />
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

      {/* Right Side: Visual */}
      <div className="relative hidden w-1/2 overflow-hidden md:block">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-brand-900/40 mix-blend-multiply transition-opacity" />
          <Image 
            src="/images/auth-bg.png" 
            alt="Auth background" 
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Overlay Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.svg" 
              alt="CRIFS Admin" 
              width={80} 
              height={30} 
              className="brightness-0 invert"
            />
          </div>

          <div className="space-y-6 max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold leading-tight">
                Empowering the future of <span className="text-brand-400 italic underline decoration-brand-400/30 underline-offset-8">Nigerian</span> investment.
              </h2>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="space-y-4"
            >
              {[
                "Advanced AI-driven KYC analysis",
                "Automated disbursement workflows",
                "Real-time governance & voting"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-400/20 text-brand-400">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-sm font-medium text-neutral-200">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex items-center justify-between text-xs font-medium text-neutral-400">
            <span>© 2026 CRIFS Platform</span>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
