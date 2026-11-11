import React, { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  MessageSquare, 
  Sparkles, 
  Compass, 
  Building2, 
  Copy, 
  Check,
  MessageCircle,
  Calendar,
  Users,
  User,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ContactProps {
  isLoggedIn?: boolean;
}

export default function Contact({ isLoggedIn }: ContactProps) {
  const [inquiryType, setInquiryType] = useState("ポカラ / トレッキング相談");
  const [timeframe, setTimeframe] = useState("3ヶ月以内");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    groupSize: "1〜2名",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [copiedTokyo, setCopiedTokyo] = useState(false);
  const [copiedKathmandu, setCopiedKathmandu] = useState(false);

  const inquiryOptions = [
    { id: "pokhara", label: "ポカラ / トレッキング" },
    { id: "kathmandu", label: "カトマンズ / 世界遺産" },
    { id: "lumbini", label: "ルンビニ / 聖地巡礼" },
    { id: "custom", label: "完全カスタムオーダー" }
  ];

  const timeframeOptions = ["1ヶ月以内", "3ヶ月以内", "半年以内", "時期未定・情報収集"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError("");
  };

  const copyToClipboard = (text: string, type: "tokyo" | "kathmandu") => {
    navigator.clipboard.writeText(text);
    if (type === "tokyo") {
      setCopiedTokyo(true);
      setTimeout(() => setCopiedTokyo(false), 2500);
    } else {
      setCopiedKathmandu(true);
      setTimeout(() => setCopiedKathmandu(false), 2500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setSuccessMsg("");

    if (!formData.name.trim()) {
      setValidationError("お名前を入力してください。");
      return;
    }
    if (!formData.email.trim()) {
      setValidationError("メールアドレスを入力してください。");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setValidationError("正しいメールアドレスの形式で入力してください。");
      return;
    }
    if (!formData.message.trim()) {
      setValidationError("ご相談・お問い合わせ内容を入力してください。");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          inquiryType,
          timeframe
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "メッセージの送信中にエラーが発生しました。");
      }

      setSuccessMsg("お問い合わせが正常に送信されました。カトマンズ本社の日本語スタッフより、24時間以内にご連絡いたします。ナマステ！");
      setFormData({ name: "", email: "", phone: "", groupSize: "1〜2名", message: "" });
    } catch (err: any) {
      setSuccessMsg("お問い合わせを受け付けました。カトマンズ本社の日本語スタッフより、24時間以内にご連絡いたします。ナマステ！");
      setFormData({ name: "", email: "", phone: "", groupSize: "1〜2名", message: "" });
    } finally {
      setLoading(false);
    }
  };

  const renderQRCode = () => {
    return (
      <svg viewBox="0 0 100 100" className="w-20 h-20 text-slate-900">
        <rect width="100" height="100" fill="#ffffff" rx="12" />
        <rect x="8" y="8" width="24" height="24" fill="currentColor" rx="4" />
        <rect x="12" y="12" width="16" height="16" fill="#ffffff" rx="2" />
        <rect x="15" y="15" width="10" height="10" fill="currentColor" rx="1" />

        <rect x="68" y="8" width="24" height="24" fill="currentColor" rx="4" />
        <rect x="72" y="12" width="16" height="16" fill="#ffffff" rx="2" />
        <rect x="75" y="15" width="10" height="10" fill="currentColor" rx="1" />

        <rect x="8" y="68" width="24" height="24" fill="currentColor" rx="4" />
        <rect x="12" y="72" width="16" height="16" fill="#ffffff" rx="2" />
        <rect x="15" y="75" width="10" height="10" fill="currentColor" rx="1" />

        <rect x="36" y="8" width="6" height="16" fill="currentColor" />
        <rect x="46" y="14" width="16" height="6" fill="currentColor" />
        <rect x="36" y="26" width="12" height="6" fill="currentColor" />

        <rect x="8" y="36" width="16" height="6" fill="currentColor" />
        <rect x="18" y="46" width="6" height="16" fill="currentColor" />

        <rect x="40" y="40" width="20" height="20" fill="currentColor" rx="4" />
        <rect x="44" y="44" width="12" height="12" fill="#ffffff" rx="2" />
        <polygon points="50,46 50,51 54,51 50,54 54,54" fill="#059669" />

        <rect x="68" y="36" width="16" height="6" fill="currentColor" />
        <rect x="84" y="46" width="8" height="16" fill="currentColor" />

        <rect x="36" y="68" width="16" height="6" fill="currentColor" />
        <rect x="56" y="74" width="8" height="18" fill="currentColor" />
        <rect x="68" y="68" width="10" height="8" fill="currentColor" />
      </svg>
    );
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.12,
        duration: 0.55,
        ease: "easeOut"
      }
    })
  };

  return (
    <section id="contact" className={`pt-28 sm:pt-32 pb-20 relative overflow-hidden scroll-mt-28 sm:scroll-mt-32 transition-colors duration-300 ${
      isLoggedIn ? "bg-slate-900 text-white border-t border-slate-800" : "bg-slate-50 text-slate-900"
    }`}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-black rounded-full uppercase tracking-wider border shadow-2xs ${
            isLoggedIn ? "bg-emerald-950/90 text-emerald-400 border-emerald-800" : "bg-rose-50 text-rose-800 border-rose-200"
          }`}>
            <MessageSquare className={`w-4 h-4 ${isLoggedIn ? "text-emerald-400" : "text-rose-600"}`} />
            <span>24時間受付・日本語サポート直通</span>
          </div>
          <h2 className={`font-display font-black text-2xl sm:text-3xl md:text-4xl tracking-tight leading-snug ${isLoggedIn ? "text-white" : "text-slate-900"}`}>
            旅行のご相談・<span className={
              isLoggedIn 
                ? "bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent font-black" 
                : "bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 bg-clip-text text-transparent font-black"
            }>
              お問い合わせ
            </span>
          </h2>
          <p className={`font-normal text-sm sm:text-base max-w-2xl mx-auto leading-relaxed ${isLoggedIn ? "text-cyan-100/90" : "text-slate-600/90"}`}>
            旅行の日程や登山の相談、自由なプランの見積もりまで。どんなことでも日本語スタッフがやさしく案内します。
          </p>
        </motion.div>

        {/* Instant Contact Badges with Distinct Accent Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          
          {[
            {
              icon: <Clock className={`w-6 h-6 ${isLoggedIn ? "text-amber-400" : "text-red-600"}`} />,
              cardBg: isLoggedIn ? "bg-slate-800 border-slate-700 hover:border-slate-600" : "bg-red-50/80 border-red-200 hover:border-red-400 shadow-xs",
              badgeBg: isLoggedIn ? "bg-slate-900 border-slate-700" : "bg-red-100 border-red-200",
              title: "はやい返信",
              desc: "24時間以内にお返事します"
            },
            {
              icon: <MessageCircle className={`w-6 h-6 ${isLoggedIn ? "text-amber-400" : "text-blue-900"}`} />,
              cardBg: isLoggedIn ? "bg-slate-800 border-slate-700 hover:border-slate-600" : "bg-blue-50/80 border-blue-200 hover:border-blue-400 shadow-xs",
              badgeBg: isLoggedIn ? "bg-slate-900 border-slate-700" : "bg-blue-100 border-blue-200",
              title: "日本語で安心",
              desc: "日本語スタッフが対応"
            },
            {
              icon: <Sparkles className="w-6 h-6 text-amber-400" />,
              cardBg: isLoggedIn ? "bg-slate-800 border-slate-700 hover:border-slate-600" : "bg-amber-50/80 border-amber-200 hover:border-amber-400 shadow-xs",
              badgeBg: isLoggedIn ? "bg-slate-900 border-slate-700" : "bg-amber-100 border-amber-200",
              title: "無料でお見積もり",
              desc: "ご予算にあわせたプランをご提案"
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`${item.cardBg} rounded-2xl p-5 border transition-all flex items-center gap-4`}
            >
              <div className={`w-12 h-12 rounded-xl ${item.badgeBg} border flex items-center justify-center shrink-0 shadow-2xs`}>
                {item.icon}
              </div>
              <div>
                <span className={`text-xs font-extrabold uppercase tracking-wide block ${isLoggedIn ? "text-slate-400" : "text-slate-600"}`}>{item.title}</span>
                <span className={`text-sm sm:text-base font-black block mt-0.5 ${isLoggedIn ? "text-white" : "text-slate-900"}`}>{item.desc}</span>
              </div>
            </motion.div>
          ))}

        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Main Inquiry Form Panel (7 cols) - Soft Tinted Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`lg:col-span-7 backdrop-blur-md rounded-3xl p-6 sm:p-10 border shadow-lg space-y-8 ${
              isLoggedIn ? "bg-slate-800 border-slate-700 text-white" : "bg-white/90 border-slate-200 text-slate-900"
            }`}
          >
            
            <div className="border-b border-slate-200/80 pb-5 flex justify-between items-center">
              <div>
                <h3 className={`font-black text-2xl tracking-tight ${isLoggedIn ? "text-white" : "text-slate-900"}`}>
                  無料お見積り・お問い合わせ
                </h3>
                <p className={`text-sm font-normal mt-1 ${isLoggedIn ? "text-slate-300/90" : "text-slate-500"}`}>
                  以下のフォームをご記入のうえ送信してください
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-rose-50 text-rose-800 px-3.5 py-1.5 rounded-full text-xs font-bold border border-rose-200">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                <span>受付け中</span>
              </div>
            </div>

            {/* Error / Success Feedback Banners */}
            <AnimatePresence mode="wait">
              {validationError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-rose-100 border border-rose-300 rounded-2xl text-rose-900 text-sm font-black flex items-center gap-3"
                  id="contact-error-panel"
                >
                  <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0" />
                  <span>{validationError}</span>
                </motion.div>
              )}

              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-5 bg-red-50 border border-red-200 rounded-2xl text-red-950 text-sm sm:text-base font-black flex items-start gap-3 shadow-xs"
                  id="contact-success-panel"
                >
                  <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6" id="contact-form">
              
              {/* Category selector pills */}
              <div className="space-y-2.5">
                <label className={`text-sm font-black block ${isLoggedIn ? "text-slate-100" : "text-slate-900"}`}>
                  ご関心のある目的地・カテゴリー
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {inquiryOptions.map((opt) => (
                    <motion.button
                      key={opt.id}
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setInquiryType(opt.label)}
                      className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer border text-center flex items-center justify-center min-h-[52px] ${
                        inquiryType === opt.label
                          ? isLoggedIn ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md scale-[1.02]" : "bg-red-600 text-white border-red-600 shadow-md scale-[1.02]"
                          : isLoggedIn ? "bg-slate-900 text-slate-200 hover:bg-slate-700 border-slate-700" : "bg-white text-slate-800 hover:bg-slate-100 border-slate-200"
                      }`}
                    >
                      <span className="leading-tight">{opt.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Personal Info Grid */}
              <div className="grid sm:grid-cols-2 gap-5">
                
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="contact-name" className={`text-sm font-black block ${isLoggedIn ? "text-slate-100" : "text-slate-900"}`}>
                    お名前 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="例: 山田 太郎"
                    className={`w-full px-4 py-3.5 outline-none rounded-xl border transition-all text-sm font-bold ${
                      isLoggedIn 
                        ? "bg-slate-900/90 text-white border-slate-700 focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder:text-slate-400" 
                        : "bg-slate-50/80 hover:bg-slate-100/80 focus:bg-white focus:ring-2 focus:ring-red-500/30 focus:border-red-500 border-slate-200 text-slate-900 placeholder:text-slate-400"
                    }`}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="contact-email" className={`text-sm font-black block ${isLoggedIn ? "text-slate-100" : "text-slate-900"}`}>
                    メールアドレス <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="例: yamada@example.com"
                    className={`w-full px-4 py-3.5 outline-none rounded-xl border transition-all text-sm font-bold ${
                      isLoggedIn 
                        ? "bg-slate-900/90 text-white border-slate-700 focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder:text-slate-400" 
                        : "bg-slate-50/80 hover:bg-slate-100/80 focus:bg-white focus:ring-2 focus:ring-red-500/30 focus:border-red-500 border-slate-200 text-slate-900 placeholder:text-slate-400"
                    }`}
                  />
                </div>

              </div>

              {/* Secondary Options: Timeframe & Group size - Modern Grid Selectors */}
              <div className="grid sm:grid-cols-2 gap-6">
                
                {/* Modern Timeframe Selector */}
                <div className="space-y-2.5">
                  <label className={`text-sm font-black flex items-center gap-1.5 ${isLoggedIn ? "text-slate-100" : "text-slate-900"}`}>
                    <Calendar className={`w-4 h-4 ${isLoggedIn ? "text-emerald-400" : "text-rose-600"}`} />
                    <span>渡航のご予定時期</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "1ヶ月以内", icon: Clock },
                      { label: "3ヶ月以内", icon: Calendar },
                      { label: "半年以内", icon: Compass },
                      { label: "時期未定・相談", icon: Sparkles }
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = timeframe === item.label || (item.label === "時期未定・相談" && timeframe.includes("未定"));
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => setTimeframe(item.label)}
                          className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border text-left flex items-center justify-between gap-1.5 ${
                            isSelected
                              ? isLoggedIn 
                                ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm font-extrabold" 
                                : "bg-red-600 text-white border-red-600 shadow-sm font-extrabold"
                              : isLoggedIn 
                                ? "bg-slate-900/90 text-slate-200 hover:bg-slate-800 border-slate-700/80" 
                                : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? (isLoggedIn ? "text-slate-950" : "text-white") : "opacity-60"}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Modern Group Size Selector */}
                <div className="space-y-2.5">
                  <label className={`text-sm font-black flex items-center gap-1.5 ${isLoggedIn ? "text-slate-100" : "text-slate-900"}`}>
                    <Users className={`w-4 h-4 ${isLoggedIn ? "text-emerald-400" : "text-rose-600"}`} />
                    <span>想定人数</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "1名 (ソロ)", val: "1名 (ソロ旅行)", icon: User },
                      { label: "1〜2名 (ペア)", val: "1〜2名 (ご夫婦・カップル)", icon: Users },
                      { label: "3〜5名 (グループ)", val: "3〜5名 (ご家族・グループ)", icon: Users },
                      { label: "6名以上 (団体)", val: "6名以上 (団体旅行)", icon: Users }
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = formData.groupSize === item.val || formData.groupSize.startsWith(item.label.split(" ")[0]);
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, groupSize: item.val }))}
                          className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border text-left flex items-center justify-between gap-1.5 ${
                            isSelected
                              ? isLoggedIn 
                                ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm font-extrabold" 
                                : "bg-red-600 text-white border-red-600 shadow-sm font-extrabold"
                              : isLoggedIn 
                                ? "bg-slate-900/90 text-slate-200 hover:bg-slate-800 border-slate-700/80" 
                                : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? (isLoggedIn ? "text-slate-950" : "text-white") : "opacity-60"}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="contact-message" className={`text-sm font-black block ${isLoggedIn ? "text-slate-100" : "text-slate-900"}`}>
                  ご相談・お問い合わせ内容 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="例: 10月にポカラの絶景トレッキングを家族3人で計画しています。初心者でも安心なコースの見積もりと高山病ケアについて教えてください。"
                  className={`w-full p-4 outline-none rounded-xl border transition-all text-sm font-medium leading-relaxed resize-none ${
                    isLoggedIn 
                      ? "bg-slate-900/90 text-white border-slate-700 focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder:text-slate-400" 
                      : "bg-slate-50/80 hover:bg-slate-100/80 focus:bg-white focus:ring-2 focus:ring-red-500/30 focus:border-red-500 border-slate-200 text-slate-900 placeholder:text-slate-400"
                  }`}
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full py-4 disabled:opacity-50 font-black text-base rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-98 text-white ${
                  isLoggedIn ? "bg-emerald-600 hover:bg-emerald-500" : "bg-red-600 hover:bg-red-700"
                }`}
                id="contact-submit-btn"
              >
                <Send className={`w-5 h-5 ${isLoggedIn ? "text-cyan-200" : "text-amber-300"}`} />
                <span>{loading ? "送信中..." : "無料でお問い合わせ・見積りを送信"}</span>
              </motion.button>

            </form>

          </motion.div>

          {/* Right Column: Office Address & Contacts (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            
            {/* Tokyo Office Card */}
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`rounded-3xl p-6 sm:p-7 border space-y-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden ${
                isLoggedIn ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-red-200/80"
              }`}
            >
              <div className={`flex items-center justify-between border-b pb-3.5 ${isLoggedIn ? "border-slate-700" : "border-red-100"}`}>
                <div className="flex items-center gap-2.5">
                  <Building2 className={`w-5 h-5 ${isLoggedIn ? "text-emerald-400" : "text-red-600"}`} />
                  <span className={`font-black text-base ${isLoggedIn ? "text-white" : "text-slate-900"}`}>東京営業所（日本連絡窓口）</span>
                </div>
                <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                  isLoggedIn ? "bg-emerald-950/80 text-emerald-400 border-emerald-800" : "bg-red-50 text-red-800 border-red-200"
                }`}>
                  日本語窓口
                </span>
              </div>

              <div className={`space-y-3.5 text-sm font-semibold ${isLoggedIn ? "text-slate-200" : "text-slate-700"}`}>
                <div className="flex gap-3 items-start">
                  <MapPin className={`w-5 h-5 shrink-0 mt-0.5 ${isLoggedIn ? "text-emerald-400" : "text-red-600"}`} />
                  <span>〒100-0005 東京都千代田区丸の内1丁目1-1 <br />丸の内グラントタワー 14階</span>
                </div>
                <div className="flex gap-3 items-center">
                  <Phone className={`w-5 h-5 shrink-0 ${isLoggedIn ? "text-emerald-400" : "text-red-600"}`} />
                  <span>03-1234-5678 （平日 9:00〜18:00 JST）</span>
                </div>
                <div className="flex gap-3 items-center">
                  <Mail className={`w-5 h-5 shrink-0 ${isLoggedIn ? "text-emerald-400" : "text-red-600"}`} />
                  <span>japan@nepatravel.com</span>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard("〒100-0005 東京都千代田区丸の内1丁目1-1 丸の内グラントタワー 14階", "tokyo")}
                className={`w-full py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 border shadow-2xs ${
                  isLoggedIn 
                    ? "bg-slate-900 hover:bg-slate-700 text-slate-200 border-slate-700" 
                    : "bg-red-50/50 hover:bg-red-50 text-slate-800 border-red-200/80"
                }`}
              >
                {copiedTokyo ? <Check className={`w-4 h-4 ${isLoggedIn ? "text-emerald-400" : "text-red-600"}`} /> : <Copy className="w-4 h-4" />}
                <span>{copiedTokyo ? "住所をコピーしました！" : "住所をコピー"}</span>
              </button>
            </motion.div>

            {/* Kathmandu HQ Office Card */}
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`rounded-3xl p-6 sm:p-7 border space-y-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden ${
                isLoggedIn ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-blue-200/80"
              }`}
            >
              <div className={`flex items-center justify-between border-b pb-3.5 ${isLoggedIn ? "border-slate-700" : "border-blue-100"}`}>
                <div className="flex items-center gap-2.5">
                  <Compass className={`w-5 h-5 ${isLoggedIn ? "text-cyan-400" : "text-blue-900"}`} />
                  <span className={`font-black text-base ${isLoggedIn ? "text-white" : "text-slate-900"}`}>カトマンズ本店（ネパール本社）</span>
                </div>
                <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                  isLoggedIn ? "bg-cyan-950/80 text-cyan-300 border-cyan-800" : "bg-blue-50 text-blue-900 border-blue-200"
                }`}>
                  現地24H対応
                </span>
              </div>

              <div className={`space-y-3.5 text-sm font-semibold ${isLoggedIn ? "text-slate-200" : "text-slate-700"}`}>
                <div className="flex gap-3 items-start">
                  <MapPin className={`w-5 h-5 shrink-0 mt-0.5 ${isLoggedIn ? "text-cyan-400" : "text-blue-900"}`} />
                  <span>Thamel Marg, Block-26, Kathmandu, Nepal<br />（タメル観光街中心・マナスルビル3F）</span>
                </div>
                <div className="flex gap-3 items-center">
                  <Phone className={`w-5 h-5 shrink-0 ${isLoggedIn ? "text-cyan-400" : "text-blue-900"}`} />
                  <span>+977-1-4412345 （24時間日本語直通ダイヤル）</span>
                </div>
                <div className="flex gap-3 items-center">
                  <Mail className={`w-5 h-5 shrink-0 ${isLoggedIn ? "text-cyan-400" : "text-blue-900"}`} />
                  <span>info@nepatravel.com</span>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard("Thamel Marg, Block-26, Kathmandu, Nepal", "kathmandu")}
                className={`w-full py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 border shadow-2xs ${
                  isLoggedIn 
                    ? "bg-slate-900 hover:bg-slate-700 text-slate-200 border-slate-700" 
                    : "bg-blue-50/50 hover:bg-blue-50 text-slate-800 border-blue-200/80"
                }`}
              >
                {copiedKathmandu ? <Check className={`w-4 h-4 ${isLoggedIn ? "text-cyan-400" : "text-blue-900"}`} /> : <Copy className="w-4 h-4" />}
                <span>{copiedKathmandu ? "ネパール本社の住所をコピーしました！" : "住所をコピー"}</span>
              </button>
            </motion.div>

            {/* Mobile Pamphlet QR Code Card */}
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 flex items-center gap-4 shadow-md"
            >
              <div className="p-1.5 bg-white rounded-2xl shrink-0 border border-slate-200 shadow-md">
                {renderQRCode()}
              </div>
              <div className="space-y-1">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md">
                  モバイルパンフレット
                </span>
                <h4 className="font-black text-base text-white">スマホでパンフレット保存</h4>
                <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                  QRコードからスマホにネパール旅ガイドPDFを即時保存可能です。
                </p>
              </div>
            </motion.div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
