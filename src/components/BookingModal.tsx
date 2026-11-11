import React, { useState, useEffect } from "react";
import { 
  X, 
  CreditCard, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  Info, 
  MapPin, 
  Receipt,
  Ticket,
  Percent,
  Compass,
  AlertTriangle,
  BadgeJapaneseYen,
  History,
  PlaneTakeoff,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Check,
  Filter
} from "lucide-react";
import { TOURS, TourItem } from "../data";
import { motion, AnimatePresence } from "motion/react";
import nepaLogo from "../assets/images/nepa_travel_hd_logo_1785218025055.jpg";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTourName?: string | null;
  currentUser: { username: string; email: string; token?: string } | null;
  onOpenAuth: (tab: "login" | "register") => void;
  initialTab?: "book" | "history";
}

export interface BookingRecord {
  id: string;
  tourId: string;
  tourName: string;
  travelDate: string;
  travelers: number;
  addOns: string[];
  totalPrice: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: "Paid" | "Pending";
  customerName: string;
  customerEmail: string;
  createdDate: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  preselectedTourName,
  currentUser,
  onOpenAuth,
  initialTab = "book"
}: BookingModalProps) {
  const activeTours = TOURS;
  
  const [activeTab, setActiveTab] = useState<"book" | "history">("book");
  const [selectedTour, setSelectedTour] = useState<TourItem>(activeTours[0]);
  const [travelDate, setTravelDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");
  
  // Custom travel Add-ons
  const [addons, setAddons] = useState({
    sherpa: false,
    suite: false,
    helicopter: false
  });

  // Coupons
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Guest inputs
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Credit Card Form Data
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Storage array of bookings
  const [bookingsList, setBookingsList] = useState<BookingRecord[]>([]);

  // Payment states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [justBooked, setJustBooked] = useState<BookingRecord | null>(null);

  // Custom Tour Selector Dropdown/Modal States
  const [isTourPickerOpen, setIsTourPickerOpen] = useState(false);
  const [tourSearchQuery, setTourSearchQuery] = useState("");
  const [selectedTourCategory, setSelectedTourCategory] = useState("all");

  // Custom Interactive Calendar States
  const todayDateObj = new Date();
  const [calMonth, setCalMonth] = useState(todayDateObj.getMonth()); // 0 - 11
  const [calYear, setCalYear] = useState(todayDateObj.getFullYear());
  const [showManualDateInput, setShowManualDateInput] = useState(false);

  const handleSelectDate = (dateStr: string) => {
    setTravelDate(dateStr);
    if (dateStr) {
      const parts = dateStr.split("-").map(Number);
      if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        setCalYear(parts[0]);
        setCalMonth(parts[1] - 1);
      }
    }
  };

  // Sync initial tab and preselected values
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      if (preselectedTourName) {
        const query = preselectedTourName.trim().toLowerCase();
        const tour = activeTours.find(t => {
          const tName = t.name.toLowerCase();
          const tId = t.id.toLowerCase();
          return tName === query || tId === query || tName.includes(query) || query.includes(tName);
        });
        if (tour) {
          setSelectedTour(tour);
        }
      }
    }
  }, [isOpen, preselectedTourName, initialTab]);

  // Load and populate bookings list
  useEffect(() => {
    const fetchBookings = async () => {
      if (currentUser && currentUser.token) {
        try {
          const response = await fetch("/api/bookings", {
            headers: {
              "Authorization": `Bearer ${currentUser.token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setBookingsList(data);
            return;
          }
        } catch (e) {
          console.error("Failed to fetch bookings from Postgres database:", e);
        }
      }

      const stored = localStorage.getItem("nepa_bookings");
      if (stored) {
        try {
          setBookingsList(JSON.parse(stored));
        } catch (e) {
          localStorage.removeItem("nepa_bookings");
        }
      } else {
        // Pre-load an elegant sample booking for visual completeness
        const defaultSamples: BookingRecord[] = [
          {
            id: "NPB-729013",
            tourId: "kathmandu",
            tourName: "カトマンズツアー",
            travelDate: "2025-10-15",
            travelers: 2,
            addOns: ["日本語専任シェルパ同行"],
            totalPrice: 255000,
            currency: "JPY",
            paymentMethod: "クレジットカード決済",
            paymentStatus: "Paid",
            customerName: currentUser?.username || "ゲストユーザー",
            customerEmail: currentUser?.email || "guest@example.com",
            createdDate: "2025-08-10"
          }
        ];
        localStorage.setItem("nepa_bookings", JSON.stringify(defaultSamples));
        setBookingsList(defaultSamples);
      }
    };
    if (isOpen) {
      fetchBookings();
    }
  }, [isOpen, currentUser]);

  // Default Travel date helper
  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 45);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    setTravelDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const getBasePriceNum = (priceStr: string) => {
    const cleanNum = priceStr.replace(/[^0-9]/g, "");
    return parseInt(cleanNum, 10) || 120000;
  };

  const SHERPA_PRICE = 25000;
  const SUITE_PRICE = 40000;
  const HELI_PRICE = 85000;

  const basePriceNum = getBasePriceNum(selectedTour.price);
  const subtotal = basePriceNum * travelers;
  
  let addonTotal = 0;
  if (addons.sherpa) addonTotal += SHERPA_PRICE * travelers;
  if (addons.suite) addonTotal += SUITE_PRICE;
  if (addons.helicopter) addonTotal += HELI_PRICE * travelers;

  const rawTotal = subtotal + addonTotal;
  const discountRate = couponApplied ? 0.10 : 0.0;
  const discountAmount = Math.round(rawTotal * discountRate);
  const taxRate = 0.13;
  const taxAmount = Math.round((rawTotal - discountAmount) * taxRate);
  const GRAND_TOTAL = (rawTotal - discountAmount) + taxAmount;

  const processSteps = [
    "日本側決済窓口ゲートウェイへの接続中...",
    "クレジットカードの安全性を確認、3Dセキュア照合中...",
    "ネパール国観光省（MoCTCA）登録ツアー確約コードの発行中...",
    "決済およびツアー仮予約が正常に完了しました！"
  ];

  const applyCoupon = () => {
    if (!coupon.trim()) return;
    const cleanCoupon = coupon.trim().toUpperCase();
    if (cleanCoupon === "NEPAL2026" || cleanCoupon === "NAMASTE") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("有効なプロモコードではありません。");
      setCouponApplied(false);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw.length > 16) raw = raw.slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw.length > 4) raw = raw.slice(0, 4);
    if (raw.length > 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const handleCardCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw.length <= 3) {
      setCardCvc(raw);
    }
  };

  const fillDemoCard = (brand: string = "visa") => {
    if (brand === "mastercard") {
      setCardNumber("5412 7531 9824 1056");
    } else if (brand === "amex") {
      setCardNumber("3782 8224 6310 005");
    } else if (brand === "jcb") {
      setCardNumber("3528 1234 5678 9012");
    } else {
      setCardNumber("4532 1234 5678 9010");
    }
    setCardHolder(currentUser?.username ? currentUser.username.toUpperCase() : "TARO YAMADA");
    setCardExpiry("12/28");
    setCardCvc("888");
    setFormErrors(prev => {
      const copy = { ...prev };
      delete copy.card;
      delete copy.cardholder;
      delete copy.expiry;
      delete copy.cvc;
      return copy;
    });
  };

  const getCardBrandDetails = (num: string) => {
    const digits = num.replace(/\D/g, "");
    if (/^4/.test(digits)) {
      return {
        brand: "visa",
        name: "Visa",
        gradient: "bg-gradient-to-tr from-blue-950 via-indigo-900 to-slate-950 border-2 border-blue-500",
        chipBg: "bg-amber-400 border border-amber-300",
        accentColor: "text-blue-300",
        badgeBg: "bg-blue-600/90 text-white border border-blue-400",
        logo: (
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl border border-blue-300/40 shadow-sm">
            <span className="font-sans font-black italic text-xl tracking-tighter text-white drop-shadow-md">
              VISA
            </span>
          </div>
        )
      };
    }
    if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(digits)) {
      return {
        brand: "mastercard",
        name: "Mastercard",
        gradient: "bg-gradient-to-tr from-red-950 via-rose-900 to-slate-950 border-2 border-rose-500",
        chipBg: "bg-amber-400 border border-amber-300",
        accentColor: "text-rose-300",
        badgeBg: "bg-rose-700 text-white border border-rose-400",
        logo: (
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700 shadow-sm">
            <div className="flex -space-x-2">
              <div className="w-5 h-5 rounded-full bg-red-600 shadow-xs" />
              <div className="w-5 h-5 rounded-full bg-amber-400 opacity-90 shadow-xs" />
            </div>
            <span className="font-sans font-black text-xs tracking-tight text-white uppercase">
              mastercard
            </span>
          </div>
        )
      };
    }
    if (/^3[47]/.test(digits)) {
      return {
        brand: "amex",
        name: "American Express",
        gradient: "bg-gradient-to-tr from-teal-950 via-cyan-900 to-slate-950 border-2 border-cyan-500",
        chipBg: "bg-cyan-200 border border-cyan-300",
        accentColor: "text-cyan-300",
        badgeBg: "bg-cyan-700 text-white border border-cyan-400",
        logo: (
          <div className="flex items-center gap-1.5 bg-cyan-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-cyan-400/60 shadow-sm">
            <span className="font-sans font-black text-xs tracking-widest text-cyan-200">
              AMEX
            </span>
          </div>
        )
      };
    }
    if (/^(352[89]|35[3-8])/.test(digits)) {
      return {
        brand: "jcb",
        name: "JCB",
        gradient: "bg-gradient-to-tr from-emerald-950 via-slate-900 to-blue-950 border-2 border-emerald-500",
        chipBg: "bg-amber-400 border border-amber-300",
        accentColor: "text-emerald-300",
        badgeBg: "bg-blue-700 text-white border border-blue-400",
        logo: (
          <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700 shadow-sm">
            <div className="flex gap-0.5">
              <div className="w-1.5 h-4 bg-blue-600 rounded-xs" />
              <div className="w-1.5 h-4 bg-red-600 rounded-xs" />
              <div className="w-1.5 h-4 bg-emerald-500 rounded-xs" />
            </div>
            <span className="font-sans font-black text-xs tracking-wider text-white">
              JCB
            </span>
          </div>
        )
      };
    }
    return {
      brand: "generic",
      name: "Credit Card",
      gradient: "bg-slate-950 border-2 border-slate-800",
      chipBg: "bg-amber-400 border border-amber-300",
      accentColor: "text-amber-300",
      badgeBg: "bg-slate-800 text-slate-200 border border-slate-700",
      logo: (
        <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-xl border border-slate-700 shadow-sm">
          <CreditCard className="w-4 h-4 text-amber-400" />
          <span className="font-sans font-black text-xs tracking-wider text-slate-200">
            SECURE CARD
          </span>
        </div>
      )
    };
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    const authorName = currentUser?.username || guestName;
    const authorEmail = currentUser?.email || guestEmail;

    if (!authorName.trim()) {
      errors.name = "お名前を入力してください。";
    }
    if (!authorEmail.trim() || !authorEmail.includes("@")) {
      errors.email = "有効なメールアドレスを入力してください。";
    }
    if (!travelDate) {
      errors.date = "出発希望日を指定してください。";
    }

    if (paymentMethod === "card") {
      if (cardNumber.replace(/\s/g, "").length !== 16) {
        errors.card = "正しい16桁のカード番号を入力してください。";
      }
      if (cardExpiry.length !== 5) {
        errors.expiry = "有効期限（MM/YY）を入力してください。";
      }
      if (cardCvc.length !== 3) {
        errors.cvc = "3桁のCVCセキュリティコードを入力してください。";
      }
      if (!cardHolder.trim()) {
        errors.cardholder = "カード名義人を英字でご入力ください。";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsProcessing(true);
    setProcessStep(0);

    const timer1 = setTimeout(() => {
      setProcessStep(1);
    }, 1100);

    const timer2 = setTimeout(() => {
      setProcessStep(2);
    }, 2200);

    const timer3 = setTimeout(async () => {
      setProcessStep(3);
      
      const selectedAddons: string[] = [];
      if (addons.sherpa) selectedAddons.push("日本語専任シェルパの同行");
      if (addons.suite) selectedAddons.push("最高級客室アップグレード（スイート）");
      if (addons.helicopter) selectedAddons.push("ヒマラヤヘリコプター遊覧フライト追加");

      const newBooking: BookingRecord = {
        id: `NPB-${Math.floor(100000 + Math.random() * 900000)}`,
        tourId: selectedTour.id,
        tourName: selectedTour.name,
        travelDate: travelDate,
        travelers: travelers,
        addOns: selectedAddons,
        totalPrice: GRAND_TOTAL,
        currency: "JPY",
        paymentMethod: paymentMethod === "card" ? "クレジットカード決済" : "銀行振込 (JP国内指定)",
        paymentStatus: paymentMethod === "card" ? "Paid" : "Pending",
        customerName: authorName,
        customerEmail: authorEmail,
        createdDate: new Date().toLocaleDateString("ja-JP")
      };

      let savedToDb = false;
      if (currentUser && currentUser.token) {
        try {
          const res = await fetch("/api/bookings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${currentUser.token}`
            },
            body: JSON.stringify(newBooking)
          });
          
          if (res.ok) {
            savedToDb = true;
            // Re-fetch fresh bookings from the database
            const listRes = await fetch("/api/bookings", {
              headers: {
                "Authorization": `Bearer ${currentUser.token}`
              }
            });
            if (listRes.ok) {
              const freshList = await listRes.json();
              setBookingsList(freshList);
            }
          }
        } catch (e) {
          console.error("Failed to save booking to Postgres:", e);
        }
      }

      // Always save to local storage as local cache/fallback
      const existing = localStorage.getItem("nepa_bookings");
      const list: BookingRecord[] = existing ? JSON.parse(existing) : [];
      list.unshift(newBooking);
      localStorage.setItem("nepa_bookings", JSON.stringify(list));
      if (!savedToDb) {
        setBookingsList(list);
      }

      setJustBooked(newBooking);
      setIsProcessing(false);
    }, 3500);
  };

  const handleResetCheckout = () => {
    setJustBooked(null);
    setIsProcessing(false);
    setCouponApplied(false);
    setCoupon("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setCardHolder("");
    setAddons({ sherpa: false, suite: false, helicopter: false });
    setActiveTab("history"); // Instantly highlight bookings history
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm("本当にこの予約をキャンセルしますか？")) return;

    let dbCancelled = false;
    if (currentUser && currentUser.token) {
      try {
        const response = await fetch(`/api/bookings/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${currentUser.token}`
          }
        });
        if (response.ok) {
          dbCancelled = true;
          const listRes = await fetch("/api/bookings", {
            headers: {
              "Authorization": `Bearer ${currentUser.token}`
            }
          });
          if (listRes.ok) {
            const freshList = await listRes.json();
            setBookingsList(freshList);
            alert("予約を正常にキャンセルしました。");
          }
        }
      } catch (e) {
        console.error("Failed to cancel booking in Postgres:", e);
      }
    }

    if (!dbCancelled) {
      const existing = localStorage.getItem("nepa_bookings");
      const list: BookingRecord[] = existing ? JSON.parse(existing) : [];
      const updatedList = list.filter(b => b.id !== id);
      localStorage.setItem("nepa_bookings", JSON.stringify(updatedList));
      setBookingsList(prev => prev.filter(b => b.id !== id));
      alert("予約を正常にキャンセルしました。");
    }
  };

  // Keyboard shortcut listener (ESC key closes modal)
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

  // Filter bookings based on active session if required
  const userBookings = bookingsList.filter(b => {
    if (!currentUser) return true; // Show local machine cache for guest preview
    return b.customerEmail.toLowerCase() === currentUser.email.toLowerCase() || b.customerEmail === "guest@example.com";
  });

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 py-6 sm:py-10 overflow-y-auto no-scrollbar"
    >
      <motion.div 
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden relative flex flex-col my-auto max-h-[85vh] sm:max-h-[88vh]"
      >

        {/* Dynamic transaction loader fallback cover */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/95 backdrop-blur-md z-55 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-16 h-16 relative mb-6">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-x-0 top-0 bottom-0 border-4 border-red-600 rounded-full animate-spin border-t-transparent"></div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">安全に支払手続きを実行しています...</h3>
              <p className="text-sm font-semibold text-red-700 font-mono animate-pulse">
                {processSteps[processStep]}
              </p>
              <p className="text-xs text-slate-450 mt-4 max-w-sm">
                この決済は国際セキュリティ最高暗号基準に完全に準拠して保護されています。
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Payment success check receipt */}
        <AnimatePresence>
          {justBooked && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-white z-50 flex flex-col overflow-y-auto p-6 sm:p-12"
            >
              <div className="max-w-xl mx-auto w-full text-center space-y-6 py-4">
                
                <div className="inline-flex p-4 bg-red-50 text-red-750 rounded-full border border-red-100/70">
                  <CheckCircle2 className="w-12 h-12 text-red-600" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">オンライン予約＆決済 完了！</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    お申し込みと安全な決済処理が完了しました。<br />
                    ご旅行条件確認書（JP版）をご登録メールアドレスに自動送付いたしました。
                  </p>
                </div>

                {/* Ticket Receipt Visual */}
                <div className="bg-slate-50 rounded-3xl border border-slate-150 p-6 text-left space-y-4 font-mono text-sm relative overflow-hidden shadow-sm">
                  <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none text-slate-900 select-none">
                    <Compass className="w-24 h-24" />
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-205 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">RESERVATION CODE</span>
                      <span className="text-red-700 font-extrabold text-base">{justBooked.id}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">TRANSACTION DATE</span>
                      <span className="text-slate-800 font-semibold text-xs">{justBooked.createdDate}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-450">代表ご氏名</span>
                      <span className="text-slate-800 font-bold">{justBooked.customerName} 様</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-455">メールアドレス</span>
                      <span className="text-slate-800 font-medium">{justBooked.customerEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-455">ご予約ツアー</span>
                      <span className="text-slate-900 font-bold">{justBooked.tourName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-455">カトマンズ出発日</span>
                      <span className="text-red-700 font-bold">{justBooked.travelDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-455">ご参加人数</span>
                      <span className="text-slate-800 font-bold">{justBooked.travelers} 名様</span>
                    </div>

                    {justBooked.addOns.length > 0 && (
                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-[9px] uppercase font-black text-slate-400 block mb-1">特別追加オプショナル</span>
                        {justBooked.addOns.map((add, i) => (
                          <div key={i} className="text-slate-650 text-[11px] flex items-center gap-1">
                            <span className="text-red-600 font-bold">•</span> {add}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Receipt className="w-4 h-4 text-slate-400" />
                      合計決済額 (税込)
                    </span>
                    <span className="text-xl font-black text-slate-900">
                      ￥{justBooked.totalPrice.toLocaleString("ja-JP")}
                    </span>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center text-xs text-red-800 font-bold flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
                    支払状況：{justBooked.paymentMethod === "card" ? "クレジットカード即時決済完了 [eチケット確約]" : "国内銀行振込受付完了 [振込待ち]"}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                  <button
                    onClick={() => alert(`【確定バウチャーPDF】\n予約番号: ${justBooked.id}\n代表者様: ${justBooked.customerName}\nツアー: ${justBooked.tourName}\n出発日: ${justBooked.travelDate}\n\neチケットを発行しました。印刷またはスマートフォン画面にて提示可能です。`)}
                    className="px-6 py-2.5 bg-slate-100 text-slate-800 font-extrabold rounded-xl text-xs border border-slate-200 hover:bg-slate-200 transition-all cursor-pointer shadow-2xs"
                  >
                    eチケットバウチャーPDF出力
                  </button>
                  <button
                    onClick={handleResetCheckout}
                    className="px-8 py-2.5 bg-gradient-to-r from-red-600 to-blue-900 hover:from-red-700 hover:to-blue-950 text-white font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>ご予約履歴を確認する</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky Visual header banner with subtle scenery background */}
        <div className="relative bg-slate-950 text-white p-3 sm:p-5 border-b-2 border-slate-800 shrink-0 select-none z-20 overflow-hidden shadow-xl">
          {/* Subtle Scenery Background Backdrop */}
          <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200" 
              alt="Himalaya Mountains" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/90" />
          </div>

          <div className="relative z-10 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
              <div className="w-9 h-9 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shrink-0 border-2 border-amber-400 overflow-hidden p-0.5">
                <img 
                  src={nepaLogo} 
                  alt="Nepa Travel Official Logo" 
                  className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-display text-sm sm:text-lg font-black tracking-tight text-white block drop-shadow-sm truncate">
                    Nepa Travel - オンライン公式予約
                  </span>
                  <span className="text-[9px] sm:text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-md shadow-xs shrink-0">
                    OFFICIAL
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-amber-300 font-bold mt-0.5 flex-wrap">
                  <span className="flex items-center gap-1 truncate">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
                    ネパール政府観光局 (NTB) 公認
                  </span>
                  <span className="hidden xs:inline text-slate-500">•</span>
                  <span className="hidden xs:inline">SSL 256-bit 保護</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 justify-end shrink-0">
              <div className="hidden md:flex items-center gap-1.5 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs text-amber-300 font-black shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                <span>24時間公式サポートデスク</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-black active:scale-95 text-slate-100 hover:text-white border-2 border-slate-700 transition-all cursor-pointer flex items-center gap-1 text-xs font-black px-2.5 py-1.5 sm:px-3.5 sm:py-2 shadow-md shrink-0"
                title="閉じる (Esc)"
              >
                <X className="w-4 h-4 text-white" />
                <span className="hidden xs:inline">閉じる</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Controls Selector Options - High Visibility */}
        <div className="flex bg-slate-200 p-1 gap-1 border-b-2 border-slate-300 text-xs sm:text-sm font-black text-slate-700">
          <button
            onClick={() => setActiveTab("book")}
            className={`flex-1 py-2 px-2 sm:py-2.5 sm:px-4 rounded-xl font-black flex items-center justify-center gap-1 sm:gap-2 cursor-pointer transition-all ${
              activeTab === "book"
                ? "text-red-700 bg-white shadow-md border-2 border-red-200"
                : "text-slate-700 hover:text-slate-950 hover:bg-slate-300/80"
            }`}
          >
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-700 shrink-0" />
            <span className="text-[11px] sm:text-xs font-black truncate">新規ツアー予約</span>
          </button>
          
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2 px-2 sm:py-2.5 sm:px-4 rounded-xl font-black flex items-center justify-center gap-1 sm:gap-2 cursor-pointer transition-all ${
              activeTab === "history"
                ? "text-red-700 bg-white shadow-md border-2 border-red-200"
                : "text-slate-700 hover:text-slate-950 hover:bg-slate-300/80"
            }`}
          >
            <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-700 shrink-0" />
            <span className="text-[11px] sm:text-xs font-black truncate">予約履歴 ({userBookings.length})</span>
          </button>
        </div>

        {/* Display active tab selection body */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {activeTab === "book" ? (
            
            <div className="grid lg:grid-cols-12 gap-0">
              
              {/* Checkout specification forms */}
              <form onSubmit={handleSubmitBooking} className="lg:col-span-7 p-3.5 sm:p-6 pb-8 sm:pb-12 space-y-5 bg-white">
                
                {Object.keys(formErrors).length > 0 && (
                  <div className="p-3 sm:p-4 bg-red-50 border-2 border-red-300 text-red-800 text-xs rounded-2xl flex items-start gap-2 animate-shake shadow-xs">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black text-xs sm:text-sm block text-red-950">入力内容をご確認ください</span>
                      <ul className="list-disc list-inside space-y-0.5 mt-0.5 text-xs font-bold">
                        {Object.values(formErrors).map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {currentUser ? (
                  <div className="p-3 sm:p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-emerald-950 text-xs sm:text-sm font-black flex items-center justify-between shadow-xs">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                      <span className="truncate"><strong>{currentUser.username} 様</strong> ({currentUser.email})</span>
                    </span>
                    <span className="text-[10px] sm:text-xs bg-emerald-800 text-white px-2.5 py-1 rounded-xl font-black shrink-0">認証済み</span>
                  </div>
                ) : (
                  <div className="p-3 sm:p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 text-amber-950 text-xs sm:text-sm font-bold space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black flex items-center gap-1 text-slate-950 text-xs sm:text-sm">
                        <Info className="w-4 h-4 text-amber-600 shrink-0" />
                        ゲストとして予約手続き実行中
                      </span>
                      <button 
                        type="button" 
                        onClick={() => {
                          onClose();
                          onOpenAuth("login");
                        }} 
                        className="text-white bg-red-700 hover:bg-red-800 px-3 py-1 rounded-xl font-black text-xs shrink-0 cursor-pointer shadow-xs transition-all"
                      >
                        会員ログイン
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2.5 pt-2 border-t border-amber-200">
                      <div>
                        <label className="text-xs text-slate-900 font-black block mb-1">代表者お名前 (フルネーム) *</label>
                        <input 
                          type="text" 
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="例：山田 太郎"
                          className="w-full bg-white px-3 py-2 rounded-xl border-2 border-slate-300 outline-none text-xs sm:text-sm font-bold text-slate-950 focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-900 font-black block mb-1">確認通知メールアドレス *</label>
                        <input 
                          type="email" 
                          required
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="例：example@mail.com"
                          className="w-full bg-white px-3 py-2 rounded-xl border-2 border-slate-300 outline-none text-xs sm:text-sm font-bold text-slate-950 focus:border-red-600"
                        />
                      </div>
                    </div>
                  </div>
                )}

                  {/* Step 1: Modern Tour selection & Interactive Calendar */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-700 text-white font-black text-xs flex items-center justify-center shrink-0">1</span>
                      <h3 className="font-black text-slate-950 text-sm sm:text-base">ツアー＆日程のご指定</h3>
                    </div>

                    {/* Custom Modern Tour Selector Trigger Card */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-black text-slate-950 uppercase tracking-wide flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-red-700" />
                          ご希望のツアーパッケージを選択
                        </label>
                        <span className="text-[10px] sm:text-xs font-black text-red-700 bg-red-50 px-2 py-0.5 rounded-lg border border-red-200">
                          全14ツアー展開中
                        </span>
                      </div>

                      {/* Selected Tour Trigger Display - Robust Responsive Layout */}
                      <div className="relative">
                        <div 
                          onClick={() => setIsTourPickerOpen(!isTourPickerOpen)}
                          className="p-3 sm:p-4 bg-slate-50 hover:bg-white rounded-2xl border-2 border-slate-300 hover:border-red-600 transition-all cursor-pointer shadow-xs flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 group"
                        >
                          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                            <img 
                              src={selectedTour.image} 
                              alt={selectedTour.name} 
                              className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl object-cover border-2 border-slate-200 shrink-0 shadow-xs group-hover:scale-105 transition-transform" 
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-black text-slate-950 text-sm sm:text-base group-hover:text-red-700 transition-colors truncate">
                                  {selectedTour.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                <span className="text-[10px] sm:text-xs font-black text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded-md border border-slate-300 whitespace-nowrap shrink-0">
                                  {selectedTour.duration}
                                </span>
                                <span className="text-[10px] sm:text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 whitespace-nowrap shrink-0">
                                  現地シェルパ同行
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 ml-auto">
                            <span className="font-black text-red-700 text-xs sm:text-base font-sans bg-red-50 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl border border-red-200 shadow-2xs whitespace-nowrap">
                              {selectedTour.price}
                            </span>
                            <div className="p-1.5 sm:p-2 rounded-xl bg-slate-200/80 text-slate-800 group-hover:bg-red-700 group-hover:text-white transition-all">
                              <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${isTourPickerOpen ? "rotate-180" : ""}`} />
                            </div>
                          </div>
                        </div>

                        {/* Custom Tour Picker Popup Overlay Panel */}
                        <AnimatePresence>
                          {isTourPickerOpen && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.98 }}
                              transition={{ duration: 0.15 }}
                              className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl border-2 border-slate-300 shadow-2xl p-4 space-y-3 max-h-[420px] flex flex-col"
                            >
                              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                                <span className="text-xs font-black text-slate-950 flex items-center gap-1.5">
                                  <Sparkles className="w-4 h-4 text-amber-500" />
                                  ネパール公式ツアーパッケージ一覧から選択
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setIsTourPickerOpen(false)}
                                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Scrollable list of tour cards */}
                              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                {activeTours.map((tour) => {
                                    const isSelected = selectedTour.id === tour.id;
                                    return (
                                      <div
                                        key={tour.id}
                                        onClick={() => {
                                          setSelectedTour(tour);
                                          setIsTourPickerOpen(false);
                                        }}
                                        className={`p-3 rounded-xl border-2 flex items-center justify-between gap-3 cursor-pointer transition-all ${
                                          isSelected 
                                            ? "border-red-600 bg-red-50/80 shadow-xs" 
                                            : "border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                                        }`}
                                      >
                                        <div className="flex items-center gap-3 min-w-0">
                                          <img 
                                            src={tour.image} 
                                            alt={tour.name} 
                                            className="w-11 h-11 rounded-lg object-cover border border-slate-300 shrink-0" 
                                          />
                                          <div className="min-w-0">
                                            <span className="font-black text-slate-950 text-xs sm:text-sm block truncate">
                                              {tour.name}
                                            </span>
                                            <span className="text-[11px] text-slate-600 font-bold block">
                                              {tour.duration}
                                            </span>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                          <span className="font-black text-red-700 text-xs sm:text-sm">
                                            {tour.price}
                                          </span>
                                          {isSelected && (
                                            <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0" />
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Interactive Custom Calendar Selector */}
                    <div className="p-4 bg-slate-50 border-2 border-slate-300 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                        <label className="text-xs font-black text-slate-950 uppercase tracking-wide flex items-center gap-1.5">
                          <Calendar className="w-4.5 h-4.5 text-red-700" />
                          <span>現地ご出発希望日を選択 (インタラクティブカレンダー)</span>
                        </label>
                        <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-lg">
                          14日前まで変更無料
                        </span>
                      </div>

                      {/* Interactive Calendar Month Header */}
                      {(() => {
                        const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
                        const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
                        const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
                        const todayStr = new Date().toISOString().split("T")[0];

                        const handlePrevMonth = () => {
                          if (calMonth === 0) {
                            setCalMonth(11);
                            setCalYear(calYear - 1);
                          } else {
                            setCalMonth(calMonth - 1);
                          }
                        };

                        const handleNextMonth = () => {
                          if (calMonth === 11) {
                            setCalMonth(0);
                            setCalYear(calYear + 1);
                          } else {
                            setCalMonth(calMonth + 1);
                          }
                        };

                        return (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-300 shadow-2xs">
                              <button
                                type="button"
                                onClick={handlePrevMonth}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer transition-all active:scale-95"
                                title="前月"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>

                              <span className="font-black text-slate-950 text-sm font-sans">
                                {calYear}年 {monthNames[calMonth]}
                              </span>

                              <button
                                type="button"
                                onClick={handleNextMonth}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer transition-all active:scale-95"
                                title="次月"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Calendar Days Header */}
                            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-black text-slate-600 bg-slate-200/60 py-1.5 rounded-lg">
                              <span className="text-red-600">日</span>
                              <span>月</span>
                              <span>火</span>
                              <span>水</span>
                              <span>木</span>
                              <span>金</span>
                              <span className="text-blue-600">土</span>
                            </div>

                            {/* Calendar Days Grid */}
                            <div className="grid grid-cols-7 gap-1">
                              {/* Blank padding cells before day 1 */}
                              {Array.from({ length: firstDayIndex }).map((_, i) => (
                                <div key={`blank-${i}`} className="h-9" />
                              ))}

                              {/* Days 1 to daysInMonth */}
                              {Array.from({ length: daysInMonth }).map((_, i) => {
                                const dayNum = i + 1;
                                const formattedMonth = String(calMonth + 1).padStart(2, '0');
                                const formattedDay = String(dayNum).padStart(2, '0');
                                const dateStr = `${calYear}-${formattedMonth}-${formattedDay}`;

                                const isSelected = travelDate === dateStr;
                                const isToday = todayStr === dateStr;
                                const isPast = dateStr < todayStr;

                                return (
                                  <button
                                    key={`day-${dayNum}`}
                                    type="button"
                                    disabled={isPast}
                                    onClick={() => handleSelectDate(dateStr)}
                                    className={`h-9 text-xs font-black rounded-xl transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                                      isSelected
                                        ? "bg-red-700 text-white font-extrabold shadow-md ring-2 ring-red-400 scale-105 z-10"
                                        : isToday
                                          ? "bg-amber-100 text-amber-950 border-2 border-amber-400 font-extrabold"
                                          : isPast
                                            ? "text-slate-300 bg-slate-100 cursor-not-allowed opacity-50"
                                            : "bg-white hover:bg-slate-200/80 text-slate-900 border border-slate-200 hover:border-slate-400"
                                    }`}
                                  >
                                    <span>{dayNum}</span>
                                    {isToday && !isSelected && (
                                      <span className="text-[8px] leading-tight text-amber-700 font-extrabold">今日</span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Active Date Selection Banner */}
                            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-300 text-xs">
                              <span className="font-bold text-slate-700">選択済み日程:</span>
                              {travelDate ? (
                                <span className="font-mono font-black text-red-700 text-sm bg-red-50 px-2.5 py-0.5 rounded-lg border border-red-200">
                                  {travelDate}
                                </span>
                              ) : (
                                <span className="text-slate-400 font-bold">上のカレンダーから日付を選択してください</span>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Fast & Smooth Interactive Quick Date Presets */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-200">
                        <span className="text-xs font-black text-slate-800 block">ワンクリックおすすめ日程指定:</span>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date();
                              d.setDate(d.getDate() + 30);
                              const ds = d.toISOString().split("T")[0];
                              handleSelectDate(ds);
                            }}
                            className="text-xs font-black bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs active:scale-95"
                          >
                            1ヶ月後
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const year = new Date().getFullYear();
                              handleSelectDate(`${year}-10-15`);
                            }}
                            className="text-xs font-black bg-amber-100 hover:bg-amber-200 text-amber-950 px-3 py-1.5 rounded-xl border border-amber-400 transition-all cursor-pointer shadow-2xs active:scale-95"
                          >
                            秋ベストシーズン (10/15)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const year = new Date().getFullYear() + 1;
                              handleSelectDate(`${year}-04-10`);
                            }}
                            className="text-xs font-black bg-emerald-100 hover:bg-emerald-200 text-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-400 transition-all cursor-pointer shadow-2xs active:scale-95"
                          >
                            春シャクナゲ期 (4/10)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const year = new Date().getFullYear();
                              handleSelectDate(`${year}-12-28`);
                            }}
                            className="text-xs font-black bg-sky-100 hover:bg-sky-200 text-sky-950 px-3 py-1.5 rounded-xl border border-sky-400 transition-all cursor-pointer shadow-2xs active:scale-95"
                          >
                            年末年始 (12/28)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                {/* Step 2: Travelers Counter - High contrast */}
                <div className="space-y-3 pt-3 border-t-2 border-slate-200">
                  <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2.5">
                    <span className="w-6 h-6 rounded-full bg-red-700 text-white font-black text-xs flex items-center justify-center shrink-0">2</span>
                    <h3 className="font-black text-slate-950 text-base">ご参加人数</h3>
                  </div>

                  <div className="flex items-center justify-between bg-slate-100 p-4 rounded-2xl border-2 border-slate-200 shadow-xs">
                    <div>
                      <span className="font-black text-slate-950 text-sm block">大人ご人数</span>
                      <span className="text-xs text-slate-700 font-bold">専任プライベート車＆専用ガイド付き</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={travelers <= 1}
                        onClick={() => setTravelers(p => p - 1)}
                        className="w-9 h-9 bg-white hover:bg-slate-200 disabled:opacity-40 rounded-xl border-2 border-slate-300 text-slate-950 font-black text-lg flex items-center justify-center cursor-pointer transition-all shadow-xs active:scale-95"
                      >
                        -
                      </button>
                      <span className="w-14 text-center font-black text-lg font-mono text-slate-950 bg-white border-2 border-slate-300 rounded-xl py-1 shadow-xs">
                        {travelers}名
                      </span>
                      <button
                        type="button"
                        disabled={travelers >= 10}
                        onClick={() => setTravelers(p => p + 1)}
                        className="w-9 h-9 bg-white hover:bg-slate-200 disabled:opacity-40 rounded-xl border-2 border-slate-300 text-slate-950 font-black text-lg flex items-center justify-center cursor-pointer transition-all shadow-xs active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 3: Add-ons - Modern Cards */}
                <div className="space-y-3 pt-3 border-t-2 border-slate-200">
                  <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2.5">
                    <span className="w-6 h-6 rounded-full bg-red-700 text-white font-black text-xs flex items-center justify-center shrink-0">3</span>
                    <h3 className="font-black text-slate-950 text-base">特別オプショナル (任意)</h3>
                  </div>
                  
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div
                      onClick={() => setAddons(p => ({ ...p, sherpa: !p.sherpa }))}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none space-y-1 relative ${
                        addons.sherpa ? "bg-red-50 border-red-600 shadow-sm" : "bg-slate-50 border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-black text-xs sm:text-sm text-slate-950 flex items-center gap-1">
                          <Users className="w-4 h-4 text-red-700" />
                          専任シェルパ
                        </span>
                        {addons.sherpa && <CheckCircle2 className="w-4 h-4 text-red-700 shrink-0" />}
                      </div>
                      <span className="text-red-700 font-mono text-xs font-black block">+25,000円/名</span>
                      <p className="text-xs text-slate-800 font-bold leading-tight">
                        難所を安全にエスコート。日本語ライセンス付き。
                      </p>
                    </div>

                    <div
                      onClick={() => setAddons(p => ({ ...p, suite: !p.suite }))}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none space-y-1 relative ${
                        addons.suite ? "bg-red-50 border-red-600 shadow-sm" : "bg-slate-50 border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-black text-xs sm:text-sm text-slate-950 flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-red-700" />
                          5つ星スイート
                        </span>
                        {addons.suite && <CheckCircle2 className="w-4 h-4 text-red-700 shrink-0" />}
                      </div>
                      <span className="text-red-700 font-mono text-xs font-black block">+40,000円/室</span>
                      <p className="text-xs text-slate-800 font-bold leading-tight">
                        カトマンズ等の提携高級リゾート特等室。
                      </p>
                    </div>

                    <div
                      onClick={() => setAddons(p => ({ ...p, helicopter: !p.helicopter }))}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none space-y-1 relative ${
                        addons.helicopter ? "bg-red-50 border-red-600 shadow-sm" : "bg-slate-50 border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-black text-xs sm:text-sm text-slate-950 flex items-center gap-1">
                          <PlaneTakeoff className="w-4 h-4 text-red-700" />
                          ヘリ遊覧
                        </span>
                        {addons.helicopter && <CheckCircle2 className="w-4 h-4 text-red-700 shrink-0" />}
                      </div>
                      <span className="text-red-700 font-mono text-xs font-black block">+85,000円/名</span>
                      <p className="text-xs text-slate-800 font-bold leading-tight">
                        エベレスト上空を絶景チャーター飛行。
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 4: Secure payments tab */}
                <div className="space-y-4 pt-3 border-t-2 border-slate-200">
                  <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2.5">
                    <span className="w-6 h-6 rounded-full bg-red-700 text-white font-black text-xs flex items-center justify-center shrink-0">4</span>
                    <h3 className="font-black text-slate-950 text-base">お支払い方法</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`py-3.5 rounded-2xl border-2 text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === "card"
                          ? "bg-slate-950 border-slate-950 text-white shadow-md"
                          : "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200"
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      クレジットカード決済
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("bank")}
                      className={`py-3.5 rounded-2xl border-2 text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === "bank"
                          ? "bg-slate-950 border-slate-950 text-white shadow-md"
                          : "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200"
                      }`}
                    >
                      <BadgeJapaneseYen className="w-4 h-4" />
                      国内銀行振込
                    </button>
                  </div>

                  {paymentMethod === "bank" ? (
                    <div className="p-4 bg-slate-100 rounded-2xl border-2 border-slate-300 text-xs space-y-1.5 text-slate-900 leading-relaxed font-mono">
                      <p className="font-black text-slate-950 flex items-center gap-1.5 text-sm">
                        <ShieldCheck className="w-4.5 h-4.5 text-red-700" />
                        【日本国内・指定振込口座】
                      </p>
                      <p className="font-bold">みずほ銀行 東京中央支店</p>
                      <p className="font-bold">普通預金：3402-22108</p>
                      <p className="font-bold">口座名義：カ）ネパ・トラベル ニホンマイコグチ</p>
                      <p className="text-xs text-amber-950 font-extrabold pt-1 bg-amber-100 p-2.5 rounded-xl border border-amber-300">
                        ※ お申込み完了後、電子メールにて振込用確定コードをお知らせします。お振込確認後に正本チケットが発行されます。
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(() => {
                        const cardBrand = getCardBrandDetails(cardNumber);
                        return (
                          <>
                            {/* Live Card graphics preview - Dynamic Brand Theming */}
                            <div className={`w-full h-42 sm:h-48 rounded-2xl p-4 sm:p-5 text-white flex flex-col justify-between font-mono relative shadow-2xl overflow-hidden transition-all duration-300 ${cardBrand.gradient}`}>
                              {/* Background ambient glow */}
                              <div className="absolute right-0 top-0 bottom-0 w-36 bg-white/5 blur-2xl pointer-events-none" />

                              <div className="flex justify-between items-start z-10">
                                <div className="flex items-center gap-2">
                                  {/* Chip */}
                                  <div className={`w-10 h-7 rounded-md shadow-xs ${cardBrand.chipBg}`} />
                                  <span className="text-[10px] font-sans font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-slate-900/80 text-amber-300 border border-slate-700">
                                    {cardBrand.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-slate-200 font-black font-sans tracking-wider uppercase bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700">
                                    SSL SECURE
                                  </span>
                                  {cardBrand.logo}
                                </div>
                              </div>

                              <div className="space-y-3 z-10">
                                <div className="text-lg sm:text-xl tracking-widest font-black text-white drop-shadow-sm font-mono">
                                  {cardNumber || "•••• •••• •••• ••••"}
                                </div>
                                <div className="flex justify-between items-end text-xs">
                                  <div>
                                    <span className="text-[9px] text-slate-300 block pb-0.5 uppercase tracking-wider font-extrabold">名義人 / CARD HOLDER</span>
                                    <span className={`font-black truncate max-w-[170px] block text-sm ${cardBrand.accentColor}`}>
                                      {cardHolder || "TARO YAMADA"}
                                    </span>
                                  </div>
                                  <div className="flex gap-4 text-right">
                                    <div>
                                      <span className="text-[9px] text-slate-300 block pb-0.5 uppercase tracking-wider font-extrabold">有効期限</span>
                                      <span className="font-black block text-sm text-white">{cardExpiry || "MM/YY"}</span>
                                    </div>
                                    <div>
                                      <span className="text-[9px] text-slate-300 block pb-0.5 uppercase tracking-wider font-extrabold">CVC</span>
                                      <span className="font-black block text-sm text-white">{cardCvc || "•••"}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Card standard text fields inputs - Solid High Contrast */}
                            <div className="space-y-3.5 bg-slate-100 p-4 rounded-2xl border-2 border-slate-300">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-300">
                                <span className="text-xs text-slate-950 font-black flex items-center gap-1.5">
                                  <CreditCard className="w-4 h-4 text-red-700" />
                                  カード情報入力
                                </span>

                                {/* Quick Brand Selector Buttons */}
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[10px] font-black text-slate-600">テスト入力:</span>
                                  <button
                                    type="button"
                                    onClick={() => fillDemoCard("visa")}
                                    className="px-2 py-0.5 text-[10px] font-black bg-blue-700 hover:bg-blue-800 text-white rounded-md cursor-pointer transition-all shadow-xs active:scale-95"
                                  >
                                    Visa
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => fillDemoCard("mastercard")}
                                    className="px-2 py-0.5 text-[10px] font-black bg-rose-700 hover:bg-rose-800 text-white rounded-md cursor-pointer transition-all shadow-xs active:scale-95"
                                  >
                                    Mastercard
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => fillDemoCard("amex")}
                                    className="px-2 py-0.5 text-[10px] font-black bg-teal-700 hover:bg-teal-800 text-white rounded-md cursor-pointer transition-all shadow-xs active:scale-95"
                                  >
                                    Amex
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => fillDemoCard("jcb")}
                                    className="px-2 py-0.5 text-[10px] font-black bg-emerald-700 hover:bg-emerald-800 text-white rounded-md cursor-pointer transition-all shadow-xs active:scale-95"
                                  >
                                    JCB
                                  </button>
                                </div>
                              </div>

                              <div className="grid sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs text-slate-900 font-black block mb-1">カード番号 *</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="4532 0000 0000 0000"
                                    value={cardNumber}
                                    className="w-full bg-white py-2.5 px-3.5 rounded-xl border-2 border-slate-300 outline-none text-xs sm:text-sm font-mono font-black text-slate-950 focus:border-red-600 shadow-2xs"
                                    onChange={handleCardNumberChange}
                                  />
                                  {formErrors.card && <p className="text-red-700 text-xs mt-1 font-black">{formErrors.card}</p>}
                                </div>
                                <div>
                                  <label className="text-xs text-slate-900 font-black block mb-1">カード名義人 (ローマ字) *</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="例：TARO YAMADA"
                                    value={cardHolder}
                                    className="w-full bg-white py-2.5 px-3.5 rounded-xl border-2 border-slate-300 outline-none text-xs sm:text-sm font-black text-slate-950 focus:border-red-600 uppercase shadow-2xs"
                                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                                  />
                                  {formErrors.cardholder && <p className="text-red-700 text-xs mt-1 font-black">{formErrors.cardholder}</p>}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs text-slate-900 font-black block mb-1">有効期限 (MM/YY) *</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="12/28"
                                    value={cardExpiry}
                                    className="w-full bg-white py-2.5 px-3.5 rounded-xl border-2 border-slate-300 outline-none text-xs sm:text-sm font-mono font-black text-slate-950 focus:border-red-600 shadow-2xs"
                                    onChange={handleCardExpiryChange}
                                  />
                                  {formErrors.expiry && <p className="text-red-700 text-xs mt-1 font-black">{formErrors.expiry}</p>}
                                </div>
                                <div>
                                  <label className="text-xs text-slate-900 font-black block mb-1">セキュリティコード (CVC) *</label>
                                  <input
                                    type="password"
                                    required
                                    placeholder="888"
                                    value={cardCvc}
                                    className="w-full bg-white py-2.5 px-3.5 rounded-xl border-2 border-slate-300 outline-none text-xs sm:text-sm font-mono font-black text-slate-950 focus:border-red-600 shadow-2xs"
                                    onChange={handleCardCvcChange}
                                  />
                                  {formErrors.cvc && <p className="text-red-700 text-xs mt-1 font-black">{formErrors.cvc}</p>}
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-red-700 hover:bg-red-800 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer text-base sm:text-lg tracking-tight border border-red-500"
                >
                  <Lock className="w-5 h-5 text-amber-300" />
                  <span>
                    {paymentMethod === "card" 
                      ? `￥${GRAND_TOTAL.toLocaleString("ja-JP")} で予約を確定する` 
                      : "銀行振込で予約番号を発行する"}
                  </span>
                </button>

              </form>

              {/* Right Summary calculator pane - High Contrast Dark Slate */}
              <div className="lg:col-span-5 p-4 sm:p-8 pb-8 sm:pb-12 bg-slate-950 text-slate-100 flex flex-col justify-between space-y-5 sm:space-y-6 border-l-2 border-slate-800 shadow-2xl">
                
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      リアルタイムお見積り
                    </h3>
                    <span className="text-[11px] bg-slate-900 text-slate-200 border border-slate-700 font-mono px-2.5 py-0.5 rounded-md font-bold shadow-2xs">
                      即時自動算出
                    </span>
                  </div>
                  
                  {/* Tour selected card */}
                  <div className="bg-slate-900 rounded-2xl p-4 border-2 border-slate-800 space-y-3 shadow-md">
                    <div className="flex gap-3 pb-3 border-b border-slate-800">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-black border-2 border-slate-700 shadow-xs">
                        <img src={selectedTour.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-white text-base leading-tight">{selectedTour.name}</h4>
                        <span className="text-xs text-slate-300 block font-bold mt-1 bg-slate-800/80 px-2 py-0.5 rounded-md w-max border border-slate-700">
                          {selectedTour.duration}
                        </span>
                        <span className="text-xs text-amber-300 block font-black mt-1">
                          基本単価：{selectedTour.price}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-200 font-bold">
                      <p className="flex justify-between">
                        <span className="text-slate-400">ツアー基本本体</span>
                        <span className="font-mono text-white font-black">￥{basePriceNum.toLocaleString("ja-JP")}</span>
                      </p>
                      <p className="flex justify-between text-white font-black">
                        <span className="text-slate-400">ご参加人数</span>
                        <span className="text-amber-300 font-black">{travelers} 名様</span>
                      </p>
                    </div>
                  </div>

                  {/* Line breakdown */}
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between text-slate-200 font-bold bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-300">ツアー基本小計</span>
                      <span className="font-mono text-white font-black">￥{subtotal.toLocaleString("ja-JP")}</span>
                    </div>

                    {addons.sherpa && (
                      <div className="flex justify-between text-amber-300 font-bold text-xs bg-slate-900 p-2.5 rounded-xl border border-slate-800 shadow-2xs">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-red-500" />
                          日本語専任シェルパ ({travelers}名)
                        </span>
                        <span className="font-mono font-black">+￥{(SHERPA_PRICE * travelers).toLocaleString("ja-JP")}</span>
                      </div>
                    )}

                    {addons.suite && (
                      <div className="flex justify-between text-amber-300 font-bold text-xs bg-slate-900 p-2.5 rounded-xl border border-slate-800 shadow-2xs">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          5つ星スイートルーム
                        </span>
                        <span className="font-mono font-black">+￥{SUITE_PRICE.toLocaleString("ja-JP")}</span>
                      </div>
                    )}

                    {addons.helicopter && (
                      <div className="flex justify-between text-amber-300 font-bold text-xs bg-slate-900 p-2.5 rounded-xl border border-slate-800 shadow-2xs">
                        <span className="flex items-center gap-1">
                          <PlaneTakeoff className="w-3.5 h-3.5 text-sky-400" />
                          ヘリコプター空中遊覧 ({travelers}名)
                        </span>
                        <span className="font-mono font-black">+￥{(HELI_PRICE * travelers).toLocaleString("ja-JP")}</span>
                      </div>
                    )}

                    {couponApplied && (
                      <div className="flex justify-between bg-amber-400 text-slate-950 rounded-xl p-2.5 font-black text-xs shadow-md">
                        <span>プロモコード割引 (10% OFF)</span>
                        <span className="font-mono font-black">-￥{discountAmount.toLocaleString("ja-JP")}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-300 border-t border-slate-800 pt-3 font-bold px-1">
                      <span className="text-slate-400">ネパール政府諸税・VAT (13%)</span>
                      <span className="font-mono text-white font-black">￥{taxAmount.toLocaleString("ja-JP")}</span>
                    </div>
                  </div>

                </div>

                {/* Promotional Coupons */}
                <div className="p-4 bg-slate-900 border-2 border-slate-800 rounded-2xl space-y-2.5 shadow-md">
                  <span className="text-xs font-black text-amber-300 block uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    プロモコード適用
                  </span>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="例：NEPAL2026"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      disabled={couponApplied}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 outline-none text-xs font-black text-white uppercase placeholder:text-slate-500 focus:border-amber-400"
                    />
                    <button
                      type="button"
                      disabled={couponApplied}
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-black text-xs rounded-xl shrink-0 cursor-pointer transition-all active:scale-95 shadow-sm"
                    >
                      適用
                    </button>
                  </div>
                  {couponApplied ? (
                    <p className="text-xs text-amber-300 font-black flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      10% 割引プロモコードが適用されました！
                    </p>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-300 font-bold pt-0.5">
                      <span>特別優待コード:</span>
                      <button 
                        type="button"
                        onClick={() => {
                          setCoupon("NEPAL2026");
                          setCouponApplied(true);
                        }}
                        className="text-amber-300 underline font-black cursor-pointer hover:text-amber-200"
                      >
                        「NEPAL2026」を適用
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub Grand Total Block */}
                <div className="border-t-2 border-slate-800 pt-4 space-y-1.5">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">お支払い総合計 (税込)</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-amber-400 font-black flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      全額返金保証対象
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-amber-400 font-sans tracking-tight drop-shadow-md">
                      ￥{GRAND_TOTAL.toLocaleString("ja-JP")}
                    </span>
                  </div>
                </div>

              </div>

            </div>

          ) : (
            
            /* TAB 2: Bookings Historical ledger overview */
            <div className="p-3.5 sm:p-8 pb-8 sm:pb-16 space-y-4 sm:space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 gap-2">
                <div className="min-w-0">
                  <h3 className="font-black text-slate-950 text-base sm:text-xl flex items-center gap-1.5 truncate">
                    <PlaneTakeoff className="w-4 h-4 sm:w-5 sm:h-5 text-red-700 shrink-0" />
                    お客様のご旅行履歴 • 決済台帳
                  </h3>
                  <p className="text-slate-700 text-[11px] sm:text-sm mt-0.5 font-bold leading-snug">
                    お申し込み完了、または銀行振込確認待ちのすべてのツアーパッケージがリアルタイムに表示されます。
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] sm:text-xs text-slate-700 uppercase tracking-wider block font-black">合計ご予約数</span>
                  <span className="font-mono text-sm sm:text-lg font-black text-red-700">{userBookings.length} 件</span>
                </div>
              </div>

              {userBookings.length === 0 ? (
                <div className="py-12 sm:py-16 text-center space-y-4 bg-slate-50 rounded-2xl border-2 border-slate-200 p-4 sm:p-6">
                  <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-700 mx-auto">
                    <History className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-950 text-base font-black">ご予約履歴はありません</p>
                    <p className="text-slate-700 text-xs sm:text-sm font-bold">
                      まだオンライン予約がおこなわれていません。左のタブからご希望のパッケージを指定して、安全にお申し込みいただけます。
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("book")}
                    className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-md"
                  >
                    新規ツアーお申し込みはこちら
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userBookings.map((b) => {
                    const matchedImage = activeTours.find(t => t.name === b.tourName || t.id === b.tourId)?.image;
                    
                    return (
                      <div 
                        key={b.id}
                        className="bg-white border-2 border-slate-300 hover:border-slate-400 rounded-2xl p-3.5 sm:p-5 shadow-md flex flex-col gap-3.5 sm:gap-4 transition-all"
                      >
                        {/* Top / Main info block */}
                        <div className="flex items-start gap-3 w-full">
                          <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-xl overflow-hidden shrink-0 bg-slate-900 border-2 border-slate-300 shadow-xs">
                            <img 
                              src={matchedImage || activeTours[0].image} 
                              alt="" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[11px] sm:text-xs uppercase font-black text-slate-800 font-mono tracking-tight">{b.id}</span>
                              <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-black uppercase shrink-0 ${
                                b.paymentStatus === "Paid" 
                                  ? "bg-emerald-100 text-emerald-950 border border-emerald-400" 
                                  : "bg-amber-100 text-amber-950 border border-amber-400"
                              }`}>
                                {b.paymentStatus === "Paid" ? "決済完了 [支払済]" : "振込確認待ち"}
                              </span>
                            </div>
                            <h4 className="font-black text-slate-950 text-sm sm:text-lg leading-tight truncate">{b.tourName}</h4>
                            <div className="text-[11px] sm:text-xs text-slate-800 font-bold space-y-0.5 flex flex-wrap gap-x-3">
                              <span>出発日：<strong className="text-slate-950 font-black">{b.travelDate}</strong></span>
                              <span>人数：<strong className="text-slate-950 font-black">{b.travelers}名様</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Add-ons block description if any */}
                        {b.addOns.length > 0 && (
                          <div className="w-full bg-slate-100 rounded-xl p-2.5 sm:p-3 text-xs text-slate-900 space-y-0.5 text-left border border-slate-200">
                            <span className="text-slate-700 font-black block uppercase text-[10px]">追加オプション</span>
                            {b.addOns.map((o, idx) => (
                              <div key={idx} className="truncate font-bold text-slate-900 text-[11px] sm:text-xs">• {o}</div>
                            ))}
                          </div>
                        )}

                        {/* Bottom price and action buttons */}
                        <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-200">
                          <div className="flex items-center justify-between sm:block">
                            <span className="text-[10px] sm:text-xs text-slate-700 font-black uppercase">決済合計額</span>
                            <span className="text-slate-950 font-black text-base sm:text-xl font-sans">
                              ￥{b.totalPrice.toLocaleString("ja-JP")}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:w-auto">
                            <button
                              onClick={() => {
                                alert(`eチケット情報: \n予約番号: ${b.id}\n代表者様: ${b.customerName}様\nツアー名: ${b.tourName}\n出発日: ${b.travelDate}\n決済方法: ${b.paymentMethod}\n\nネパール現地窓口(カトマンズ本店)にてバウチャー提示によりフルアテンドをいたします。`);
                              }}
                              className="bg-slate-900 hover:bg-black text-white px-3 sm:px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer shadow-xs text-center whitespace-nowrap"
                            >
                              詳細バウチャー
                            </button>
                            <button
                              onClick={() => handleCancelBooking(b.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-700 font-black px-2.5 sm:px-3 py-2 text-xs rounded-xl transition-all cursor-pointer border border-red-300 text-center whitespace-nowrap"
                            >
                              予約をキャンセル
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
}
