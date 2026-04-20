import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";

import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { PickupMethod } from "./pages/PickupMethod";
import { CallConfirm } from "./pages/CallConfirm";
import { OjekQR } from "./pages/OjekQR";
import { Monitoring } from "./pages/Monitoring";
import { Confirmation } from "./pages/Confirmation";
import { Settings } from "./pages/Settings";

const queryClient = new QueryClient();

type Screen =
  | "login"
  | "dashboard"
  | "pickup-method"
  | "call-confirm"
  | "ojek-qr"
  | "monitoring"
  | "confirmation"
  | "settings";

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [callNote, setCallNote] = useState("");

  const pageVariants = {
    initial: { x: 48, opacity: 0, scale: 0.98, filter: "blur(6px)" },
    animate: {
      x: 0, opacity: 1, scale: 1, filter: "blur(0px)",
      transition: { type: "spring", stiffness: 320, damping: 28, mass: 0.9 },
    },
    exit: {
      x: -32, opacity: 0, scale: 0.98, filter: "blur(4px)",
      transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
    },
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return <Login key="login" onLogin={() => setCurrentScreen("dashboard")} />;

      case "dashboard":
        return (
          <Dashboard
            key="dashboard"
            onCallConfirm={() => setCurrentScreen("pickup-method")}
            onAutoCall={() => {
              setCallNote("(Panggilan otomatis dari radius)");
              setCurrentScreen("monitoring");
            }}
            onGoToSettings={() => setCurrentScreen("settings")}
          />
        );

      case "pickup-method":
        return (
          <PickupMethod
            key="pickup-method"
            onOrtu={() => setCurrentScreen("call-confirm")}
            onOjek={() => setCurrentScreen("ojek-qr")}
            onBack={() => setCurrentScreen("dashboard")}
          />
        );

      case "call-confirm":
        return (
          <CallConfirm
            key="call-confirm"
            onConfirm={(note) => {
              setCallNote(note);
              setCurrentScreen("monitoring");
            }}
            onCancel={() => setCurrentScreen("pickup-method")}
          />
        );

      case "ojek-qr":
        return (
          <OjekQR
            key="ojek-qr"
            onBack={() => setCurrentScreen("pickup-method")}
            onDone={() => {
              setCallNote("(Penjemputan via ojek online — QR sudah dibuat)");
              setCurrentScreen("monitoring");
            }}
          />
        );

      case "monitoring":
        return (
          <Monitoring
            key="monitoring"
            callNote={callNote}
            onNavigateToConfirmation={() => setCurrentScreen("confirmation")}
            onBack={() => setCurrentScreen("dashboard")}
          />
        );

      case "confirmation":
        return (
          <Confirmation
            key="confirmation"
            onComplete={() => setCurrentScreen("login")}
            onBackToDashboard={() => setCurrentScreen("dashboard")}
          />
        );

      case "settings":
        return (
          <Settings
            key="settings"
            onBack={() => setCurrentScreen("dashboard")}
            onLogout={() => setCurrentScreen("login")}
          />
        );
    }
  };

  return (
    <div className="bg-[#05080F] min-h-[100dvh] flex justify-center w-full">
      <div className="w-full max-w-[430px] bg-[#0A0F1E] shadow-2xl sm:border-x sm:border-white/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
