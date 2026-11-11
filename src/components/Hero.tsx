import { useState, useEffect } from "react";
import { Compass, Calendar, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { IMAGES } from "../data";

interface HeroProps {
  onSeeTours: () => void;
  onBookNow: () => void;
  isLoggedIn?: boolean;
}

export default function Hero({ onSeeTours, onBookNow, isLoggedIn }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use our beautiful generated landscapes for the slide show!
  const slides = [
    {
      image: IMAGES.hero,
      title: "ヒマラヤの息吹を感じる",
      description: "世界の屋根を仰ぎ見、祈りの旗が風に揺れる天空の地へ。",
      accent: "神々の住まう高峰"
    },
    {
      image: IMAGES.pokhara,
      title: "静寂のフェワ湖とアンナプルナ",
      description: "鏡のような湖面に映る雪山と、のんびりと漂う色鮮やかなボート。",
      accent: "大自然のリゾート・ポカラ"
    },
    {
      image: IMAGES.kathmandu,
      title: "悠久の時が息づく首都",
      description: "神聖なネワ文化、金色の仏塔にともる平和の灯火、薫香が包む路地。",
      accent: "世界遺産カトマンズ盆地"
    },
    {
      image: IMAGES.lumbini,
      title: "仏教開祖・ブッダ生誕の地",
      description: "世界平和の願いが降り注ぐ、釈迦が誕生したとされる静寂の聖園。",
      accent: "聖地ルンビニ"
    },
    {
      image: IMAGES.dhorpatan,
      title: "手つかずの野生が息づく秘境",
      description: "そびえ立つ山陵、朝霧が立ちのぼる松林と青い羊が住む最後の約束の地。",
      accent: "ドルパタン自然保護区"
    }
  ];

  // Auto sliding carousel every 6.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-slate-900 text-white">
      {/* Background Slideshow Panel */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={slides[currentSlide].image}
              alt="Nepal Nature Scenic"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none"
            />
            {/* Dark overlay mask - rich atmospheric gradients for both modes */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/65 to-black/55 z-10" />
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-black/40 z-10" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Copy Content Box with staggered layout */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl space-y-6">
          
          {/* Animated Accent Banner */}
          <motion.div
            key={`accent-${currentSlide}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`inline-flex items-center gap-1.5 backdrop-blur-md text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase px-4 py-1.5 rounded-full border shadow-lg ${
              isLoggedIn 
                ? "bg-emerald-600/85 border-amber-400/60" 
                : "bg-red-600/80 border-amber-400/40"
            }`}
          >
            <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>{slides[currentSlide].accent}</span>
          </motion.div>

          {/* Majestic Heading */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3 sm:space-y-4"
          >
            <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter leading-none my-1 sm:my-2">
              <span className="text-red-500 font-black">
                Nepa
              </span>{" "}
              <span className="text-white font-black">
                Travel
              </span>
            </h1>

            {/* Subtitle - Lighter, softer, elegant typography */}
            <p className="font-display font-bold text-[12px] min-[360px]:text-[13.5px] min-[400px]:text-base sm:text-xl md:text-2xl max-w-3xl mx-auto tracking-tighter min-[360px]:tracking-tight sm:tracking-wider mt-3.5 sm:mt-6 md:mt-8 text-amber-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] whitespace-nowrap">
              「ネパールの美しさを探索し、その魅力を感じよう」
            </p>
          </motion.div>

          {/* Subtitle slide description - Lighter & clean font */}
          <motion.p
            key={`desc-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xs sm:text-base text-slate-200/90 font-medium max-w-xl mx-auto whitespace-pre-line drop-shadow-2xs min-h-[44px] sm:min-h-[52px] leading-relaxed px-2"
          >
            {slides[currentSlide].description}
          </motion.p>

          {/* CTA Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-row gap-3 sm:gap-4 justify-center items-center pt-2 sm:pt-4"
          >
            <button
              onClick={onSeeTours}
              className={`px-5 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-base font-bold rounded-xl shadow-lg hover:shadow-xl transform active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 group ${
                isLoggedIn 
                  ? "bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/50" 
                  : "bg-white hover:bg-slate-100 text-slate-950"
              }`}
              id="hero-see-tours"
            >
              <Compass className={`w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform ${isLoggedIn ? "text-emerald-400" : "text-red-600"}`} />
              ツアーを見る
            </button>
            <button
              onClick={onBookNow}
              className={`px-5 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-base font-bold rounded-xl shadow-lg hover:shadow-xl border transform active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
                isLoggedIn
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/50"
                  : "bg-red-600 hover:bg-red-700 text-white border-amber-400/40"
              }`}
              id="hero-book-now"
            >
              <Calendar className={`w-4 h-4 sm:w-5 sm:h-5 ${isLoggedIn ? "text-cyan-200" : "text-amber-300"}`} />
              今すぐ予約
            </button>
          </motion.div>

        </div>
      </div>

      {/* Slide Dots Indicator at Bottom Left */}
      <div className="absolute bottom-4 left-3 sm:bottom-8 sm:left-10 md:left-16 z-20 flex items-center">
        <div className="flex gap-2 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full border border-amber-400/30 shadow-2xl">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 sm:h-3 rounded-full cursor-pointer transition-all duration-300 ${
                currentSlide === idx 
                  ? "w-7 sm:w-11 bg-gradient-to-r from-amber-400 to-yellow-300 shadow-md" 
                  : "w-2.5 sm:w-3 bg-white/50 hover:bg-white/80"
              }`}
              title={`スライド ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Centered Modern Scroll Down Button (No Background Box) */}
      <button
        onClick={onSeeTours}
        className="absolute bottom-24 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-2.5 cursor-pointer group active:scale-95 transition-all duration-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
        title="ツアー一覧へスクロール"
        id="hero-scroll-down-btn"
      >
        {/* Animated Mouse Icon */}
        <div className="w-4 h-6 rounded-full border-2 border-amber-300/90 group-hover:border-amber-200 flex justify-center pt-1 shadow-md bg-slate-950/40 backdrop-blur-xs">
          <motion.div
            animate={{ y: [0, 7, 0], opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1 h-1.5 bg-amber-300 rounded-full shadow-[0_0_8px_rgba(251,191,36,1)]"
          />
        </div>

        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-black text-amber-300 group-hover:text-amber-200 transition-colors select-none">
          Scroll Down
        </span>

        <motion.div
          animate={{ y: [0, 3, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          className="text-amber-400 group-hover:text-amber-200"
        >
          <ChevronDown className="w-4 h-4 stroke-[2.5]" />
        </motion.div>
      </button>

    </section>
  );
}
