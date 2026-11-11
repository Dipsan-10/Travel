import React, { useState, useEffect } from "react";
import { Compass, ShieldCheck, Award, Heart, ChevronLeft, ChevronRight, Users, Sparkles, CheckCircle2, Star, Quote, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { IMAGES } from "../data";

interface AboutProps {
  isLoggedIn?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  roleJa: string;
  image: string;
  bioJa: string;
  bioEn: string;
  specialty: string;
  badge: string;
  experienceYears: string;
}

export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "dipsan-limbu",
    name: "Dipsan Limbu",
    role: "Founder & CEO",
    roleJa: "創業者・最高経営責任者",
    image: IMAGES.dipsanLimbu,
    bioJa: "ネパールと日本双方の文化と美徳を深く理解し、両国を繋ぐ架け橋として『Nepa Travel』を設立いたしました。カトマンズおよびポカラを拠点とした強固な現地直営ネットワークを構築し、日本人旅行者が言葉の壁や高山病の不安を感じることなく、最高峰ヒマラヤの壮大な絶景と温かい現地文化を心から堪能できるよう、安全面・品質面で一切の妥協を許さない最高品質の旅づくりを徹底追求しています。",
    bioEn: "Deeply understanding the cultures of both Nepal and Japan, Dipsan founded Nepa Travel as a bridge between the two nations. He has built an unparalleled network across Kathmandu and Pokhara, ensuring every traveler experiences the majestic Himalayas with absolute safety, authentic hospitality, and zero language barriers.",
    specialty: "総合経営・ネパール観光戦略・品質管理",
    badge: "FOUNDER & CEO",
    experienceYears: "12年"
  },
  {
    id: "pujan-sherpali",
    name: "Pujan Sherpali",
    role: "Head Expedition & Trekking Guide",
    roleJa: "主席ヒマラヤ登頂ガイド",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    bioJa: "エベレスト（標高8,848m）をはじめとする8,000m超のヒマラヤ名峰への登頂経験を複数回誇る伝説的クライミングガイドです。高所医学と緊急救命・高山病予防の高度な専門講習を修了しており、お一人おひとりの体調変化を迅速に見抜きます。初心者向けのポカラハイキングから上級者向けのエベレストベースキャンプ（EBC）まで、ユーモア溢れる人柄と絶対的な安心感で皆様を安全に目的地へお導きします。",
    bioEn: "A legendary expedition guide with multiple 8,000m mountain summits including Mount Everest. Certified in alpine medicine and high-altitude emergency protocols, Pujan provides unwavering safety and memorable mountain stories for trekkers of all experience levels.",
    specialty: "高所トレッキング・エベレスト登山・安全管理",
    badge: "LEAD GUIDE",
    experienceYears: "15年"
  },
  {
    id: "naresh-tamang",
    name: "Naresh Tamang",
    role: "Cultural Heritage & Tour Specialist",
    roleJa: "文化遺産・世界遺産スペシャリスト",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
    bioJa: "カトマンズ盆地の古代寺院、パタンやバクタプルの歴史的建造物、そしてブッダ生誕地ルンビニの聖地文化を長年研究してきた知識豊富な日本語専任ガイドです。流暢で分かりやすい日本語解説に定評があり、単なる名所案内にとどまらず、ネパールの宗教観・伝統建築・ヒンドゥー教や仏教の神秘的な精神世界まで深く解き明かす、知的好奇心を満たす特別な体験をお届けします。",
    bioEn: "A passionate historian specializing in UNESCO World Heritage sites, Kathmandu valley architecture, and sacred Buddhist pilgrimages. His fluent Japanese and deep cultural insights transform standard tours into enriching, soul-stirring journeys.",
    specialty: "ユネスコ世界遺産解説・古代建築・仏教聖地",
    badge: "CULTURAL EXPERT",
    experienceYears: "10年"
  },
  {
    id: "roshan-bhandari",
    name: "Roshan Bhandari",
    role: "Operations & Customer Success Manager",
    roleJa: "現地運行・カスタマーサポート責任者",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=800",
    bioJa: "日本での長年の留学・就労経験を持ち、日本語での完璧で細やかなコミュニケーションが可能なカスタマーサクセス責任者です。24時間365日体制で日本のお客様からのご質問や緊急時のご相談に迅速対応。空港送迎、高級ホテル予約、現地国内フライトの手配から体調不良時の医療機関手配まで、誠実かつ完璧なサポートで快適で安心な旅行を支えます。",
    bioEn: "With extensive experience living in Japan, Roshan manages 24/7 seamless operations, airport transfers, luxury accommodation bookings, and emergency support in fluent Japanese. He guarantees every detail of your trip runs flawlessly.",
    specialty: "日本語カスタマーサポート・運行手配・緊急対応",
    badge: "OPERATIONS",
    experienceYears: "8年"
  },
  {
    id: "ganga-shrestha",
    name: "Ganga Shrestha",
    role: "Senior Sherpa & Mountain Safety Specialist",
    roleJa: "シニアシェルパ・高所安全スペシャリスト",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
    bioJa: "20年以上にわたりヒマラヤ山脈の最前線で数多くの登山隊やトレッキングチームを率いてきた信頼のベテランシェルパです。天候予測や雪崩・崩落危険区域の察知において熟練の知見を持ち、最新の気象データと長年の勘を融合させた確実なルート判断を行います。温かい笑顔と力強いサポートで、お客様のヒマラヤ夢登頂を足元から全力で支えます。",
    bioEn: "A veteran Sherpa with over two decades of leading mountain expeditions. Renowned for his intuitive weather analysis, alpine safety instincts, and friendly encouraging spirit, Ganga ensures every trekker returns home with cherished memories.",
    specialty: "シェルパ専門チーム統括・気象ルート判断",
    badge: "SENIOR SHERPA",
    experienceYears: "22年"
  }
];

export default function About({ isLoggedIn }: AboutProps) {
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem("nepa_team_members") || sessionStorage.getItem("nepa_team_members");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((m: TeamMember) => {
          if (m.id === "dipsan-limbu" && (m.image.includes("dipsan_limbu_original") || !m.image)) {
            return { ...m, image: IMAGES.dipsanLimbu };
          }
          return m;
        });
      }
      return DEFAULT_TEAM_MEMBERS;
    } catch {
      return DEFAULT_TEAM_MEMBERS;
    }
  });

  // Listen for team edits from Admin Panel
  useEffect(() => {
    const syncTeam = () => {
      const saved = localStorage.getItem("nepa_team_members") || sessionStorage.getItem("nepa_team_members");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const updated = parsed.map((m: TeamMember) => {
            if (m.id === "dipsan-limbu" && (m.image.includes("dipsan_limbu_original") || !m.image)) {
              return { ...m, image: IMAGES.dipsanLimbu };
            }
            return m;
          });
          setTeamMembers(updated);
        } catch (e) {}
      }
    };
    window.addEventListener("nepa_team_updated", syncTeam);
    window.addEventListener("storage", syncTeam);
    return () => {
      window.removeEventListener("nepa_team_updated", syncTeam);
      window.removeEventListener("storage", syncTeam);
    };
  }, []);

  const getMemberPhoto = (member: TeamMember) => {
    if (member.image) {
      if (member.id === "dipsan-limbu" && member.image.includes("dipsan_limbu_original")) {
        return IMAGES.dipsanLimbu;
      }
      return member.image;
    }
    if (member.id === "dipsan-limbu") {
      return IMAGES.dipsanLimbu;
    }
    return member.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800";
  };

  const activeMember = teamMembers[currentTeamIndex] || teamMembers[0] || DEFAULT_TEAM_MEMBERS[0];

  // Automatic Smooth Carousel Autoplay Effect (4.5s) unless paused
  useEffect(() => {
    if (isPaused || teamMembers.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTeamIndex((prev) => (prev + 1) % teamMembers.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, teamMembers.length]);

  // Smooth slide navigation
  const handleNext = () => {
    if (teamMembers.length === 0) return;
    setIsPaused(true);
    setCurrentTeamIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const handlePrev = () => {
    if (teamMembers.length === 0) return;
    setIsPaused(true);
    setCurrentTeamIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const coreValues = [
    {
      icon: <Compass className={`w-5 h-5 ${isLoggedIn ? "text-emerald-400" : "text-emerald-600"}`} />,
      bg: isLoggedIn ? "bg-slate-800 border-slate-700 hover:border-emerald-500" : "bg-emerald-50 border-emerald-200 hover:border-emerald-400",
      iconBg: isLoggedIn ? "bg-emerald-950 border-emerald-800" : "bg-emerald-100/80 border-emerald-200",
      title: "神聖なるヒマラヤトレッキング",
      desc: "エベレストをはじめ無数の名峰を歩きます。経験豊富な日本語対応専門ガイドが同行。"
    },
    {
      icon: <ShieldCheck className={`w-5 h-5 ${isLoggedIn ? "text-sky-400" : "text-blue-600"}`} />,
      bg: isLoggedIn ? "bg-slate-800 border-slate-700 hover:border-sky-500" : "bg-blue-50/60 border-blue-200 hover:border-blue-400",
      iconBg: isLoggedIn ? "bg-sky-950 border-sky-800" : "bg-blue-100/80 border-blue-200",
      title: "日本語対応の安心フルサポート",
      desc: "言葉の心配なし。現地ライセンスガイドと日本人スタッフが移動から全行程を完全伴走。"
    },
    {
      icon: <Award className={`w-5 h-5 ${isLoggedIn ? "text-amber-400" : "text-amber-600"}`} />,
      bg: isLoggedIn ? "bg-slate-800 border-slate-700 hover:border-amber-500" : "bg-amber-50/60 border-amber-200 hover:border-amber-400",
      iconBg: isLoggedIn ? "bg-amber-950 border-amber-800" : "bg-amber-100/80 border-amber-200",
      title: "世界遺産と伝統文化の宝庫",
      desc: "カトマンズの古代寺院からブッダ生誕地ルンビニまで。神秘的な芸術と精神世界に触れます。"
    },
    {
      icon: <Heart className={`w-5 h-5 ${isLoggedIn ? "text-rose-400" : "text-rose-600"}`} />,
      bg: isLoggedIn ? "bg-slate-800 border-slate-700 hover:border-rose-500" : "bg-rose-50/60 border-rose-200 hover:border-rose-400",
      iconBg: isLoggedIn ? "bg-rose-950 border-rose-800" : "bg-rose-100/80 border-rose-200",
      title: "「ナマステ」温かい笑顔の国",
      desc: "親日国ネパールの最大の魅力は人の温かさ。家族のように温かくお迎えいたします。"
    }
  ];

  return (
    <section id="about" className={`pt-28 sm:pt-32 pb-20 relative overflow-hidden scroll-mt-28 sm:scroll-mt-32 transition-colors duration-300 ${isLoggedIn ? "bg-slate-900 text-white border-y border-slate-800" : "bg-slate-50 text-slate-900"}`}>
      
      {/* Background Subtle Solid Accent Overlay for Guest / None for Logged In */}
      {!isLoggedIn && (
        <>
          <div className="absolute top-0 right-10 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Top 2-Column: Hero Photo & Brand Values */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          {/* Left Side: Photo Frame with Modern Border Accent & Motion */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col h-full"
          >
            <div className="relative group h-full flex flex-col">
              <div className={`absolute -inset-1 rounded-3xl opacity-50 group-hover:opacity-100 transition-all duration-500 ${isLoggedIn ? "bg-amber-500/20" : "bg-red-600/20"}`} />
              
              <div className={`relative h-[520px] sm:h-[560px] lg:h-full w-full rounded-3xl overflow-hidden shadow-xl border flex flex-col justify-between ${isLoggedIn ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}>
                <img
                  src={IMAGES.hero}
                  alt="Majestic Sunrise Hike in Nepal Himalaya"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 select-none"
                />
                
                {/* Floating caption chip */}
                <div className={`absolute bottom-5 left-5 right-5 p-4 rounded-2xl border flex items-center gap-3 shadow-lg backdrop-blur-md ${isLoggedIn ? "bg-slate-900/95 border-slate-700 text-white" : "bg-white/95 border-slate-200 text-slate-900"}`}>
                  <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Compass className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h4 className={`font-black text-sm leading-none block ${isLoggedIn ? "text-white" : "text-slate-900"}`}>エベレストパノラマ</h4>
                    <span className={`text-xs font-bold block mt-1 ${isLoggedIn ? "text-amber-400" : "text-red-700"}`}>標高 8,848.86m 近郊撮影 · ネパ公式ガイド</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Introduction Text & Core Value Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-4">
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-black rounded-full uppercase tracking-wider border shadow-2xs ${isLoggedIn ? "bg-emerald-950 text-emerald-400 border-emerald-800" : "bg-red-50 text-red-700 border-red-200"}`}>
                <span>Nepa Travel Brand Story</span>
              </div>
              <h2 className={`font-display font-black text-2xl sm:text-3xl md:text-4xl tracking-tight leading-snug ${isLoggedIn ? "text-white" : "text-slate-900"}`}>
                ヒマラヤの雄姿と聖地が息づく国へ。<br className="hidden sm:inline" />
                <span className={isLoggedIn ? "text-emerald-400 font-black" : "text-red-600"}>五感で深まる、一生モノの旅体験を。</span>
              </h2>
              <p className={`leading-relaxed font-semibold text-sm sm:text-base ${isLoggedIn ? "text-slate-200" : "text-slate-800"}`}>
                「ネパ・トラベル」は、世界最高峰の山脈から古代の世界遺産、静寂なる仏教聖地までをお届けするネパール観光旅行の専門エージェントです。<br /><br />
                カトマンズ現地本店と日本語サポート窓口が連携し、空港送迎から専用車手配、高山病ケアまでを完全フルアテンド。初めてネパールを訪れる方から熟練クライマーまで、安全で心満たされる旅をお約束いたします。
              </p>
            </div>

            {/* Grid value cards with modern hover animation */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {coreValues.map((value, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`flex gap-3.5 p-5 rounded-2xl border shadow-xs hover:shadow-md transition-all duration-300 ${value.bg}`}
                >
                  <div className={`shrink-0 p-2.5 rounded-xl flex items-center justify-center h-11 w-11 border shadow-2xs ${value.iconBg}`}>
                    {value.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className={`font-black text-sm sm:text-base ${isLoggedIn ? "text-white" : "text-slate-900"}`}>
                      {value.title}
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed font-semibold ${isLoggedIn ? "text-slate-300" : "text-slate-700"}`}>
                      {value.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

          </motion.div>

        </div>

        {/* Bottom Section: 5 Team Members Carousel (Distinct Guest View vs Logged-In Admin View) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className={`rounded-3xl p-6 sm:p-10 border-2 shadow-2xl relative overflow-hidden transition-all duration-500 ${
            isLoggedIn 
              ? "bg-slate-950 border-slate-800 text-white" 
              : "bg-gradient-to-br from-amber-50/95 via-white to-red-50/90 border-red-200/90 text-slate-900"
          }`}
        >
          {/* Subtle Himalayan backdrop pattern overlay */}
          <div className={`absolute inset-0 pointer-events-none ${
            isLoggedIn 
              ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent" 
              : "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200/30 via-transparent to-transparent"
          }`} />

          {/* Section Header */}
          <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b relative z-10 ${
            isLoggedIn ? "border-slate-800" : "border-slate-200"
          }`}>
            <div>
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-black rounded-full uppercase tracking-wider border shadow-xs mb-2 ${
                isLoggedIn 
                  ? "bg-red-950 text-red-400 border-red-800" 
                  : "bg-red-100 text-red-800 border-red-300"
              }`}>
                <Users className={`w-3.5 h-3.5 ${isLoggedIn ? "text-amber-400" : "text-red-600"}`} />
                <span>{isLoggedIn ? "ADMIN PORTAL · Nepa Specialist Team" : "GUEST VIEW · Nepa Travel Official Guide Team"}</span>
              </div>
              <h3 className={`font-display text-2xl sm:text-3xl font-black tracking-tight ${isLoggedIn ? "text-white" : "text-slate-900"}`}>
                私たち5名の現地専任チームがネパール旅をフルサポート
              </h3>
              <p className={`text-xs sm:text-sm font-bold mt-1 ${isLoggedIn ? "text-slate-300" : "text-slate-600"}`}>
                日本語サポート・運行管理・現場高所シェルパが連携し、一生の想い出となる安全な旅をお約束します。
              </p>
            </div>

            {/* Prev / Next Arrow Controls in Header */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePrev}
                className={`p-3 rounded-2xl border transition-all cursor-pointer active:scale-95 shadow-md ${
                  isLoggedIn 
                    ? "bg-slate-900 hover:bg-red-600 text-white border-slate-700" 
                    : "bg-white hover:bg-red-600 hover:text-white text-slate-800 border-slate-300"
                }`}
                title="前のメンバー"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className={`p-3 rounded-2xl border transition-all cursor-pointer active:scale-95 shadow-md ${
                  isLoggedIn 
                    ? "bg-slate-900 hover:bg-red-600 text-white border-slate-700" 
                    : "bg-white hover:bg-red-600 hover:text-white text-slate-800 border-slate-300"
                }`}
                title="次のメンバー"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Featured Member Showcase with Animated Transitions */}
          <div className="pt-8 relative z-10 min-h-[360px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMember.id}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="grid lg:grid-cols-12 gap-8 items-center w-full"
              >
                {/* Left Photo & Badges */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center text-center gap-3">
                  <div className="relative group self-center">
                    <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-red-600 via-amber-500 to-emerald-500 opacity-75 blur-sm group-hover:opacity-100 transition-all duration-300" />
                    <div className={`relative w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-3xl overflow-hidden border-4 bg-slate-900 shadow-2xl shrink-0 ${
                      isLoggedIn ? "border-slate-800" : "border-white"
                    }`}>
                      <img
                        src={getMemberPhoto(activeMember)}
                        alt={activeMember.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                      />
                    </div>

                    <span className={`absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full border-2 shadow-xl shrink-0 whitespace-nowrap ${
                      isLoggedIn 
                        ? "bg-amber-400 text-slate-950 border-slate-900" 
                        : "bg-amber-500 text-slate-950 border-white"
                    }`}>
                      {activeMember.badge}
                    </span>
                  </div>

                  {/* Centered Dots Indicator */}
                  <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-lg mt-3 self-center ${
                    isLoggedIn 
                      ? "bg-slate-950/60 backdrop-blur-md border-white/10" 
                      : "bg-white/80 backdrop-blur-md border-slate-200"
                  }`}>
                    {teamMembers.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentTeamIndex(idx)}
                        className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                          currentTeamIndex === idx
                            ? isLoggedIn ? "w-7 bg-amber-400" : "w-7 bg-red-600"
                            : isLoggedIn ? "w-2 bg-white/30 hover:bg-white/60" : "w-2 bg-slate-300 hover:bg-slate-400"
                        }`}
                        title={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Bio & Detailed Info */}
                <div className="lg:col-span-7 space-y-4 text-center sm:text-left">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                      <h4 className={`text-2xl sm:text-3xl lg:text-4xl font-black font-sans tracking-tight ${
                        isLoggedIn ? "text-white" : "text-slate-900"
                      }`}>
                        {activeMember.name}
                      </h4>
                      <span className={`text-xs font-black px-3.5 py-1 rounded-xl border shadow-xs ${
                        isLoggedIn 
                          ? "text-red-300 bg-red-950 border-red-800" 
                          : "text-red-800 bg-red-100 border-red-300"
                      }`}>
                        {activeMember.roleJa}
                      </span>
                      <span className={`text-xs font-black px-2.5 py-1 rounded-xl border ${
                        isLoggedIn 
                          ? "text-amber-300 bg-amber-950/80 border-amber-800" 
                          : "text-amber-900 bg-amber-100 border-amber-300"
                      }`}>
                        業界経験 {activeMember.experienceYears}
                      </span>
                    </div>
                    <span className={`text-xs font-black block uppercase tracking-wider font-mono ${
                      isLoggedIn ? "text-amber-300/90" : "text-red-700"
                    }`}>
                      {activeMember.role}
                    </span>
                  </div>

                  {/* Japanese Quote & Detailed Bio */}
                  <div className={`p-5 sm:p-6 rounded-2xl border-2 relative space-y-3 ${
                    isLoggedIn 
                      ? "bg-slate-900/90 border-slate-800 shadow-inner" 
                      : "bg-white/95 border-slate-200/90 shadow-md"
                  }`}>
                    <Quote className={`w-10 h-10 absolute right-4 top-4 pointer-events-none ${
                      isLoggedIn ? "text-amber-400/15" : "text-red-600/10"
                    }`} />
                    <p className={`text-sm sm:text-base font-bold leading-relaxed text-justify ${
                      isLoggedIn ? "text-slate-100" : "text-slate-800"
                    }`}>
                      {activeMember.bioJa}
                    </p>
                    <div className={`pt-2 border-t ${isLoggedIn ? "border-slate-800/80" : "border-slate-200"}`}>
                      <p className={`text-xs font-medium italic leading-relaxed ${
                        isLoggedIn ? "text-slate-400" : "text-slate-500"
                      }`}>
                        "{activeMember.bioEn}"
                      </p>
                    </div>
                  </div>

                  {/* Specialty Tag & Guest CTA */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <span className={`text-xs font-bold ${isLoggedIn ? "text-slate-400" : "text-slate-600"}`}>主要担当・専門領域:</span>
                    <span className={`text-xs font-black border px-3.5 py-1.5 rounded-xl ${
                      isLoggedIn 
                        ? "text-emerald-300 bg-emerald-950/80 border-emerald-800" 
                        : "text-emerald-800 bg-emerald-50 border-emerald-300"
                    }`}>
                      {activeMember.specialty}
                    </span>
                    <span className={`text-xs font-bold border px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${
                      isLoggedIn 
                        ? "text-amber-300 bg-slate-900 border-slate-800" 
                        : "text-amber-900 bg-amber-50 border-amber-300"
                    }`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isLoggedIn ? "text-amber-400" : "text-amber-600"}`} />
                      現地公式専任スタッフ
                    </span>

                    {/* Guest Consultation CTA button (Only visible in Guest view) */}
                    {!isLoggedIn && (
                      <a
                        href="#contact"
                        className="mt-2 sm:mt-0 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 text-amber-300" />
                        <span>{activeMember.name}に旅行の無料相談をする</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Thumbnails Grid Bar */}
          <div className={`mt-8 pt-6 border-t relative z-10 ${
            isLoggedIn ? "border-slate-800/80" : "border-slate-200"
          }`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
              {teamMembers.map((member, index) => {
                const isActive = index === currentTeamIndex;
                const memberPhoto = getMemberPhoto(member);
                return (
                  <button
                    key={member.id}
                    onClick={() => setCurrentTeamIndex(index)}
                    className={`flex items-center gap-2.5 p-2 sm:p-2.5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isActive
                        ? isLoggedIn
                          ? "bg-red-600/90 text-white border-amber-400 shadow-lg shadow-red-950/50 scale-[1.02]"
                          : "bg-red-600 text-white border-red-700 shadow-lg scale-[1.02]"
                        : isLoggedIn
                          ? "bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
                          : "bg-white/90 text-slate-700 border-slate-200 hover:border-red-300 hover:bg-red-50/50"
                    }`}
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-white/20 shrink-0 shadow-xs">
                      <img src={memberPhoto} alt={member.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="text-left min-w-0 flex-1">
                      <span className="text-xs sm:text-sm font-black block truncate leading-tight">
                        {member.name}
                      </span>
                      <span className={`text-[10px] font-bold block truncate mt-0.5 ${
                        isActive ? "text-amber-200" : isLoggedIn ? "text-slate-400" : "text-slate-500"
                      }`}>
                        {member.roleJa}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}

