import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  ZoomIn, 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  MapPin, 
  Search, 
  Camera, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { GALLERY, GalleryItem } from "../data";
import { motion, AnimatePresence } from "motion/react";

interface GalleryProps {
  onSelectDestinationTour?: (destination: string) => void;
  isLoggedIn?: boolean;
}

export default function Gallery({ onSelectDestinationTour, isLoggedIn }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState("すべて");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<{ item: GalleryItem; index: number } | null>(null);

  const normalizeGalleryList = (items: any[]): GalleryItem[] => {
    if (!Array.isArray(items) || items.length === 0) return GALLERY;
    return items.map((item: any, idx: number) => {
      const defaultMatch = GALLERY.find(g => g.id === item.id || g.title === item.title);
      const imgSrc = item.image || item.url || defaultMatch?.image || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop";
      return {
        id: item.id || `g-${idx + 1}`,
        title: item.title || defaultMatch?.title || "ネパールの風景",
        image: imgSrc,
        url: item.url || imgSrc,
        category: item.category || defaultMatch?.category || "自然",
        location: item.location || defaultMatch?.location || "ネパール",
        description: item.description || defaultMatch?.description || "神々が宿るネパールの素晴らしい大自然と文化の景色。"
      };
    });
  };

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem("nepa_admin_gallery_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return normalizeGalleryList(parsed);
        }
      } catch (e) {}
    }
    return GALLERY;
  });

  useEffect(() => {
    const syncGallery = () => {
      const saved = localStorage.getItem("nepa_admin_gallery_v2");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setGalleryItems(normalizeGalleryList(parsed));
            return;
          }
        } catch (e) {}
      }
      setGalleryItems(GALLERY);
    };

    window.addEventListener("nepa_gallery_updated", syncGallery);
    window.addEventListener("storage", syncGallery);
    return () => {
      window.removeEventListener("nepa_gallery_updated", syncGallery);
      window.removeEventListener("storage", syncGallery);
    };
  }, []);

  const categories = ["すべて", "自然", "山", "文化", "歴史", "秘境"];

  // Category specific color configurations
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case "自然":
        return {
          activeBg: "bg-emerald-600 text-white shadow-emerald-500/20",
          pillBg: "bg-emerald-700 text-emerald-100",
          badge: "bg-emerald-600 text-white",
          iconColor: "text-emerald-400"
        };
      case "山":
        return {
          activeBg: "bg-sky-600 text-white shadow-sky-500/20",
          pillBg: "bg-sky-700 text-sky-100",
          badge: "bg-sky-600 text-white",
          iconColor: "text-sky-400"
        };
      case "文化":
        return {
          activeBg: "bg-amber-600 text-white shadow-amber-500/20",
          pillBg: "bg-amber-700 text-amber-100",
          badge: "bg-amber-600 text-white",
          iconColor: "text-amber-400"
        };
      case "歴史":
        return {
          activeBg: "bg-rose-600 text-white shadow-rose-500/20",
          pillBg: "bg-rose-700 text-rose-100",
          badge: "bg-rose-600 text-white",
          iconColor: "text-rose-400"
        };
      case "秘境":
        return {
          activeBg: "bg-purple-600 text-white shadow-purple-500/20",
          pillBg: "bg-purple-700 text-purple-100",
          badge: "bg-purple-600 text-white",
          iconColor: "text-purple-400"
        };
      default:
        return {
          activeBg: "bg-slate-900 text-white shadow-slate-900/20",
          pillBg: "bg-slate-800 text-slate-200",
          badge: "bg-slate-800 text-white",
          iconColor: "text-amber-400"
        };
    }
  };

  // Filter gallery items by selected tab and search query
  const filteredGallery = galleryItems.filter((item) => {
    const matchesCategory = activeCategory === "すべて" || item.category === activeCategory;
    const matchesSearch = searchQuery.trim() === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate category counts
  const getCategoryCount = (cat: string) => {
    if (cat === "すべて") return galleryItems.length;
    return galleryItems.filter(item => item.category === cat).length;
  };

  // Lightbox keyboard navigation (Arrow keys + Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      if (e.key === "Escape") {
        setSelectedItem(null);
      } else if (e.key === "ArrowRight") {
        const nextIndex = (selectedItem.index + 1) % filteredGallery.length;
        setSelectedItem({ item: filteredGallery[nextIndex], index: nextIndex });
      } else if (e.key === "ArrowLeft") {
        const prevIndex = (selectedItem.index - 1 + filteredGallery.length) % filteredGallery.length;
        setSelectedItem({ item: filteredGallery[prevIndex], index: prevIndex });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem, filteredGallery]);

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedItem && filteredGallery.length > 0) {
      const nextIndex = (selectedItem.index + 1) % filteredGallery.length;
      setSelectedItem({
        item: filteredGallery[nextIndex],
        index: nextIndex
      });
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedItem && filteredGallery.length > 0) {
      const prevIndex = (selectedItem.index - 1 + filteredGallery.length) % filteredGallery.length;
      setSelectedItem({
        item: filteredGallery[prevIndex],
        index: prevIndex
      });
    }
  };

  const handleTourJump = (locationName?: string) => {
    setSelectedItem(null);
    const element = document.getElementById("tours");
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    if (onSelectDestinationTour && locationName) {
      onSelectDestinationTour(locationName);
    }
  };

  return (
    <section id="gallery" className={`pt-28 sm:pt-32 pb-20 scroll-mt-28 sm:scroll-mt-32 transition-colors duration-300 ${
      isLoggedIn ? "bg-slate-950 text-white border-t border-slate-800" : "bg-slate-50"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section title header */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 space-y-3"
        >
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-black rounded-full uppercase tracking-wider shadow-sm border ${
            isLoggedIn ? "bg-emerald-950 text-emerald-400 border-emerald-800" : "bg-slate-900 text-white border-slate-800"
          }`}>
            <Camera className={`w-3.5 h-3.5 ${isLoggedIn ? "text-emerald-400" : "text-amber-400"}`} />
            <span>ネパール公式フォトギャラリー</span>
          </div>
          <h2 className={`font-display font-black text-2xl sm:text-3xl md:text-4xl tracking-tight leading-snug ${isLoggedIn ? "text-white" : "text-slate-900"}`}>
            ネパールの絶景<span className={`ml-1 ${isLoggedIn ? "text-emerald-400 font-black" : "text-red-600"}`}>フォトギャラリー</span>
          </h2>
          <p className={`font-bold text-sm sm:text-base max-w-2xl mx-auto leading-relaxed ${isLoggedIn ? "text-emerald-200/90" : "text-emerald-700"}`}>
            神々が宿る8000m峰から神秘の秘境湖、古都の寺院まで。弊社の専属日本語ガイドが現地で撮影した、最新ネパール旅行の素顔をご覧ください。
          </p>
        </motion.div>

        {/* Controls Bar: Category Filters & Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`flex flex-col md:flex-row justify-between items-center gap-4 mb-10 p-3 sm:p-4 rounded-2xl shadow-sm border ${
            isLoggedIn ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200/80"
          }`}
        >
          
          {/* Category tabs with distinct theme colors */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto" id="gallery-categories-container">
            {categories.map((cat) => {
              const count = getCategoryCount(cat);
              const isActive = activeCategory === cat;
              const theme = getCategoryTheme(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? `${theme.activeBg} shadow-md active:scale-95`
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950"
                  }`}
                  id={`gallery-cat-${cat}`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? theme.pillBg : "bg-slate-200 text-slate-700"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="地名やキーワード検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-8 py-2.5 text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </motion.div>

        {/* Gallery Grid Showcase */}
        {filteredGallery.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
            <Camera className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-700 font-bold text-sm">該当する写真が見つかりませんでした。</p>
            <p className="text-slate-400 text-xs mt-1">検索条件を変更するか「すべて」のタブをお試しください。</p>
            <button
              onClick={() => { setActiveCategory("すべて"); setSearchQuery(""); }}
              className="mt-4 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-extrabold hover:bg-slate-800 transition-all cursor-pointer"
            >
              条件をリセット
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5" id="gallery-grid">
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((item, idx) => {
                const theme = getCategoryTheme(item.category);
                return (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => setSelectedItem({ item, index: idx })}
                    className="group relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-2xl bg-slate-900 border border-slate-200/80 cursor-pointer shadow-xs hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    id={`gallery-card-${item.id}`}
                  >
                    {/* Photo image */}
                    <img
                      src={item.image || item.url}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.fallback) {
                          target.dataset.fallback = "true";
                          const defaultMatch = GALLERY.find(g => g.id === item.id || g.title === item.title);
                          target.src = defaultMatch?.image || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop";
                        }
                      }}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 select-none"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-65 group-hover:opacity-90 transition-opacity duration-300" />

                    {/* Top Location Badge */}
                    {item.location && (
                      <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[10px] font-extrabold text-white flex items-center gap-1 shadow-xs">
                        <MapPin className={`w-3 h-3 ${theme.iconColor} shrink-0`} />
                        <span className="truncate max-w-[130px]">{item.location}</span>
                      </div>
                    )}

                    {/* Zoom Indicator top right */}
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 text-white shadow-md">
                      <ZoomIn className="w-4 h-4" />
                    </div>

                    {/* Bottom Text Description */}
                    <div className="absolute bottom-0 inset-x-0 p-4 text-white transform group-hover:translate-y-0 transition-transform">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className={`${theme.badge} font-black text-[9px] px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-2xs`}>
                          {item.category}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm sm:text-base leading-snug text-white line-clamp-1 drop-shadow-sm">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-[11px] text-slate-200 line-clamp-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Ultra-Modern Lightbox Modal Overlay via createPortal */}
        {typeof document !== "undefined" && createPortal(
          <AnimatePresence>
            {selectedItem && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedItem(null)}
                className="fixed inset-0 z-[100000] flex flex-col items-center justify-between bg-slate-950/95 backdrop-blur-md p-3 sm:p-6 cursor-zoom-out select-none overflow-hidden"
                id="gallery-lightbox"
              >
                {/* Lightbox Header Bar */}
                <div 
                  className="w-full max-w-6xl flex justify-between items-center text-white z-20 pt-2 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-sm shadow-md">
                      N
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-black text-white block">Nepa Travel Photo Viewer</span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {selectedItem.index + 1} / {filteredGallery.length} 枚目 （キーボード ← → で切替）
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                    title="閉じる (Esc)"
                    id="lightbox-close-btn"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Main Photo Display Stage */}
                <div className="relative max-w-5xl w-full flex-1 flex items-center justify-center my-auto cursor-default">
                  
                  {/* Arrow Navigation buttons */}
                  <button
                    onClick={handlePrev}
                    className="absolute left-1 sm:left-4 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 transition-all cursor-pointer shadow-2xl z-20 hover:scale-110 active:scale-95"
                    title="前へ (←)"
                    id="lightbox-prev-btn"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-1 sm:right-4 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 transition-all cursor-pointer shadow-2xl z-20 hover:scale-110 active:scale-95"
                    title="次へ (→)"
                    id="lightbox-next-btn"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Main Active Image Box */}
                  <motion.div
                    key={selectedItem.item.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="relative max-h-[62vh] sm:max-h-[68vh] rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-black"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={selectedItem.item.image}
                      alt={selectedItem.item.title}
                      referrerPolicy="no-referrer"
                      className="max-h-[62vh] sm:max-h-[68vh] w-full object-contain select-none"
                    />
                  </motion.div>
                </div>

                {/* Lightbox Footer Bar: Details & Jump to Tours button */}
                <div 
                  className="w-full max-w-4xl bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-2xl p-4 text-white z-20 shrink-0 space-y-2 mb-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`${getCategoryTheme(selectedItem.item.category).badge} font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase`}>
                          {selectedItem.item.category}
                        </span>
                        {selectedItem.item.location && (
                          <span className="text-slate-300 text-xs font-bold flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            {selectedItem.item.location}
                          </span>
                        )}
                      </div>
                      <h3 className="font-sans font-black text-lg sm:text-xl text-white tracking-tight">
                        {selectedItem.item.title}
                      </h3>
                      {selectedItem.item.description && (
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">
                          {selectedItem.item.description}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleTourJump(selectedItem.item.location)}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <span>このエリアのツアーを見る</span>
                      <ArrowRight className="w-4 h-4 text-amber-200" />
                    </button>
                  </div>

                  {/* Horizontal Interactive Thumbnail Bar */}
                  <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-800/80 overflow-x-auto pb-1">
                    {filteredGallery.map((thumb, tIdx) => (
                      <button
                        key={thumb.id}
                        onClick={() => setSelectedItem({ item: thumb, index: tIdx })}
                        className={`relative w-12 h-10 rounded-lg overflow-hidden shrink-0 transition-all cursor-pointer border ${
                          selectedItem.index === tIdx
                            ? "ring-2 ring-amber-400 border-white scale-105"
                            : "opacity-40 hover:opacity-100 border-transparent"
                        }`}
                      >
                        <img
                          src={thumb.image}
                          alt={thumb.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      </div>
    </section>
  );
}
