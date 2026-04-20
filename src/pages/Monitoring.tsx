import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RadioReceiver, CheckCircle, Clock, ChevronLeft, MessageCircle, RefreshCw } from "lucide-react";

interface MonitoringProps {
  callNote: string;
  onNavigateToConfirmation: () => void;
  onBack: () => void;
}

type Status = "searching" | "found" | "delayed";

export function Monitoring({ callNote, onNavigateToConfirmation, onBack }: MonitoringProps) {
  const [status, setStatus] = useState<Status>("searching");

  const cycleStatus = () => {
    if (status === "searching") setStatus("found");
    else if (status === "found") setStatus("delayed");
    else setStatus("searching");
  };

  const statusLabel = {
    searching: "Memanggil...",
    found: "Ditemukan",
    delayed: "Sedikit Terlambat",
  };

  const statusColor = {
    searching: "text-primary bg-primary/10 border-primary/20",
    found: "text-green-400 bg-green-500/10 border-green-500/20",
    delayed: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0A0F1E] pb-28">

      {/* Header */}
      <header className="px-6 pt-12 pb-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          data-testid="btn-back-monitoring"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Status Panggilan</h1>
          <p className="text-white/40 text-xs mt-0.5">Budi Santoso · Kelas 5A</p>
        </div>

        {/* Status badge */}
        <div className={`ml-auto text-xs font-semibold px-3 py-1.5 rounded-full border ${statusColor[status]}`}>
          {statusLabel[status]}
        </div>
      </header>

      {/* Note that was sent */}
      {callNote.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 mb-4 bg-primary/5 border border-primary/15 rounded-2xl px-4 py-3 flex items-start gap-2"
        >
          <MessageCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-white/40 text-xs">Pesan yang dikirim ke guru:</p>
            <p className="text-white text-sm font-medium">"{callNote}"</p>
          </div>
        </motion.div>
      )}

      <div className="px-6 flex flex-col gap-5">

        {/* Main Status Card */}
        <AnimatePresence mode="wait">

          {/* SEARCHING */}
          {status === "searching" && (
            <motion.div
              key="searching"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-8 flex flex-col items-center text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="w-20 h-20 bg-primary/15 rounded-full flex items-center justify-center border border-primary/25 mb-6"
              >
                <RadioReceiver className="w-10 h-10 text-primary" />
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-1">
                Sedang memanggil Budi
                {[0, 0.3, 0.6].map((d, i) => (
                  <motion.span key={i} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: d }}>.</motion.span>
                ))}
              </h2>
              <p className="text-white/40 text-sm">Guru di kelas sudah menerima notifikasi</p>
              <p className="text-white/30 text-xs mt-1">Dipanggil pukul 14:32</p>
            </motion.div>
          )}

          {/* FOUND */}
          {status === "found" && (
            <motion.div
              key="found"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-green-500/10 border border-green-500/25 rounded-3xl p-8 shadow-[0_0_40px_rgba(34,197,94,0.12)] flex flex-col items-center text-center backdrop-blur-lg"
            >
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 250, damping: 18 }}
                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/35 mb-5"
              >
                <CheckCircle className="w-12 h-12 text-green-400" />
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-1">Budi sudah ditemukan!</h2>
              <p className="text-white/50 text-sm mb-5">Dia sedang berjalan menuju gerbang sekolah</p>
              <div className="bg-white/5 rounded-2xl p-4 w-full border border-white/8 mb-4">
                <p className="text-white font-semibold text-base">Budi Santoso</p>
                <p className="text-white/50 text-sm">Kelas 5A · SD Nusantara 1</p>
              </div>
              <div className="bg-green-500/15 text-green-400 font-semibold px-4 py-2 rounded-full border border-green-500/25 text-sm flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
                Estimasi tiba 2–3 menit lagi
              </div>
            </motion.div>
          )}

          {/* DELAYED */}
          {status === "delayed" && (
            <motion.div
              key="delayed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-amber-500/8 border border-amber-500/25 rounded-3xl p-8 shadow-[0_0_40px_rgba(245,158,11,0.12)] flex flex-col items-center text-center backdrop-blur-lg"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 bg-amber-500/15 rounded-full flex items-center justify-center border border-amber-500/30 mb-5"
              >
                <Clock className="w-10 h-10 text-amber-400" />
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-1">Sabar sebentar ya</h2>
              <p className="text-white/50 text-sm mb-5 leading-relaxed">
                Budi masih ada kegiatan di dalam kelas. Guru sudah tahu kamu menunggu.
              </p>
              <div className="bg-amber-500/15 text-amber-400 font-semibold px-4 py-2 rounded-full border border-amber-500/25 text-sm">
                Harap menunggu sebentar
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Teacher Note Chat Bubble — always visible */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-end gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-xs">GR</span>
          </div>
          <div className="bg-white/8 border border-white/8 rounded-2xl rounded-bl-none p-4 max-w-[85%] backdrop-blur-md">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-white/40 text-xs font-medium">Wali Kelas</span>
              <span className="text-white/30 text-xs">14:35</span>
            </div>
            <p className="text-white text-sm leading-relaxed">
              {status === "delayed"
                ? "Budi sedang membereskan buku di kelas, harap sabar ya Pak/Bu. Sebentar lagi keluar."
                : status === "found"
                ? "Budi sudah siap dan sedang berjalan ke gerbang. Terima kasih sudah menunggu."
                : "Baik, notifikasi sudah diterima. Sedang menghubungi Budi di kelas."}
            </p>
          </div>
        </motion.div>

        {/* Demo toggle */}
        <div className="flex justify-center pt-2">
          <button
            onClick={cycleStatus}
            className="text-white/25 text-xs border border-white/8 rounded-full px-4 py-2 hover:bg-white/5 hover:text-white/50 transition-colors flex items-center gap-1.5"
            data-testid="btn-demo-cycle"
          >
            <RefreshCw className="w-3 h-3" />
            Ganti Status (Mode Demo)
          </button>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/85 to-transparent flex justify-center max-w-[430px] mx-auto pointer-events-none">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNavigateToConfirmation}
          className="w-full bg-gradient-to-r from-blue-600 to-primary text-white font-bold rounded-2xl py-4 shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-primary/40 pointer-events-auto flex items-center justify-center gap-2"
          data-testid="btn-to-confirmation"
        >
          Anak sudah di gerbang? Lanjut
        </motion.button>
      </div>
    </div>
  );
}
