import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ChevronLeft, Car, PartyPopper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConfirmationProps {
  onComplete: () => void;
  onBackToDashboard: () => void;
}

export function Confirmation({ onComplete, onBackToDashboard }: ConfirmationProps) {
  const [countdown, setCountdown] = useState(180);
  const [canRetry, setCanRetry] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((p) => p - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setCanRetry(true);
    }
  }, [countdown]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleRetry = () => {
    if (!canRetry) return;
    const next = retryCount + 1;
    setRetryCount(next);
    setCountdown(180);
    setCanRetry(false);
    toast({
      title: "Panggilan ulang dikirim!",
      description: "Guru sudah mendapat notifikasi lagi.",
    });
  };

  const steps = [
    { label: "Dipanggil", time: "14:32", done: true },
    { label: "Budi ditemukan", time: "14:34", done: true },
    { label: "Menuju gerbang", time: "14:36", done: true },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0A0F1E] pb-8">

      {/* Header */}
      <header className="px-6 pt-12 pb-5 flex items-center gap-3">
        <button
          onClick={onBackToDashboard}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          data-testid="btn-back-from-confirm"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Hampir Selesai!</h1>
          <p className="text-white/40 text-xs">Konfirmasi penjemputan Budi</p>
        </div>
      </header>

      <div className="px-6 flex-1 flex flex-col gap-5">

        {/* Summary Card */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center border border-primary/20">
              <Car className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-white font-bold">Budi Santoso</p>
              <p className="text-white/40 text-xs">Kelas 5A · SD Nusantara 1</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative pl-6 space-y-5">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-primary/15 rounded-full" />
            {steps.map((step) => (
              <div key={step.label} className="relative">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-primary border-4 border-[#0A0F1E] flex items-center justify-center shadow-[0_0_8px_rgba(59,130,246,0.4)]">
                  <Check className="w-2.5 h-2.5 text-white font-bold stroke-[3]" />
                </div>
                <p className="text-white text-sm font-medium">{step.label}</p>
                <p className="text-white/40 text-xs">{step.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Retry count info */}
        {retryCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/3 border border-white/8 rounded-2xl px-4 py-3 text-center"
          >
            <p className="text-white/40 text-xs">
              Kamu sudah panggil ulang sebanyak <span className="text-white font-semibold">{retryCount}x</span>
            </p>
          </motion.div>
        )}

        {/* Main Question */}
        <div className="flex flex-col items-center text-center py-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-5xl mb-4"
          >
            🚗
          </motion.div>
          <h2 className="text-2xl font-bold text-white leading-tight mb-2">
            Apakah Budi sudah naik ke mobilmu?
          </h2>
          <p className="text-white/40 text-sm">Tekan "Sudah" kalau penjemputan sudah selesai.</p>
        </div>

        {/* Buttons */}
        <div className="space-y-3 pb-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-blue-600 to-primary text-white font-bold rounded-2xl py-5 text-base shadow-[0_0_25px_rgba(59,130,246,0.3)] border border-primary/40 flex items-center justify-center gap-2"
            data-testid="btn-complete"
          >
            <PartyPopper className="w-5 h-5" />
            Sudah! Selesai & Tutup
          </motion.button>

          <motion.button
            whileTap={canRetry ? { scale: 0.97 } : {}}
            onClick={handleRetry}
            disabled={!canRetry}
            className={`w-full rounded-2xl py-5 text-base font-semibold transition-all duration-300 border flex flex-col items-center justify-center gap-0.5 ${
              canRetry
                ? "bg-white/8 text-white border-white/15 hover:bg-white/12"
                : "bg-white/3 text-white/25 border-white/5 cursor-not-allowed"
            }`}
            data-testid="btn-retry"
          >
            {canRetry ? (
              "Belum — Panggil Lagi"
            ) : (
              <>
                <span>Panggil Lagi</span>
                <span className="text-xs font-normal text-white/30">Bisa dipakai lagi dalam {formatTime(countdown)}</span>
              </>
            )}
          </motion.button>
        </div>

        <button
          onClick={onBackToDashboard}
          className="flex items-center justify-center text-white/30 hover:text-white/60 transition-colors py-2 text-sm"
          data-testid="btn-back-dashboard"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Kembali ke halaman utama
        </button>
      </div>
    </div>
  );
}
