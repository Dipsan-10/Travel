import React from "react";
import { createPortal } from "react-dom";
import { LogOut, X, AlertTriangle, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import nepaLogo from "../assets/images/nepa_travel_hd_logo_1785218025055.jpg";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  username?: string;
}

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  username
}: LogoutConfirmModalProps) {
  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100050] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
          id="logout-modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col relative my-auto text-center"
            id="logout-modal-card"
          >
            {/* Top Red Gradient Stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              title="閉じる"
              id="close-logout-modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 sm:p-7 space-y-5">
              
              {/* Branded Icon Header */}
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-full h-full rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-black shadow-inner">
                  <LogOut className="w-8 h-8 stroke-[2.2]" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center border-2 border-white shadow-sm">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Text content */}
              <div className="space-y-2">
                <h3 className="font-sans font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                  ログアウトしますか？
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed max-w-xs mx-auto">
                  {username ? `${username} 様、` : ""}本当にアカウントからログアウトしてもよろしいですか？
                </p>
                <p className="text-[11px] text-slate-400 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  ※ マイ予約の確認や会員限定特典のご利用には再ログインが必要となります。
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-xl transition-all cursor-pointer text-xs sm:text-sm active:scale-98"
                  id="cancel-logout-btn"
                >
                  キャンセル
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer text-xs sm:text-sm active:scale-98 flex items-center justify-center gap-1.5"
                  id="confirm-logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                  <span>ログアウト</span>
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
