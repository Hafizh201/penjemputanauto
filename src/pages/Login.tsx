import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserIcon, LockIcon, EyeIcon, EyeOffIcon, BusIcon } from "lucide-react";
import { SkeletonLoader } from "@/components/SkeletonLoader";

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-6 bg-gradient-to-b from-[#0A0F1E] via-[#0D1530] to-[#0A0F1E]">
      <motion.div
        className="w-full max-w-sm glass-card p-8 flex flex-col items-center relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
          <BusIcon className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">SiJemput</h1>
        <p className="text-muted-foreground text-sm mb-8">Penjemputan Siswa Cerdas</p>

        {loading ? (
          <SkeletonLoader />
        ) : (
          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                placeholder="ID Orang Tua / Siswa"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                required
                data-testid="input-userId"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password / PIN"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                required
                data-testid="input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                data-testid="btn-toggle-password"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-muted-foreground hover:text-white transition-colors" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-muted-foreground hover:text-white transition-colors" />
                )}
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-primary text-white font-semibold rounded-2xl py-4 shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-primary/50"
              data-testid="btn-login"
            >
              Masuk
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
