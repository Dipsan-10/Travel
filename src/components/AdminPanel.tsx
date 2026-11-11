import React, { useState, useEffect } from "react";
import { 
  Shield, 
  BarChart3, 
  Users, 
  Calendar, 
  Compass, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  RefreshCw, 
  TrendingUp, 
  DollarSign, 
  X, 
  Upload, 
  ImageIcon, 
  Check, 
  AlertTriangle,
  Star,
  Eye,
  ChevronRight,
  Filter,
  UserPlus,
  Mail,
  Grid,
  Tag,
  Maximize2,
  UserCheck,
  Lock,
  Phone,
  Globe,
  FileText,
  Save,
  ShieldCheck,
  Smile,
  Key,
  Quote,
  Award,
  ShieldAlert,
  LogIn,
  Send,
  UserMinus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TourPackage } from "../types";
import { TOURS, GALLERY, IMAGES } from "../data";
import { DEFAULT_TEAM_MEMBERS, TeamMember } from "./About";
import nepaLogo from "../assets/images/nepa_travel_hd_logo_1785218025055.jpg";

const PRIMARY_ADMIN_EMAILS = [
  "dipsanijamhang@gmail.com",
  "admin@nepatravel.com",
  "test@nepa.com"
];

export interface SubAdminRequest {
  email: string;
  username: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
}

function getApprovedSubAdmins(): string[] {
  try {
    const saved = localStorage.getItem("nepa_approved_subadmins");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveApprovedSubAdmins(list: string[]) {
  try {
    localStorage.setItem("nepa_approved_subadmins", JSON.stringify(list));
  } catch (e) {
    console.error("Error saving subadmins:", e);
  }
}

function getPendingSubAdminRequests(): SubAdminRequest[] {
  try {
    const saved = localStorage.getItem("nepa_pending_subadmin_requests");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function savePendingSubAdminRequests(list: SubAdminRequest[]) {
  try {
    localStorage.setItem("nepa_pending_subadmin_requests", JSON.stringify(list));
  } catch (e) {
    console.error("Error saving pending subadmin requests:", e);
  }
}

const SharpStar = ({ className = "w-5 h-5 fill-amber-300 text-amber-300" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <polygon points="50,2 60.78,35.17 95.65,35.17 67.44,55.67 78.21,88.83 50,68.33 21.79,88.83 32.56,55.67 4.35,35.17 39.22,35.17" />
  </svg>
);

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { username: string; email: string; avatarUrl?: string } | null;
  onLoginSuccess?: (user: { username: string; email: string; token: string; avatarUrl?: string }) => void;
}

interface AdminBooking {
  id: string;
  tourName: string;
  customerName: string;
  customerEmail: string;
  travelDate: string;
  travelers: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: "paid" | "pending" | "cancelled";
  createdDate: string;
}

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  createdDate: string;
}

interface AdminMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  status: "unread" | "read" | "replied";
}

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  url: string;
  uploadedAt: string;
}

// Preset Tour Images for Quick Selection
const PRESET_TOUR_IMAGES = [
  { id: "pokhara", name: "ポカラ (フェワ湖)", url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop" },
  { id: "kathmandu", name: "カトマンズ (王宮広場)", url: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1000&auto=format&fit=crop" },
  { id: "lumbini", name: "ルンビニ (ブッダ聖地)", url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=1000&auto=format&fit=crop" },
  { id: "dhorpatan", name: "ドルパタン (大自然保護区)", url: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=1000&auto=format&fit=crop" },
  { id: "everest", name: "エベレスト (ヒマラヤ山脈)", url: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1000&auto=format&fit=crop" },
  { id: "annapurna", name: "アンナプルナ (トレッキング)", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop" },
];

const ADMIN_AVATAR_PRESETS = [
  { id: "admin-1", name: "プロガイド", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" },
  { id: "admin-2", name: "ヒマラヤ登山家", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" },
  { id: "admin-3", name: "ポカラ案内人", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" },
  { id: "admin-4", name: "カトマンズ支配人", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop" },
  { id: "admin-5", name: "自然トラベラー", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop" },
  { id: "admin-6", name: "チトワンレンジャー", url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=400&auto=format&fit=crop" },
];

export default function AdminPanel({ isOpen, onClose, currentUser, onLoginSuccess }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "tours" | "gallery" | "users" | "messages" | "profile" | "team">("overview");

  // Sub-Admin & Authorization States
  const [approvedSubAdmins, setApprovedSubAdmins] = useState<string[]>(() => getApprovedSubAdmins());
  const [pendingRequests, setPendingRequests] = useState<SubAdminRequest[]>(() => getPendingSubAdminRequests());
  const [subAdminRequestSent, setSubAdminRequestSent] = useState(false);
  
  // Auth Form State for Guest / Unapproved Login inside Modal
  const [authEmail, setAuthEmail] = useState("dipsanijamhang@gmail.com");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [manualSubAdminEmail, setManualSubAdminEmail] = useState("");

  const isPrimaryAdmin = (email?: string) => {
    if (!email) return false;
    const e = email.trim().toLowerCase();
    return PRIMARY_ADMIN_EMAILS.some(p => p.toLowerCase() === e);
  };

  const isSubAdminApproved = (email?: string) => {
    if (!email) return false;
    const e = email.trim().toLowerCase();
    return approvedSubAdmins.some(item => item.toLowerCase() === e);
  };

  const isAuthorized = Boolean(
    currentUser &&
    currentUser.email &&
    (isPrimaryAdmin(currentUser.email) || isSubAdminApproved(currentUser.email))
  );

  const handleAdminDirectLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const trimmedEmail = authEmail.trim().toLowerCase();
    
    if (!trimmedEmail) {
      setAuthError("メールアドレスを入力してください。");
      return;
    }

    const isPrimary = PRIMARY_ADMIN_EMAILS.some(p => p.toLowerCase() === trimmedEmail);
    const isSub = approvedSubAdmins.some(s => s.toLowerCase() === trimmedEmail);

    if (!isPrimary && !isSub) {
      setAuthError(`メールアドレス「${trimmedEmail}」は管理者として登録・承認されていません。最高管理者の承認が必要です。`);
      return;
    }

    const username = isPrimary ? "Dipsan Limbu (Primary Admin)" : "Nepa Sub-Admin";
    if (onLoginSuccess) {
      onLoginSuccess({
        username,
        email: trimmedEmail,
        token: "admin_token_" + Date.now(),
        avatarUrl: currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
      });
    }
    showToast(`管理者「${username}」としてログイン認証成功しました！`);
  };

  const handleQuickPrimaryAdminLogin = () => {
    const primaryEmail = "dipsanijamhang@gmail.com";
    if (onLoginSuccess) {
      onLoginSuccess({
        username: "Dipsan Limbu (Chief Executive Admin)",
        email: primaryEmail,
        token: "primary_admin_token_" + Date.now(),
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
      });
    }
    showToast("最高管理者 (dipsanijamhang@gmail.com) としてログインしました！");
  };

  const handleRequestSubAdmin = async () => {
    if (!currentUser?.email) return;
    const reqs = getPendingSubAdminRequests();
    const existingIndex = reqs.findIndex(r => r.email.toLowerCase() === currentUser.email.toLowerCase());
    
    const newReq: SubAdminRequest = {
      email: currentUser.email,
      username: currentUser.username || "User",
      requestedAt: new Date().toLocaleString("ja-JP"),
      status: "pending"
    };

    if (existingIndex >= 0) {
      reqs[existingIndex] = newReq;
    } else {
      reqs.push(newReq);
    }

    savePendingSubAdminRequests(reqs);
    setPendingRequests(reqs);
    setSubAdminRequestSent(true);

    try {
      // Send backend notification email to dipsanijamhang@gmail.com
      const res = await fetch("/api/admin/request-approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentUser.email,
          username: currentUser.username || "User",
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`最高管理者 (${data.notifiedEmail || "dipsanijamhang@gmail.com"}) へ申請通知メールを送信しました！`);
      } else {
        showToast("最高管理者 (dipsanijamhang@gmail.com) にアクセス申請を送信しました！");
      }
    } catch {
      showToast("最高管理者 (dipsanijamhang@gmail.com) にアクセス申請を送信しました！");
    }
  };

  const handleApproveSubAdmin = (emailToApprove: string) => {
    const lower = emailToApprove.trim().toLowerCase();
    let currentList = getApprovedSubAdmins();
    if (!currentList.some(e => e.toLowerCase() === lower)) {
      currentList.push(lower);
      saveApprovedSubAdmins(currentList);
      setApprovedSubAdmins(currentList);
    }

    let reqs = getPendingSubAdminRequests();
    reqs = reqs.map(r => r.email.toLowerCase() === lower ? { ...r, status: "approved" as const } : r);
    savePendingSubAdminRequests(reqs);
    setPendingRequests(reqs);

    setUsersList(prev => prev.map(u => u.email.toLowerCase() === lower ? { ...u, role: "admin" } : u));

    showToast(`「${emailToApprove}」をサブ管理者として承認・登録しました！`);
  };

  const handleRevokeSubAdmin = (emailToRevoke: string) => {
    const lower = emailToRevoke.trim().toLowerCase();
    let currentList = getApprovedSubAdmins().filter(e => e.toLowerCase() !== lower);
    saveApprovedSubAdmins(currentList);
    setApprovedSubAdmins(currentList);

    setUsersList(prev => prev.map(u => u.email.toLowerCase() === lower ? { ...u, role: "user" } : u));

    showToast(`「${emailToRevoke}」のサブ管理者権限を取り消しました`);
  };

  const handleAddManualSubAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSubAdminEmail) return;
    handleApproveSubAdmin(manualSubAdminEmail);
    setManualSubAdminEmail("");
  };

  // Admin Profile State
  const [adminProfile, setAdminProfile] = useState({
    username: currentUser?.username || "Nepa Admin",
    email: currentUser?.email || "admin@nepatravel.com",
    phone: "+81 90-9876-5432",
    roleTitle: "最高管理者 (Chief Executive Admin)",
    location: "カトマンズ本社 & 日本事務局",
    avatarUrl: currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    bio: "カトマンズ本部・ポカラ営業所の統合予約管理および全15ツアーの掲載管理を統括。ヒマラヤ現地サポート対応中。",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notificationsEnabled: true,
    autoConfirmBookings: true
  });

  const adminAvatarFileRef = React.useRef<HTMLInputElement>(null);

  // Team & Staff Profiles List State
  const [teamList, setTeamList] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem("nepa_team_members") || sessionStorage.getItem("nepa_team_members");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((m: TeamMember) => {
          if (m.id === "dipsan-limbu" && (!m.image || m.image.includes("dipsan_limbu_original"))) {
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

  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamForm, setTeamForm] = useState<TeamMember>({
    id: "",
    name: "",
    role: "",
    roleJa: "",
    image: "",
    bioJa: "",
    bioEn: "",
    specialty: "",
    badge: "",
    experienceYears: ""
  });
  const teamMemberPhotoRef = React.useRef<HTMLInputElement>(null);

  // Main Data States
  const [bookingsList, setBookingsList] = useState<AdminBooking[]>([]);
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [messagesList, setMessagesList] = useState<AdminMessage[]>([]);
  const [toursList, setToursList] = useState<TourPackage[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [tourCategoryFilter, setTourCategoryFilter] = useState("all");

  // Tour Modal State
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<TourPackage | null>(null);
  const [tourForm, setTourForm] = useState({
    name: "",
    nameJp: "",
    description: "",
    price: "125,000円",
    duration: "4泊5日",
    image: "pokhara",
    customImageUrl: "",
    rating: 5
  });

  // Gallery Upload Modal State
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    category: "景観・自然",
    url: ""
  });

  // Custom Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "tour" | "booking" | "user" | "message" | "gallery";
    id: string;
    title: string;
  } | null>(null);

  // Load Admin Data when opened
  useEffect(() => {
    if (isOpen) {
      fetchAdminData();
      
      // Load stored admin profile
      const savedAdmin = localStorage.getItem("nepa_admin_profile");
      if (savedAdmin) {
        try {
          const parsed = JSON.parse(savedAdmin);
          setAdminProfile(prev => ({ ...prev, ...parsed }));
        } catch (e) {}
      } else if (currentUser) {
        setAdminProfile(prev => ({
          ...prev,
          username: currentUser.username || prev.username,
          email: currentUser.email || prev.email,
          avatarUrl: currentUser.avatarUrl || prev.avatarUrl
        }));
      }
    }
  }, [isOpen, currentUser]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const handleAdminAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("ファイルサイズは5MB以下にしてください");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAdminProfile(prev => ({ ...prev, avatarUrl: result }));
        showToast("管理者アバター写真を変更しました！");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminProfile.newPassword && adminProfile.newPassword !== adminProfile.confirmPassword) {
      alert("新しいパスワードと確認用パスワードが一致しません");
      return;
    }

    const updated = {
      ...adminProfile,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    };

    localStorage.setItem("nepa_admin_profile", JSON.stringify(updated));

    // Also sync with user session in localStorage if current user is admin
    const savedUser = localStorage.getItem("nepa_user_profile");
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        if (userObj.role === "admin" || userObj.email === adminProfile.email) {
          userObj.username = adminProfile.username;
          userObj.email = adminProfile.email;
          userObj.avatarUrl = adminProfile.avatarUrl;
          userObj.phone = adminProfile.phone;
          localStorage.setItem("nepa_user_profile", JSON.stringify(userObj));
        }
      } catch (err) {}
    }

    window.dispatchEvent(new Event("nepa_user_updated"));
    showToast("管理者プロフィール情報を正常に保存・更新しました！");
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Load Tours from localStorage or fallback to all 15 TOURS
      loadStoredTours();

      // 2. Load Bookings
      try {
        const bookRes = await fetch("/api/bookings", {
          headers: { "Authorization": `Bearer ${currentUser?.email || "demo-token"}` }
        });
        if (bookRes.ok) {
          const bData = await bookRes.json();
          setBookingsList(bData);
        } else {
          loadStoredBookings();
        }
      } catch (e) {
        loadStoredBookings();
      }

      // 3. Load Registered Users dynamically from localStorage
      loadRegisteredUsers();

      // 4. Load Contact Messages
      const storedMsgs = localStorage.getItem("nepa_contact_messages");
      if (storedMsgs) {
        try {
          setMessagesList(JSON.parse(storedMsgs));
        } catch (e) {
          loadDefaultMessages();
        }
      } else {
        loadDefaultMessages();
      }

      // 5. Load Gallery Items from localStorage or fallback to all 16 GALLERY items
      loadStoredGallery();

    } catch (err) {
      console.error("Admin data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadStoredTours = () => {
    const saved = localStorage.getItem("nepa_admin_tours_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setToursList(parsed);
          return;
        }
      } catch (e) {}
    }
    // Map all 15 tour items from data.ts
    const initialTours: TourPackage[] = TOURS.map(t => ({
      id: t.id,
      name: t.name,
      nameJp: t.name,
      description: t.description,
      price: t.price,
      duration: t.duration,
      rating: t.rating,
      image: t.image,
      tags: t.tags
    }));
    setToursList(initialTours);
    localStorage.setItem("nepa_admin_tours_v2", JSON.stringify(initialTours));
    window.dispatchEvent(new Event("nepa_tours_updated"));
  };

  const loadStoredGallery = () => {
    const saved = localStorage.getItem("nepa_admin_gallery_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGalleryList(parsed);
          return;
        }
      } catch (e) {}
    }
    // Map all 16 gallery items from data.ts
    const initialGallery: any[] = GALLERY.map((g, idx) => ({
      id: g.id || `g-${idx + 1}`,
      title: g.title,
      category: g.category,
      image: g.image,
      url: g.image,
      location: g.location,
      description: g.description,
      uploadedAt: "2026-08-01"
    }));
    setGalleryList(initialGallery);
    localStorage.setItem("nepa_admin_gallery_v2", JSON.stringify(initialGallery));
    window.dispatchEvent(new Event("nepa_gallery_updated"));
  };

  const loadStoredBookings = () => {
    const localBookings = localStorage.getItem("nepa_user_bookings");
    if (localBookings) {
      try {
        setBookingsList(JSON.parse(localBookings));
        return;
      } catch (e) {}
    }
    setBookingsList([
      { id: "BK-901", tourName: "ポカラ Premium Tour", customerName: currentUser?.username || "ネパール太郎", customerEmail: currentUser?.email || "user@example.com", travelDate: "2026-09-10", travelers: 2, totalPrice: 256000, paymentMethod: "クレジットカード", paymentStatus: "paid", createdDate: "2026-08-02" }
    ]);
  };

  const loadRegisteredUsers = () => {
    const storedUsers = localStorage.getItem("nepa_registered_accounts");
    let parsedUsers: AdminUser[] = [];

    // Include current logged in user
    if (currentUser) {
      parsedUsers.push({
        id: "usr-admin",
        username: currentUser.username,
        email: currentUser.email,
        role: "admin",
        createdDate: new Date().toISOString().split("T")[0]
      });
    }

    if (storedUsers) {
      try {
        const raw = JSON.parse(storedUsers);
        if (Array.isArray(raw)) {
          raw.forEach((u: any, idx: number) => {
            if (u.email && u.email !== currentUser?.email) {
              parsedUsers.push({
                id: `usr-${idx + 10}`,
                username: u.username || u.email.split("@")[0],
                email: u.email,
                role: "user",
                createdDate: u.registeredAt || new Date().toISOString().split("T")[0]
              });
            }
          });
        }
      } catch (e) {}
    }

    setUsersList(parsedUsers);
  };

  const loadDefaultMessages = () => {
    setMessagesList([
      { id: "msg-101", name: "佐藤 健一", email: "sato@example.com", message: "10月にポカラツアーを検討しています。日本語ガイドの手配は可能でしょうか？", date: "2026-08-02 14:30", status: "unread" }
    ]);
  };

  // Metrics calculation
  const totalRevenue = bookingsList
    .filter(b => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const pendingBookingsCount = bookingsList.filter(b => b.paymentStatus === "pending").length;
  const unreadMessagesCount = messagesList.filter(m => m.status === "unread").length;

  // Update Booking Status
  const handleUpdateBookingStatus = (id: string, newStatus: "paid" | "pending" | "cancelled") => {
    const updated = bookingsList.map(b => b.id === id ? { ...b, paymentStatus: newStatus } : b);
    setBookingsList(updated);
    localStorage.setItem("nepa_user_bookings", JSON.stringify(updated));
    showToast(`予約 #${id} のステータスを更新しました ✨`);
  };

  // Confirmed Execution Delete (100% Working Fix!)
  const confirmExecuteDelete = () => {
    if (!deleteTarget) return;

    const { type, id, title } = deleteTarget;

    if (type === "tour") {
      const updated = toursList.filter(t => t.id !== id);
      setToursList(updated);
      localStorage.setItem("nepa_admin_tours_v2", JSON.stringify(updated));
      window.dispatchEvent(new Event("nepa_tours_updated"));
      showToast(`ツアー「${title}」を削除しました 🗑️`);
    } else if (type === "booking") {
      const updated = bookingsList.filter(b => b.id !== id);
      setBookingsList(updated);
      localStorage.setItem("nepa_user_bookings", JSON.stringify(updated));
      showToast(`予約 #${id} を削除しました`);
    } else if (type === "user") {
      const updatedUsers = usersList.filter(u => u.id !== id);
      setUsersList(updatedUsers);
      
      const storedUsers = localStorage.getItem("nepa_registered_accounts");
      if (storedUsers) {
        try {
          const raw = JSON.parse(storedUsers);
          const filtered = raw.filter((u: any) => u.email !== title);
          localStorage.setItem("nepa_registered_accounts", JSON.stringify(filtered));
        } catch (e) {}
      }
      showToast(`ユーザー「${title}」を削除しました`);
    } else if (type === "message") {
      const updated = messagesList.filter(m => m.id !== id);
      setMessagesList(updated);
      localStorage.setItem("nepa_contact_messages", JSON.stringify(updated));
      showToast(`メッセージを削除しました`);
    } else if (type === "gallery") {
      const updated = galleryList.filter(g => g.id !== id);
      setGalleryList(updated);
      localStorage.setItem("nepa_admin_gallery_v2", JSON.stringify(updated));
      window.dispatchEvent(new Event("nepa_gallery_updated"));
      showToast(`ギャラリー写真を削除しました 🗑️`);
    }

    setDeleteTarget(null);
  };

  // Save/Update Tour
  const handleSaveTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourForm.name.trim() || !tourForm.price.trim()) {
      alert("ツアー名と価格を入力してください");
      return;
    }

    const finalImage = tourForm.customImageUrl.trim() || (PRESET_TOUR_IMAGES.find(p => p.id === tourForm.image)?.url || tourForm.image);

    let updatedTours: TourPackage[];

    if (editingTour) {
      updatedTours = toursList.map(t => t.id === editingTour.id ? {
        ...t,
        name: tourForm.name,
        nameJp: tourForm.nameJp || tourForm.name,
        description: tourForm.description,
        price: tourForm.price.includes("円") ? tourForm.price : `${tourForm.price}円`,
        duration: tourForm.duration,
        image: finalImage,
        rating: tourForm.rating
      } : t);
      showToast(`ツアー「${tourForm.name}」を更新しました ✨`);
    } else {
      const newTour: TourPackage = {
        id: `tour-${Date.now()}`,
        name: tourForm.name,
        nameJp: tourForm.nameJp || tourForm.name,
        description: tourForm.description,
        price: tourForm.price.includes("円") ? tourForm.price : `${tourForm.price}円`,
        duration: tourForm.duration || "4泊5日",
        rating: tourForm.rating || 5,
        image: finalImage,
        tags: ["人気ツアー", "ネパール観光"]
      };
      updatedTours = [newTour, ...toursList];
      showToast(`新しいツアー「${newTour.name}」を公開しました 🎉`);
    }

    setToursList(updatedTours);
    localStorage.setItem("nepa_admin_tours_v2", JSON.stringify(updatedTours));
    window.dispatchEvent(new Event("nepa_tours_updated"));

    setIsTourModalOpen(false);
    setEditingTour(null);
    setTourForm({ name: "", nameJp: "", description: "", price: "125,000円", duration: "4泊5日", image: "pokhara", customImageUrl: "", rating: 5 });
  };

  // Image Compression Utility for Browser LocalStorage Reliability (Compact 450x450 JPEG)
  const compressImage = (file: File, maxWidth = 500, maxHeight = 500, quality = 0.75): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", quality));
          } else {
            resolve((event.target?.result as string) || "");
          }
        };
        img.onerror = () => resolve((event.target?.result as string) || "");
        img.src = (event.target?.result as string) || "";
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  };

  // File Upload Handler (Base64) for Tour Image
  const handleTourFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 1000, 800, 0.82);
        if (compressed) {
          setTourForm(prev => ({
            ...prev,
            customImageUrl: compressed
          }));
          showToast("ツアーの写真をアップロードしました 📸");
        }
      } catch {
        alert("画像の読み込みに失敗しました");
      }
    }
  };

  // Gallery Photo Upload Handler
  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 1000, 800, 0.82);
        if (compressed) {
          setGalleryForm(prev => ({
            ...prev,
            url: compressed
          }));
          showToast("写真をアップロードしました 📸");
        }
      } catch {
        alert("画像の読み込みに失敗しました");
      }
    }
  };

  // Team Member Modal Handler
  const handleOpenTeamModal = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setTeamForm({ ...member });
    } else {
      setEditingMember(null);
      setTeamForm({
        id: `team-${Date.now()}`,
        name: "",
        role: "Mountain Specialist & Guide",
        roleJa: "現地専任ガイド",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
        bioJa: "",
        bioEn: "",
        specialty: "トレッキングサポート・地域文化解説",
        badge: "OFFICIAL GUIDE",
        experienceYears: "5年"
      });
    }
    setIsTeamModalOpen(true);
  };

  // Save Team Member
  const handleSaveTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name.trim() || !teamForm.bioJa.trim()) {
      alert("スタッフのお名前と日本語の「説明文（Bio）」を入力してください");
      return;
    }

    let updated: TeamMember[];
    if (editingMember) {
      updated = teamList.map(m => m.id === editingMember.id ? { ...teamForm } : m);
      showToast(`「${teamForm.name}」の説明文・プロフィールを更新しました！ ✨`);
    } else {
      const newM = { ...teamForm, id: teamForm.id || `team-${Date.now()}` };
      updated = [...teamList, newM];
      showToast(`新規スタッフ「${newM.name}」を追加しました！ 🎉`);
    }

    setTeamList(updated);
    try {
      localStorage.setItem("nepa_team_members", JSON.stringify(updated));
    } catch (err) {
      console.warn("localStorage save retry:", err);
      try {
        localStorage.setItem("nepa_team_members", JSON.stringify(updated));
      } catch (e) {
        console.error("Storage limit reached:", e);
      }
    }
    try {
      sessionStorage.setItem("nepa_team_members", JSON.stringify(updated));
    } catch (e) {}
    window.dispatchEvent(new Event("nepa_team_updated"));

    setIsTeamModalOpen(false);
    setEditingMember(null);
  };

  // Delete Team Member
  const handleDeleteTeamMember = (id: string, name: string) => {
    if (confirm(`スタッフ「${name}」を削除しますか？`)) {
      const updated = teamList.filter(m => m.id !== id);
      setTeamList(updated);
      try {
        localStorage.setItem("nepa_team_members", JSON.stringify(updated));
      } catch (e) {}
      window.dispatchEvent(new Event("nepa_team_updated"));
      showToast(`スタッフ「${name}」を削除しました 🗑️`);
    }
  };

  // Reset Team Members to Defaults
  const handleResetTeamMembers = () => {
    if (confirm("全スタッフの説明文・プロフィールを初期状態（デフォルト5名）に復元しますか？")) {
      setTeamList(DEFAULT_TEAM_MEMBERS);
      try {
        localStorage.setItem("nepa_team_members", JSON.stringify(DEFAULT_TEAM_MEMBERS));
      } catch (e) {}
      window.dispatchEvent(new Event("nepa_team_updated"));
      showToast("スタッフ情報を初期状態にリセットしました ✨");
    }
  };

  // Photo Upload Handler for Team Member with Compression (450x450 Max)
  const handleTeamPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 450, 450, 0.72);
        if (compressed) {
          setTeamForm(prev => ({ ...prev, image: compressed }));
          showToast("スタッフ写真を最適化してアップロードしました 📸");
        }
      } catch {
        alert("画像の読み込みに失敗しました");
      }
    }
  };

  const handleSaveGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title.trim() || !galleryForm.url.trim()) {
      alert("タイトルと写真を指定してください。");
      return;
    }

    const newItem: any = {
      id: `g-${Date.now()}`,
      title: galleryForm.title,
      category: galleryForm.category || "自然",
      image: galleryForm.url,
      url: galleryForm.url,
      location: "ネパール",
      description: galleryForm.title,
      uploadedAt: new Date().toISOString().split("T")[0]
    };

    const updated = [newItem, ...galleryList];
    setGalleryList(updated);
    localStorage.setItem("nepa_admin_gallery_v2", JSON.stringify(updated));
    window.dispatchEvent(new Event("nepa_gallery_updated"));
    showToast("ギャラリーに写真を追加しました 🖼️");
    setIsGalleryModalOpen(false);
    setGalleryForm({ title: "", category: "景観・自然", url: "" });
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = "予約ID,ツアー名,顧客名,メールアドレス,旅行日,人数,合計金額,支払い方法,ステータス,作成日\n";
    const rows = bookingsList.map(b => 
      `"${b.id}","${b.tourName}","${b.customerName}","${b.customerEmail}","${b.travelDate}",${b.travelers},${b.totalPrice},"${b.paymentMethod}","${b.paymentStatus}","${b.createdDate}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `NepaTravel_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("予約データのCSVを出力しました 📊");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-lg flex items-center justify-center p-1 sm:p-4 md:p-6 animate-fade-in">
        
        {/* Floating Toast Notification */}
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-80 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white font-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm sm:text-base border-2 border-emerald-300/40"
          >
            <Sparkles className="w-6 h-6 text-amber-300 animate-spin" />
            <span className="tracking-wide">{toastMsg}</span>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 z-80 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border-2 border-rose-500/50 text-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl text-center"
            >
              <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-inner">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-white">本当に削除しますか？</h3>
                <p className="text-sm sm:text-base font-bold text-slate-300 leading-relaxed">
                  「<span className="text-rose-400 font-black">{deleteTarget.title}</span>」を削除します。この操作は取り消せません。
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black rounded-2xl text-sm transition-all cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  onClick={confirmExecuteDelete}
                  className="flex-1 py-3.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl text-sm transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>削除を実行</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Main Admin Portal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 15 }}
          className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl sm:rounded-3xl w-full max-w-7xl h-[98vh] sm:h-[94vh] flex flex-col shadow-2xl overflow-hidden relative"
        >
          
          {/* Header Bar */}
          <div className="bg-slate-950 px-3 sm:px-8 py-2.5 sm:py-5 border-b border-slate-800 flex items-center justify-between shrink-0 gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden bg-white border-2 border-rose-500/80 shadow-xl shrink-0 flex items-center justify-center p-0.5">
                <img 
                  src={nepaLogo} 
                  alt="Nepa Travel Official Logo" 
                  className="w-full h-full object-cover rounded-lg sm:rounded-xl" 
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
                  <h2 className="text-sm sm:text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-1 sm:gap-2 truncate">
                    <span className="text-rose-500 font-black">Nepa</span>{" "}
                    <span className="text-white font-black">Travel</span>
                    <span className="text-slate-300 font-extrabold text-xs sm:text-lg ml-0.5 hidden xs:inline">PRO</span>
                  </h2>
                  <span className="px-2 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 text-[10px] sm:text-xs font-black tracking-wider uppercase shrink-0 flex items-center gap-1">
                    {isAuthorized ? (
                      isPrimaryAdmin(currentUser?.email) ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>👑 最高管理者</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>🛡️ サブ管理者</span>
                        </>
                      )
                    ) : (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                        <span>🔒 認証保護</span>
                      </>
                    )}
                  </span>
                </div>
                <p className="text-xs sm:text-base font-extrabold text-slate-300 mt-0.5 sm:mt-1 truncate hidden sm:block">
                  リアルタイム予約・全15ツアー編集・ギャラリー写真管理・ユーザー統合コントロール
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={fetchAdminData}
                disabled={loading}
                className="p-2 sm:px-4 sm:py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 border border-slate-700 active:scale-95"
                title="最新データを同期"
              >
                <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? "animate-spin text-amber-400" : ""}`} />
                <span className="hidden sm:inline">最新同期</span>
              </button>

              <button
                onClick={onClose}
                className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center border border-slate-700 active:scale-95"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Conditional Security Barrier Screen vs Nav Tabs & Workspace */}
          {!isAuthorized ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center bg-slate-950/95 relative min-h-0 w-full py-6 sm:py-10">
              
              {/* Background ambient light gradients */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 sm:space-y-5 text-center relative z-10 backdrop-blur-2xl my-auto shrink-0">
                
                {/* Shield Icon Header */}
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl sm:rounded-3xl bg-slate-950 border-2 border-amber-500/40 flex items-center justify-center shadow-xl relative">
                    <ShieldAlert className="w-7 h-7 sm:w-9 sm:h-9 text-amber-400" />
                    <div className="absolute -bottom-1 -right-1 sm:-bottom-1.5 sm:-right-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 rounded-full p-1 sm:p-1.5 shadow-lg border border-slate-900">
                      <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 font-black" />
                    </div>
                  </div>
                </div>

                {/* Title & Security Badge */}
                <div className="space-y-1 sm:space-y-2">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                    <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> 管理者エリア (RESTRICTED AREA)
                  </div>
                  <h3 className="text-base sm:text-xl font-black text-white tracking-tight">
                    {!currentUser ? "管理者ログインが必要です" : "アクセス承認が必要です"}
                  </h3>
                </div>

                {!currentUser ? (
                  /* GUEST CASE: Prompt to log in as admin */
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-slate-950/80 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-800 text-left space-y-1">
                      <p className="text-[11px] sm:text-xs text-slate-300 font-extrabold leading-relaxed">
                        管理者機能へのアクセスは保護されています。承認済みの管理者情報でログインしてください。
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-amber-400/90 font-mono truncate">
                        (最高管理者: dipsanijamhang@gmail.com)
                      </p>
                    </div>

                    <form onSubmit={handleAdminDirectLogin} className="space-y-3 sm:space-y-3.5 text-left">
                      <div>
                        <label className="block text-[11px] sm:text-xs font-black text-slate-200 mb-1">
                          メールアドレス
                        </label>
                        <div className="relative">
                          <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            placeholder="dipsanijamhang@gmail.com"
                            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 text-white rounded-xl py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm font-bold outline-none transition-all shadow-inner"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] sm:text-xs font-black text-slate-200 mb-1">
                          パスワード
                        </label>
                        <div className="relative">
                          <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="password"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 text-white rounded-xl py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm font-bold outline-none transition-all shadow-inner"
                            required
                          />
                        </div>
                      </div>

                      {authError && (
                        <div className="text-rose-300 text-[11px] sm:text-xs font-bold bg-rose-950/90 border border-rose-800/80 p-2.5 sm:p-3 rounded-xl leading-relaxed">
                          {authError}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2.5 sm:py-3 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-amber-400/20 cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
                      >
                        <LogIn className="w-4 h-4 text-slate-950" />
                        <span>ログイン</span>
                      </button>
                    </form>
                  </div>
                ) : (
                  /* LOGGED IN USER WITHOUT ADMIN AUTHORIZATION CASE */
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-slate-950/90 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800 text-left space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-400">
                        <span>ログイン中:</span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-extrabold text-[10px] sm:text-[11px]">一般</span>
                      </div>
                      <p className="text-xs sm:text-sm font-black text-amber-300 break-all">{currentUser.username} ({currentUser.email})</p>
                      <p className="text-[11px] sm:text-xs text-slate-300 font-medium leading-relaxed pt-0.5">
                        管理者権限が未割り当てです。最高管理者 (<span className="text-amber-300 font-bold">dipsanijamhang@gmail.com</span>) による承認が必要です。
                      </p>
                    </div>

                    {subAdminRequestSent ? (
                      <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-emerald-950/90 border border-emerald-600/60 text-emerald-300 text-[11px] sm:text-xs font-black flex items-center gap-2 justify-center shadow-lg">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                        <span>アクセス申請を送信しました</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestSubAdmin}
                        className="w-full py-2.5 sm:py-3 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-amber-400/20 cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
                      >
                        <Send className="w-4 h-4 text-slate-950" />
                        <span>権限を申請する</span>
                      </button>
                    )}
                  </div>
                )}

              </div>
            </div>
          ) : (
            <>
              {/* Nav Tabs */}
          <div className="bg-slate-950/90 px-2 sm:px-8 border-b border-slate-800 flex items-center gap-1 sm:gap-4 overflow-x-auto no-scrollbar shrink-0 scroll-smooth">
            
            <button
              onClick={(e) => {
                e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                setActiveTab("overview");
              }}
              className={`py-2.5 sm:py-4 px-3 sm:px-5 font-black text-xs sm:text-base transition-all border-b-2 sm:border-b-3 whitespace-nowrap flex items-center gap-1.5 sm:gap-2.5 cursor-pointer ${
                activeTab === "overview" 
                  ? "border-amber-400 text-amber-300 bg-amber-500/10" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
              <span>概要</span>
            </button>

            <button
              onClick={(e) => {
                e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                setActiveTab("tours");
              }}
              className={`py-2.5 sm:py-4 px-3 sm:px-5 font-black text-xs sm:text-base transition-all border-b-2 sm:border-b-3 whitespace-nowrap flex items-center gap-1.5 sm:gap-2.5 cursor-pointer ${
                activeTab === "tours" 
                  ? "border-amber-400 text-amber-300 bg-amber-500/10" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
              <span>ツアー</span>
            </button>

            <button
              onClick={(e) => {
                e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                setActiveTab("gallery");
              }}
              className={`py-2.5 sm:py-4 px-3 sm:px-5 font-black text-xs sm:text-base transition-all border-b-2 sm:border-b-3 whitespace-nowrap flex items-center gap-1.5 sm:gap-2.5 cursor-pointer ${
                activeTab === "gallery" 
                  ? "border-amber-400 text-amber-300 bg-amber-500/10" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 shrink-0" />
              <span>ギャラリー</span>
            </button>

            <button
              onClick={(e) => {
                e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                setActiveTab("bookings");
              }}
              className={`py-2.5 sm:py-4 px-3 sm:px-5 font-black text-xs sm:text-base transition-all border-b-2 sm:border-b-3 whitespace-nowrap flex items-center gap-1.5 sm:gap-2.5 cursor-pointer relative ${
                activeTab === "bookings" 
                  ? "border-amber-400 text-amber-300 bg-amber-500/10" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
              <span>予約</span>
              {pendingBookingsCount > 0 && (
                <span className="px-2 py-0.5 bg-amber-500 text-slate-950 rounded-full text-[10px] sm:text-xs font-black">
                  {pendingBookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={(e) => {
                e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                setActiveTab("users");
              }}
              className={`py-2.5 sm:py-4 px-3 sm:px-5 font-black text-xs sm:text-base transition-all border-b-2 sm:border-b-3 whitespace-nowrap flex items-center gap-1.5 sm:gap-2.5 cursor-pointer ${
                activeTab === "users" 
                  ? "border-amber-400 text-amber-300 bg-amber-500/10" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 shrink-0" />
              <span>会員</span>
            </button>

            <button
              onClick={(e) => {
                e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                setActiveTab("messages");
              }}
              className={`py-2.5 sm:py-4 px-3 sm:px-5 font-black text-xs sm:text-base transition-all border-b-2 sm:border-b-3 whitespace-nowrap flex items-center gap-1.5 sm:gap-2.5 cursor-pointer relative ${
                activeTab === "messages" 
                  ? "border-amber-400 text-amber-300 bg-amber-500/10" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 shrink-0" />
              <span>問合せ</span>
              {unreadMessagesCount > 0 && (
                <span className="px-2 py-0.5 bg-rose-500 text-white rounded-full text-[10px] sm:text-xs font-black">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={(e) => {
                e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                setActiveTab("profile");
              }}
              className={`py-2.5 sm:py-4 px-3 sm:px-5 font-black text-xs sm:text-base transition-all border-b-2 sm:border-b-3 whitespace-nowrap flex items-center gap-1.5 sm:gap-2.5 cursor-pointer relative ${
                activeTab === "profile" 
                  ? "border-amber-400 text-amber-300 bg-amber-500/10" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
              <span>管理者プロフ</span>
            </button>

            <button
              onClick={(e) => {
                e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                setActiveTab("team");
              }}
              className={`py-2.5 sm:py-4 px-3 sm:px-5 font-black text-xs sm:text-base transition-all border-b-2 sm:border-b-3 whitespace-nowrap flex items-center gap-1.5 sm:gap-2.5 cursor-pointer relative ${
                activeTab === "team" 
                  ? "border-amber-400 text-amber-300 bg-amber-500/10" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">スタッフ説明編集</span>
              <span className="sm:hidden">スタッフ説明</span>
            </button>

          </div>

          {/* Tab Workspace */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">

            {/* TAB 1: OVERVIEW DASHBOARD */}
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                
                {/* Interactive Animated Hover Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  
                  {/* Revenue Card */}
                  <motion.div 
                    whileHover={{ scale: 1.03, y: -6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => setActiveTab("bookings")}
                    className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-6 rounded-3xl border-2 border-emerald-500/40 hover:border-emerald-400 shadow-xl relative overflow-hidden cursor-pointer group transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">確定売上額 (JPY)</span>
                      <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 group-hover:scale-110 transition-transform">
                        <DollarSign className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        ¥{totalRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs font-black text-emerald-300">
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4" />
                        確定注文: {bookingsList.filter(b => b.paymentStatus === "paid").length}件
                      </span>
                      <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>

                  {/* Bookings Card */}
                  <motion.div 
                    whileHover={{ scale: 1.03, y: -6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => setActiveTab("bookings")}
                    className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6 rounded-3xl border-2 border-indigo-500/40 hover:border-indigo-400 shadow-xl relative overflow-hidden cursor-pointer group transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">総予約件数</span>
                      <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30 group-hover:scale-110 transition-transform">
                        <Calendar className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        {bookingsList.length} <span className="text-base font-extrabold text-slate-400">件</span>
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs font-black text-indigo-200">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-extrabold">{bookingsList.filter(b => b.paymentStatus === "paid").length} 確定</span>
                        <span>•</span>
                        <span className="text-amber-400 font-extrabold">{pendingBookingsCount} 保留</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>

                  {/* Registered Users Card */}
                  <motion.div 
                    whileHover={{ scale: 1.03, y: -6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => setActiveTab("users")}
                    className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950 p-6 rounded-3xl border-2 border-purple-500/40 hover:border-purple-400 shadow-xl relative overflow-hidden cursor-pointer group transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-purple-400 uppercase tracking-widest">登録会員数</span>
                      <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl border border-purple-500/30 group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        {usersList.length} <span className="text-base font-extrabold text-slate-400">名</span>
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs font-black text-purple-200">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-purple-400" />
                        新規登録リアルタイム反映
                      </span>
                      <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>

                  {/* Tours Count Card */}
                  <motion.div 
                    whileHover={{ scale: 1.03, y: -6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => setActiveTab("tours")}
                    className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950 p-6 rounded-3xl border-2 border-amber-500/40 hover:border-amber-400 shadow-xl relative overflow-hidden cursor-pointer group transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-400 uppercase tracking-widest">公開ツアー数</span>
                      <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30 group-hover:scale-110 transition-transform">
                        <Compass className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        {toursList.length} <span className="text-base font-extrabold text-slate-400">プラン</span>
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs font-black text-amber-200">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        全ツアー予約受付中
                      </span>
                      <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>

                </div>

                {/* Quick Actions & Recent Activity Table */}
                <div className="bg-slate-950/90 p-4 sm:p-8 rounded-3xl border border-slate-800 space-y-5 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 shrink-0" />
                        最新予約ログ
                      </h3>
                      <p className="text-xs sm:text-sm font-extrabold text-slate-400 mt-1">
                        Webサイトより受け付けたリアルタイムの予約一覧
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                      <button
                        onClick={handleExportCSV}
                        className="flex-1 sm:flex-initial justify-center px-3.5 py-2.5 sm:px-4 sm:py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 shadow-lg active:scale-95"
                      >
                        <Download className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
                        <span>CSV出力</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingTour(null);
                          setTourForm({ name: "", nameJp: "", description: "", price: "125,000円", duration: "4泊5日", image: "pokhara", customImageUrl: "", rating: 5 });
                          setIsTourModalOpen(true);
                        }}
                        className="flex-1 sm:flex-initial justify-center px-3.5 py-2.5 sm:px-5 sm:py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 shadow-lg active:scale-95 whitespace-nowrap"
                      >
                        <Plus className="w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0" />
                        <span>新規ツアー作成</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-800">
                    <table className="w-full text-left text-xs sm:text-sm text-slate-200 min-w-[650px]">
                      <thead className="bg-slate-900 text-slate-300 font-black uppercase text-xs tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3 sm:p-4 whitespace-nowrap">予約ID</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap">ツアー名</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap">お客様名</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap">日程</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap">金額</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap">ステータス</th>
                          <th className="p-3 sm:p-4 text-right whitespace-nowrap">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 font-bold">
                        {bookingsList.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-400 text-sm font-bold">
                              予約データはまだありません。
                            </td>
                          </tr>
                        ) : (
                          bookingsList.slice(0, 5).map((b) => (
                            <tr key={b.id} className="hover:bg-slate-900/60 transition-colors">
                              <td className="p-3 sm:p-4 font-mono text-amber-400 font-black text-xs sm:text-sm whitespace-nowrap">{b.id}</td>
                              <td className="p-3 sm:p-4 text-white font-black text-xs sm:text-sm whitespace-nowrap">{b.tourName}</td>
                              <td className="p-3 sm:p-4 whitespace-nowrap">
                                <div className="text-white font-black text-xs sm:text-sm">{b.customerName}</div>
                                <div className="text-[11px] sm:text-xs text-slate-400 font-normal">{b.customerEmail}</div>
                              </td>
                              <td className="p-3 sm:p-4 text-slate-200 font-bold whitespace-nowrap">{b.travelDate}</td>
                              <td className="p-3 sm:p-4 font-black text-emerald-400 text-xs sm:text-sm whitespace-nowrap">¥{b.totalPrice.toLocaleString()}</td>
                              <td className="p-3 sm:p-4 whitespace-nowrap">
                                {b.paymentStatus === "paid" ? (
                                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black inline-flex items-center gap-1.5 whitespace-nowrap">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 支払済み
                                  </span>
                                ) : b.paymentStatus === "pending" ? (
                                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black inline-flex items-center gap-1.5 whitespace-nowrap">
                                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" /> 保留中
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black inline-flex items-center gap-1.5 whitespace-nowrap">
                                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" /> キャンセル
                                  </span>
                                )}
                              </td>
                              <td className="p-3 sm:p-4 text-right whitespace-nowrap">
                                <button
                                  onClick={() => setActiveTab("bookings")}
                                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
                                >
                                  管理
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB 2: TOURS MANAGEMENT WITH ENHANCED CARDS & UPLOAD */}
            {activeTab === "tours" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-slate-950/90 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800">
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2 sm:gap-2.5">
                      <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 shrink-0" />
                      ツアーパッケージ編集・管理 ({toursList.length})
                    </h3>
                    <p className="text-xs sm:text-sm font-extrabold text-slate-400 mt-1">
                      ツアーの写真アップロード・価格・期間の変更・新規追加が可能です
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingTour(null);
                      setTourForm({ name: "", nameJp: "", description: "", price: "125,000円", duration: "4泊5日", image: "pokhara", customImageUrl: "", rating: 5 });
                      setIsTourModalOpen(true);
                    }}
                    className="w-full sm:w-auto justify-center px-4 py-3 sm:px-6 sm:py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 shadow-xl active:scale-95 shrink-0"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span>新規ツアーを追加</span>
                  </button>
                </div>

                {/* Tour Grid Cards with Smooth Hover Effects */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {toursList.map((tour) => {
                    const previewImg = PRESET_TOUR_IMAGES.find(p => p.id === tour.image)?.url || tour.image;

                    return (
                      <motion.div 
                        key={tour.id} 
                        whileHover={{ y: -6, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="bg-slate-950/90 rounded-3xl border-2 border-slate-800/90 hover:border-amber-500/60 overflow-hidden flex flex-col justify-between transition-all shadow-xl group"
                      >
                        <div>
                          {/* Image Banner */}
                          <div className="h-56 w-full relative overflow-hidden bg-slate-900">
                            <img 
                              src={previewImg} 
                              alt={tour.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
                            
                            {/* Duration Badge - Larger, clearer box */}
                            <span className="absolute top-3.5 left-3.5 px-4 py-2 rounded-2xl bg-slate-950/95 backdrop-blur-md text-amber-300 border-2 border-amber-500/60 text-sm sm:text-base font-black shadow-xl flex items-center gap-2">
                              <Clock className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                              <span>{tour.duration}</span>
                            </span>

                            <span className="absolute bottom-3.5 right-3.5 text-lg sm:text-xl font-black text-emerald-400 bg-slate-950/95 px-4 py-1.5 rounded-2xl border border-emerald-500/40 shadow-lg">
                              {tour.price}
                            </span>
                          </div>

                          <div className="p-6 space-y-3">
                            <h4 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                              {tour.name}
                            </h4>

                            <p className="text-xs sm:text-sm font-bold text-slate-300 line-clamp-3 leading-relaxed">
                              {tour.description}
                            </p>
                          </div>
                        </div>

                        <div className="px-6 pb-6 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                          {/* Tour Single Perfect Star Rating */}
                          <div className="flex items-center gap-1.5 bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-amber-500/40 shadow-inner">
                            <SharpStar className="w-5 h-5 fill-amber-400 text-amber-400 shrink-0" />
                            <span className="text-sm font-black text-amber-300">
                              {tour.rating ? (tour.rating.toString().includes(".") ? tour.rating : `${tour.rating}.0`) : "5.0"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={() => {
                                setEditingTour(tour);
                                setTourForm({
                                  name: tour.name,
                                  nameJp: tour.nameJp || tour.name,
                                  description: tour.description,
                                  price: tour.price,
                                  duration: tour.duration,
                                  image: PRESET_TOUR_IMAGES.some(p => p.id === tour.image) ? tour.image : "custom",
                                  customImageUrl: PRESET_TOUR_IMAGES.some(p => p.id === tour.image) ? "" : tour.image,
                                  rating: tour.rating
                                });
                                setIsTourModalOpen(true);
                              }}
                              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-black rounded-xl text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                            >
                              <Edit3 className="w-4 h-4" />
                              <span>編集</span>
                            </button>

                            <button
                              onClick={() => setDeleteTarget({ type: "tour", id: tour.id, title: tour.name })}
                              className="p-2.5 text-rose-400 hover:text-white hover:bg-rose-600/30 rounded-2xl transition-all cursor-pointer active:scale-95"
                              title="削除"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 3: PHOTO GALLERY SHOWCASE & UPLOAD */}
            {activeTab === "gallery" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-slate-950/90 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800">
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2 sm:gap-2.5">
                      <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 shrink-0" />
                      フォトギャラリー管理 ({galleryList.length})
                    </h3>
                    <p className="text-xs sm:text-sm font-extrabold text-slate-400 mt-1">
                      Webサイトに掲載するネパールの観光名所写真を管理・追加できます
                    </p>
                  </div>

                  <button
                    onClick={() => setIsGalleryModalOpen(true)}
                    className="w-full sm:w-auto justify-center px-4 py-3 sm:px-6 sm:py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 shadow-xl active:scale-95 shrink-0"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span>ギャラリー写真を追加</span>
                  </button>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {galleryList.map((item) => (
                    <motion.div 
                      key={item.id}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="bg-slate-950/90 rounded-3xl border border-slate-800 overflow-hidden shadow-xl group relative"
                    >
                      <div className="h-52 w-full relative overflow-hidden bg-slate-900">
                        <img 
                          src={item.url} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                        
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur-md text-indigo-300 border border-indigo-500/40 text-xs font-black">
                          {item.category}
                        </span>

                        <button
                          onClick={() => setDeleteTarget({ type: "gallery", id: item.id, title: item.title })}
                          className="absolute top-3 right-3 p-2 bg-slate-950/90 hover:bg-rose-600 text-rose-400 hover:text-white rounded-xl transition-all cursor-pointer border border-rose-500/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-4">
                        <h4 className="text-base font-black text-white truncate">{item.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">追加日: {item.uploadedAt}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB 4: BOOKINGS */}
            {activeTab === "bookings" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-slate-950/90 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800">
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2 sm:gap-2.5">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0" />
                      全予約レコード管理 ({bookingsList.length})
                    </h3>
                    <p className="text-xs sm:text-sm font-extrabold text-slate-400 mt-1">
                      お客様の予約確認・支払いステータス変更・削除が可能です
                    </p>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="予約検索 (名前・ツアー名)"
                        className="pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-full sm:w-64"
                      />
                    </div>

                    <button
                      onClick={handleExportCSV}
                      className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95"
                    >
                      <Download className="w-4 h-4 shrink-0" />
                      <span>CSV</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950/90 rounded-3xl border border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm text-slate-200 min-w-[700px]">
                      <thead className="bg-slate-900 text-slate-300 font-black uppercase text-xs tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3 sm:p-4 whitespace-nowrap">予約ID</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap">ツアー名</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap">お客様情報</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap">旅行日程</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap">人数</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap">支払金額</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap">決済手段</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap">ステータス</th>
                          <th className="p-3 sm:p-4 text-right whitespace-nowrap">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 font-bold">
                        {bookingsList.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="p-8 text-center text-slate-400 text-sm font-bold">
                              予約データは現在ありません。
                            </td>
                          </tr>
                        ) : (
                          bookingsList
                            .filter(b => 
                              b.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              b.id.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((b) => (
                              <tr key={b.id} className="hover:bg-slate-900/60 transition-colors">
                                <td className="p-3 sm:p-4 font-mono text-amber-400 font-black text-xs sm:text-sm whitespace-nowrap">{b.id}</td>
                                <td className="p-3 sm:p-4 text-white font-black text-xs sm:text-sm whitespace-nowrap">{b.tourName}</td>
                                <td className="p-3 sm:p-4 whitespace-nowrap">
                                  <div className="text-white font-black text-xs sm:text-sm">{b.customerName}</div>
                                  <div className="text-[11px] sm:text-xs text-slate-400 font-normal">{b.customerEmail}</div>
                                </td>
                                <td className="p-3 sm:p-4 text-slate-200 font-bold whitespace-nowrap">{b.travelDate}</td>
                                <td className="p-3 sm:p-4 font-black whitespace-nowrap">{b.travelers}名</td>
                                <td className="p-3 sm:p-4 font-black text-emerald-400 text-xs sm:text-sm whitespace-nowrap">¥{b.totalPrice.toLocaleString()}</td>
                                <td className="p-3 sm:p-4 text-slate-300 text-xs font-semibold whitespace-nowrap">{b.paymentMethod}</td>
                                <td className="p-3 sm:p-4 whitespace-nowrap">
                                  <select
                                    value={b.paymentStatus}
                                    onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as any)}
                                    className={`px-2.5 py-1.5 rounded-xl text-xs font-black border cursor-pointer whitespace-nowrap ${
                                      b.paymentStatus === "paid" 
                                        ? "bg-emerald-950 text-emerald-300 border-emerald-600" 
                                        : b.paymentStatus === "pending"
                                        ? "bg-amber-950 text-amber-300 border-amber-600"
                                        : "bg-rose-950 text-rose-300 border-rose-600"
                                    }`}
                                  >
                                    <option value="paid">支払済み (Confirmed)</option>
                                    <option value="pending">保留中 (Pending)</option>
                                    <option value="cancelled">キャンセル (Cancelled)</option>
                                  </select>
                                </td>
                                <td className="p-3 sm:p-4 text-right whitespace-nowrap">
                                  <button
                                    onClick={() => setDeleteTarget({ type: "booking", id: b.id, title: `予約 #${b.id}` })}
                                    className="p-2 text-rose-400 hover:text-white hover:bg-rose-600/30 rounded-xl transition-all cursor-pointer active:scale-95"
                                    title="削除"
                                  >
                                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                                  </button>
                                </td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 5: REGISTERED USERS DIRECTORY */}
            {activeTab === "users" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-slate-950/90 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800">
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2 sm:gap-2.5">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 shrink-0" />
                      登録会員ディレクトリ ({usersList.length})
                    </h3>
                    <p className="text-xs sm:text-sm font-extrabold text-slate-400 mt-1">
                      Webサイトで新規アカウント登録を行ったすべての会員が即座に反映されます
                    </p>
                  </div>
                </div>

                {/* Sub-Admin Approval Management Section */}
                <div className="bg-slate-950/90 p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-800 space-y-5 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <h4 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-amber-400" />
                        <span>サブ管理者 権限管理・承認システム</span>
                      </h4>
                      <p className="text-xs text-slate-400 font-bold mt-1">
                        最高管理者 (<span className="text-amber-300 font-mono">dipsanijamhang@gmail.com</span>) はサブ管理者のアクセス申請を承認・拒否・追加・取消できます。
                      </p>
                    </div>
                    
                    {/* Manual Sub-Admin Add Form */}
                    <form onSubmit={handleAddManualSubAdmin} className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="email"
                        value={manualSubAdminEmail}
                        onChange={(e) => setManualSubAdminEmail(e.target.value)}
                        placeholder="指定メールアドレスを入力"
                        className="bg-slate-900 border border-slate-800 focus:border-amber-400 text-white text-xs font-bold px-3 py-2 rounded-xl outline-none w-full sm:w-56"
                        required
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>サブ管理者に追加</span>
                      </button>
                    </form>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    
                    {/* Pending Requests Box */}
                    <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span>承認待ち申請リスト ({pendingRequests.filter(r => r.status === "pending").length})</span>
                        </h5>
                      </div>

                      {pendingRequests.filter(r => r.status === "pending").length === 0 ? (
                        <p className="text-xs text-slate-500 font-bold py-3 text-center">
                          現在承認待ちのサブ管理者申請はありません
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {pendingRequests.filter(r => r.status === "pending").map((req) => (
                            <div key={req.email} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-xs font-black text-white truncate">{req.username}</p>
                                <p className="text-[11px] font-bold text-slate-400 truncate">{req.email}</p>
                                <p className="text-[10px] text-slate-500">{req.requestedAt}</p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleApproveSubAdmin(req.email)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                                >
                                  <Check className="w-3 h-3" /> 承認
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const reqs = pendingRequests.filter(r => r.email.toLowerCase() !== req.email.toLowerCase());
                                    savePendingSubAdminRequests(reqs);
                                    setPendingRequests(reqs);
                                    showToast(`「${req.email}」の申請を拒否しました`);
                                  }}
                                  className="px-2 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 font-bold text-[11px] rounded-lg transition-all cursor-pointer"
                                >
                                  拒否
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Approved Sub-Admins List Box */}
                    <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs sm:text-sm font-black text-emerald-300 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>承認済みサブ管理者リスト ({approvedSubAdmins.length})</span>
                        </h5>
                      </div>

                      {approvedSubAdmins.length === 0 ? (
                        <p className="text-xs text-slate-500 font-bold py-3 text-center">
                          現在承認済みのサブ管理者はいません
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {approvedSubAdmins.map((subEmail) => (
                            <div key={subEmail} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-xs font-black text-white truncate">{subEmail}</p>
                                <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">承認済み</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRevokeSubAdmin(subEmail)}
                                className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold text-[11px] rounded-lg transition-all cursor-pointer flex items-center gap-1"
                                title="サブ管理者権限を取り消す"
                              >
                                <UserMinus className="w-3 h-3" /> 権限取消
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                <div className="bg-slate-950/90 rounded-3xl border border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm text-slate-200 min-w-[600px]">
                      <thead className="bg-slate-900 text-slate-300 font-black uppercase text-xs tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3 sm:p-4 whitespace-nowrap">ユーザー</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap">メールアドレス</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap">権限ロール</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap">登録日</th>
                          <th className="p-3 sm:p-4 text-right whitespace-nowrap">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 font-bold">
                        {usersList.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400 text-sm font-bold">
                              登録会員はまだありません。サイトで新規会員登録を行ってください。
                            </td>
                          </tr>
                        ) : (
                          usersList.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-900/60 transition-colors">
                              <td className="p-3 sm:p-4 whitespace-nowrap">
                                <div className="flex items-center gap-2.5 sm:gap-3">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center font-black text-slate-950 text-xs sm:text-base shadow-md shrink-0">
                                    {u.username[0]?.toUpperCase() || "U"}
                                  </div>
                                  <span className="text-white font-black text-xs sm:text-base whitespace-nowrap">{u.username}</span>
                                </div>
                              </td>
                              <td className="p-3 sm:p-4 text-slate-200 font-bold text-xs sm:text-sm whitespace-nowrap">{u.email}</td>
                              <td className="p-3 sm:p-4 whitespace-nowrap">
                                {u.role === "admin" ? (
                                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-black inline-flex items-center gap-1.5 whitespace-nowrap">
                                    <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> 管理者 (Admin)
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold whitespace-nowrap">
                                    一般会員 (User)
                                  </span>
                                )}
                              </td>
                              <td className="p-3 sm:p-4 text-slate-400 text-xs sm:text-sm font-semibold whitespace-nowrap">{u.createdDate}</td>
                              <td className="p-3 sm:p-4 text-right whitespace-nowrap">
                                <div className="inline-flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      const newRole = u.role === "admin" ? "user" : "admin";
                                      setUsersList(prev => prev.map(usr => usr.id === u.id ? { ...usr, role: newRole } : usr));
                                      showToast(`ユーザー「${u.username}」の権限を${newRole.toUpperCase()}に更新しました`);
                                    }}
                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95"
                                  >
                                    権限変更
                                  </button>
                                  <button
                                    onClick={() => setDeleteTarget({ type: "user", id: u.id, title: u.email })}
                                    className="p-2 text-rose-400 hover:text-white hover:bg-rose-600/30 rounded-xl transition-all cursor-pointer active:scale-95"
                                    title="アカウント削除"
                                  >
                                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 6: MESSAGES */}
            {activeTab === "messages" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-slate-950/90 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800">
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2 sm:gap-2.5">
                      <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 shrink-0" />
                      お問い合わせメッセージ ({messagesList.length})
                    </h3>
                    <p className="text-xs sm:text-sm font-extrabold text-slate-400 mt-1">
                      Webサイトのお問い合わせフォームから送信されたメッセージ
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {messagesList.length === 0 ? (
                    <div className="p-8 sm:p-12 text-center bg-slate-950/90 rounded-2xl sm:rounded-3xl border border-slate-800 text-slate-400 font-bold text-sm sm:text-base">
                      メッセージはまだ届いていません。
                    </div>
                  ) : (
                    messagesList.map((m) => (
                      <div key={m.id} className="bg-slate-950/90 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 space-y-3 relative hover:border-indigo-500/40 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <span className="text-base sm:text-lg font-black text-white">{m.name}</span>
                            <span className="text-xs font-bold text-slate-400 break-all">({m.email})</span>
                          </div>
                          <span className="text-xs font-bold text-slate-500 shrink-0">{m.date}</span>
                        </div>

                        <p className="text-xs sm:text-sm font-bold text-slate-200 bg-slate-900/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800 leading-relaxed break-words">
                          {m.message}
                        </p>

                        <div className="flex items-center justify-between pt-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                            m.status === "unread" ? "bg-rose-500/20 text-rose-300 border-rose-500/30" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          }`}>
                            {m.status === "unread" ? "未読" : "確認済み"}
                          </span>

                          <button
                            onClick={() => setDeleteTarget({ type: "message", id: m.id, title: `${m.name}様のメッセージ` })}
                            className="p-2 text-rose-400 hover:text-white hover:bg-rose-600/30 rounded-xl transition-all cursor-pointer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 7: ADMIN PROFILE EDIT & MANAGEMENT */}
            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Admin Hero Cover & Avatar Summary Banner */}
                <div className="bg-slate-950 rounded-2xl sm:rounded-3xl border border-slate-800 overflow-hidden relative shadow-2xl">
                  {/* Background Himalayan Cover Image */}
                  <div className="h-32 sm:h-48 w-full relative overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200&auto=format&fit=crop" 
                      alt="Himalaya Cover" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                  </div>

                  {/* Profile Summary Overlay */}
                  <div className="px-4 sm:px-8 pb-6 pt-0 relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-16">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end text-center sm:text-left gap-3 sm:gap-5 w-full sm:w-auto">
                      {/* Avatar Circle with Upload Trigger */}
                      <div className="relative group shrink-0">
                        <div className="w-22 h-22 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-slate-900 border-3 sm:border-4 border-amber-400 p-1 shadow-2xl overflow-hidden flex items-center justify-center relative">
                          {adminProfile.avatarUrl ? (
                            <img 
                              src={adminProfile.avatarUrl} 
                              alt={adminProfile.username} 
                              className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-900 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-2xl text-amber-400">
                              {adminProfile.username[0]?.toUpperCase() || "A"}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => adminAvatarFileRef.current?.click()}
                          className="absolute -bottom-1 -right-1 bg-amber-500 hover:bg-amber-400 text-slate-950 p-2 rounded-xl border-2 border-slate-950 shadow-xl cursor-pointer transition-all active:scale-95"
                          title="アバター写真をアップロード"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                        <input 
                          type="file" 
                          ref={adminAvatarFileRef} 
                          accept="image/*" 
                          onChange={handleAdminAvatarUpload} 
                          className="hidden" 
                        />
                      </div>

                      <div className="space-y-1.5 pb-1 flex-1 min-w-0 w-full sm:w-auto">
                        <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                          <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs tracking-wider uppercase inline-flex items-center gap-1 shadow-xs max-w-full">
                            <Shield className="w-3.5 h-3.5 shrink-0" /> {adminProfile.roleTitle}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black shrink-0">
                            ● オンライン (全権限)
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                          <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                            {adminProfile.username}
                          </h3>
                          <span className="text-xs sm:text-sm font-bold text-slate-400 bg-slate-900/80 px-2.5 py-0.5 rounded-md border border-slate-800">
                            管理者ID: #ADM-001
                          </span>
                        </div>

                        <div className="text-slate-300 text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-3 pt-0.5">
                          <div className="flex items-center gap-1.5 max-w-full">
                            <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                            <span className="break-all">{adminProfile.email}</span>
                          </div>
                          <span className="hidden sm:inline text-slate-600">•</span>
                          <div className="flex items-center gap-1.5 max-w-full">
                            <Globe className="w-4 h-4 text-sky-400 shrink-0" />
                            <span className="break-words">{adminProfile.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => setActiveTab("overview")}
                        className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold rounded-xl text-xs transition-all cursor-pointer shadow-md"
                      >
                        ダッシュボードへ戻る
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Admin Profile Form */}
                <form onSubmit={handleSaveAdminProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column (2 Cols wide on desktop): Basic Info & Avatar Selection & Bio */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Basic Info Section */}
                    <div className="bg-slate-950 p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-800 space-y-5 shadow-lg">
                      <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                        <UserCheck className="w-5 h-5 text-amber-400 shrink-0" />
                        <h4 className="text-base sm:text-lg font-black text-white">管理者基本情報の編集</h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-black text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <UserCheck className="w-4 h-4 text-amber-400" />
                            <span>管理者名 (表示名) *</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={adminProfile.username}
                            onChange={(e) => setAdminProfile({ ...adminProfile, username: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-amber-400 transition-colors"
                            placeholder="例: dipsan (管理者)"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-black text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-blue-400" />
                            <span>管理者メールアドレス *</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={adminProfile.email}
                            onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-amber-400 transition-colors"
                            placeholder="admin@nepatravel.com"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-black text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <Phone className="w-4 h-4 text-emerald-400" />
                            <span>緊急連絡先 電話番号</span>
                          </label>
                          <input
                            type="text"
                            value={adminProfile.phone}
                            onChange={(e) => setAdminProfile({ ...adminProfile, phone: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-amber-400 transition-colors"
                            placeholder="+81 90-1234-5678"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-black text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-purple-400" />
                            <span>役職・肩書き</span>
                          </label>
                          <select
                            value={adminProfile.roleTitle}
                            onChange={(e) => setAdminProfile({ ...adminProfile, roleTitle: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
                          >
                            <option value="最高管理者 (Chief Executive Admin)">最高管理者 (Chief Executive Admin)</option>
                            <option value="ツアー統括マネージャー (Tour Operations Manager)">ツアー統括マネージャー (Tour Operations Manager)</option>
                            <option value="予約・決済管理責任者 (Head of Booking & Payments)">予約・決済管理責任者 (Head of Booking & Payments)</option>
                            <option value="カトマンズ本部マネージャー (Kathmandu HQ Manager)">カトマンズ本部マネージャー (Kathmandu HQ Manager)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-black text-slate-300 mb-1.5 flex items-center gap-1.5">
                          <Globe className="w-4 h-4 text-sky-400" />
                          <span>拠点・担当オフィス</span>
                        </label>
                        <input
                          type="text"
                          value={adminProfile.location}
                          onChange={(e) => setAdminProfile({ ...adminProfile, location: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-amber-400 transition-colors"
                          placeholder="カトマンズ本社 & 日本連絡所"
                        />
                      </div>
                    </div>

                    {/* Preset Avatars & Custom Photo Selector */}
                    <div className="bg-slate-950 p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-800 space-y-4 shadow-lg">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2.5">
                          <Smile className="w-5 h-5 text-amber-400 shrink-0" />
                          <h4 className="text-base sm:text-lg font-black text-white">アバターアイコンプリセット</h4>
                        </div>
                        <span className="text-xs font-bold text-slate-400">ワンクリック選択</span>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {ADMIN_AVATAR_PRESETS.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => setAdminProfile({ ...adminProfile, avatarUrl: preset.url })}
                            className={`group relative rounded-2xl p-1 border-2 transition-all cursor-pointer overflow-hidden flex flex-col items-center ${
                              adminProfile.avatarUrl === preset.url
                                ? "border-amber-400 bg-amber-500/20 scale-105 shadow-lg"
                                : "border-slate-800 bg-slate-900 hover:border-slate-600"
                            }`}
                          >
                            <div className="w-12 h-12 rounded-xl overflow-hidden mb-1">
                              <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-300 truncate max-w-full px-1">
                              {preset.name}
                            </span>
                            {adminProfile.avatarUrl === preset.url && (
                              <div className="absolute top-1 right-1 bg-amber-400 text-slate-950 rounded-full p-0.5 shadow-sm">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Custom Direct Image URL Option */}
                      <div className="pt-2">
                        <label className="block text-xs font-black text-slate-400 mb-1">
                          または直接画像URLを指定:
                        </label>
                        <input
                          type="text"
                          value={adminProfile.avatarUrl}
                          onChange={(e) => setAdminProfile({ ...adminProfile, avatarUrl: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-400"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                    </div>

                    {/* Admin Bio / Notes Section */}
                    <div className="bg-slate-950 p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-800 space-y-4 shadow-lg">
                      <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                        <FileText className="w-5 h-5 text-amber-400 shrink-0" />
                        <h4 className="text-base sm:text-lg font-black text-white">管理者自己紹介・担当業務メモ</h4>
                      </div>

                      <textarea
                        rows={3}
                        value={adminProfile.bio}
                        onChange={(e) => setAdminProfile({ ...adminProfile, bio: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold text-slate-200 focus:outline-none focus:border-amber-400 transition-colors leading-relaxed"
                        placeholder="管理者メモを記述してください..."
                      />
                    </div>

                  </div>

                  {/* Right Column (1 Col wide on desktop): Password Change & System Options & Save Button */}
                  <div className="space-y-6">
                    
                    {/* Security & Password Card */}
                    <div className="bg-slate-950 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 space-y-4 shadow-lg">
                      <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                        <Key className="w-5 h-5 text-rose-400 shrink-0" />
                        <h4 className="text-base font-black text-white">パスワードの変更</h4>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-black text-slate-300 mb-1">現在のパスワード</label>
                          <input
                            type="password"
                            value={adminProfile.currentPassword}
                            onChange={(e) => setAdminProfile({ ...adminProfile, currentPassword: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                            placeholder="••••••••"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-300 mb-1">新しいパスワード</label>
                          <input
                            type="password"
                            value={adminProfile.newPassword}
                            onChange={(e) => setAdminProfile({ ...adminProfile, newPassword: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                            placeholder="新パスワード"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-slate-300 mb-1">新しいパスワード (確認)</label>
                          <input
                            type="password"
                            value={adminProfile.confirmPassword}
                            onChange={(e) => setAdminProfile({ ...adminProfile, confirmPassword: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                            placeholder="再入力"
                          />
                        </div>
                      </div>
                    </div>

                    {/* System Notifications & Settings */}
                    <div className="bg-slate-950 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 space-y-4 shadow-lg">
                      <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                        <h4 className="text-base font-black text-white">管理通知・環境設定</h4>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700">
                          <span className="text-xs font-bold text-slate-200">新規予約のリアルタイム通知</span>
                          <input 
                            type="checkbox" 
                            checked={adminProfile.notificationsEnabled} 
                            onChange={(e) => setAdminProfile({ ...adminProfile, notificationsEnabled: e.target.checked })}
                            className="w-4 h-4 text-amber-500 rounded focus:ring-0 cursor-pointer"
                          />
                        </label>

                        <label className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700">
                          <span className="text-xs font-bold text-slate-200">予約データの自動同期保存</span>
                          <input 
                            type="checkbox" 
                            checked={adminProfile.autoConfirmBookings} 
                            onChange={(e) => setAdminProfile({ ...adminProfile, autoConfirmBookings: e.target.checked })}
                            className="w-4 h-4 text-amber-500 rounded focus:ring-0 cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Big Action Save Button */}
                    <div className="space-y-3 pt-2">
                      <button
                        type="submit"
                        className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl text-base transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Save className="w-5 h-5" />
                        <span>管理者プロフィールを保存</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const saved = localStorage.getItem("nepa_admin_profile");
                          if (saved) {
                            setAdminProfile(JSON.parse(saved));
                            showToast("変更を取り消しました");
                          }
                        }}
                        className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer text-center"
                      >
                        変更をキャンセル
                      </button>
                    </div>

                  </div>

                </form>

              </motion.div>
            )}

            {/* TAB 8: TEAM & STAFF DESCRIPTION EDITING */}
            {activeTab === "team" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Header Banner */}
                <div className="bg-slate-950 p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 font-black text-[11px] sm:text-xs uppercase tracking-wider">
                        チーム・スタッフ説明文の編集
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] sm:text-xs font-bold">
                        登録数: {teamList.length}名
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                      <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 shrink-0" />
                      <span>現地専任ガイド・スタッフの説明文管理</span>
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-slate-400 leading-relaxed">
                      Ganga Shrestha や Dipsan Limbu などの詳細説明文（日本語・英語）、役職、経験年数、主要領域、顔写真を自由に編集・保存できます。
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleOpenTeamModal()}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Plus className="w-4 h-4 shrink-0" />
                      <span>新規スタッフを追加</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleResetTeamMembers}
                      className="flex-1 sm:flex-none px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      title="初期状態にリセット"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>初期データ復元</span>
                    </button>
                  </div>
                </div>

                {/* Staff Cards List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {teamList.map((member) => (
                    <div
                      key={member.id}
                      className="bg-slate-950 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 hover:border-slate-700 transition-all shadow-xl space-y-4 relative flex flex-col justify-between"
                    >
                      {/* Top Row: Photo, Name, Badge, Experience */}
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-400 shrink-0 shadow-md relative">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[9px] font-black text-amber-300 text-center py-0.5 truncate px-1">
                            {member.badge}
                          </span>
                        </div>

                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-lg sm:text-xl font-black text-white truncate">
                              {member.name}
                            </h4>
                            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black shrink-0">
                              {member.experienceYears}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-md bg-rose-950/80 text-rose-300 border border-rose-800 text-xs font-black">
                              {member.roleJa}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400 truncate">
                              {member.role}
                            </span>
                          </div>

                          <div className="text-xs text-emerald-400 font-bold flex items-center gap-1 pt-1">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">領域: {member.specialty}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bio Japanese Description Section */}
                      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 relative">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                            <Quote className="w-3.5 h-3.5" /> 日本語 説明文（Bio）
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {member.bioJa.length}文字
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed line-clamp-4">
                          {member.bioJa}
                        </p>
                      </div>

                      {/* Bio English Quote Section */}
                      {member.bioEn && (
                        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                          <span className="text-[11px] font-bold text-slate-400 block mb-1">英語メッセージ:</span>
                          <p className="text-xs text-slate-300 italic line-clamp-2">
                            "{member.bioEn}"
                          </p>
                        </div>
                      )}

                      {/* Actions Footer */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleOpenTeamModal(member)}
                          className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>説明文・プロフィールを編集</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteTeamMember(member.id, member.name)}
                          className="p-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/50 rounded-xl text-xs transition-all cursor-pointer"
                          title="削除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

              </motion.div>
            )}

          </div>
            </>
          )}
        </motion.div>

        {/* CREATE / EDIT TOUR MODAL WITH PROMINENT PHOTO UPLOADER */}
        {isTourModalOpen && (
          <div className="fixed inset-0 z-70 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border-2 border-slate-700 text-white rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-3.5 sm:py-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
                <h3 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 shrink-0" />
                  <span>{editingTour ? "ツアー情報を編集" : "新しいツアーを作成"}</span>
                </h3>
                <button
                  onClick={() => setIsTourModalOpen(false)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTour} className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
                
                {/* PROMINENT VISIBLE PHOTO UPLOAD ZONE */}
                <div className="space-y-3 bg-slate-950/80 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-dashed border-amber-500/50">
                  <label className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span>ツアー写真のアップロード *</span>
                  </label>

                  {/* Photo Preview Banner */}
                  <div className="relative h-36 sm:h-48 w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center group">
                    {tourForm.customImageUrl ? (
                      <img 
                        src={tourForm.customImageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src={PRESET_TOUR_IMAGES.find(p => p.id === tourForm.image)?.url || PRESET_TOUR_IMAGES[0].url} 
                        alt="Preset Preview" 
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="text-xs font-black text-white bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700">
                        写真変更
                      </span>
                    </div>
                  </div>

                  {/* Upload Controls */}
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 pt-1">
                    <label className="w-full sm:flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl sm:rounded-2xl text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg active:scale-95">
                      <Upload className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                      <span>PCから写真をアップロード</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleTourFileUpload} 
                        className="hidden" 
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setTourForm(prev => ({ ...prev, customImageUrl: "" }))}
                      className="w-full sm:w-auto py-2.5 sm:py-3 px-3.5 sm:px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold rounded-xl sm:rounded-2xl text-xs transition-all cursor-pointer"
                    >
                      プリセット選択に戻す
                    </button>
                  </div>

                  {/* Preset Quick Chooser */}
                  <div className="pt-1">
                    <span className="text-[11px] sm:text-xs font-bold text-slate-400 block mb-1.5">サンプル写真から選択:</span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {PRESET_TOUR_IMAGES.map((img) => (
                        <button
                          type="button"
                          key={img.id}
                          onClick={() => setTourForm(prev => ({ ...prev, image: img.id, customImageUrl: "" }))}
                          className={`h-12 sm:h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer relative ${
                            tourForm.image === img.id && !tourForm.customImageUrl ? "border-amber-400 ring-2 ring-amber-400/50" : "border-slate-800 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-black text-slate-200">ツアー名 (日本語) *</label>
                  <input
                    type="text"
                    required
                    value={tourForm.name}
                    onChange={(e) => setTourForm({ ...tourForm, name: e.target.value })}
                    placeholder="例: ポカラ プレミアムツアー"
                    className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-950 border border-slate-700 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Price & Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-black text-slate-200">価格 (JPY) *</label>
                    <input
                      type="text"
                      required
                      value={tourForm.price}
                      onChange={(e) => setTourForm({ ...tourForm, price: e.target.value })}
                      placeholder="125,000円"
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-950 border border-slate-700 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-black text-slate-200">旅行期間 *</label>
                    <input
                      type="text"
                      required
                      value={tourForm.duration}
                      onChange={(e) => setTourForm({ ...tourForm, duration: e.target.value })}
                      placeholder="4泊5日"
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-950 border border-slate-700 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-black text-slate-200">詳細説明文 *</label>
                  <textarea
                    rows={3}
                    required
                    value={tourForm.description}
                    onChange={(e) => setTourForm({ ...tourForm, description: e.target.value })}
                    placeholder="ツアーの見どころやハイライトを入力してください..."
                    className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-950 border border-slate-700 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed"
                  />
                </div>

                {/* Footer buttons */}
                <div className="flex items-center justify-end gap-2.5 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsTourModalOpen(false)}
                    className="flex-1 sm:flex-initial justify-center px-4 py-2.5 sm:px-5 sm:py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold rounded-xl sm:rounded-2xl text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial justify-center px-4 py-2.5 sm:px-6 sm:py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl sm:rounded-2xl text-xs sm:text-sm transition-all cursor-pointer shadow-lg active:scale-95 flex items-center gap-1.5 sm:gap-2"
                  >
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span>ツアーを保存</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD GALLERY ITEM MODAL */}
        {isGalleryModalOpen && (
          <div className="fixed inset-0 z-70 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border-2 border-slate-700 text-white rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-400" />
                  フォトギャラリーに写真を追加
                </h3>
                <button
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveGalleryItem} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-200">写真タイトル *</label>
                  <input
                    type="text"
                    required
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                    placeholder="例: ポカラの湖畔"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-sm font-bold text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-200">カテゴリー</label>
                  <select
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-sm font-bold text-white"
                  >
                    <option value="ポカラ">ポカラ</option>
                    <option value="カトマンズ">カトマンズ</option>
                    <option value="ヒマラヤ">ヒマラヤ</option>
                    <option value="ドルパタン">ドルパタン</option>
                    <option value="景観・自然">景観・自然</option>
                  </select>
                </div>

                {/* Upload Image for Gallery */}
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-200">写真ファイル *</label>
                  <label className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5" />
                    <span>写真をアップロード</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleGalleryFileUpload} 
                      className="hidden" 
                    />
                  </label>
                  {galleryForm.url && (
                    <div className="h-32 rounded-2xl overflow-hidden border border-slate-800 mt-2">
                      <img src={galleryForm.url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsGalleryModalOpen(false)}
                    className="flex-1 sm:flex-initial justify-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs sm:text-sm"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 shadow-lg active:scale-95"
                  >
                    <Check className="w-4 h-4 shrink-0" />
                    <span>ギャラリーに保存</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* CREATE / EDIT TEAM MEMBER MODAL */}
        {isTeamModalOpen && (
          <div className="fixed inset-0 z-70 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border-2 border-slate-700 text-white rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-3.5 sm:py-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
                <h3 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 shrink-0" />
                  <span>{editingMember ? `「${editingMember.name}」の説明文・プロフィール編集` : "新規スタッフ追加"}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTeamMember} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
                
                {/* Photo & Upload Section */}
                <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <label className="block text-xs sm:text-sm font-black text-amber-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><ImageIcon className="w-4 h-4" /> スタッフ顔写真</span>
                    <span className="text-[10px] text-slate-400 font-normal">自動圧縮して安全保存</span>
                  </label>

                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900 border-2 border-amber-400 overflow-hidden shrink-0 shadow-lg relative">
                      <img src={teamForm.image} alt="Preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] font-bold text-amber-300 text-center py-0.5">プレビュー</span>
                    </div>

                    <div className="space-y-2 flex-1">
                      <button
                        type="button"
                        onClick={() => teamMemberPhotoRef.current?.click()}
                        className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-95"
                      >
                        <Upload className="w-4 h-4" />
                        <span>デバイスから新しい写真をアップロード 📸</span>
                      </button>
                      <input 
                        type="file" 
                        ref={teamMemberPhotoRef} 
                        accept="image/*" 
                        onChange={handleTeamPhotoUpload} 
                        className="hidden" 
                      />

                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={teamForm.image}
                          onChange={(e) => setTeamForm({ ...teamForm, image: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-400"
                          placeholder="または画像URLを直接入力 https://..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Preset Choice Buttons */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                      おすすめプリセット顔写真 (ワンクリック適用):
                    </span>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { label: "Dipsan", url: IMAGES.dipsanLimbu },
                        { label: "Pujan", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600" },
                        { label: "Naresh", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600" },
                        { label: "Roshan", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600" },
                        { label: "Ganga", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600" }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setTeamForm({ ...teamForm, image: preset.url })}
                          className={`flex flex-col items-center gap-1 p-1 rounded-xl border transition-all cursor-pointer ${
                            teamForm.image === preset.url
                              ? "border-amber-400 bg-amber-500/20 scale-105"
                              : "border-slate-800 bg-slate-900 hover:border-slate-700"
                          }`}
                        >
                          <img src={preset.url} alt={preset.label} className="w-8 h-8 rounded-lg object-cover" />
                          <span className="text-[9px] font-bold text-slate-300">{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Basic Member Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-300 mb-1">スタッフ氏名 *</label>
                    <input
                      type="text"
                      required
                      value={teamForm.name}
                      onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-amber-400"
                      placeholder="例: Ganga Shrestha"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-300 mb-1">日本語役職名 *</label>
                    <input
                      type="text"
                      required
                      value={teamForm.roleJa}
                      onChange={(e) => setTeamForm({ ...teamForm, roleJa: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-amber-400"
                      placeholder="例: シニアシェルパ・高所安全スペシャリスト"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-300 mb-1">英語役職名</label>
                    <input
                      type="text"
                      value={teamForm.role}
                      onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-amber-400"
                      placeholder="例: Senior Sherpa & Mountain Safety Specialist"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-300 mb-1">業界経験年数</label>
                    <input
                      type="text"
                      value={teamForm.experienceYears}
                      onChange={(e) => setTeamForm({ ...teamForm, experienceYears: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-amber-400"
                      placeholder="例: 22年"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-300 mb-1">バッジ表記 (英語)</label>
                    <input
                      type="text"
                      value={teamForm.badge}
                      onChange={(e) => setTeamForm({ ...teamForm, badge: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-amber-400"
                      placeholder="例: SENIOR SHERPA"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-300 mb-1">主要担当・専門領域</label>
                    <input
                      type="text"
                      value={teamForm.specialty}
                      onChange={(e) => setTeamForm({ ...teamForm, specialty: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-amber-400"
                      placeholder="例: シェルパ専門チーム統括・気象ルート判断"
                    />
                  </div>
                </div>

                {/* Description Textarea: Japanese (BioJa) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-amber-400 flex items-center justify-between">
                    <span>日本語 詳細説明文 (Description / Bio) *</span>
                    <span className="text-slate-400 font-normal">カード上に大きく表示されます</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={teamForm.bioJa}
                    onChange={(e) => setTeamForm({ ...teamForm, bioJa: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                    placeholder="20年以上にわたりヒマラヤ山脈の最前線で数多くの登山隊やトレッキングチームを率いてきた信頼のベテランシェルパです..."
                  />
                </div>

                {/* Description Textarea: English Quote (BioEn) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-sky-400 flex items-center justify-between">
                    <span>英語 メッセージ・引用文 (English Quote)</span>
                    <span className="text-slate-400 font-normal">説明文の下部にイタリック表示されます</span>
                  </label>
                  <textarea
                    rows={2}
                    value={teamForm.bioEn}
                    onChange={(e) => setTeamForm({ ...teamForm, bioEn: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-sky-400 leading-relaxed"
                    placeholder='A veteran Sherpa with over two decades of leading mountain expeditions...'
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsTeamModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer"
                  >
                    <Save className="w-4 h-4 shrink-0" />
                    <span>説明文・プロフィールを保存</span>
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}

      </div>
    </AnimatePresence>
  );
}
