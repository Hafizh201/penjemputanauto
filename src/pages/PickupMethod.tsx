import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Car, Bike, CheckCircle } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring" as const, stiffness: 360, damping: 26, delay: i * 0.1 },
  }),
};

interface PickupMethodProps {
  onOrtu: () => void;
  onOjek: () => void;
  onBack: () => void;
}

export function PickupMethod({ onOrtu, onOjek, onBack }: PickupMethodProps) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0A0F1E]">
      <header className="px-6 pt-12 pb-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
          data-testid="btn-back-pickup"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <p className="text-white/40 text-xs">Langkah 1 dari 2</p>
          <h1 className="text-xl font-bold text-white">Cara Penjemputan</h1>
        </div>
      </header>

      <div className="px-6 pt-4 flex flex-col gap-5">
        <motion.p
          custom={0} variants={fadeUp} initial="hidden" animate="show"
          className="text-white/50 text-sm leading-relaxed"
        >
          Pilih cara kamu menjemput <span className="text-white font-semibold">Budi Santoso</span> hari ini. Guru akan diberitahu sesuai metode yang kamu pilih.
        </motion.p>

        {/* Option 1: Orang Tua */}
        <motion.button
          custom={1} variants={fadeUp} initial="hidden" animate="show"
          whileTap={{ scale: 0.98 }}
          onClick={onOrtu}
          className="w-full text-left glass-card p-6 border-2 border-transparent hover:border-primary/30 transition-all duration-200 group"
          data-testid="btn-pickup-ortu"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <Car className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-base mb-1">Dijemput Orang Tua</p>
              <p className="text-white/45 text-sm leading-relaxed">
                Kamu menjemput langsung menggunakan kendaraan pribadi. Kamu bisa tambahkan pesan untuk guru.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Pesan ke guru", "Cek kata-kata", "Langsung dipanggil"].map((tag) => (
                  <span key={tag} className="text-xs bg-primary/10 text-primary/80 px-2.5 py-1 rounded-full border border-primary/15">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.button>

        {/* Option 2: Ojek Online */}
        <motion.button
          custom={2} variants={fadeUp} initial="hidden" animate="show"
          whileTap={{ scale: 0.98 }}
          onClick={onOjek}
          className="w-full text-left glass-card p-6 border-2 border-transparent hover:border-amber-400/30 transition-all duration-200 group"
          data-testid="btn-pickup-ojek"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
              <Bike className="w-7 h-7 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-base mb-1">Ojek Online</p>
              <p className="text-white/45 text-sm leading-relaxed">
                Anak kamu dijemput oleh pengemudi ojek online. QR Code akan dibuat sebagai bukti verifikasi.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["QR Code verifikasi", "Terpantau guru", "Bisa regenerate"].map((tag) => (
                  <span key={tag} className="text-xs bg-amber-400/10 text-amber-400/80 px-2.5 py-1 rounded-full border border-amber-400/15">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.button>

        {/* Info note */}
        <div className="bg-white/3 border border-white/8 rounded-2xl px-4 py-3 flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
          <p className="text-white/30 text-xs leading-relaxed">
            Pilihan ini hanya berlaku untuk penjemputan hari ini. Setiap metode akan dicatat secara digital oleh sistem sekolah.
          </p>
        </div>
      </div>
    </div>
  );
}
