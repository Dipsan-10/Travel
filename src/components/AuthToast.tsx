import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { LogOut, Sparkles, X, CheckCircle2 } from "lucide-react";

export interface AuthToastData {
  type: "login" | "logout";
  title: string;
  message: string;
  username?: string;
  avatarUrl?: string;
}

interface AuthToastProps {
  toast: AuthToastData | null;
  onClose: () => void;
}

export default function AuthToast({ toast, onClose }: AuthToastProps) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isLogin = toast.type === "login";

  const toastContent = (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 450, damping: 30 }}
          className="fixed bottom-5 right-4 sm:right-6 z-[100080] max-w-[310px] sm:max-w-[330px] w-auto shadow-xl rounded-xl overflow-hidden border border-slate-700/80 bg-slate-900/95 text-white backdrop-blur-xl pointer-events-auto"
          id="auth-notification-toast"
        >
          {/* Top subtle accent line */}
          <div
            className={`h-0.5 w-full ${
              isLogin ? "bg-emerald-500/80" : "bg-slate-400/80"
            }`}
          />

          <div className="p-3 flex items-start gap-2.5 relative">
            {/* Left Icon or Avatar */}
            <div className="shrink-0 relative">
              {isLogin ? (
                toast.avatarUrl ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-400 shadow-xs">
                    <img
                      src={toast.avatarUrl}
                      alt={toast.username || "User"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-inner">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )
              ) : (
                <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-inner">
                  <LogOut className="w-4 h-4 stroke-[2.2]" />
                </div>
              )}

              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black border border-slate-900 ${
                  isLogin ? "bg-emerald-500 text-slate-950" : "bg-amber-400 text-slate-950"
                }`}
              >
                ✓
              </span>
            </div>

            {/* Content Text */}
            <div className="flex-1 pr-5 min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.25 rounded-full border ${
                    isLogin
                      ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                      : "bg-amber-950 text-amber-300 border-amber-800"
                  }`}
                >
                  {isLogin ? "SUCCESS" : "LOGOUT"}
                </span>
                {toast.username && (
                  <span className="text-[11px] font-semibold text-slate-300 truncate">
                    @{toast.username}
                  </span>
                )}
              </div>

              <h4 className="text-xs font-bold text-white mt-0.5 leading-tight">
                {toast.title}
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-tight font-medium">
                {toast.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="閉じる"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Animated Auto-Dismiss Progress Bar */}
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 2.2, ease: "linear" }}
            className={`h-0.5 ${isLogin ? "bg-emerald-400" : "bg-slate-400"}`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(toastContent, document.body);
}
