import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Globe, 
  FileText, 
  Check, 
  Edit3, 
  Save, 
  Sparkles, 
  Award, 
  History, 
  Compass, 
  PhoneCall, 
  LogOut, 
  X, 
  Camera, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  Smile, 
  RefreshCw,
  Sliders
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import LogoutConfirmModal from "./LogoutConfirmModal";
import { IMAGES } from "../data";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { 
    username: string; 
    email: string; 
    phone?: string; 
    bio?: string; 
    country?: string; 
    avatarUrl?: string; 
  } | null;
  onLogout: () => void;
  onOpenBooking: (tab: "book" | "history") => void;
  onUpdateAvatar?: (avatarUrl: string) => void;
  onUpdateProfile?: (updated: Partial<{ username: string; email: string; phone?: string; bio?: string; country?: string; avatarUrl?: string }>) => void;
}

// Scenery Carousel background images for the profile header using actual tour images
const HEADER_CAROUSEL_IMAGES = [
  { id: 1, url: IMAGES.pokhara },
  { id: 2, url: IMAGES.hero },
  { id: 3, url: IMAGES.kathmandu },
  { id: 4, url: IMAGES.everestClimb },
  { id: 5, url: IMAGES.upperMustang }
];

// Preset avatars for quick selection
const PRESET_AVATARS = [
  { id: "everest", name: "エベレスト", url: IMAGES.everestClimb },
  { id: "pokhara", name: "ポカラレイク", url: IMAGES.pokhara },
  { id: "culture", name: "カトマンズ", url: IMAGES.kathmandu },
  { id: "mustang", name: "ムスタン", url: IMAGES.upperMustang },
  { id: "badimalika", name: "バディマリカ", url: IMAGES.badimalika }
];

export default function UserProfileModal({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onOpenBooking,
  onUpdateAvatar,
  onUpdateProfile
}: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "preferences" | "actions">("info");
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // Background carousel image index
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Editable Form state
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    phone: "",
    country: "日本 (Japan)",
    bio: "",
    avatarUrl: ""
  });

  // Preference toggles state
  const [preferences, setPreferences] = useState({
    japaneseGuide: true,
    vegFood: false,
    insuranceSupport: true,
    emailOffers: true
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-play background image carousel
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % HEADER_CAROUSEL_IMAGES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Sync state whenever currentUser opens or changes
  useEffect(() => {
    if (currentUser) {
      setFormState({
        username: currentUser.username || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "+81 90-1234-5678",
        country: currentUser.country || "日本 (Japan)",
        bio: currentUser.bio || "ヒマラヤの絶景とポカラの自然を楽しむネパール旅行を計画中！",
        avatarUrl: currentUser.avatarUrl || ""
      });
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  // Custom photo upload handler with canvas compression to prevent QuotaExceededError
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawDataUrl = event.target?.result as string;
        if (!rawDataUrl) return;

        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 300; // 300px max for avatar, produces lightweight ~20KB string

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedAvatar = canvas.toDataURL("image/jpeg", 0.82);

            setFormState(prev => ({ ...prev, avatarUrl: compressedAvatar }));
            if (onUpdateAvatar) onUpdateAvatar(compressedAvatar);
            setToastMsg("プロフィール写真を変更しました ✨");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
          }
        };
        img.onerror = () => {
          setToastMsg("画像の読み込みに失敗しました");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        };
        img.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  // Select preset avatar
  const handleSelectPresetAvatar = (url: string) => {
    setFormState(prev => ({ ...prev, avatarUrl: url }));
    if (onUpdateAvatar) onUpdateAvatar(url);
    setShowAvatarPicker(false);
    setToastMsg("アバター画像を変更しました！");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Remove custom avatar photo
  const handleRemoveAvatar = () => {
    setFormState(prev => ({ ...prev, avatarUrl: "" }));
    if (onUpdateAvatar) onUpdateAvatar("");
    setToastMsg("プロフィール写真をリセットしました");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Save profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.username.trim() || !formState.email.trim()) {
      setToastMsg("ユーザー名とメールアドレスを入力してください");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    setSaving(true);
    setTimeout(() => {
      if (onUpdateProfile) {
        onUpdateProfile({
          username: formState.username.trim(),
          email: formState.email.trim(),
          phone: formState.phone.trim(),
          country: formState.country.trim(),
          bio: formState.bio.trim(),
          avatarUrl: formState.avatarUrl
        });
      }
      setSaving(false);
      setIsEditing(false);
      setToastMsg("プロフィールを更新しました！ ✨");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    }, 350);
  };

  const modalContent = (
    <>
      <AnimatePresence>
        {isOpen && (
          <div 
            className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-6 py-6 sm:py-10 bg-slate-950/85 backdrop-blur-md overflow-y-auto no-scrollbar"
            id="profile-modal-overlay"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col relative my-auto max-h-[85vh] sm:max-h-[88vh]"
              id="profile-modal-card"
            >
              {/* Solid Top Accent Line (Solid Crimson Red) */}
              <div className="h-2 w-full bg-[#8B0000] shrink-0" />

              {/* Toast Feedback Notification Banner */}
              <AnimatePresence>
                {showToast && (
                  <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    className="absolute top-4 left-4 right-16 z-50 bg-slate-900 text-amber-300 border border-amber-400/50 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold backdrop-blur-md"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{toastMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hero Banner Header with Animated Scenery Carousel */}
              <div className="relative bg-slate-950 text-white p-3.5 sm:p-6 overflow-hidden shrink-0">
                
                {/* Background Image Carousel Slider - High Clarity Background Picture */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={HEADER_CAROUSEL_IMAGES[carouselIndex].url}
                      src={HEADER_CAROUSEL_IMAGES[carouselIndex].url}
                      alt="Nepal Tour scenery"
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.04 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {/* Gradient Overlay for Maximum Scenery Picture Clarity and Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/30" />
                </div>

                {/* Top Right Header Control: Close Button Only */}
                <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-20">
                  <button
                    onClick={onClose}
                    className="p-1.5 sm:p-2.5 rounded-xl bg-slate-900/90 hover:bg-black text-white border-2 border-slate-700 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                    title="閉じる"
                    id="close-profile-modal"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Minimalist Carousel Slide Indicators (Bottom Right Original Position) */}
                <div className="absolute bottom-2.5 right-3 sm:bottom-3 sm:right-4 z-20 flex items-center gap-1 bg-black/75 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
                  {HEADER_CAROUSEL_IMAGES.map((img, idx) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setCarouselIndex(idx)}
                      className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer ${
                        idx === carouselIndex ? "w-4 sm:w-5 bg-amber-400" : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/90"
                      }`}
                    />
                  ))}
                </div>

                {/* Main User Avatar & Info Layout */}
                <div className="relative z-10 flex items-start gap-3 sm:gap-4 pr-16 sm:pr-24 pt-1">
                  <div className="relative shrink-0 group">
                    {/* High Contrast Solid Avatar Ring */}
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border-2 sm:border-3 border-amber-400 p-0.5 sm:p-1 shadow-xl relative overflow-hidden flex items-center justify-center cursor-pointer"
                      onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                    >
                      {formState.avatarUrl ? (
                        <img 
                          src={formState.avatarUrl} 
                          alt={formState.username} 
                          className="w-full h-full rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center font-black text-lg sm:text-2xl text-amber-300">
                          {formState.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </motion.div>

                    {/* Camera Upload Badge */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 bg-red-700 hover:bg-red-800 p-1 sm:p-1.5 rounded-full border-2 border-slate-900 text-white shadow-lg hover:scale-110 active:scale-90 transition-all cursor-pointer"
                      title="写真をアップロード"
                      id="upload-avatar-btn"
                    >
                      <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="user-avatar-file-input"
                    />
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-950 bg-amber-400 border border-amber-300 px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs shrink-0">
                        <Sparkles className="w-3 h-3 text-slate-950 shrink-0" /> VIP Platinum
                      </span>
                      <span className="text-[10px] sm:text-xs font-black text-white bg-slate-800/90 border border-slate-600 px-1.5 py-0.5 rounded-md shrink-0">
                        ネパール公式会員
                      </span>
                    </div>

                    <h3 className="font-display font-black text-base sm:text-2xl text-white tracking-tight mt-1 flex items-baseline gap-1 drop-shadow-md min-w-0">
                      <span className="truncate max-w-[150px] sm:max-w-[260px]">{formState.username}</span>
                      <span className="text-xs sm:text-sm font-bold text-amber-300 shrink-0">様</span>
                    </h3>

                    <p className="text-slate-100 text-xs sm:text-sm font-bold flex items-center gap-1.5 mt-0.5 drop-shadow-sm min-w-0">
                      <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{formState.email}</span>
                    </p>

                    <div className="flex items-center gap-1.5 sm:gap-2 mt-2 flex-wrap">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[10px] sm:text-xs font-black text-sky-200 hover:text-white flex items-center gap-1 cursor-pointer transition-colors bg-sky-900/90 hover:bg-sky-800 border border-sky-500/80 px-2 py-1 rounded-lg shrink-0"
                      >
                        <Upload className="w-3 h-3 shrink-0" /> 写真を変更
                      </button>
                      <button
                        onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                        className="text-[10px] sm:text-xs font-black text-amber-200 hover:text-white flex items-center gap-1 cursor-pointer transition-colors bg-amber-900/90 hover:bg-amber-800 border border-amber-500/80 px-2 py-1 rounded-lg shrink-0"
                      >
                        <Smile className="w-3 h-3 shrink-0" /> アバター選択
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preset Avatar Selection Grid Dropdown */}
                <AnimatePresence>
                  {showAvatarPicker && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="relative z-20 mt-3 sm:mt-4 pt-2.5 border-t border-white/20 overflow-hidden"
                    >
                      <p className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1">
                        <Smile className="w-4 h-4 text-amber-300" /> サンプルアバターを選択:
                      </p>
                      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                        {PRESET_AVATARS.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectPresetAvatar(preset.url)}
                            className="group flex flex-col items-center gap-0.5 sm:gap-1 p-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/20 transition-all cursor-pointer hover:scale-105"
                          >
                            <img src={preset.url} alt={preset.name} className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg object-cover" />
                            <span className="text-[9px] sm:text-[10px] font-black text-slate-200 group-hover:text-amber-300 truncate w-full text-center">
                              {preset.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation Tabs Bar - High Visibility Typography */}
              <div className="bg-slate-100 border-b-2 border-slate-200 px-1.5 sm:px-3 pt-2 flex items-center justify-between sm:justify-around shrink-0 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`relative pb-2.5 px-2 sm:px-3 text-[11px] sm:text-xs md:text-sm font-black transition-colors flex items-center gap-1 sm:gap-1.5 shrink-0 cursor-pointer whitespace-nowrap ${
                    activeTab === "info" ? "text-red-700 font-black" : "text-slate-600 hover:text-slate-900"
                  }`}
                  id="tab-btn-info"
                >
                  <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 shrink-0" />
                  <span>基本情報・編集</span>
                  {activeTab === "info" && (
                    <motion.div
                      layoutId="profileTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-full"
                    />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("preferences")}
                  className={`relative pb-2.5 px-2 sm:px-3 text-[11px] sm:text-xs md:text-sm font-black transition-colors flex items-center gap-1 sm:gap-1.5 shrink-0 cursor-pointer whitespace-nowrap ${
                    activeTab === "preferences" ? "text-red-700 font-black" : "text-slate-600 hover:text-slate-900"
                  }`}
                  id="tab-btn-preferences"
                >
                  <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-700 shrink-0" />
                  <span>旅行好み・ステータス</span>
                  {activeTab === "preferences" && (
                    <motion.div
                      layoutId="profileTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-full"
                    />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("actions")}
                  className={`relative pb-2.5 px-2 sm:px-3 text-[11px] sm:text-xs md:text-sm font-black transition-colors flex items-center gap-1 sm:gap-1.5 shrink-0 cursor-pointer whitespace-nowrap ${
                    activeTab === "actions" ? "text-red-700 font-black" : "text-slate-600 hover:text-slate-900"
                  }`}
                  id="tab-btn-actions"
                >
                  <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                  <span>ショートカット</span>
                  {activeTab === "actions" && (
                    <motion.div
                      layoutId="profileTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-full"
                    />
                  )}
                </button>
              </div>

              {/* Scrollable Modal Body */}
              <div className="p-5 sm:p-6 pb-8 sm:pb-12 space-y-5 bg-slate-50/70 overflow-y-auto flex-1 no-scrollbar">
                <AnimatePresence mode="wait">
                  
                  {/* TAB 1: User Info & Editable Details */}
                  {activeTab === "info" && (
                    <motion.div
                      key="tab-info"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <UserIcon className="w-4 h-4 text-red-600" />
                          <span>会員プロフィール詳細</span>
                        </h4>

                        {!isEditing ? (
                          <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md hover:scale-102"
                            id="btn-enable-edit-profile"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>編集する</span>
                          </button>
                        ) : (
                          <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> 編集モード中
                          </span>
                        )}
                      </div>

                      <form onSubmit={handleSaveProfile} className="space-y-4">
                        {/* Username Input */}
                        <div>
                          <label className="block text-xs sm:text-sm font-black text-slate-900 mb-1 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 shrink-0" /> ユーザー名（お名前）
                            </span>
                            <span className="text-[11px] sm:text-xs text-red-600 font-black">*必須</span>
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              required
                              value={formState.username}
                              onChange={(e) => setFormState({ ...formState, username: e.target.value })}
                              className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-red-300 rounded-xl sm:rounded-2xl text-xs sm:text-base font-bold text-slate-900 focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-100 transition-all shadow-xs"
                              placeholder="例: dipsan (山田 太郎)"
                              id="profile-input-username"
                            />
                          ) : (
                            <div className="p-2.5 sm:p-3.5 bg-white border-2 border-slate-200/90 rounded-xl sm:rounded-2xl text-xs sm:text-base font-extrabold text-slate-900 shadow-xs">
                              {formState.username}
                            </div>
                          )}
                        </div>

                        {/* Email Input */}
                        <div>
                          <label className="block text-xs sm:text-sm font-black text-slate-900 mb-1 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" /> メールアドレス
                            </span>
                            <span className="text-[11px] sm:text-xs text-red-600 font-black">*必須</span>
                          </label>
                          {isEditing ? (
                            <input
                              type="email"
                              required
                              value={formState.email}
                              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                              className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-red-300 rounded-xl sm:rounded-2xl text-xs sm:text-base font-bold text-slate-900 focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-100 transition-all shadow-xs"
                              placeholder="youremail@example.com"
                              id="profile-input-email"
                            />
                          ) : (
                            <div className="p-2.5 sm:p-3.5 bg-white border-2 border-slate-200/90 rounded-xl sm:rounded-2xl text-xs sm:text-base font-extrabold text-slate-900 shadow-xs break-all">
                              {formState.email}
                            </div>
                          )}
                        </div>

                        {/* Phone Number Input */}
                        <div>
                          <label className="block text-xs sm:text-sm font-black text-slate-900 mb-1 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" /> 電話番号 (緊急連絡先)
                            </span>
                            <span className="text-[11px] sm:text-xs text-slate-500 font-bold">任意</span>
                          </label>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={formState.phone}
                              onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                              className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-slate-300 rounded-xl sm:rounded-2xl text-xs sm:text-base font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all shadow-xs"
                              placeholder="+81 90-1234-5678"
                              id="profile-input-phone"
                            />
                          ) : (
                            <div className="p-2.5 sm:p-3.5 bg-white border-2 border-slate-200/90 rounded-xl sm:rounded-2xl text-xs sm:text-base font-extrabold text-slate-900 shadow-xs">
                              {formState.phone || "未設定"}
                            </div>
                          )}
                        </div>

                        {/* Country / Region */}
                        <div>
                          <label className="block text-xs sm:text-sm font-black text-slate-900 mb-1 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" /> 居住国・地域
                            </span>
                          </label>
                          {isEditing ? (
                            <select
                              value={formState.country}
                              onChange={(e) => setFormState({ ...formState, country: e.target.value })}
                              className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-slate-300 rounded-xl sm:rounded-2xl text-xs sm:text-base font-bold text-slate-900 focus:outline-none focus:border-blue-600 transition-all cursor-pointer shadow-xs"
                              id="profile-input-country"
                            >
                              <option value="日本 (Japan)">🇯🇵 日本 (Japan)</option>
                              <option value="ネパール (Nepal)">🇳🇵 ネパール (Nepal)</option>
                              <option value="アメリカ (USA)">🇺🇸 アメリカ (USA)</option>
                              <option value="その他 (Other)">🌐 その他 (Other)</option>
                            </select>
                          ) : (
                            <div className="p-2.5 sm:p-3.5 bg-white border-2 border-slate-200/90 rounded-xl sm:rounded-2xl text-xs sm:text-base font-extrabold text-slate-900 shadow-xs">
                              {formState.country}
                            </div>
                          )}
                        </div>

                        {/* Bio / Travel Note */}
                        <div>
                          <label className="block text-xs sm:text-sm font-black text-slate-900 mb-1 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 shrink-0" /> 旅の希望・メモ (Bio)
                            </span>
                          </label>
                          {isEditing ? (
                            <textarea
                              rows={2}
                              value={formState.bio}
                              onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                              className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-slate-300 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 transition-all shadow-xs"
                              placeholder="例: ポカラのレイクサイドとエベレストの朝日を撮影したいです。"
                              id="profile-input-bio"
                            />
                          ) : (
                            <div className="p-2.5 sm:p-3.5 bg-white border-2 border-slate-200/90 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-slate-800 leading-relaxed shadow-xs">
                              {formState.bio || "ネパール旅行のメモはありません"}
                            </div>
                          )}
                        </div>

                        {/* Submit Save Controls */}
                        {isEditing && (
                          <div className="pt-2 flex items-center gap-3">
                            <button
                              type="submit"
                              disabled={saving}
                              className="flex-1 py-3.5 bg-red-700 hover:bg-red-800 text-white font-black rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 text-base active:scale-98"
                              id="profile-save-btn"
                            >
                              {saving ? (
                                <RefreshCw className="w-5 h-5 animate-spin" />
                              ) : (
                                <Save className="w-5 h-5" />
                              )}
                              <span>変更内容を保存する</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setIsEditing(false);
                                if (currentUser) {
                                  setFormState({
                                    username: currentUser.username || "",
                                    email: currentUser.email || "",
                                    phone: currentUser.phone || "+81 90-1234-5678",
                                    country: currentUser.country || "日本 (Japan)",
                                    bio: currentUser.bio || "",
                                    avatarUrl: currentUser.avatarUrl || ""
                                  });
                                }
                              }}
                              className="px-5 py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold rounded-2xl text-sm transition-all cursor-pointer"
                            >
                              キャンセル
                            </button>
                          </div>
                        )}
                      </form>

                      {/* Account Security & Logout Area */}
                      {!isEditing && (
                        <div className="pt-4 border-t-2 border-slate-200 space-y-3">
                          <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-bold">
                                <LogOut className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="font-black text-slate-950 text-sm block">アカウントの切り替え・ログアウト</span>
                                <span className="text-xs text-slate-600 font-bold">安全にログアウトしてログイン画面へ戻ります</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowConfirmLogout(true)}
                              className="px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white font-black text-xs sm:text-sm rounded-xl shrink-0 cursor-pointer transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                              id="profile-tab-logout-btn"
                            >
                              <LogOut className="w-4 h-4 text-white" />
                              <span>ログアウト</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* TAB 2: Travel Preferences & Status - HIGH VISIBILITY TYPOGRAPHY */}
                  {activeTab === "preferences" && (
                    <motion.div
                      key="tab-preferences"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {/* Member Rank Progress Card */}
                      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg border-2 border-slate-700 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="w-6 h-6 text-amber-400 shrink-0" />
                            <span className="font-black text-base text-amber-300">VIP Platinum ステータス</span>
                          </div>
                          <span className="text-xs font-black text-emerald-300 bg-emerald-950/80 border border-emerald-400 px-3 py-1 rounded-xl">
                            アクティブ
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs sm:text-sm font-black text-slate-100">
                            <span>ダイヤモンドランクまで</span>
                            <span className="text-amber-300 font-black">80% 達成</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-600">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: "80%" }}
                              transition={{ duration: 0.8 }}
                              className="bg-amber-400 h-full rounded-full"
                            />
                          </div>
                        </div>

                        <p className="text-xs font-bold text-slate-200 leading-relaxed bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                          VIP会員特典: 日本語ガイド無料指名権、専用直通サポート、優先予約権が付与されています。
                        </p>
                      </div>

                      {/* Travel Preferences Toggles with Ultra-High Visibility Contrast */}
                      <div className="bg-white border-2 border-slate-300 rounded-2xl p-4.5 space-y-3 shadow-md">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-red-600" />
                          <span>旅行サポート優先設定</span>
                        </h4>

                        {/* Toggle 1: Japanese Guide */}
                        <label className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-red-50/50 rounded-2xl transition-all cursor-pointer border-2 border-slate-200">
                          <div className="pr-3">
                            <span className="text-sm font-black text-slate-950 block">日本語ガイド最優先手配</span>
                            <span className="text-xs text-slate-800 font-bold mt-0.5 block">現地ツアーで日本語通訳ガイドを確実に配置</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.japaneseGuide}
                            onChange={(e) => setPreferences({ ...preferences, japaneseGuide: e.target.checked })}
                            className="w-5 h-5 accent-red-600 rounded cursor-pointer shrink-0"
                          />
                        </label>

                        {/* Toggle 2: Veg Food */}
                        <label className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-red-50/50 rounded-2xl transition-all cursor-pointer border-2 border-slate-200">
                          <div className="pr-3">
                            <span className="text-sm font-black text-slate-950 block">特別食事対応（ベジタリアン/アレルギー）</span>
                            <span className="text-xs text-slate-800 font-bold mt-0.5 block">事前にお食事の制限を現地ホテルに通知</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.vegFood}
                            onChange={(e) => setPreferences({ ...preferences, vegFood: e.target.checked })}
                            className="w-5 h-5 accent-red-600 rounded cursor-pointer shrink-0"
                          />
                        </label>

                        {/* Toggle 3: Insurance Support */}
                        <label className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-red-50/50 rounded-2xl transition-all cursor-pointer border-2 border-slate-200">
                          <div className="pr-3">
                            <span className="text-sm font-black text-slate-950 block">海外旅行傷害・山岳保険アドバイス</span>
                            <span className="text-xs text-slate-800 font-bold mt-0.5 block">トレッキング時の緊急ヘリ手配保険の確認</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.insuranceSupport}
                            onChange={(e) => setPreferences({ ...preferences, insuranceSupport: e.target.checked })}
                            className="w-5 h-5 accent-red-600 rounded cursor-pointer shrink-0"
                          />
                        </label>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: Shortcuts & Account Security */}
                  {activeTab === "actions" && (
                    <motion.div
                      key="tab-actions"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider px-1">
                          マイメニュー＆ショートカット
                        </h4>

                        {/* Booking History Shortcut */}
                        <button
                          onClick={() => {
                            onClose();
                            onOpenBooking("history");
                          }}
                          className="w-full p-4 bg-white hover:bg-slate-100 border-2 border-slate-200 rounded-2xl flex items-center justify-between transition-all group cursor-pointer text-left shadow-xs hover:shadow-md"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                              <History className="w-6 h-6" />
                            </div>
                            <div>
                              <span className="text-base font-black text-slate-900 block">マイ予約・予約履歴の確認</span>
                              <span className="text-xs text-slate-600 font-bold">現在の予約状況と確定日程</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-900 group-hover:translate-x-1 transition-all" />
                        </button>

                        {/* New Tour Booking Shortcut */}
                        <button
                          onClick={() => {
                            onClose();
                            onOpenBooking("book");
                          }}
                          className="w-full p-4 bg-white hover:bg-slate-100 border-2 border-slate-200 rounded-2xl flex items-center justify-between transition-all group cursor-pointer text-left shadow-xs hover:shadow-md"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                              <Compass className="w-6 h-6" />
                            </div>
                            <div>
                              <span className="text-base font-black text-slate-900 block">新規ツアーのオンライン予約</span>
                              <span className="text-xs text-slate-600 font-bold">ポカラ、カトマンズ、ヒマラヤなど</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
                        </button>

                        {/* Support Consultation */}
                        <button
                          onClick={() => {
                            onClose();
                            const el = document.getElementById("contact");
                            if (el) {
                              el.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                          className="w-full p-4 bg-white hover:bg-slate-100 border-2 border-slate-200 rounded-2xl flex items-center justify-between transition-all group cursor-pointer text-left shadow-xs hover:shadow-md"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                              <PhoneCall className="w-6 h-6" />
                            </div>
                            <div>
                              <span className="text-base font-black text-slate-900 block">日本語デスクへ相談する</span>
                              <span className="text-xs text-slate-600 font-bold">LINE・お電話・フォームお問い合わせ</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                        </button>

                        {/* Prominent Original Location Logout Button */}
                        <div className="pt-2 border-t border-slate-200">
                          <button
                            onClick={() => setShowConfirmLogout(true)}
                            className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-98 text-sm sm:text-base"
                            id="profile-logout-shortcut-btn"
                          >
                            <LogOut className="w-5 h-5 text-white" />
                            <span>アカウントからログアウトする</span>
                          </button>
                        </div>
                      </div>

                      {/* Security Status Box */}
                      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex items-center gap-3.5">
                        <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                        <div>
                          <span className="text-sm font-black text-slate-900 block">セキュリティ・データ保護</span>
                          <span className="text-xs text-slate-600 font-bold">パスワード保護・暗号化通信適用済み</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmModal
        isOpen={showConfirmLogout}
        onClose={() => setShowConfirmLogout(false)}
        onConfirm={() => {
          onClose();
          onLogout();
        }}
        username={currentUser?.username}
      />
    </>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
