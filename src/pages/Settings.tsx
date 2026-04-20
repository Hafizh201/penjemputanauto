import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, User, Shield, Bell, Users,
  LogOut, Plus, CheckCircle, XCircle, Loader2, Eye, EyeOff,
  Info, Radio, Vibrate, Volume2, GraduationCap, Trash2, Map
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsProps {
  onBack: () => void;
  onLogout: () => void;
}

interface Student {
  id: string;
  name: string;
  kelas: string;
  sekolah: string;
  nik: string;
}

type Section = "" | "students" | "add-student" | "call-settings" | "security" | "about";

const MOCK_STUDENTS: Record<string, { name: string; kelas: string; sekolah: string }> = {
  "3271234567890001": { name: "Andi Pratama", kelas: "Kelas 3B", sekolah: "SD Nusantara 1" },
  "3271234567890002": { name: "Siti Rahayu", kelas: "Kelas 2A", sekolah: "SD Nusantara 1" },
};

const RADIUS_OPTIONS = [50, 100, 150, 200, 300, 500];

export function Settings({ onBack, onLogout }: SettingsProps) {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<Section>("");

  // Students
  const [students, setStudents] = useState<Student[]>([
    { id: "1", name: "Budi Santoso", kelas: "Kelas 5A", sekolah: "SD Nusantara 1", nik: "3271234567890000" },
  ]);
  const [nikInput, setNikInput] = useState("");
  const [nikStatus, setNikStatus] = useState<"idle" | "checking" | "found" | "notfound">("idle");
  const [foundStudent, setFoundStudent] = useState<{ name: string; kelas: string; sekolah: string } | null>(null);

  // Call settings
  const [radius, setRadius] = useState(2); // index of RADIUS_OPTIONS
  const [vibrateOn, setVibrateOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [autoCallOn, setAutoCallOn] = useState(true);
  const [autoCallNote, setAutoCallNote] = useState("Saya sudah di depan gerbang sekolah dan siap menjemput.");

  // PIN change
  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinSaving, setPinSaving] = useState(false);

  const handleCheckNik = () => {
    if (nikInput.length < 16) {
      toast({ title: "NIK tidak valid", description: "NIK harus terdiri dari 16 digit angka." });
      return;
    }
    setNikStatus("checking");
    setFoundStudent(null);
    setTimeout(() => {
      const found = MOCK_STUDENTS[nikInput];
      if (found) {
        setNikStatus("found");
        setFoundStudent(found);
      } else if (nikInput.length === 16) {
        // Simulate random find for other 16-digit NIKs
        const random = { name: "Ahmad Fauzi", kelas: "Kelas 4C", sekolah: "SD Nusantara 1" };
        setNikStatus("found");
        setFoundStudent(random);
      } else {
        setNikStatus("notfound");
      }
    }, 1800);
  };

  const handleAddStudent = () => {
    if (!foundStudent) return;
    const already = students.find((s) => s.nik === nikInput);
    if (already) {
      toast({ title: "Sudah terdaftar", description: `${foundStudent.name} sudah ada di daftar murid kamu.` });
      return;
    }
    setStudents((prev) => [
      ...prev,
      { id: Date.now().toString(), name: foundStudent.name, kelas: foundStudent.kelas, sekolah: foundStudent.sekolah, nik: nikInput },
    ]);
    toast({ title: "Berhasil!", description: `${foundStudent.name} ditambahkan sebagai murid kamu.` });
    setNikInput("");
    setNikStatus("idle");
    setFoundStudent(null);
    setActiveSection("students");
  };

  const handleRemoveStudent = (id: string, name: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Murid dihapus", description: `${name} dihapus dari daftar.` });
  };

  const handleSavePin = () => {
    if (oldPin.length < 4) { toast({ title: "PIN lama kurang dari 4 digit" }); return; }
    if (newPin.length < 4) { toast({ title: "PIN baru kurang dari 4 digit" }); return; }
    if (newPin !== confirmPin) { toast({ title: "PIN baru tidak cocok", description: "Pastikan PIN baru dan konfirmasi sama." }); return; }
    if (oldPin !== "1234") { toast({ title: "PIN lama salah", description: "Coba lagi dengan PIN yang benar." }); return; }
    setPinSaving(true);
    setTimeout(() => {
      setPinSaving(false);
      setOldPin(""); setNewPin(""); setConfirmPin("");
      toast({ title: "PIN berhasil diubah!", description: "Gunakan PIN baru kamu mulai sekarang." });
      setActiveSection("");
    }, 1500);
  };

  const toggle = (section: Section) => setActiveSection((prev) => (prev === section ? "" : section));

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0A0F1E] pb-10">

      {/* Header */}
      <header className="px-6 pt-10 pb-5 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
          data-testid="btn-back-settings"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Pengaturan</h1>
          <p className="text-white/40 text-xs">Kelola akun dan preferensi kamu</p>
        </div>
      </header>

      {/* Profile Card */}
      <div className="mx-6 mb-6">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            AB
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-base">Ayah Budi</p>
            <p className="text-white/40 text-xs">ID Orang Tua: OT-2026-0417</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              <span className="text-green-400 text-xs font-medium">Akun Aktif</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-3">

        {/* ── STUDENTS ── */}
        <SectionCard
          icon={<Users className="w-5 h-5 text-primary" />}
          iconBg="bg-primary/10"
          title="Murid Terdaftar"
          subtitle={`${students.length} murid terdaftar`}
          open={activeSection === "students"}
          onToggle={() => toggle("students")}
          testId="section-students"
        >
          <div className="space-y-2 mb-4">
            {students.map((s) => (
              <div key={s.id} className="flex items-center gap-3 bg-white/3 border border-white/8 rounded-2xl px-4 py-3">
                <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{s.name}</p>
                  <p className="text-white/40 text-xs">{s.kelas} · {s.sekolah}</p>
                </div>
                <button
                  onClick={() => handleRemoveStudent(s.id, s.name)}
                  className="w-8 h-8 rounded-full hover:bg-red-500/15 flex items-center justify-center transition-colors shrink-0"
                  data-testid={`btn-remove-student-${s.id}`}
                >
                  <Trash2 className="w-3.5 h-3.5 text-white/30 hover:text-red-400 transition-colors" />
                </button>
              </div>
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveSection("add-student")}
            className="w-full border border-dashed border-primary/30 rounded-2xl py-3 flex items-center justify-center gap-2 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
            data-testid="btn-add-student"
          >
            <Plus className="w-4 h-4" />
            Tambah Murid Baru
          </motion.button>
        </SectionCard>

        {/* ── ADD STUDENT ── */}
        <AnimatePresence>
          {activeSection === "add-student" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setActiveSection("students")} className="text-white/40 hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h3 className="text-white font-bold text-sm">Tambah Murid dengan NIK</h3>
                </div>

                <div className="bg-primary/5 border border-primary/15 rounded-2xl p-3 mb-4 flex gap-2">
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-white/50 text-xs leading-relaxed">
                    Masukkan NIK (Nomor Induk Kependudukan) 16 digit dari kartu pelajar atau KK anak kamu. Sistem akan memverifikasi data secara otomatis.
                  </p>
                </div>

                <label className="text-white/50 text-xs mb-1.5 block">Nomor NIK</label>
                <input
                  type="number"
                  value={nikInput}
                  onChange={(e) => { setNikInput(e.target.value.slice(0, 16)); setNikStatus("idle"); setFoundStudent(null); }}
                  placeholder="Masukkan 16 digit NIK anak..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all tabular-nums"
                  data-testid="input-nik"
                />
                <p className="text-white/25 text-xs mt-1 text-right">{nikInput.length}/16 digit</p>

                {/* Status feedback */}
                <AnimatePresence mode="wait">
                  {nikStatus === "checking" && (
                    <motion.div key="checking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 mt-3 bg-primary/5 border border-primary/15 rounded-2xl px-4 py-3">
                      <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                      <p className="text-white/60 text-sm">Memverifikasi NIK ke sistem Dapodik...</p>
                    </motion.div>
                  )}
                  {nikStatus === "found" && foundStudent && (
                    <motion.div key="found" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-3 bg-green-500/8 border border-green-500/20 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-green-400 text-xs font-semibold mb-0.5">Murid ditemukan!</p>
                          <p className="text-white font-bold">{foundStudent.name}</p>
                          <p className="text-white/50 text-xs">{foundStudent.kelas} · {foundStudent.sekolah}</p>
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleAddStudent}
                        className="w-full mt-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/25 font-bold rounded-2xl py-2.5 text-sm transition-colors flex items-center justify-center gap-2"
                        data-testid="btn-confirm-add-student"
                      >
                        <Plus className="w-4 h-4" />
                        Tambahkan ke Daftar Murid
                      </motion.button>
                    </motion.div>
                  )}
                  {nikStatus === "notfound" && (
                    <motion.div key="notfound" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-start gap-3 mt-3 bg-red-500/8 border border-red-500/20 rounded-2xl px-4 py-3">
                      <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-400 text-xs font-semibold">NIK tidak ditemukan</p>
                        <p className="text-white/40 text-xs mt-0.5">Pastikan NIK 16 digit dan sudah terdaftar di Dapodik sekolah.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {nikStatus !== "found" && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCheckNik}
                    disabled={nikInput.length < 16 || nikStatus === "checking"}
                    className={`w-full mt-4 rounded-2xl py-3 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      nikInput.length >= 16 && nikStatus !== "checking"
                        ? "bg-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]"
                        : "bg-white/5 text-white/25 cursor-not-allowed"
                    }`}
                    data-testid="btn-verify-nik"
                  >
                    {nikStatus === "checking" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {nikStatus === "checking" ? "Memverifikasi..." : "Cari & Verifikasi NIK"}
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CALL SETTINGS ── */}
        <SectionCard
          icon={<Radio className="w-5 h-5 text-violet-400" />}
          iconBg="bg-violet-500/10"
          title="Pengaturan Panggilan"
          subtitle={`Radius aktif: ${RADIUS_OPTIONS[radius]}m`}
          open={activeSection === "call-settings"}
          onToggle={() => toggle("call-settings")}
          testId="section-call-settings"
        >
          {/* Radius picker */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Map className="w-4 h-4 text-violet-400" />
              <p className="text-white text-sm font-semibold">Radius Panggil Otomatis</p>
            </div>
            <p className="text-white/40 text-xs mb-3">Panggilan otomatis akan aktif saat kamu dalam radius ini dari gerbang sekolah.</p>
            <div className="flex gap-2 flex-wrap">
              {RADIUS_OPTIONS.map((r, i) => (
                <button
                  key={r}
                  onClick={() => setRadius(i)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
                    radius === i
                      ? "bg-violet-500/20 border-violet-400/40 text-violet-300"
                      : "bg-white/5 border-white/8 text-white/40 hover:text-white/70"
                  }`}
                  data-testid={`btn-radius-${r}`}
                >
                  {r}m
                </button>
              ))}
            </div>
            <div className="mt-3 bg-violet-500/8 border border-violet-500/15 rounded-xl px-3 py-2">
              <p className="text-violet-300 text-xs">
                Dipilih: <span className="font-bold">{RADIUS_OPTIONS[radius]} meter</span> — Sekitar {Math.round(RADIUS_OPTIONS[radius] / 80)} menit jalan kaki dari gerbang.
              </p>
            </div>
          </div>

          {/* Auto-call default note */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <p className="text-white text-sm font-semibold">Keterangan Default Panggilan Otomatis</p>
            </div>
            <p className="text-white/35 text-xs mb-2 leading-relaxed">
              Teks ini akan otomatis dikirim ke guru saat mode panggilan otomatis aktif. Tidak perlu diisi ulang setiap kali.
            </p>
            <textarea
              value={autoCallNote}
              onChange={(e) => setAutoCallNote(e.target.value)}
              rows={3}
              placeholder="Contoh: Saya sudah di depan gerbang, pakai mobil silver..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder:text-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400/40 transition-all resize-none"
              data-testid="input-auto-call-note"
            />
            <p className="text-white/25 text-xs mt-1 text-right">{autoCallNote.length}/200</p>
          </div>

          <div className="space-y-3">
            <ToggleRow
              icon={<Bell className="w-4 h-4 text-amber-400" />}
              label="Panggil Otomatis"
              description="Aktifkan panggilan otomatis saat masuk radius"
              value={autoCallOn}
              onToggle={() => setAutoCallOn(!autoCallOn)}
              testId="toggle-auto-call"
            />
            <ToggleRow
              icon={<Vibrate className="w-4 h-4 text-blue-400" />}
              label="Getaran (Haptic)"
              description="Getar saat menerima notifikasi status siswa"
              value={vibrateOn}
              onToggle={() => setVibrateOn(!vibrateOn)}
              testId="toggle-vibrate"
            />
            <ToggleRow
              icon={<Volume2 className="w-4 h-4 text-green-400" />}
              label="Suara Notifikasi"
              description="Mainkan suara saat ada pembaruan status"
              value={soundOn}
              onToggle={() => setSoundOn(!soundOn)}
              testId="toggle-sound"
            />
          </div>
        </SectionCard>

        {/* ── SECURITY ── */}
        <SectionCard
          icon={<Shield className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-emerald-500/10"
          title="Keamanan"
          subtitle="Ganti PIN akun kamu"
          open={activeSection === "security"}
          onToggle={() => toggle("security")}
          testId="section-security"
        >
          <div className="space-y-3">
            <PinField label="PIN Lama" hint="Masukkan PIN yang sekarang" value={oldPin} onChange={setOldPin} show={showOldPin} onToggleShow={() => setShowOldPin(!showOldPin)} testId="input-old-pin" />
            <PinField label="PIN Baru" hint="Minimal 4 digit" value={newPin} onChange={setNewPin} show={showNewPin} onToggleShow={() => setShowNewPin(!showNewPin)} testId="input-new-pin" />
            <PinField label="Konfirmasi PIN Baru" hint="Ulangi PIN baru kamu" value={confirmPin} onChange={setConfirmPin} show={showConfirmPin} onToggleShow={() => setShowConfirmPin(!showConfirmPin)} testId="input-confirm-pin" />

            <div className="bg-white/3 border border-white/8 rounded-xl px-3 py-2">
              <p className="text-white/30 text-xs">PIN saat ini untuk demo: <span className="text-white/50 font-mono font-bold">1234</span></p>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSavePin}
              disabled={pinSaving}
              className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/25 font-bold rounded-2xl py-3 text-sm transition-colors flex items-center justify-center gap-2"
              data-testid="btn-save-pin"
            >
              {pinSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              {pinSaving ? "Menyimpan..." : "Simpan PIN Baru"}
            </motion.button>
          </div>
        </SectionCard>

        {/* ── ABOUT ── */}
        <SectionCard
          icon={<Info className="w-5 h-5 text-white/40" />}
          iconBg="bg-white/5"
          title="Tentang Aplikasi"
          subtitle="SiJemput v1.0.0"
          open={activeSection === "about"}
          onToggle={() => toggle("about")}
          testId="section-about"
        >
          <div className="space-y-2 text-sm">
            {[
              { label: "Versi Aplikasi", value: "1.0.0 (Build 2026041701)" },
              { label: "Nama Aplikasi", value: "SiJemput" },
              { label: "Pengembang", value: "Dinas Pendidikan Digital" },
              { label: "Platform", value: "Web App (PWA)" },
              { label: "Terakhir Diperbarui", value: "17 April 2026" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                <span className="text-white/40">{item.label}</span>
                <span className="text-white text-right text-xs font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ── LOGOUT ── */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="w-full bg-red-500/8 border border-red-500/20 rounded-3xl py-4 flex items-center justify-center gap-3 text-red-400 font-semibold hover:bg-red-500/15 transition-colors mt-2"
          data-testid="btn-logout"
        >
          <LogOut className="w-5 h-5" />
          Keluar dari Akun
        </motion.button>

        <p className="text-center text-white/15 text-xs pb-2">SiJemput · Versi 1.0.0</p>
      </div>
    </div>
  );
}

/* ── Reusable sub-components ── */

function SectionCard({
  icon, iconBg, title, subtitle, open, onToggle, children, testId,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  testId: string;
}) {
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-5 text-left"
        data-testid={testId}
      >
        <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm">{title}</p>
          <p className="text-white/40 text-xs mt-0.5 truncate">{subtitle}</p>
        </div>
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight className="w-4 h-4 text-white/30" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 border-t border-white/5">
              <div className="pt-4">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToggleRow({
  icon, label, description, value, onToggle, testId,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
  testId: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-white/3 border border-white/6 rounded-2xl px-4 py-3">
      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium">{label}</p>
        <p className="text-white/35 text-xs truncate">{description}</p>
      </div>
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={onToggle}
        className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 flex shrink-0 ${value ? "bg-primary justify-end" : "bg-white/10 justify-start"}`}
        data-testid={testId}
      >
        <motion.div layout className="w-5 h-5 bg-white rounded-full shadow-sm" />
      </motion.button>
    </div>
  );
}

function PinField({
  label, hint, value, onChange, show, onToggleShow, testId,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggleShow: () => void;
  testId: string;
}) {
  return (
    <div>
      <label className="text-white/50 text-xs mb-1 block">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder={hint}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-11 text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all tabular-nums tracking-widest"
          data-testid={testId}
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute inset-y-0 right-0 pr-4 flex items-center"
        >
          {show
            ? <EyeOff className="w-4 h-4 text-white/30 hover:text-white/60 transition-colors" />
            : <Eye className="w-4 h-4 text-white/30 hover:text-white/60 transition-colors" />}
        </button>
      </div>
    </div>
  );
}
