import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, QrCode, RefreshCw, CheckCircle2, Eye, Loader2, AlertTriangle, Pencil, Sparkles } from "lucide-react";
import QRCode from "qrcode";

interface OjekQRProps {
  onBack: () => void;
  onDone: () => void;
}

type Step = "note" | "nopol" | "checking" | "warning" | "qr";

/* ── AI mock helper ── */
const SLANG_MAP: Record<string, string> = {
  ngga: "tidak", nggak: "tidak", gak: "tidak", gk: "tidak",
  gue: "saya", gw: "saya", lo: "Anda", lu: "Anda",
  kayak: "seperti", banget: "sekali", udah: "sudah", blm: "belum",
  gimana: "bagaimana", org: "orang", yg: "yang", dgn: "dengan",
};

function checkAI(text: string): { ok: boolean; issues: string[]; corrected: string } {
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

/* ── Main component ── */
export function OjekQR({ onBack, onDone }: OjekQRProps) {
  const [step, setStep] = useState<Step>("note");
  const [nopol, setNopol] = useState("");

  const [aiResult, setAiResult] = useState<{ ok: boolean; issues: string[]; corrected: string } | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrToken, setQrToken] = useState("");
  const [scanCount, setScanCount] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [regenCooldown, setRegenCooldown] = useState(0);
const prefix = "Panggilan atas nama Budi Santoso, kelas 5A sudah dijemput ojek didepan ";
const [note, setNote] = useState(prefix);
const [suffix, setSuffix] = useState("");

  const generateQR = useCallback(async (noteText: string) => {
  const token = `SIJEMPUT-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const payload = JSON.stringify({
    token,
    siswa: "Budi Santoso",
    kelas: "5A",
    waktu: new Date().toISOString(),
    keterangan: noteText || "-",
    metode: "ojek_online",
  });

  setQrToken(token);
  setScanCount(0);
  setScanned(false);

  // 🔥 QR statis pakai API gratis
  const staticQR = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(payload)}`;

  setQrDataUrl(staticQR);
  setStep("qr");
}, []);

  /* Countdown for regenerate */
  useEffect(() => {
    if (regenCooldown <= 0) return;
    const t = setTimeout(() => setRegenCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [regenCooldown]);

  /* Simulate scan after 8s (demo) */
  useEffect(() => {
    if (step !== "qr") return;
    const t = setTimeout(() => {
      setScanCount((c) => c + 1);
      setScanned(true);
    }, 8000);
    return () => clearTimeout(t);
  }, [step, qrToken]);

  const handleCheckNote = () => {
    setStep("checking");
    const result = checkAI(note);
    setTimeout(() => {
      setAiResult(result);
      if (result.ok) {
        generateQR(note);
      } else {
        setStep("warning");
      }
    }, 1800);
  };

  const handleUseCorrected = () => {
    setNote(aiResult?.corrected ?? note);
    generateQR(aiResult?.corrected ?? note);
  };

  const handleRegenerate = async () => {
    if (regenCooldown > 0) return;
    setRegenCooldown(30);
    setQrDataUrl("");
    await generateQR(note);
  };

  console.log({ note, suffix });
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0A0F1E] pb-10">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 flex items-center gap-3">
        <button
          onClick={step === "note" ? onBack : () => setStep("note")}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
          data-testid="btn-back-ojek"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <p className="text-white/40 text-xs">
            {step === "note" && "Langkah 2 dari 3 · Keterangan"}
            {step === "checking" && "Langkah 2 dari 3 · Memeriksa..."}
            {step === "warning" && "Langkah 2 dari 3 · Perlu Diperbaiki"}
            {step === "qr" && "Langkah 3 dari 3 · QR Code"}
          </p>
          <h1 className="text-xl font-bold text-white">
            {step === "qr" ? "QR Code Ojek" : "Ojek Online"}
          </h1>
        </div>
      </header>

      <div className="px-6">
        <AnimatePresence mode="wait">

          {/* ── STEP: NOTE INPUT ── */}
          {step === "note" && (
            <motion.div key="note" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-1">
                  <Pencil className="w-4 h-4 text-amber-400" />
                  <h2 className="text-white font-bold text-base">Lengkapi Panggilan</h2>
                </div>
                <p className="text-white/40 text-xs mb-4 leading-relaxed">
                 Ini adalah kalimat pangggilan yang akan diumumkan oleh speaker, mohon gunakan kata kata yang sopan, jelas dan mudah dimengerti oleh siswa.
                </p>

               


              <div className="relative w-full">
                {/* Highlight layer */}
                <div className="absolute inset-0 pointer-events-none px-4 py-3 text-sm whitespace-pre-wrap">
                  <span className="text-amber-400/50 font-medium">{prefix}</span>
                  <span className="text-white"> {suffix}</span>
                </div>

                <textarea
                  value={note}
                  onChange={(e) => {
                    let val = e.target.value || "";


                    if (!val.startsWith(prefix)) {
                      val = prefix + suffix;
                    }

                    const newSuffix = val.slice(prefix.length);

                    setSuffix(newSuffix);
                    setNote(prefix + newSuffix);
                  }}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-transparent caret-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 resize-none"
              />
              </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-white/25 text-xs">*Opsional diisi, ditambahkan jika ada catatan sebelum Pemanggilan diproses</p>
                  <p className="text-white/30 text-xs">{note.length}/300</p>
                </div>
              </div>

              <div className="bg-amber-500/8 border border-amber-400/15 rounded-2xl p-4 flex gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-amber-300/70 text-xs leading-relaxed">
                  Teks kamu akan diperiksa oleh AI sebelum dikirim, untuk memastikan bahasa yang digunakan sopan dan baku.
                </p>
              </div>

              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-1">
                  <Pencil className="w-4 h-4 text-amber-400" />
                  <h2 className="text-white font-bold text-base">Plat Nomor Penjemput</h2>
                </div>
                <p className="text-white/40 text-xs mb-4 leading-relaxed">
                 Keterangan Ini hanya ditampilkan di TV depan sekolah.
                </p>

                <textarea
                  value={nopol}
                  onChange={(e) => setNopol(e.target.value)}
                  placeholder="Contoh: AB 1234 CD"
                  rows={1}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder:text-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 transition-all resize-none"
                  data-testid="input-ojek-note"
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-white/25 text-xs">*Opsional, Hanya untuk memudahkan siswa</p>
                  <p className="text-white/30 text-xs">{nopol.length}/9</p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleCheckNote}
                disabled={note.trim().length < 10}
                className={`w-full rounded-2xl py-4 font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  note.trim().length >= 10
                    ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                    : "bg-white/5 text-white/25 cursor-not-allowed"
                }`}
                data-testid="btn-check-note"
              >
                <Sparkles className="w-4 h-4" />
                Periksa & Buat QR Code
              </motion.button>
            </motion.div>
          )}

          

          {/* ── STEP: AI WARNING ── */}
          {step === "warning" && aiResult && (
            <motion.div key="warning" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
              <div className="bg-red-500/8 border border-red-400/20 rounded-3xl p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-red-500/15 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Ada yang perlu diperbaiki</p>
                    <p className="text-white/45 text-xs mt-0.5">AI mendeteksi penggunaan bahasa yang kurang baku atau sopan</p>
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

                <div className="bg-white/3 border border-white/8 rounded-2xl p-3 mb-1">
                  <p className="text-white/40 text-xs mb-1 font-medium">Teks kamu:</p>
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
                  data-testid="btn-use-corrected"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Gunakan Teks yang Sudah Dikoreksi
                </motion.button>
              </div>

              <button
                onClick={() => setStep("note")}
                className="w-full text-white/40 py-2 text-sm hover:text-white/70 transition-colors flex items-center justify-center gap-2"
                data-testid="btn-edit-note"
              >
                <Pencil className="w-3.5 h-3.5" />
                Tulis Ulang Sendiri
              </button>
            </motion.div>
          )}

          {/* ── STEP: QR ── */}
          {step === "qr" && (
            <motion.div key="qr" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
              {/* Scan status */}
              <motion.div
                animate={scanned ? { backgroundColor: "rgba(34,197,94,0.08)" } : {}}
                className={`rounded-3xl border p-4 flex items-center gap-3 transition-colors duration-500 ${
                  scanned ? "border-green-400/25" : "bg-white/3 border-white/8"
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${scanned ? "bg-green-500/15" : "bg-white/5"}`}>
                  {scanned ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <QrCode className="w-5 h-5 text-white/40" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${scanned ? "text-green-400" : "text-white/60"}`}>
                    {scanned ? "QR sudah di-scan!" : "Menunggu scan..."}
                  </p>
                  <p className="text-white/30 text-xs">Total scan: <span className="text-white/50 font-semibold">{scanCount}×</span></p>
                </div>
                {!scanned && (
                  <div className="flex gap-1">
                    {[0, 0.3, 0.6].map((d, i) => (
                      <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity, delay: d }}
                        className="w-1.5 h-1.5 rounded-full bg-primary" />
                    ))}
                  </div>
                )}
              </motion.div>

              {/* QR Card */}
              <div className="glass-card p-6 flex flex-col items-center">
                <p className="text-white/50 text-xs mb-1">QR untuk <span className="text-white font-semibold">Budi Santoso</span></p>
                <p className="text-white/25 text-xs mb-5 font-mono">{qrToken}</p>

                {qrDataUrl ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`rounded-2xl overflow-hidden border-4 transition-colors duration-500 ${scanned ? "border-green-400/40" : "border-white/10"}`}
                  >
                    <img src={qrDataUrl} alt="QR Code" className="w-[200px] h-[200px]" />
                  </motion.div>
                ) : (
                  <div className="w-[200px] h-[200px] rounded-2xl bg-white/5 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                )}

                <p className="text-white/30 text-xs mt-4 text-center leading-relaxed px-4">
                  Tunjukkan QR ini ke pengemudi ojek. Dan di scan di Pos Satpam, setelah discan, otomatis akan ada panggilan di speaker untuk siswa yang dijemput, dan informasi penjemputan akan muncul di TV depan sekolah.
                </p>

                {note && (
                  <div className="mt-4 w-full bg-white/3 border border-white/8 rounded-2xl px-4 py-3">
                    <p className="text-white/35 text-xs mb-0.5">Keterangan:</p>
                    <p className="text-white/60 text-xs leading-relaxed">"{note}"</p>
                  </div>
                )}
              </div>

              {/* Regenerate button */}
              <motion.button
                whileTap={regenCooldown > 0 ? {} : { scale: 0.97 }}
                onClick={handleRegenerate}
                disabled={regenCooldown > 0}
                className={`w-full rounded-2xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 transition-all border ${
                  regenCooldown > 0
                    ? "bg-white/3 border-white/8 text-white/25 cursor-not-allowed"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
                data-testid="btn-regenerate-qr"
              >
                <motion.div animate={regenCooldown === 0 ? {} : { rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                {regenCooldown > 0 ? `Regenerate dalam ${regenCooldown}s` : "Regenerate QR Code"}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onDone}
                className="w-full bg-gradient-to-r from-blue-600 to-primary text-white font-bold rounded-2xl py-4 shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-primary/40 flex items-center justify-center gap-2"
                data-testid="btn-done-ojek"
              >
                <Eye className="w-5 h-5" />
                
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
