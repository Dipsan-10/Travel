import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Compass, History, ChevronDown, Sparkles, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import nepaLogo from "../assets/images/nepa_travel_hd_logo_1785218025055.jpg";
import LogoutConfirmModal from "./LogoutConfirmModal";

interface NavbarProps {
  currentUser: { username: string; email: string; avatarUrl?: string } | null;
  isLoggedIn?: boolean;
  onLogout: () => void;
  onOpenAuth: (tab: "login" | "register") => void;
  onOpenBooking: (tab: "book" | "history") => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
}

export default function Navbar({ 
  currentUser, 
  isLoggedIn: isLoggedInProp,
  onLogout, 
  onOpenAuth, 
  onOpenBooking,
  onOpenProfile,
  onOpenAdmin
}: NavbarProps) {
  const isLoggedIn = isLoggedInProp ?? Boolean(currentUser);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  // Handle scroll effects for sticky nav styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Active section detection including Map
      const sections = ["home", "about", "tours", "map", "reviews", "gallery", "contact"];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "ホーム" },
    { id: "about", label: "アバウト" },
    { id: "tours", label: "ツアー" },
    { id: "map", label: "MAP" },
    { id: "reviews", label: "レビュー" },
    { id: "gallery", label: "ギャラリー" },
    { id: "contact", label: "お問い合わせ" },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-3.5 sm:py-4 text-slate-800 border-b border-slate-100"
          : "bg-gradient-to-b from-black/75 via-black/45 to-transparent py-4 sm:py-5 text-white"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center w-full min-w-0">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 mr-2 lg:mr-4 xl:mr-6"
          >
            {/* Nepa Travel Image Logo */}
            <div className={`relative w-10 h-10 sm:w-12 sm:h-12 xl:w-13 xl:h-13 rounded-2xl overflow-hidden bg-white shadow-md border-2 group-hover:scale-105 transition-all shrink-0 flex items-center justify-center ${
              isLoggedIn ? "border-emerald-500/90 group-hover:border-emerald-400" : "border-red-500/80 group-hover:border-red-400"
            }`}>
              <img 
                src={nepaLogo} 
                alt="Nepa Travel Official Logo" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="shrink-0">
              <span className="font-display font-black text-lg sm:text-xl xl:text-2xl tracking-tight leading-none block">
                <span className={scrolled ? "text-[#8B0000] font-black" : "text-red-500 font-black"}>
                  Nepa
                </span>{" "}
                <span className={scrolled ? "text-[#002147] font-black" : "text-white font-black"}>
                  Travel
                </span>
              </span>
              <span className={`text-[9px] sm:text-[10px] xl:text-xs font-medium tracking-widest uppercase block mt-0.5 ${scrolled ? "text-slate-500" : "text-slate-200/90"}`}>
                <span className="inline-flex items-center gap-1 sm:gap-1.5">
                  ネパトラベル
                  {isLoggedIn && (
                    <span className="inline-flex items-center gap-0.5 px-1 sm:px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 font-black text-[9px] sm:text-[10px] tracking-wider uppercase shadow-xs border border-yellow-200">
                      <Sparkles className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-slate-950 fill-slate-950 shrink-0" />
                      VIP
                    </span>
                  )}
                </span>
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-5 min-w-0">
            <div className="flex items-center gap-1 xl:gap-2.5 shrink-0">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2.5 lg:px-3 xl:px-4 py-1.5 lg:py-2 xl:py-2.5 rounded-xl text-xs lg:text-sm xl:text-base font-extrabold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeSection === item.id
                      ? isLoggedIn
                        ? scrolled
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-emerald-500 text-white shadow-md"
                        : scrolled
                        ? "bg-red-600 text-white shadow-sm"
                        : "bg-white text-slate-950 shadow-md"
                      : scrolled
                      ? isLoggedIn
                        ? "text-slate-700 hover:text-emerald-600 hover:bg-slate-100"
                        : "text-slate-700 hover:text-red-600 hover:bg-slate-100"
                      : "text-white/95 hover:text-white hover:bg-white/20"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* User Account/Auth Buttons */}
            <div className="flex items-center gap-1.5 lg:gap-2 xl:gap-3 border-l border-slate-300/40 pl-2 lg:pl-3 xl:pl-4 shrink-0">
              
              {/* Admin Dashboard Access */}
              <button
                onClick={onOpenAdmin}
                className={`text-xs xl:text-sm font-black whitespace-nowrap px-2.5 lg:px-3 xl:px-3.5 py-1.5 lg:py-2 xl:py-2.5 rounded-xl border shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1 lg:gap-1.5 ${
                  scrolled 
                    ? "bg-slate-900 text-amber-300 border-slate-800 hover:bg-slate-950" 
                    : "bg-black/60 text-amber-300 border-amber-400/40 hover:bg-black/80 backdrop-blur-md"
                }`}
                title="管理者ダッシュボードを開く"
                id="nav-admin-panel-btn"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>管理者</span>
              </button>

              {/* Online Booking Action */}
              <button
                onClick={() => onOpenBooking("book")}
                className={`text-xs lg:text-sm xl:text-base font-extrabold whitespace-nowrap px-2.5 lg:px-3.5 xl:px-4 py-1.5 lg:py-2 xl:py-2.5 rounded-xl shadow-md hover:shadow-lg transform active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 xl:gap-2 ${
                  isLoggedIn 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                    : "bg-blue-900 hover:bg-blue-950 text-white"
                }`}
                id="nav-online-book"
              >
                <Compass className={`w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 shrink-0 ${isLoggedIn ? "text-cyan-200" : "text-amber-400"}`} />
                <span>オンライン予約</span>
              </button>

              {currentUser && (
                <button
                  onClick={() => onOpenBooking("history")}
                  className={`text-xs lg:text-sm xl:text-base font-extrabold whitespace-nowrap px-2.5 lg:px-3.5 xl:px-4 py-1.5 lg:py-2 xl:py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 xl:gap-2 ${
                    scrolled 
                      ? "bg-slate-100 text-slate-800 hover:bg-slate-200" 
                      : "bg-white/15 text-white hover:bg-white/25"
                  }`}
                  id="nav-my-bookings"
                >
                  <History className="w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 text-amber-500 shrink-0" />
                  <span>マイ予約</span>
                </button>
              )}

              {currentUser ? (
                <button
                  onClick={onOpenProfile}
                  className={`w-9 h-9 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-full p-0.5 border-2 transition-all cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 relative flex items-center justify-center shrink-0 ${
                    scrolled
                      ? "border-amber-500/90 bg-slate-900 hover:border-amber-400"
                      : "border-white bg-white/25 backdrop-blur-md hover:border-amber-300"
                  }`}
                  title={`${currentUser.username} 様 - マイアカウント`}
                  id="nav-user-account-btn"
                >
                  <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                    {currentUser.avatarUrl ? (
                      <img 
                        src={currentUser.avatarUrl} 
                        alt={currentUser.username} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-red-600 text-white font-black text-xs xl:text-base flex items-center justify-center">
                        {currentUser.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 lg:gap-2.5 shrink-0">
                  <button
                    onClick={() => onOpenAuth("login")}
                    className={`text-xs lg:text-sm xl:text-base font-bold px-2.5 lg:px-3.5 xl:px-4 py-1.5 lg:py-2 xl:py-2.5 rounded-xl cursor-pointer transition-all whitespace-nowrap ${
                      scrolled 
                        ? "text-slate-800 hover:text-red-600 hover:bg-slate-100" 
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    ログイン
                  </button>
                  <button
                    onClick={() => onOpenAuth("register")}
                    className="text-xs lg:text-sm xl:text-base font-black bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 lg:px-4 xl:px-5 py-1.5 lg:py-2 xl:py-2.5 rounded-xl shadow-md hover:shadow-lg transform active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
                  >
                    新規登録
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburg menu button */}
          <div className="flex lg:hidden items-center gap-2">
            {currentUser && (
              <button
                onClick={onOpenProfile}
                className={`w-9 h-9 rounded-full p-0.5 border-2 transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center ${
                  scrolled 
                    ? "border-amber-500 bg-slate-900" 
                    : "border-white/80 bg-white/20 backdrop-blur-md"
                }`}
                title={`${currentUser.username} 様 - マイアカウント`}
              >
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                  {currentUser.avatarUrl ? (
                    <img 
                      src={currentUser.avatarUrl} 
                      alt={currentUser.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-red-600 via-orange-500 to-amber-500 text-white font-black text-xs flex items-center justify-center">
                      {currentUser.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                scrolled ? "text-slate-800 hover:bg-slate-100" : "text-white hover:bg-white/10"
              }`}
              id="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 text-slate-800 shadow-xl overflow-hidden"
            id="mobile-drawer"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-bold block transition-colors cursor-pointer ${
                    activeSection === item.id
                      ? "bg-red-600 text-white shadow-md"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                
                {/* Mobile Admin Trigger */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-3 bg-slate-950 text-amber-300 rounded-xl text-sm font-black transition-colors cursor-pointer shadow-sm border border-slate-800"
                >
                  <Shield className="w-4 h-4 text-amber-400" />
                  管理者ダッシュボード (Admin Panel)
                </button>

                {/* Mobile Booking Quick Triggers */}
                <div className="grid grid-cols-2 gap-2.5 px-1">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenBooking("book");
                    }}
                    className="flex justify-center items-center gap-1.5 py-2.5 px-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    <Compass className="w-4 h-4 text-amber-400" />
                    安全予約
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenBooking("history");
                    }}
                    className="flex justify-center items-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                  >
                    <History className="w-4 h-4 text-amber-500" />
                    予約照会
                  </button>
                </div>

                {currentUser ? (
                  <div 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenProfile();
                    }}
                    className="flex items-center justify-between p-3 bg-slate-900 rounded-2xl text-white cursor-pointer hover:bg-slate-800 transition-all border border-slate-800 shadow-sm group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shrink-0 shadow-xs overflow-hidden border border-amber-400">
                        {currentUser.avatarUrl ? (
                          <img 
                            src={currentUser.avatarUrl} 
                            alt={currentUser.username} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          currentUser.username.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-black block truncate text-white">
                          {currentUser.username} 様
                        </span>
                        <span className="text-[10px] text-amber-400 font-extrabold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> VIP 会員マイページ
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors shrink-0" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 px-2">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAuth("login");
                      }}
                      className="text-center px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-bold transition-all cursor-pointer"
                    >
                      ログイン
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAuth("register");
                      }}
                      className="text-center px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-bold transition-all cursor-pointer"
                    >
                      新規登録
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Dialog Modal */}
      <LogoutConfirmModal
        isOpen={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={onLogout}
        username={currentUser?.username}
      />
    </nav>
  );
}
