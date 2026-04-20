import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronLeft, MessageSquare, MapPin, Info, AlertTriangle, CheckCircle2, Sparkles, Pencil } from "lucide-react";

interface CallConfirmProps {
  onConfirm: (note: string) => void;
  onCancel: () => void;
}

const quickNotes = [
  "Ditunggu di parkiran",
  "ditunggu 5 menit lagi",
  "Ditunggu di depan pos satpam",
];

const SLANG_MAP: Record<string, string> = {
  ngga: "tidak", nggak: "tidak", gak: "tidak", gk: "tidak",
  gue: "saya", gw: "saya", lo: "Anda", lu: "Anda",
  kayak: "seperti", banget: "sekali", udah: "sudah", blm: "belum",
  gimana: "bagaimana", org: "orang", yg: "yang", dgn: "dengan",
};

function checkAI(text: string): { ok: boolean; issues: string[]; corrected: string } {
  if (!text.trim()) return { ok: true, issues: [], corrected: text };
  const issues: string[] = [];
  let corrected = text.trim();

  if (text.toUpperCase() === text && text.replace(/\s/g, "").length > 5) {
    issues.push("Menggunakan huruf kapital semua");
    corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1).toLowerCase();
  }

  if (/[!?]{2,}/.test(text)) {
    issues.push("Tanda baca berlebihan");
    corrected = corrected.replace(/([!?])\1+/g, "$1");
  }

  const words = text.toLowerCase().split(/\s+/);
  for (const word of words) {
    const clean = word.replace(/[^a-z]/g, "");
    if (SLANG_MAP[clean]) {
      issues.push(`Kata tidak baku: "${clean}"`);
      corrected = corrected.replace(new RegExp(`\\b${clean}\\b`, "gi"), SLANG_MAP[clean]);
    }
  }

  corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
  if (corrected && !corrected.endsWith(".") && !corrected.endsWith("!")) corrected += ".";

  return { ok: issues.length === 0, issues, corrected };
}

type Step = "form" | "checking" | "warning";

export function CallConfirm({ onConfirm, onCancel }: CallConfirmProps) {
  const [step, setStep] = useState<Step>("form");
  const [note, setNote] = useState("");
  const [selectedQuick, setSelectedQuick] = useState("");
  const [aiResult, setAiResult] = useState<{ ok: boolean; issues: string[]; corrected: string } | null>(null);

  const handleQuickNote = (text: string) => {
    if (selectedQuick === text) {
      setSelectedQuick("");
      setNote("");
    } else {
      setSelectedQuick(text);
      setNote(text);
    }
  };

  const handleConfirmClick = () => {
    if (!note.trim()) {
      onConfirm("");
      return;
    }
    setStep("checking");
    const result = checkAI(note);
    setTimeout(() => {
      setAiResult(result);
      if (result.ok) {
        onConfirm(note);
      } else {
        setStep("warning");
      }
    }, 1600);
  };

  const handleUseCorrected = () => {
    const corrected = aiResult?.corrected ?? note;
    setNote(corrected);
    onConfirm(corrected);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0A0F1E]">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 flex items-center gap-3">
        <button
          onClick={step === "form" ? onCancel : () => setStep("form")}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
          data-testid="btn-back-call"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <p className="text-white/40 text-xs">
            {step === "form" && "Langkah 2 dari 2"}
            {step === "checking" && "Memeriksa kata-kata..."}
            {step === "warning" && "Perlu Diperbaiki"}
          </p>
          <h1 className="text-xl font-bold text-white">
            {step === "form" && "Konfirmasi Panggilan"}
            {step === "checking" && "AI Sedang Memeriksa"}
            {step === "warning" && "Periksa Kembali"}
          </h1>
        </div>
      </header>

      <div className="px-6 pb-36">
        <AnimatePresence mode="wait">

          {/* ── FORM STEP ── */}
          {step === "form" && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              {/* Status chip */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-2xl px-4 py-3"
              >
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
                </span>
                <div>
                  <p className="text-green-400 text-sm font-semibold">Kamu sudah di dekat sekolah!</p>
                  <p className="text-green-400/60 text-xs">Dalam radius 150 meter dari gerbang</p>
                </div>
                <MapPin className="w-4 h-4 text-green-400 ml-auto shrink-0" />
              </motion.div>

              {/* Confirmation card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex justify-center mb-5">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center"
                  >
                    <Bell className="w-10 h-10 text-primary" />
                  </motion.div>
                </div>
                <h2 className="text-center text-white font-bold text-xl mb-1">Panggil Budi Santoso?</h2>
                <p className="text-center text-white/50 text-sm mb-2">Kelas 5A · SD Nusantara 1</p>
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-3 flex items-start gap-2 mt-4">
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-white/60 text-xs leading-relaxed">
                    Guru di kelas akan mendapat notifikasi dan mempersiapkan anak untuk keluar. Proses biasanya butuh 2–5 menit.
                  </p>
                </div>
              </motion.div>

              {/* Notes */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <h3 className="text-white font-semibold">Pesan untuk Guru</h3>
                  <span className="text-white/30 text-xs ml-auto">Opsional</span>
                </div>
                <p className="text-white/40 text-xs mb-3">Mau kasih tahu guru sesuatu? Teks kamu akan dicek AI sebelum dikirim.</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {quickNotes.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQuickNote(q)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                        selectedQuick === q
                          ? "bg-primary/20 border-primary/50 text-primary"
                          : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <textarea
                  value={note}
                  onChange={(e) => { setNote(e.target.value); setSelectedQuick(""); }}
                  placeholder="Atau tulis pesan sendiri... (contoh: Saya sudah ada di depan, pakai mobil putih)"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all resize-none"
                  data-testid="input-call-note"
                />
                {note.length > 0 && (
                  <p className="text-white/30 text-xs mt-1 text-right">{note.length}/200 karakter</p>
                )}

                {note.trim().length > 0 && (
                  <div className="mt-3 flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-xl px-3 py-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                    <p className="text-primary/70 text-xs">AI akan memeriksa kata-kata kamu saat tombol panggil ditekan</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* ── CHECKING STEP ── */}
          {step === "checking" && (
            <motion.div key="checking" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-6 pt-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary"
              />
              <div className="text-center">
                <p className="text-white font-bold text-lg">AI sedang memeriksa...</p>
                <p className="text-white/40 text-sm mt-1">Menganalisis kesopanan dan tata bahasa</p>
              </div>
            </motion.div>
          )}

          {/* ── WARNING STEP ── */}
          {step === "warning" && aiResult && (
            <motion.div key="warning" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4 pt-2">
              <div className="bg-red-500/8 border border-red-400/20 rounded-3xl p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-red-500/15 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Ada yang perlu diperbaiki</p>
                    <p className="text-white/45 text-xs mt-0.5">AI mendeteksi bahasa yang kurang baku atau sopan</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {aiResult.issues.map((issue) => (
                    <div key={issue} className="flex items-center gap-2 bg-red-500/5 rounded-xl px-3 py-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      <p className="text-red-300 text-xs">{issue}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white/3 rounded-2xl p-3">
                  <p className="text-white/35 text-xs mb-1">Teks kamu:</p>
                  <p className="text-white/60 text-sm italic">"{note}"</p>
                </div>
              </div>

              <div className="bg-green-500/8 border border-green-400/20 rounded-3xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-green-400" />
                  <p className="text-green-400 font-semibold text-sm">Saran koreksi dari AI:</p>
                </div>
                <div className="bg-green-500/5 rounded-2xl p-3 mb-4">
                  <p className="text-white text-sm leading-relaxed">"{aiResult.corrected}"</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleUseCorrected}
                  className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-400/25 text-green-400 font-bold rounded-2xl py-3 text-sm transition-colors flex items-center justify-center gap-2"
                  data-testid="btn-use-corrected-callconfirm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Gunakan Teks yang Sudah Dikoreksi
                </motion.button>
              </div>

              <button
                onClick={() => setStep("form")}
                className="w-full text-white/40 py-2 text-sm hover:text-white/70 transition-colors flex items-center justify-center gap-2"
                data-testid="btn-edit-callconfirm"
              >
                <Pencil className="w-3.5 h-3.5" />
                Tulis Ulang Sendiri
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom CTA — only on form step */}
      <AnimatePresence>
        {step === "form" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-0 left-0 right-0 p-6 max-w-[430px] mx-auto bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/95 to-transparent pointer-events-none"
          >
            <div className="flex flex-col gap-3 pointer-events-auto">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleConfirmClick}
                className="w-full bg-gradient-to-r from-blue-600 to-primary text-white font-bold rounded-2xl py-4 shadow-[0_0_25px_rgba(59,130,246,0.35)] border border-primary/40 flex items-center justify-center gap-2 text-base"
                data-testid="btn-confirm-call"
              >
                <Bell className="w-5 h-5" />
                Ya, Panggil Sekarang!
              </motion.button>
              <button
                onClick={onCancel}
                className="w-full text-white/40 py-2 text-sm hover:text-white/70 transition-colors"
                data-testid="btn-cancel-call"
              >
                Belum, nanti saja
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
