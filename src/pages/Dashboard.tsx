import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, Bell, AlertCircle, Sparkles, CheckCircle2, Clock, XCircle } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};
const card = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 380, damping: 28 } },
};

interface DashboardProps {
  onCallConfirm: () => void;
  onAutoCall: () => void;
  onGoToSettings: () => void;
}

export function Dashboard({ onCallConfirm, onAutoCall, onGoToSettings }: DashboardProps) {
  const [autoMode, setAutoMode] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [inRadius, setInRadius] = useState(false);
  const [showRadiusPrompt, setShowRadiusPrompt] = useState(false);
  const [now, setNow] = useState(new Date());

  // Mock presensi state — true = sudah presensi pulang
  const [sudahPresensi] = useState(false);

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(tick);
  }, []);

  const dateStr = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  useEffect(() => {
    if (!manualInput) {
      setIsTyping(false);
      setSuggestion("");0 
      return;
    }
    setIsTyping(true);
    setSuggestion("");
    const timeout = setTimeout(() => {
      setIsTyping(false);
      if (manualInput.toLowerCase() === "bdu" || manualInput.toLowerCase() === "bdi") {
        setSuggestion("Budi Santoso");
      } else if (manualInput.length > 2) {
        setSuggestion(manualInput.charAt(0).toUpperCase() + manualInput.slice(1) + " Santoso");
      }
    }, 1500);
    return () => clearTimeout(timeout);
  }, [manualInput]);

  const handleRadarClick = () => {
    const next = !inRadius;
    setInRadius(next);
    if (next && autoMode) {
      setTimeout(() => setShowRadiusPrompt(true), 600);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0A0F1E] pb-28">

      {/* Header */}
      <header className="px-6 pt-10 pb-5 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Assalamu'alaikum</h1>
          <p className="text-white/40 text-xs mt-0.5">Hari ini: <span className="capitalize">{dateStr}</span></p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onGoToSettings}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_22px_rgba(59,130,246,0.55)] transition-shadow"
          data-testid="btn-profile-avatar"
          aria-label="Buka Pengaturan"
        >
          AB
        </motion.button>
      </header>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-6 space-y-5"
      >

        {/* ── PRESENSI PULANG CARD ── */}
        <motion.div
          variants={card}
          className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border ${
            sudahPresensi
              ? "bg-green-500/8 border-green-500/20"
              : "bg-amber-500/8 border-amber-400/20"
          }`}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            sudahPresensi ? "bg-green-500/15" : "bg-amber-400/12"
          }`}>
            {sudahPresensi
              ? <CheckCircle2 className="w-5 h-5 text-green-400" />
              : <Clock className="w-5 h-5 text-amber-400" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-bold ${sudahPresensi ? "text-green-400" : "text-amber-400"}`}>
              {sudahPresensi ? "Presensi Pulang Tercatat" : "Belum Presensi Pulang"}
            </p>
            <p className="text-white/35 text-xs mt-0.5">
              {sudahPresensi
                ? "Budi sudah melakukan presensi pulang digital hari ini"
                : "Budi belum tercatat presensi pulang digital hari ini"
              }
            </p>
          </div>
          {sudahPresensi && (
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
            </span>
          )}
          {!sudahPresensi && (
            <XCircle className="w-4 h-4 text-amber-400/50 shrink-0" />
          )}
        </motion.div>

        {/* Auto Mode Card */}
        <motion.div
          layout
          variants={card}
          className={`relative p-6 rounded-3xl border transition-all duration-500 overflow-hidden ${
            autoMode
              ? "bg-green-500/10 border-green-500/25 shadow-[0_0_35px_rgba(34,197,94,0.12)]"
              : "glass-card"
          }`}
        >
          {autoMode && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}

          <div className="flex justify-between items-start mb-3 relative z-10">
            <div>
              <h2 className="text-base font-bold text-white">Panggil Otomatis</h2>
              <p className="text-white/40 text-[11px] mt-0.5">
                {autoMode ? "Aktif — Anda dalam Pantauan" : "Matikan jika Ingin Memanggil Secara Manual"}
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => {
                setAutoMode(!autoMode);
                if (!autoMode && inRadius) setTimeout(() => setShowRadiusPrompt(true), 400);
              }}
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex ${
                autoMode ? "bg-green-500 justify-end" : "bg-white/10 justify-start"
              }`}
              data-testid="toggle-auto-mode"
            >
              <motion.div layout className="w-6 h-6 bg-white rounded-full shadow-md" />
            </motion.button>
          </div>

          <p className="text-white/50 text-[12px] leading-relaxed relative z-10">
            {autoMode
              ? "Jika Anda sudah Berada di Dalam Lingkungan Sekolah, Aplikasi akan otomatis memanggil anak Anda secara otomatis."
              : "Mode Lokasi dimatikan, anda harus panggil anak anda secara manual di tombol bawah ini."}
          </p>
        </motion.div>

        {/* Radar Card */}
        <motion.div
          variants={card}
          className={`flex flex-col items-center justify-center py-8 rounded-3xl border backdrop-blur-md cursor-pointer transition-all duration-500 ${
            inRadius
              ? "bg-green-500/8 border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]"
              : "bg-white/3 border-white/8"
          }`}
          onClick={handleRadarClick}
          data-testid="radar-card"
        >
          <div className="relative w-28 h-28 flex items-center justify-center mb-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 2.2, 3], opacity: [0.7, 0.3, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
                className={`absolute inset-0 rounded-full border-2 ${inRadius ? "border-green-400" : "border-primary"}`}
              />
            ))}
            <div
              className={`w-12 h-12 rounded-full z-10 flex items-center justify-center shadow-lg transition-colors duration-500 ${
                inRadius ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]" : "bg-primary shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              }`}
            >
              <Navigation className="w-6 h-6 text-white fill-white" />
            </div>
          </div>

          <p className={`text-sm font-semibold transition-colors duration-500 ${inRadius ? "text-green-400" : "text-white/40"}`}>
            {inRadius ? "Anda sudah dekat sekolah!" : "Anda berada di luar radius sekolah"}
          </p>
          <p className="text-white/25 text-xs mt-1 text-center mr-[20px] ml-[20px]">
            {inRadius ? "Pemanggilan Sudah diproses! Keterangan Selanjutnya dibawah ini" : "Aplikasi sedang mencari lokasi kamu, pastikan GPS aktif dan beri izin lokasi"}
          </p>
        </motion.div>

        {/* Auto mode: prompt to confirm call when in radius — langsung panggil tanpa pilihan */}
        <AnimatePresence>
          {inRadius && autoMode && showRadiusPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-green-500/10 border border-green-500/25 rounded-3xl p-5"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-green-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">Panggilan Sudah diproses!</p>
                  <p className="text-white/50 text-xs mt-0.5 leading-relaxed">
                    Aplikasi mendeteksi kamu di radius sekolah. Panggilan otomatis akan segera dikirim ke guru menggunakan keterangan default kamu.
                  </p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onAutoCall}
                className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-2xl py-3 text-sm shadow-[0_0_20px_rgba(34,197,94,0.25)] border border-green-500/30 flex items-center justify-center gap-2"
                data-testid="btn-auto-call-confirm"
              >
                <Bell className="w-4 h-4" />
                Panggil Budi Sekarang!
              </motion.button>
              <button
                onClick={() => setShowRadiusPrompt(false)}
                className="w-full mt-2 text-white/30 text-xs py-1.5 hover:text-white/60 transition-colors"
              >
                Abaikan
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Manual Section — only when auto mode off 

        <AnimatePresence>
          {!autoMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card p-5">
                <h3 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  Panggil Anak Sekarang
                </h3>
                <p className="text-white/40 text-xs mb-4">Ketik nama anak kamu, lalu tekan konfirmasi.</p>

                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Cari nama siswa... (cth: Budi)"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                  data-testid="input-manual-student"
                />

                <div className="min-h-[40px] mt-2">
                  {isTyping && (
                    <div className="flex items-center gap-2 text-primary/80 text-xs">
                      <span>Mengecek nama siswa</span>
                      <span className="flex gap-0.5">
                        {[0, 0.3, 0.6].map((d, i) => (
                          <motion.span key={i} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: d }}>.</motion.span>
                        ))}
                      </span>
                    </div>
                  )}
                  {!isTyping && suggestion && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <p className="text-amber-400 text-xs">
                        Apakah maksudnya: <span className="font-semibold">{suggestion}</span>?
                      </p>
                    </motion.div>
                  )}
                </div>

                {!isTyping && suggestion && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onCallConfirm}
                    className="w-full bg-primary/15 hover:bg-primary/25 text-primary border border-primary/25 font-semibold rounded-2xl py-3 text-sm transition-colors mt-1 flex items-center justify-center gap-2"
                    data-testid="btn-confirm-manual"
                  >
                    <Bell className="w-4 h-4" />
                    Ya, ini benar — Panggil {suggestion.split(" ")[0]}!
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
*/}
      </motion.div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/85 to-transparent flex justify-center max-w-[430px] mx-auto pointer-events-none">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onCallConfirm}
          className="w-full bg-gradient-to-r from-blue-600 to-primary text-white font-bold rounded-2xl py-4 shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-primary/40 pointer-events-auto flex items-center justify-center gap-2"
          data-testid="btn-to-call-confirm"
        >
          <Bell className="w-5 h-5" />
          Panggil Anak Sekarang
        </motion.button>
      </div>
    </div>
  );
}
