/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Tours from "./components/Tours";
import Reviews from "./components/Reviews";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import AuthModal from "./components/AuthModal";
import BookingModal from "./components/BookingModal";
import UserProfileModal from "./components/UserProfileModal";
import AdminPanel from "./components/AdminPanel";
import AuthToast, { AuthToastData } from "./components/AuthToast";
import { NepalMapExplorer } from "./components/NepalMapExplorer";
import { TOURS } from "./data";
import { CheckCircle2, Compass, ArrowUp, Instagram, Facebook, Twitter, Globe, Heart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import nepaLogo from "./assets/images/nepa_travel_hd_logo_1785218025055.jpg";

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ 
    username: string; 
    email: string; 
    phone?: string; 
    bio?: string; 
    country?: string; 
    avatarUrl?: string; 
  } | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<"login" | "register">("login");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [bookingSuccessTour, setBookingSuccessTour] = useState<string | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingPreselectTour, setBookingPreselectTour] = useState<string | null>(null);
  const [bookingInitialTab, setBookingInitialTab] = useState<"book" | "history">("book");
  const [authToast, setAuthToast] = useState<AuthToastData | null>(null);
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  // Global Google Maps Platform Quota Defense Listener (Case A Compliance)
  useEffect(() => {
    const handleQuota = () => setMapsQuotaExceeded(true);
    window.addEventListener("gmp-quota-exceeded", handleQuota);
    return () => window.removeEventListener("gmp-quota-exceeded", handleQuota);
  }, []);

  // Safe localStorage setter to prevent QuotaExceededError
  const safeSetLocalStorage = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.warn(`localStorage quota exceeded while setting ${key}. Cleaning non-essential cache:`, err);
      try {
        localStorage.removeItem("nepa_custom_team_photos");
        localStorage.setItem(key, value);
      } catch (e) {
        console.error(`Could not save item ${key} to localStorage:`, e);
      }
    }
  };

  // Restore user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("nepa_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.email) {
          const profileKey = `nepa_profile_${parsed.email.toLowerCase()}`;
          const storedProfile = localStorage.getItem(profileKey);
          if (storedProfile) {
            try {
              const extra = JSON.parse(storedProfile);
              const merged = { ...parsed, ...extra };
              setCurrentUser(merged);
              safeSetLocalStorage("nepa_user", JSON.stringify(merged));
            } catch (e) {
              setCurrentUser(parsed);
            }
          } else {
            setCurrentUser(parsed);
          }
        } else {
          setCurrentUser(parsed);
        }
      } catch (e) {
        localStorage.removeItem("nepa_user");
      }
    }

    // Scroll state tracker
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginSuccess = (user: { username: string; email: string; token: string; avatarUrl?: string; phone?: string; bio?: string; country?: string }) => {
    let fullUser = { ...user };
    if (user.email) {
      const profileKey = `nepa_profile_${user.email.toLowerCase()}`;
      const savedProfile = localStorage.getItem(profileKey);
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          // Retain user custom avatarUrl, bio, phone, country and name across re-logins
          fullUser = { ...user, ...parsed, token: user.token };
        } catch (e) {
          console.error("Error loading saved user profile:", e);
        }
      }
      safeSetLocalStorage(profileKey, JSON.stringify(fullUser));
    }

    setCurrentUser(fullUser);
    safeSetLocalStorage("nepa_user", JSON.stringify(fullUser));
    setAuthToast({
      type: "login",
      title: "ログインに成功しました！",
      message: `おかえりなさい、${fullUser.username}様！ネパトラベルへようこそ。`,
      username: fullUser.username,
      avatarUrl: fullUser.avatarUrl
    });
  };

  const handleUpdateProfile = (updatedProfile: Partial<{ username: string; email: string; phone?: string; bio?: string; country?: string; avatarUrl?: string }>) => {
    if (currentUser) {
      const updated = { ...currentUser, ...updatedProfile };
      setCurrentUser(updated);
      safeSetLocalStorage("nepa_user", JSON.stringify(updated));
      if (updated.email) {
        const profileKey = `nepa_profile_${updated.email.toLowerCase()}`;
        safeSetLocalStorage(profileKey, JSON.stringify(updated));

        // Sync with backend database so profile picture and data load on published URL / other devices
        fetch("/api/auth/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: updated.email,
            username: updated.username,
            avatarUrl: updated.avatarUrl,
            phone: updated.phone,
            bio: updated.bio,
            country: updated.country,
          }),
        }).catch((err) => console.warn("Background profile sync notice:", err));
      }
    }
  };

  const handleUpdateAvatar = (avatarUrl: string) => {
    handleUpdateProfile({ avatarUrl });
  };

  const handleLogout = () => {
    const prevUsername = currentUser?.username;
    setCurrentUser(null);
    localStorage.removeItem("nepa_user");
    setAuthToast({
      type: "logout",
      title: "ログアウトしました",
      message: "ご利用ありがとうございました。またのご利用を心よりお待ちしております！",
      username: prevUsername,
    });
  };

  const handleOpenAuth = (tab: "login" | "register") => {
    setAuthInitialTab(tab);
    setAuthModalOpen(true);
  };

  // Direct integration of interactive Online booking & pay flow modal 
  const handleBookTour = (tourName: string) => {
    setBookingPreselectTour(tourName);
    setBookingInitialTab("book");
    setBookingModalOpen(true);
  };

  const handleOpenBooking = (tab: "book" | "history") => {
    setBookingInitialTab(tab);
    setBookingPreselectTour(null);
    setBookingModalOpen(true);
  };

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
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
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full max-w-full overflow-x-hidden flex flex-col justify-between font-sans selection:bg-brand-green-500 selection:text-white bg-slate-50 relative">
      
      {/* Google Maps Quota Warning Banner (Case A Requirement) */}
      {mapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Dynamic Sticky Header Navigation */}
      <Navbar
        currentUser={currentUser}
        isLoggedIn={!!currentUser}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
        onOpenBooking={handleOpenBooking}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenAdmin={() => setAdminPanelOpen(true)}
      />

      {/* Main Core Document Container */}
      <main className="flex-grow">
        
        {/* Full screen carousel slider hero element */}
        <Hero
          isLoggedIn={!!currentUser}
          onSeeTours={() => handleScrollToSection("tours")}
          onBookNow={() => handleScrollToSection("contact")}
        />

        {/* Dynamic side-by-side Japanese introductory block */}
        <About isLoggedIn={!!currentUser} />

        {/* 4 Packages cards collection plus itinerary modals */}
        <Tours isLoggedIn={!!currentUser} onBookTour={handleBookTour} />

        {/* Google Maps Platform Interactive Tour Explorer */}
        <NepalMapExplorer
          onOpenBookingModal={(tourId) => {
            const foundTour = TOURS.find((t) => t.id === tourId);
            handleBookTour(foundTour ? foundTour.name : "ポカラツアー");
          }}
        />

        {/* Auto sliding feedback reviews carousel */}
        <Reviews isLoggedIn={!!currentUser} />

        {/* Lightboxed mosaic gallery of mountains and stupas */}
        <Gallery isLoggedIn={!!currentUser} />

        {/* Contact post form, QR codes and details pane */}
        <Contact isLoggedIn={!!currentUser} />

      </main>

      {/* Ultra-Modern Localized Japanese Footer */}
      <footer className={`${currentUser ? "bg-slate-950 text-slate-100 border-t border-slate-800" : "bg-slate-950 border-t border-slate-800 text-slate-200"} font-medium relative overflow-hidden transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          
          {/* Main Footer Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* Brand Column (Col 5) */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-white border border-red-500/80 shadow-md shrink-0 flex items-center justify-center">
                  <img 
                    src={nepaLogo} 
                    alt="Nepa Travel Official Logo" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center scale-105"
                  />
                </div>
                <div>
                  <span className="font-sans font-black text-xl sm:text-2xl tracking-tight block">
                    <span className="text-red-500 font-black">Nepa</span>{" "}
                    <span className="text-white font-black">Travel</span>
                  </span>
                  <span className="text-xs text-amber-200/80 font-medium block mt-0.5">ネパール公式観光・日本語フルサポート</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-slate-200 max-w-md font-semibold">
                カトマンズ現地本店と日本カスタマーサポートが連携し、空港送迎・専用車・日本語ライセンスガイド手配まで、すべて日本語でフル伴走いたします。
              </p>

              {/* Minimal License Badges */}
              <div className="pt-1 flex flex-wrap gap-2 text-[11px] font-bold text-slate-200">
                <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-full flex items-center gap-1.5 text-amber-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
                  ネパール国観光省 (MoCTCA) No.9842A
                </span>
                <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-slate-200">
                  NATTA 正会員
                </span>
              </div>
            </div>

            {/* Navigation Column (Col 4) */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-white text-xs font-black tracking-widest uppercase">
                サイトマップ
              </h4>
              <ul className="grid grid-cols-2 gap-2.5 text-xs sm:text-sm font-bold">
                {[
                  { id: "home", label: "ホーム" },
                  { id: "tours", label: "ツアーパッケージ" },
                  { id: "about", label: "ブランドストーリー" },
                  { id: "reviews", label: "お客様の口コミ" },
                  { id: "gallery", label: "フォトギャラリー" },
                  { id: "contact", label: "お問い合わせ" },
                ].map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => handleScrollToSection(link.id)}
                      className="hover:text-amber-300 text-slate-200 transition-colors cursor-pointer block py-1"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social & Contact Column (Col 3) */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-white text-xs font-black tracking-widest uppercase">
                公式 SNS ＆ アカウント
              </h4>
              <div className="flex items-center gap-2.5">
                <a href="#footer" className="p-2.5 bg-slate-900 hover:bg-red-600 hover:text-white rounded-xl text-slate-200 border border-slate-700 transition-all cursor-pointer" title="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#footer" className="p-2.5 bg-slate-900 hover:bg-red-600 hover:text-white rounded-xl text-slate-200 border border-slate-700 transition-all cursor-pointer" title="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#footer" className="p-2.5 bg-slate-900 hover:bg-red-600 hover:text-white rounded-xl text-slate-400 border border-slate-700 transition-all cursor-pointer" title="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#footer" className="p-2.5 bg-slate-900 hover:bg-red-600 hover:text-white rounded-xl text-slate-200 border border-slate-700 transition-all cursor-pointer" title="Website">
                  <Globe className="w-4 h-4" />
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleScrollToSection("contact")}
                  className={`w-full py-3 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-md hover:shadow-lg text-center block border active:scale-95 ${
                    currentUser 
                      ? "bg-emerald-600 hover:bg-emerald-500 border-emerald-400" 
                      : "bg-red-600 hover:bg-red-700 border-red-500"
                  }`}
                >
                  無料お見積りをご依頼
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Legal Line */}
          <div className="mt-10 pt-6 border-t border-slate-800 text-center flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-300 font-semibold">
            <p>
              &copy; {new Date().getFullYear()} Nepa Travel. All Rights Reserved.
            </p>
            <div className="flex items-center gap-1 text-[11px] text-slate-300 font-semibold">
              <span>Crafted for Japan & International Travelers</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline-block ml-0.5" />
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Scroll to Top Arrow */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-35 p-3 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl hover:shadow-2xl transition-all transform active:scale-95 cursor-pointer border border-white/10"
            title="トップへスクロール"
            id="btn-scroll-top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Auth Drawer Modal overlay */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authInitialTab}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Modern Interactive Booking & Payments Modal overlay */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedTourName={bookingPreselectTour}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        initialTab={bookingInitialTab}
      />

      {/* User Account / Profile Details Modal */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenBooking={handleOpenBooking}
        onUpdateAvatar={handleUpdateAvatar}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Admin Dashboard & Management System */}
      <AdminPanel
        isOpen={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Login & Logout Floating Notification Toast Popup */}
      <AuthToast
        toast={authToast}
        onClose={() => setAuthToast(null)}
      />

    </div>
  );
}

