import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Mail, 
  Lock, 
  User, 
  X, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { auth, googleAuthProvider } from "../lib/firebase.ts";
import { signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import nepaLogo from "../assets/images/nepa_travel_hd_logo_1785218025055.jpg";

export type AuthTab = "login" | "register" | "reset";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: "login" | "register";
  onLoginSuccess: (user: { username: string; email: string; token: string }) => void;
}

interface PasswordRules {
  minLength: boolean;
  hasUpper: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function evaluatePasswordRules(password: string): PasswordRules {
  return {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password),
  };
}

interface LocalUserAccount {
  username: string;
  email: string;
  passwordHash: string;
}

function getLocalRegisteredAccounts(): LocalUserAccount[] {
  try {
    const data = localStorage.getItem("nepa_registered_accounts");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalRegisteredAccount(account: LocalUserAccount) {
  try {
    const list = getLocalRegisteredAccounts();
    const normalizedEmail = account.email.trim().toLowerCase();
    const existingIdx = list.findIndex(a => a.email.trim().toLowerCase() === normalizedEmail);
    if (existingIdx >= 0) {
      list[existingIdx] = { ...account, email: normalizedEmail };
    } else {
      list.push({ ...account, email: normalizedEmail });
    }
    localStorage.setItem("nepa_registered_accounts", JSON.stringify(list));
  } catch (e) {
    console.error("Failed to persist local account:", e);
  }
}

export default function AuthModal({ isOpen, onClose, initialTab, onLoginSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<AuthTab>(initialTab);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    agreeTerms: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resetSuccessMsg, setResetSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Real-time password criteria evaluation
  const pwdRules = evaluatePasswordRules(formData.password);
  const isPwdFullyValid = pwdRules.minLength && pwdRules.hasUpper && pwdRules.hasNumber && pwdRules.hasSymbol;

  // Sync tab state with prop modifications from parent
  useEffect(() => {
    setTab(initialTab);
    setErrorMsg("");
    setResetSuccessMsg("");
  }, [initialTab, isOpen]);

  // ESC key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setErrorMsg("");
    setResetSuccessMsg("");
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setResetSuccessMsg("");
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleAuthProvider);
      const user = userCredential.user;
      const token = await user.getIdToken();

      // Synchronize authenticated user
      const response = await fetch("/api/auth/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "ユーザー同期に失敗しました。");
      }

      onLoginSuccess({
        username: result.user.username,
        email: result.user.email,
        token: token
      });
      onClose();
    } catch (err: any) {
      console.error("Google login error:", err);
      setErrorMsg(err.message || "Googleログイン中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setResetSuccessMsg("");

    const normalizedEmail = formData.email.trim().toLowerCase();

    if (!normalizedEmail) {
      setErrorMsg("登録されているメールアドレスを入力してください。");
      return;
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setErrorMsg("有効なメールアドレス形式を入力してください。");
      return;
    }

    setLoading(true);
    try {
      try {
        await sendPasswordResetEmail(auth, normalizedEmail);
      } catch (fbErr) {
        console.warn("Firebase password reset warning:", fbErr);
      }

      setResetSuccessMsg(`「${normalizedEmail}」宛にパスワード再設定用の案内メールを送信いたしました。メールをご確認の上、再設定を行ってください。`);
    } catch (err: any) {
      setErrorMsg(err.message || "パスワード再設定メールの送信に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "reset") {
      return handleResetPasswordSubmit(e);
    }

    setErrorMsg("");
    setResetSuccessMsg("");

    const normalizedEmail = formData.email.trim().toLowerCase();

    // 1. Common Email Format Validation
    if (!normalizedEmail) {
      setErrorMsg("メールアドレスを入力してください。");
      return;
    }
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setErrorMsg("有効なメールアドレス形式を入力してください（例：user@example.com）。");
      return;
    }

    // 2. Registration Specific Validations
    if (tab === "register") {
      if (!formData.username.trim()) {
        setErrorMsg("お名前 / ユーザー名を入力してください。");
        return;
      }

      // Strict Password Validation Check
      if (!pwdRules.minLength) {
        setErrorMsg("パスワードは8文字以上で設定してください。");
        return;
      }
      if (!pwdRules.hasUpper) {
        setErrorMsg("パスワードには英大文字（A〜Z）を少なくとも1文字含める必要があります。");
        return;
      }
      if (!pwdRules.hasNumber) {
        setErrorMsg("パスワードには数字（0〜9）を少なくとも1文字含める必要があります。");
        return;
      }
      if (!pwdRules.hasSymbol) {
        setErrorMsg("パスワードには記号（@, #, $, ! など）を少なくとも1文字含める必要があります。");
        return;
      }

      if (!formData.agreeTerms) {
        setErrorMsg("利用規約およびプライバシーポリシーに同意いただく必要があります。");
        return;
      }

      // Check if email already exists in local registered accounts
      const existingLocal = getLocalRegisteredAccounts().find(a => a.email.toLowerCase() === normalizedEmail);
      if (existingLocal) {
        setErrorMsg("このメールアドレスは既に登録されています。ログイン画面からログインしてください。");
        return;
      }
    }

    // 3. Login Specific Validations
    if (tab === "login") {
      if (!formData.password) {
        setErrorMsg("パスワードを入力してください。");
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = tab === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = tab === "login" 
        ? { email: normalizedEmail, password: formData.password }
        : { username: formData.username.trim(), email: normalizedEmail, password: formData.password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        // If server backend returns error for login, fallback to checking local accounts if offline/restart
        if (tab === "login") {
          const localMatch = getLocalRegisteredAccounts().find(a => a.email.toLowerCase() === normalizedEmail);
          if (localMatch) {
            if (localMatch.passwordHash === formData.password) {
              const userObj = {
                username: localMatch.username,
                email: localMatch.email,
                token: `local-token-${Date.now()}`
              };
              onLoginSuccess(userObj);
              onClose();
              setFormData({ username: "", email: "", password: "", agreeTerms: true });
              return;
            } else {
              throw new Error("パスワードが正しくありません。入力内容をご確認ください。");
            }
          } else {
            throw new Error(result.error || "このメールアドレスは登録されていません。まずは「新規会員登録」を行ってください。");
          }
        }
        throw new Error(result.error || "認証中に問題が発生しました。");
      }

      // Save registered user locally for session continuity
      if (tab === "register") {
        saveLocalRegisteredAccount({
          username: formData.username.trim(),
          email: normalizedEmail,
          passwordHash: formData.password
        });
      } else if (tab === "login") {
        saveLocalRegisteredAccount({
          username: result.user.username,
          email: normalizedEmail,
          passwordHash: formData.password
        });
      }

      // Success callback
      onLoginSuccess(result.user);
      onClose();
      setFormData({ username: "", email: "", password: "", agreeTerms: true });
    } catch (err: any) {
      setErrorMsg(err.message || "エラーが発生しました。しばらくしてからやり直してください。");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100000] flex items-center justify-center p-2.5 sm:p-6 py-4 sm:py-10 bg-slate-950/80 backdrop-blur-md overflow-y-auto no-scrollbar"
          id="auth-modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md sm:max-w-lg w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200/90 flex flex-col relative my-auto"
            id="auth-modal-card"
          >
            {/* Header Section - Modern Deep Slate Navy with Ambient Glow */}
            <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-4 sm:p-7 overflow-hidden border-b border-slate-800/80 shrink-0">
              
              {/* Background Glow */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3.5 sm:top-5 right-3.5 sm:right-5 p-1.5 sm:p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-all cursor-pointer shadow-xs z-20"
                title="閉じる (Esc)"
                id="close-auth-modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 sm:gap-3.5 mb-2 sm:mb-3 relative z-10 pr-8">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white p-1 shadow-md border border-slate-700 shrink-0 flex items-center justify-center">
                  <img 
                    src={nepaLogo} 
                    alt="Nepa Travel" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-amber-400">
                      Nepa Travel
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-500" />
                    <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400">ネパトラベル</span>
                  </div>
                  <h3 className="font-display font-black text-lg sm:text-2xl text-white tracking-tight leading-tight mt-0.5">
                    {tab === "login" && "アカウントへログイン"}
                    {tab === "register" && "新規会員登録"}
                    {tab === "reset" && "パスワードの再設定"}
                  </h3>
                </div>
              </div>

              <p className="text-slate-300 text-[11px] sm:text-xs font-medium leading-normal sm:leading-relaxed max-w-sm relative z-10 hidden sm:block">
                {tab === "login" && "ご登録いただいたメールアドレスとパスワードを入力してください。"}
                {tab === "register" && "安全なアカウント登録のため、英大文字・数字・記号を含むパスワードをご設定ください。"}
                {tab === "reset" && "登録されているメールアドレスに、パスワード再設定用の案内リンクをお送りします。"}
              </p>

              {/* Segmented Tab Switcher */}
              {tab !== "reset" ? (
                <div className="mt-3 sm:mt-5 p-1.5 bg-slate-950/90 rounded-2xl border border-slate-800 flex items-center relative z-10 shadow-inner">
                  <button
                    onClick={() => {
                      setTab("login");
                      setErrorMsg("");
                      setResetSuccessMsg("");
                    }}
                    className={`flex-1 py-2.5 sm:py-3 text-center font-black text-xs sm:text-sm transition-all rounded-xl relative z-10 cursor-pointer flex items-center justify-center gap-2 ${
                      tab === "login" ? "text-slate-950 shadow-md font-black" : "text-slate-400 hover:text-white"
                    }`}
                    id="tab-btn-login"
                  >
                    {tab === "login" && (
                      <motion.div
                        layoutId="auth-active-tab-bg"
                        className="absolute inset-0 bg-white rounded-xl z-[-1]"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>ログイン</span>
                  </button>

                  <button
                    onClick={() => {
                      setTab("register");
                      setErrorMsg("");
                      setResetSuccessMsg("");
                    }}
                    className={`flex-1 py-2.5 sm:py-3 text-center font-black text-xs sm:text-sm transition-all rounded-xl relative z-10 cursor-pointer flex items-center justify-center gap-2 ${
                      tab === "register" ? "text-slate-950 shadow-md font-black" : "text-slate-400 hover:text-white"
                    }`}
                    id="tab-btn-register"
                  >
                    {tab === "register" && (
                      <motion.div
                        layoutId="auth-active-tab-bg"
                        className="absolute inset-0 bg-white rounded-xl z-[-1]"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>新規会員登録</span>
                  </button>
                </div>
              ) : (
                <div className="mt-3 sm:mt-4 relative z-10">
                  <button
                    type="button"
                    onClick={() => {
                      setTab("login");
                      setErrorMsg("");
                      setResetSuccessMsg("");
                    }}
                    className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-white transition-colors cursor-pointer bg-slate-800/90 border border-slate-700 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>ログイン画面に戻る</span>
                  </button>
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-7 pb-8 sm:pb-10 space-y-4 sm:space-y-5 bg-white overflow-y-auto flex-1 no-scrollbar">

              {/* Error Notification Banner */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-3.5 bg-red-50 border-2 border-red-300 rounded-2xl text-red-800 text-xs sm:text-sm font-bold flex items-start gap-2.5 shadow-2xs"
                    id="auth-error-pane"
                  >
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reset Success Banner */}
              <AnimatePresence>
                {resetSuccessMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-emerald-900 text-xs sm:text-sm font-medium flex items-start gap-3 shadow-2xs"
                    id="auth-reset-success-pane"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-black text-emerald-950 text-sm sm:text-base">案内メールを送信しました</p>
                      <p className="leading-relaxed text-slate-800 font-bold">{resetSuccessMsg}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Auth / Reset Form */}
              <form onSubmit={handleSubmit} className="space-y-4" id="auth-modal-form">
                
                {/* Username field (Register tab only) */}
                {tab === "register" && (
                  <div className="space-y-1.5">
                    <label htmlFor="auth-username" className="text-slate-900 text-xs sm:text-sm font-black tracking-normal block flex items-center justify-between">
                      <span>お名前 / ユーザー名 <span className="text-rose-600 font-extrabold">*</span></span>
                      <span className="text-[10px] font-bold text-slate-500">本名またはニックネーム</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-focus-within:bg-indigo-600 group-focus-within:text-white transition-all shadow-xs">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="auth-username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="例：ネパール太郎"
                        className="w-full pl-13 pr-4 py-3 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-600 outline-none rounded-2xl border-2 border-slate-300 transition-all text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 shadow-2xs"
                      />
                    </div>
                  </div>
                )}

                {/* Email field */}
                <div className="space-y-1.5">
                  <label htmlFor="auth-email" className="text-slate-900 text-xs sm:text-sm font-black tracking-normal block flex items-center justify-between">
                    <span>メールアドレス <span className="text-rose-600 font-extrabold">*</span></span>
                    <span className="text-[10px] font-bold text-slate-500">通知・予約確認用</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-focus-within:bg-indigo-600 group-focus-within:text-white transition-all shadow-xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      id="auth-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="例：yamada@example.com"
                      className="w-full pl-13 pr-4 py-3 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-600 outline-none rounded-2xl border-2 border-slate-300 transition-all text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Password field (Login & Register tabs only) */}
                {tab !== "reset" && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="auth-password" className="text-slate-900 text-xs sm:text-sm font-black tracking-normal block">
                        パスワード <span className="text-rose-600 font-extrabold">*</span>
                      </label>
                      {tab === "login" && (
                        <button
                          type="button"
                          onClick={() => {
                            setTab("reset");
                            setErrorMsg("");
                            setResetSuccessMsg("");
                          }}
                          className="text-[11px] sm:text-xs font-black text-indigo-700 hover:text-indigo-900 transition-colors cursor-pointer underline decoration-indigo-300 underline-offset-2"
                        >
                          パスワードをお忘れの方
                        </button>
                      )}
                    </div>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-focus-within:bg-indigo-600 group-focus-within:text-white transition-all shadow-xs">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="auth-password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder={tab === "register" ? "8文字以上・大文字・数字・記号" : "パスワードを入力"}
                        className="w-full pl-13 pr-12 py-3 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-600 outline-none rounded-2xl border-2 border-slate-300 transition-all text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 p-1.5 cursor-pointer transition-colors rounded-lg hover:bg-slate-100"
                        title={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Interactive Real-Time Password Requirements Visualizer (Register tab only) */}
                    {tab === "register" && (
                      <div className="mt-2.5 p-3.5 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-lg space-y-2.5">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-[11px] font-black text-slate-200 flex items-center gap-1.5">
                            <ShieldCheck className={`w-4 h-4 ${isPwdFullyValid ? "text-emerald-400" : "text-amber-400"}`} />
                            パスワードのセキュリティ要件:
                          </span>
                          {isPwdFullyValid ? (
                            <span className="text-[10px] font-black text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                              <Sparkles className="w-3 h-3 text-emerald-400" /> 強度合格
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-300/90 bg-amber-950/50 border border-amber-500/30 px-2 py-0.5 rounded-full">未達成</span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-[11px] font-extrabold">
                          <div className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                            pwdRules.minLength 
                              ? "bg-emerald-950/70 text-emerald-200 border-emerald-500/60 shadow-xs" 
                              : "bg-slate-800/60 text-slate-400 border-slate-700/80"
                          }`}>
                            <CheckCircle2 className={`w-4 h-4 shrink-0 ${pwdRules.minLength ? "text-emerald-400" : "text-slate-600"}`} />
                            <span>8文字以上</span>
                          </div>

                          <div className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                            pwdRules.hasUpper 
                              ? "bg-emerald-950/70 text-emerald-200 border-emerald-500/60 shadow-xs" 
                              : "bg-slate-800/60 text-slate-400 border-slate-700/80"
                          }`}>
                            <CheckCircle2 className={`w-4 h-4 shrink-0 ${pwdRules.hasUpper ? "text-emerald-400" : "text-slate-600"}`} />
                            <span>英大文字 (A〜Z)</span>
                          </div>

                          <div className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                            pwdRules.hasNumber 
                              ? "bg-emerald-950/70 text-emerald-200 border-emerald-500/60 shadow-xs" 
                              : "bg-slate-800/60 text-slate-400 border-slate-700/80"
                          }`}>
                            <CheckCircle2 className={`w-4 h-4 shrink-0 ${pwdRules.hasNumber ? "text-emerald-400" : "text-slate-600"}`} />
                            <span>数字 (0〜9)</span>
                          </div>

                          <div className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                            pwdRules.hasSymbol 
                              ? "bg-emerald-950/70 text-emerald-200 border-emerald-500/60 shadow-xs" 
                              : "bg-slate-800/60 text-slate-400 border-slate-700/80"
                          }`}>
                            <CheckCircle2 className={`w-4 h-4 shrink-0 ${pwdRules.hasSymbol ? "text-emerald-400" : "text-slate-600"}`} />
                            <span>記号 (@, #, $ 等)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Terms agreement checkbox (Register tab only) */}
                {tab === "register" && (
                  <div className="flex items-start gap-2.5 pt-1 text-[11px] sm:text-xs text-slate-800 font-bold bg-slate-50 p-3 rounded-2xl border border-slate-200/90">
                    <input
                      type="checkbox"
                      id="agree-checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="mt-0.5 w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-600 cursor-pointer shrink-0"
                    />
                    <label htmlFor="agree-checkbox" className="leading-tight cursor-pointer select-none">
                      「ネパ・トラベル」の<span className="text-indigo-900 font-black underline decoration-indigo-300">利用規約</span>およびプライバシーポリシーに同意します。
                    </label>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 hover:from-slate-900 hover:to-indigo-900 active:scale-[0.99] text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex justify-center items-center gap-2 text-sm tracking-wide border border-slate-800"
                  id="auth-submit-btn"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>処理中...</span>
                    </>
                  ) : tab === "reset" ? (
                    <>
                      <RotateCcw className="w-4 h-4 text-amber-300" />
                      <span>再設定用メールを送信する</span>
                    </>
                  ) : (
                    <>
                      <span>{tab === "login" ? "ログインする" : "新規アカウントを作成する"}</span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>

              </form>

              {/* Divider (Only in login/register tab) */}
              {tab !== "reset" && (
                <>
                  <div className="relative flex py-0.5 items-center">
                    <div className="flex-grow border-t border-slate-200/90"></div>
                    <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">または</span>
                    <div className="flex-grow border-t border-slate-200/90"></div>
                  </div>

                  {/* Google OAuth Login Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-2.5 sm:py-3 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 active:scale-[0.99] text-slate-800 font-bold rounded-2xl shadow-2xs transition-all flex justify-center items-center gap-2.5 cursor-pointer text-xs"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.28 1.5-.1.113-2.5v2.08h3.31c1.94-1.78 3.07-4.4 3.07-7.43z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.88-3.02c-1.08.72-2.45 1.16-4.08 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.13C3.26 21.84 7.31 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.27 14.27a7.17 7.17 0 010-4.54V6.6H1.29a11.94 11.94 0 000 10.8l3.98-3.13z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.16 1.29 5.4l3.98 3.13c.95-2.85 3.6-4.96 6.72-4.96z"
                      />
                    </svg>
                    <span>Googleアカウントでログイン</span>
                  </button>
                </>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
