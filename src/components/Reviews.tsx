import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Check,
  Search,
  Quote, 
  ShieldCheck, 
  CheckCircle2, 
  ThumbsUp, 
  MessageSquarePlus, 
  Grid, 
  SlidersHorizontal, 
  Filter,
  X, 
  Sparkles,
  MapPin,
  Award,
  Send,
  User,
  Users,
  Compass,
  MessageSquare
} from "lucide-react";
import { REVIEWS, ReviewItem, TOURS } from "../data";
import { motion, AnimatePresence } from "motion/react";

// Crisp 5-point vector star matching the Tour section
const SharpStar = ({ className = "w-4 h-4 fill-amber-400 text-amber-400" }: { className?: string; key?: string | number }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <polygon points="50,2 60.78,35.17 95.65,35.17 67.44,55.67 78.21,88.83 50,68.33 21.79,88.83 32.56,55.67 4.35,35.17 39.22,35.17" />
  </svg>
);

interface ReviewsProps {
  isLoggedIn?: boolean;
}

export default function Reviews({ isLoggedIn }: ReviewsProps) {
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");
  const [selectedTourFilter, setSelectedTourFilter] = useState("すべて");
  const [likedReviews, setLikedReviews] = useState<{ [id: string]: boolean }>({});
  
  // Write review modal state
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newTour, setNewTour] = useState(TOURS[0]?.name || "ポカラツアー");
  const [isTourDropdownOpen, setIsTourDropdownOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [newText, setNewText] = useState("");
  const [newRole, setNewRole] = useState("個人旅行客（1名）");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const TRAVEL_STYLES = [
    "個人旅行客（1名）",
    "ご夫婦・カップル（2名）",
    "ご友人グループ（3〜4名）",
    "ファミリー・家族旅行（4名以上）",
    "シニア夫婦・ゆったり旅（2名）",
    "団体・ツアーグループ（5名以上）",
  ];

  // Filter reviews by selected tour
  const filteredReviews = reviewsList.filter((r) => {
    if (selectedTourFilter === "すべて") return true;
    return r.tourName === selectedTourFilter;
  });

  // Dynamic filter options including default categories and all tours from TOURS
  const tourOptions = [
    "すべて",
    ...Array.from(new Set([
      "ポカラツアー",
      "カトマンズツアー",
      "ルンビニツアー",
      "ドルパタンツアー",
      ...TOURS.map((t) => t.name)
    ]))
  ];

  // Auto sliding timer for carousel view
  useEffect(() => {
    if (viewMode !== "carousel" || filteredReviews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [viewMode, filteredReviews.length]);

  const handleNext = () => {
    if (filteredReviews.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
  };

  const handlePrev = () => {
    if (filteredReviews.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredReviews.length) % filteredReviews.length);
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isLiked = likedReviews[id];
    setLikedReviews((prev) => ({ ...prev, [id]: !isLiked }));
    setReviewsList((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            likes: (r.likes || 0) + (isLiked ? -1 : 1),
          };
        }
        return r;
      })
    );
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newText.trim()) {
      alert("お名前とレビュー本文を入力してください。");
      return;
    }

    const createdReview: ReviewItem = {
      id: `user_rev_${Date.now()}`,
      author: newAuthor.endsWith("様") ? newAuthor : `${newAuthor} 様`,
      role: newRole,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      rating: newRating,
      text: newText,
      date: "2026年7月 (最新)",
      tourName: newTour,
      location: "公式ご利用完了",
      verified: true,
      likes: 1,
      tags: ["公式認定レビュー", "最新投稿", "日本語ガイド"]
    };

    setReviewsList([createdReview, ...reviewsList]);
    setIsWriteModalOpen(false);
    setNewAuthor("");
    setNewText("");
    setToastMessage("レビューを投稿いただきありがとうございました！");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const currentReview = filteredReviews[currentIndex] || reviewsList[0];

  // Helper for tag background color rotation
  const getTagStyle = (idx: number) => {
    const styles = [
      "bg-amber-50 text-amber-900 border-amber-200/80",
      "bg-emerald-50 text-emerald-900 border-emerald-200/80",
      "bg-indigo-50 text-indigo-900 border-indigo-200/80",
      "bg-rose-50 text-rose-900 border-rose-200/80"
    ];
    return styles[idx % styles.length];
  };

  return (
    <section id="reviews" className={`pt-28 sm:pt-32 pb-20 relative overflow-hidden scroll-mt-28 sm:scroll-mt-32 transition-colors duration-300 ${
      isLoggedIn ? "bg-slate-900 text-white border-t border-slate-800" : "bg-gradient-to-b from-slate-50 via-amber-50/20 to-slate-50"
    }`}>
      
      {/* Background Decorative Ambient Glows */}
      {!isLoggedIn && (
        <>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 space-y-3.5"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 text-xs font-black rounded-full uppercase tracking-wider border shadow-2xs ${
            isLoggedIn ? "bg-emerald-950 text-emerald-400 border-emerald-800" : "bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 text-slate-900 border-amber-300/80"
          }`}>
            <Award className={`w-4 h-4 ${isLoggedIn ? "text-emerald-400" : "text-amber-500"}`} />
            <span>信頼の顧客満足度 98.4%</span>
          </div>
          <h2 className={`font-display font-black text-2xl sm:text-3xl md:text-4xl tracking-tight leading-snug ${isLoggedIn ? "text-white" : "text-slate-900"}`}>
            旅をともにしたお客様の <span className={isLoggedIn ? "text-emerald-400 font-black" : "bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 bg-clip-text text-transparent"}>リアルな声</span>
          </h2>
          <p className={`font-extrabold text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${isLoggedIn ? "text-emerald-200/90" : "text-slate-800"}`}>
            ネパトラベルで実際にヒマラヤや古都を旅された皆様からの、心温まる体験談と評価をご紹介します。
          </p>
        </motion.div>

        {/* Global Rating & Trust Highlights Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`rounded-3xl p-6 sm:p-8 shadow-md border mb-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center ${
            isLoggedIn ? "bg-slate-800 text-white border-slate-700" : "bg-white text-slate-900 border-slate-200/90"
          }`}
        >
          
          {/* Rating Score Card */}
          <div className={`md:col-span-5 flex flex-col sm:flex-row items-center gap-4 border-b md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-6 justify-center sm:justify-start ${
            isLoggedIn ? "border-slate-700" : "border-slate-200"
          }`}>
            <div className="text-center sm:text-left flex flex-col items-center sm:items-start shrink-0">
              <span className={`text-5xl font-black font-mono tracking-tight block leading-none ${isLoggedIn ? "text-white" : "text-slate-900"}`}>4.9</span>
              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SharpStar key={i} className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-2xs" />
                ))}
              </div>
            </div>
            <div className="text-center sm:text-left space-y-1">
              <span className={`text-sm font-black block ${isLoggedIn ? "text-white" : "text-slate-900"}`}>総合顧客評価（全320名超）</span>
              <span className={`text-xs font-extrabold block ${isLoggedIn ? "text-slate-300" : "text-slate-800"}`}>98.4%のお客様が「大変満足」と回答</span>
              <div className="pt-1">
                <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-lg border ${
                  isLoggedIn ? "bg-emerald-950 text-emerald-400 border-emerald-800" : "bg-emerald-100 text-emerald-900 border-emerald-300"
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>100% 本物体験談</span>
                </span>
              </div>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-black text-slate-900 border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6">
            <div className="flex items-center gap-2.5 bg-gradient-to-br from-indigo-50 to-blue-50/60 p-3 rounded-2xl border border-indigo-200/80 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <span className="block text-slate-900 font-black">日本語専属ガイド</span>
                <span className="text-indigo-700 font-black text-[11px] block">100% 専属保証</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-gradient-to-br from-amber-50 to-yellow-50/60 p-3 rounded-2xl border border-amber-200/80 shadow-2xs">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="block text-slate-900 font-black">ネパール政府NTB</span>
                <span className="text-amber-800 font-black text-[11px] block">公認ライセンス</span>
              </div>
            </div>
          </div>

          {/* Write a Review Action Trigger */}
          <div className="md:col-span-3 flex items-center justify-center md:justify-end">
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 border border-rose-500/30"
              id="open-write-review-btn"
            >
              <MessageSquarePlus className="w-4 h-4 text-amber-200" />
              <span>レビューを投稿する</span>
            </button>
          </div>

        </motion.div>

        {/* View Switcher & Tour Filters Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 mb-8 bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border border-slate-200 shadow-md">
          
          {/* Tour filter pills with count badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 bg-slate-100 px-3 py-2 rounded-2xl border border-slate-200 shrink-0">
              <Filter className="w-3.5 h-3.5 text-amber-600" />
              <span>絞り込み:</span>
            </div>
            
            <div className="flex items-center gap-2">
              {tourOptions.map((tName) => {
                const count = tName === "すべて" 
                  ? reviewsList.length 
                  : reviewsList.filter(r => r.tourName === tName).length;
                const isSelected = selectedTourFilter === tName;

                return (
                  <button
                    key={tName}
                    onClick={() => {
                      setSelectedTourFilter(tName);
                      setCurrentIndex(0);
                    }}
                    className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                      isSelected
                        ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-slate-800 shadow-md ring-2 ring-slate-900/10 scale-[1.02]"
                        : "bg-white text-slate-900 hover:bg-slate-100 border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    <span>{tName}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-black ${
                      isSelected 
                        ? "bg-amber-400 text-slate-950" 
                        : "bg-slate-100 text-slate-800 border border-slate-200"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Layout Mode Toggle Buttons */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 border-t lg:border-t-0 border-slate-150 pt-2.5 lg:pt-0">
            <span className="text-xs font-black text-slate-800 hidden sm:inline-block mr-1">表示モード:</span>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-2xs w-full sm:w-auto">
              <button
                onClick={() => setViewMode("carousel")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  viewMode === "carousel" 
                    ? "bg-slate-900 text-white shadow-sm border border-slate-800" 
                    : "text-slate-800 hover:text-slate-950 hover:bg-white/60"
                }`}
                title="フィーチャースライド表示"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span>フィーチャー</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  viewMode === "grid" 
                    ? "bg-slate-900 text-white shadow-sm border border-slate-800" 
                    : "text-slate-800 hover:text-slate-950 hover:bg-white/60"
                }`}
                title="カード一覧表示"
              >
                <Grid className="w-3.5 h-3.5 text-indigo-400" />
                <span>カード一覧 ({filteredReviews.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Display Area */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-800 font-extrabold text-sm">選択されたツアーのレビューはまだありません。</p>
            <button
              onClick={() => setSelectedTourFilter("すべて")}
              className="mt-3 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-extrabold hover:bg-slate-800 cursor-pointer shadow-sm"
            >
              すべてのレビューを表示
            </button>
          </div>
        ) : viewMode === "carousel" ? (

          /* CAROUSEL MODE FEATURE BOX */
          <div className="relative bg-white rounded-3xl p-6 sm:p-12 shadow-lg border border-slate-200/90 min-h-[380px] flex flex-col justify-between overflow-hidden">
            
            {/* Background Quote Watermark */}
            <Quote className="absolute top-6 right-8 w-28 h-28 text-slate-100/90 pointer-events-none select-none -rotate-12" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentReview.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-6 relative z-10 my-auto"
              >
                {/* Top Tags & Verified Seal */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-150 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-indigo-50 text-indigo-900 text-xs font-black px-3.5 py-1.5 rounded-full border border-indigo-200/80 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      {currentReview.tourName} 参加者
                    </span>
                    {currentReview.location && (
                      <span className="text-xs text-slate-700 font-extrabold flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-rose-600" />
                        {currentReview.location}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50/80 px-3 py-1 rounded-full border border-amber-200/80">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <SharpStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < currentReview.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-200 text-slate-200"
                        }`}
                      />
                    ))}
                    <span className="text-xs font-black text-amber-900 ml-1 font-mono">5.0</span>
                  </div>
                </div>

                {/* Main Review Text - CRISP DARK HIGH CONTRAST */}
                <blockquote className="text-slate-900 font-black text-base sm:text-xl md:text-2xl leading-relaxed tracking-tight">
                  “ {currentReview.text} ”
                </blockquote>

                {/* Tags list */}
                {currentReview.tags && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {currentReview.tags.map((tag, tIdx) => (
                      <span key={tIdx} className={`text-xs font-black px-3 py-1 rounded-lg border shadow-2xs ${getTagStyle(tIdx)}`}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Author Profile Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-150">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={currentReview.avatar}
                      alt={currentReview.author}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full border-2 border-amber-400 shadow-md object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-base sm:text-lg">{currentReview.author}</span>
                        {currentReview.verified && (
                          <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-2xs">認証済み</span>
                        )}
                      </div>
                      <span className="text-slate-700 text-xs font-extrabold block mt-0.5">
                        {currentReview.role} · <span className="text-slate-900 font-mono font-black">{currentReview.date}</span>
                      </span>
                    </div>
                  </div>

                  {/* Like / Helpful button */}
                  <button
                    onClick={(e) => toggleLike(currentReview.id, e)}
                    className={`self-start sm:self-auto px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer border shadow-2xs ${
                      likedReviews[currentReview.id]
                        ? "bg-amber-100 text-amber-950 border-amber-300"
                        : "bg-slate-100 hover:bg-amber-50 text-slate-800 hover:text-amber-900 border-slate-200"
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${likedReviews[currentReview.id] ? "text-amber-600 fill-amber-500" : "text-slate-600"}`} />
                    <span>役に立った ({currentReview.likes || 0})</span>
                  </button>
                </div>

              </motion.div>
            </AnimatePresence>

            {/* Carousel Navigation Footer Controls */}
            <div className="flex items-center justify-between pt-6 mt-4 border-t border-slate-150">
              <div className="flex items-center gap-1.5">
                {filteredReviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx ? "w-8 bg-slate-900" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 transition-all cursor-pointer shadow-2xs active:scale-95 border border-slate-200"
                  title="前へ"
                  id="rev-prev-btn"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 transition-all cursor-pointer shadow-2xs active:scale-95 border border-slate-200"
                  title="次へ"
                  id="rev-next-btn"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        ) : (

          /* GRID MODE DISPLAY */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredReviews.map((rev) => (
                <motion.div
                  key={rev.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl border border-slate-200 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Header bar */}
                    <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                      <span className="text-xs font-black text-indigo-900 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200/70">
                        {rev.tourName}
                      </span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <SharpStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < rev.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review text */}
                    <p className="text-slate-900 text-sm font-extrabold leading-relaxed line-clamp-5">
                      “{rev.text}”
                    </p>

                    {/* Tags */}
                    {rev.tags && (
                      <div className="flex flex-wrap gap-1.5">
                        {rev.tags.map((tag, tIdx) => (
                          <span key={tIdx} className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md border ${getTagStyle(tIdx)}`}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Profile & Like Footer */}
                  <div className="pt-4 mt-4 border-t border-slate-150 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.avatar}
                        alt={rev.author}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shrink-0 shadow-2xs"
                      />
                      <div className="truncate max-w-[140px]">
                        <span className="font-black text-slate-900 text-sm truncate block">{rev.author}</span>
                        <span className="text-xs text-slate-700 font-extrabold truncate block">{rev.role}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => toggleLike(rev.id, e)}
                      className={`p-2 px-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border ${
                        likedReviews[rev.id] ? "bg-amber-100 text-amber-950 border-amber-300" : "bg-slate-100 text-slate-800 hover:bg-amber-50 border-slate-200"
                      }`}
                      title="役に立った"
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${likedReviews[rev.id] ? "text-amber-600 fill-amber-500" : "text-slate-600"}`} />
                      <span className="text-[11px]">{rev.likes || 0}</span>
                    </button>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        )}

        {/* Toast Feedback Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs sm:text-sm font-black"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WRITE A REVIEW MODAL PORTAL */}
        {typeof document !== "undefined" && createPortal(
          <AnimatePresence>
            {isWriteModalOpen && (
              <div 
                onClick={() => {
                  setIsWriteModalOpen(false);
                  setIsTourDropdownOpen(false);
                  setIsRoleDropdownOpen(false);
                }}
                className="fixed inset-0 z-[100000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
              >
                <motion.div
                  onClick={(e) => e.stopPropagation()}
                  initial={{ scale: 0.94, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.94, opacity: 0, y: 15 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] shadow-2xl border border-slate-200 relative flex flex-col overflow-hidden text-slate-900 my-auto"
                >
                  {/* Top Solid Accent Line */}
                  <div className="h-2 w-full bg-red-600 shrink-0" />

                  {/* Modal Header */}
                  <div className="px-5 sm:px-7 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-red-600 text-white rounded-2xl shadow-sm shrink-0">
                        <Sparkles className="w-5 h-5 text-amber-300" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">レビューをご投稿ください</h3>
                        <p className="text-xs sm:text-sm font-bold text-slate-600">ネパール旅行の素敵な思い出をお聞かせください</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsWriteModalOpen(false);
                        setIsTourDropdownOpen(false);
                        setIsRoleDropdownOpen(false);
                      }}
                      className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer shrink-0"
                      title="閉じる"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modal Scrollable Form Body */}
                  <form 
                    id="write-review-form"
                    onSubmit={(e) => {
                      setIsTourDropdownOpen(false);
                      setIsRoleDropdownOpen(false);
                      handlePostReview(e);
                    }} 
                    className="p-5 sm:p-7 space-y-5 overflow-y-auto flex-1 scrollbar-thin"
                  >
                    {/* Star Rating Section - Enhanced & Clean */}
                    <div className="bg-amber-50/80 p-4 sm:p-5 rounded-2xl border-2 border-amber-200/90 shadow-2xs">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                          <SharpStar className="w-4 h-4 fill-amber-500 text-amber-500" />
                          <span>満足度の星評価</span>
                        </label>
                        <span className="text-xs sm:text-sm font-mono font-black text-amber-950 bg-amber-200 px-3 py-1 rounded-full border border-amber-300 shadow-2xs">
                          {(hoverRating !== null ? hoverRating : newRating)}.0 / 5.0
                        </span>
                      </div>

                      {/* Interactive Stars */}
                      <div className="flex items-center gap-1.5 sm:gap-2.5 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const active = (hoverRating !== null ? hoverRating : newRating) >= star;
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(null)}
                              className="p-1 cursor-pointer transition-all hover:scale-125 active:scale-95 focus:outline-none"
                              title={`${star}点`}
                            >
                              <SharpStar
                                className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors duration-150 ${
                                  active ? "fill-amber-400 text-amber-500 filter drop-shadow-xs" : "fill-slate-200 text-slate-300"
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>

                      {/* Feedback Rating Label */}
                      <div className="bg-white/90 rounded-xl p-2.5 border border-amber-200 text-center">
                        <span className="text-xs sm:text-sm font-black text-slate-900">
                          {(hoverRating !== null ? hoverRating : newRating) === 5 && "★★★★★ 大変満足 （とても素晴らしかった）"}
                          {(hoverRating !== null ? hoverRating : newRating) === 4 && "★★★★☆ 満足 （期待通りで満足）"}
                          {(hoverRating !== null ? hoverRating : newRating) === 3 && "★★★☆☆ 普通 （標準的な体験）"}
                          {(hoverRating !== null ? hoverRating : newRating) === 2 && "★★☆☆☆ やや不満 （改善の余地あり）"}
                          {(hoverRating !== null ? hoverRating : newRating) === 1 && "★☆☆☆☆ 不満 （満足できなかった）"}
                        </span>
                      </div>
                    </div>

                    {/* Participated Tour Custom Selector (No Search Box) */}
                    <div className="relative">
                      <label className="block text-xs sm:text-sm font-black text-slate-900 mb-1.5 flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-red-600" />
                        <span>参加されたツアー</span>
                      </label>
                      
                      {/* Trigger Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsTourDropdownOpen(!isTourDropdownOpen);
                          setIsRoleDropdownOpen(false);
                        }}
                        className="w-full bg-slate-50 hover:bg-white border-2 border-slate-300 hover:border-red-500 rounded-2xl px-4 py-3 text-left flex items-center justify-between transition-all cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-2 overflow-hidden pr-2">
                          <span className="text-xs sm:text-sm font-black text-slate-900 truncate">{newTour}</span>
                          {TOURS.find(t => t.name === newTour)?.duration && (
                            <span className="text-[10px] font-mono font-black bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md border border-slate-300 shrink-0">
                              {TOURS.find(t => t.name === newTour)?.duration}
                            </span>
                          )}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${isTourDropdownOpen ? "rotate-180 text-red-600" : ""}`} />
                      </button>

                      {/* Custom Dropdown Options Menu (No Search Box) */}
                      {isTourDropdownOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border-2 border-slate-300 shadow-2xl rounded-2xl p-2 max-h-52 overflow-y-auto space-y-1 scrollbar-thin">
                          {TOURS.map((tourItem) => {
                            const isSelected = newTour === tourItem.name;
                            return (
                              <button
                                key={tourItem.id}
                                type="button"
                                onClick={() => {
                                  setNewTour(tourItem.name);
                                  setIsTourDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
                                  isSelected 
                                    ? "bg-red-600 text-white font-black shadow-xs" 
                                    : "text-slate-800 hover:bg-slate-100 hover:text-slate-950"
                                }`}
                              >
                                <div className="flex items-center gap-2 overflow-hidden pr-2">
                                  <span className="truncate">{tourItem.name}</span>
                                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                                    isSelected ? "bg-red-700 text-white" : "bg-slate-100 text-slate-600"
                                  }`}>
                                    {tourItem.duration}
                                  </span>
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-white shrink-0 ml-1" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Name and Travel Style inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div>
                        <label className="block text-xs sm:text-sm font-black text-slate-900 mb-1.5 flex items-center gap-1.5">
                          <User className="w-4 h-4 text-slate-700" />
                          <span>お名前（イニシャル可）</span>
                        </label>
                        <input
                          type="text"
                          placeholder="例: 山田 太郎"
                          value={newAuthor}
                          onChange={(e) => setNewAuthor(e.target.value)}
                          required
                          className="w-full bg-slate-50 hover:bg-white border-2 border-slate-300 hover:border-slate-500 focus:border-red-600 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 shadow-2xs transition-all placeholder:text-slate-400 placeholder:font-normal"
                        />
                      </div>

                      {/* Travel Style Selector */}
                      <div className="relative">
                        <label className="block text-xs sm:text-sm font-black text-slate-900 mb-1.5 flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-slate-700" />
                          <span>ご旅行の形態</span>
                        </label>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setIsRoleDropdownOpen(!isRoleDropdownOpen);
                            setIsTourDropdownOpen(false);
                          }}
                          className="w-full bg-slate-50 hover:bg-white border-2 border-slate-300 hover:border-red-500 rounded-2xl px-4 py-3 text-left flex items-center justify-between transition-all cursor-pointer shadow-2xs"
                        >
                          <span className="text-xs sm:text-sm font-black text-slate-900 truncate">{newRole}</span>
                          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${isRoleDropdownOpen ? "rotate-180 text-red-600" : ""}`} />
                        </button>

                        {isRoleDropdownOpen && (
                          <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border-2 border-slate-300 shadow-2xl rounded-2xl p-1.5 max-h-52 overflow-y-auto space-y-1 scrollbar-thin">
                            {TRAVEL_STYLES.map((style) => {
                              const isSelected = newRole === style;
                              return (
                                <button
                                  key={style}
                                  type="button"
                                  onClick={() => {
                                    setNewRole(style);
                                    setIsRoleDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
                                    isSelected 
                                      ? "bg-red-600 text-white font-black shadow-xs" 
                                      : "text-slate-800 hover:bg-slate-100 hover:text-slate-950"
                                  }`}
                                >
                                  <span>{style}</span>
                                  {isSelected && <Check className="w-4 h-4 text-white shrink-0 ml-1" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Review text area */}
                    <div>
                      <label className="block text-xs sm:text-sm font-black text-slate-900 mb-1.5 flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-slate-700" />
                        <span>ご感想・体験談</span>
                      </label>
                      <textarea
                        rows={4}
                        placeholder="現地ガイドの対応やヒマラヤ絶景の感想、おすすめしたいポイントなどをご自由にお書きください..."
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        required
                        className="w-full bg-slate-50 hover:bg-white border-2 border-slate-300 hover:border-slate-500 focus:border-red-600 rounded-2xl p-4 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 shadow-2xs leading-relaxed transition-all placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>
                  </form>

                  {/* Modal Footer */}
                  <div className="px-5 sm:px-7 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setIsWriteModalOpen(false);
                        setIsTourDropdownOpen(false);
                        setIsRoleDropdownOpen(false);
                      }}
                      className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-2xs"
                    >
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      form="write-review-form"
                      className="px-7 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-2xl text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Send className="w-4 h-4 text-amber-200" />
                      <span>投稿を送信する</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

      </div>
    </section>
  );
}

