import React, { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap
} from "@vis.gl/react-google-maps";
import {
  MapPin,
  Compass,
  Navigation,
  Mountain,
  Layers,
  Sparkles,
  Info,
  Calendar,
  ExternalLink,
  ChevronRight,
  Search,
  CheckCircle2,
  TreePine,
  Landmark,
  Eye
} from "lucide-react";
import { IMAGES } from "../data";

export type DestinationCategory = "all" | "resort" | "heritage" | "trekking" | "wildlife" | "secret";

export interface DestinationPoint {
  id: string;
  name: string;
  nameEn: string;
  category: "resort" | "heritage" | "trekking" | "wildlife" | "secret";
  lat: number;
  lng: number;
  altitude: string;
  description: string;
  highlights: string[];
  image: string;
  recommendedDays: string;
  tourId: string;
  priceEstimate: string;
  region: string;
}

export const NEPAL_DESTINATIONS: DestinationPoint[] = [
  {
    id: "pokhara",
    name: "ポカラ & フェワ湖",
    nameEn: "Pokhara & Phewa Lake (Gandaki)",
    category: "resort",
    lat: 28.2096,
    lng: 83.9856,
    altitude: "822m",
    description: "ヒマラヤの雄大なパノラマと静寂なフェワ湖が広がるネパール随一のリゾート。鏡のような湖面に映るマチャプチャレ（魚の尾）の雪山と鮮やかなボートが旅人を癒やします。",
    highlights: ["フェワ湖ボート遊び", "マチャプチャレ絶景", "サランコット朝日", "パラグライダー体験"],
    image: IMAGES.pokhara,
    recommendedDays: "4泊5日",
    tourId: "pokhara",
    priceEstimate: "128,000円〜",
    region: "ガンダキ州・ポカラ"
  },
  {
    id: "kathmandu",
    name: "カトマンズ盆地 世界遺産群",
    nameEn: "Kathmandu Valley UNESCO Heritage",
    category: "heritage",
    lat: 27.7172,
    lng: 85.3240,
    altitude: "1,400m",
    description: "古代寺院と中世の王宮文化が息づく首都。知恵の目が見守る世界最大級の仏塔ボダナートや、スワヤンブナート、旧王宮ダルバール広場など見どころが凝縮。",
    highlights: ["ボダナート大仏塔", "スワヤンブナート寺院", "ダルバール旧王宮広場", "タメル街ショッピング"],
    image: IMAGES.kathmandu,
    recommendedDays: "3泊4日",
    tourId: "kathmandu",
    priceEstimate: "115,000円〜",
    region: "バグマティ州・カトマンズ"
  },
  {
    id: "pashupatinath",
    name: "パシュパティナート寺院",
    nameEn: "Pashupatinath Sacred Temple",
    category: "heritage",
    lat: 27.7104,
    lng: 85.3487,
    altitude: "1,400m",
    description: "ユネスコ世界文化遺産。ヒンドゥー教最高峰の聖域であり、三大神シヴァを祀る金色のパゴダ。聖なるバグマティ川のほとりに立ち、祈りの鐘と夕刻のアールティ儀礼が響きます。",
    highlights: ["ユネスコ世界遺産", "ヒンドゥー最高峰の聖域", "聖なるバグマティ川", "黄金のパゴダ建築"],
    image: IMAGES.pashupatinath || IMAGES.kathmandu,
    recommendedDays: "日帰り / 半日",
    tourId: "kathmandu",
    priceEstimate: "カトマンズツアー内包",
    region: "カトマンズ盆地東部"
  },
  {
    id: "lumbini",
    name: "ルンビニ 釈迦生誕聖地",
    nameEn: "Lumbini Sacred Garden (Buddha Birthplace)",
    category: "heritage",
    lat: 27.4839,
    lng: 83.2759,
    altitude: "150m",
    description: "紀元前623年、仏教の開祖シッダールタ（ブッダ）が誕生したユネスコ世界文化遺産。聖なるマヤデビ寺院やアショカ王石柱、各国の美しい寺院群が並ぶ国際平和聖地。",
    highlights: ["お釈迦様生誕の地", "マヤデビ寺院", "アショカ王石柱", "世界各国の平和仏教寺院"],
    image: IMAGES.lumbini,
    recommendedDays: "4泊5日",
    tourId: "lumbini",
    priceEstimate: "135,005円〜",
    region: "ルンビニ州・タライ平原"
  },
  {
    id: "dhorpatan",
    name: "ドルパタン野生動物保護区",
    nameEn: "Dhorpatan Hunting & Wildlife Reserve",
    category: "wildlife",
    lat: 28.5300,
    lng: 83.0500,
    altitude: "2,850m〜5,500m",
    description: "ネパールで唯一の野生狩猟保護区。豊かな緑と高山草原、珍しい野生の青い羊（ナウル）に出会える、大自然と静寂に包まれた秘境トレッキングルート。",
    highlights: ["青い羊ナウル生息地", "ネパール唯一の野生保護区", "標高2850mの大草原", "伝統チベット集落"],
    image: IMAGES.dhorpatan,
    recommendedDays: "6泊7日",
    tourId: "dhorpatan",
    priceEstimate: "165,000円〜",
    region: "ダウラギリ山麓・バグルン"
  },
  {
    id: "everest_ebc",
    name: "エベレスト・ベースキャンプ (EBC)",
    nameEn: "Everest Base Camp & Kala Patthar",
    category: "trekking",
    lat: 27.9881,
    lng: 86.9250,
    altitude: "5,364m (カラパタール 5,545m)",
    description: "世界最高峰エベレスト（8,848m）を間近に仰ぐ憧れのトレッキングコース。クンブ大氷河、シェルパ族の首都ナムチェバザール、タンボチェ僧院を巡る冒険。",
    highlights: ["標高5364mのEBC到達", "カラパタール展望台", "クンブ大氷河", "シェルパ族文化体験"],
    image: IMAGES.everestClimb,
    recommendedDays: "11泊12日",
    tourId: "everest",
    priceEstimate: "285,000円〜",
    region: "ソルクンブ・クンブ地方"
  },
  {
    id: "everest_climb",
    name: "エベレスト世界最高峰登頂 (8,848m)",
    nameEn: "Mt. Everest Expedition Summit 8,848.86m",
    category: "trekking",
    lat: 27.9881,
    lng: 86.9250,
    altitude: "8,848.86m (地球頂点)",
    description: "地球の頂点・エベレスト（8,848.86m）へ挑む遠征ツアー。プロの国際Sherpaチームと万全のロジスティクス体制で一生に一度の夢の山頂アタックをサポート。",
    highlights: ["地球最高峰8848m登頂", "専属国際Sherpaチーム", "ヒラリーステップ突破", "究極の山岳遠征"],
    image: IMAGES.everestClimb,
    recommendedDays: "45日間",
    tourId: "everest_climb",
    priceEstimate: "4,850,000円〜",
    region: "クンブ・ヒマラヤ主稜線"
  },
  {
    id: "pathibhara",
    name: "パティバラ女神 聖地巡礼",
    nameEn: "Pathibhara Devi Sacred Shrine (Taplejung)",
    category: "heritage",
    lat: 27.4267,
    lng: 87.7667,
    altitude: "3,794m",
    description: "東ネパール・タプレジュンの標高3,794mに鎮座する願望成就の神秘寺院。世界第3位カンチェンジュンガ峰（8,586m）の大パノラマとシャクナゲの原生林が広がります。",
    highlights: ["願望成就の最高聖地", "カンチェンジュンガ8586m望む", "シャクナゲの原生林", "東ネパール巡礼街道"],
    image: IMAGES.pathibhara,
    recommendedDays: "5泊6日",
    tourId: "pathibhara",
    priceEstimate: "148,000円〜",
    region: "東ネパール・タプレジュン"
  },
  {
    id: "timbung_pokhari",
    name: "ティンブン・ポカリ 秘境神聖湖",
    nameEn: "Timbung Pokhari Sacred Lake (4,338m)",
    category: "secret",
    lat: 27.5600,
    lng: 87.9700,
    altitude: "4,338m",
    description: "パンチタルとタプレジュンの境、標高4,338mに潜む神聖なエメラルド湖。湖面から銃声のような神秘音が響くと言われ、高山植物が咲き誇る手つかずの秘境です。",
    highlights: ["エメラルド色の神聖湖", "高山植物の天然庭園", "銃声のような神秘の反響音", "静寂のヒマラヤ秘境"],
    image: IMAGES.timbungPokhari,
    recommendedDays: "7泊8日",
    tourId: "timbung_pokhari",
    priceEstimate: "185,000円〜",
    region: "パンチタル / タプレジュン境"
  },
  {
    id: "upper_mustang",
    name: "アッパー・ムスタン 禁断の古都ローマンタン",
    nameEn: "Upper Mustang & Kingdom of Lo Manthang",
    category: "secret",
    lat: 29.1825,
    lng: 83.9575,
    altitude: "3,840m",
    description: "チベットの伝統文化がそのまま残る「ラスト・シャングリラ」。風が削り出した赤い崖や古代の崖穴洞窟群、城壁に囲まれた禁断の王国ローマンタンを巡る神秘の旅。",
    highlights: ["禁断の古都ローマンタン", "チベット密教文化の宝庫", "赤い絶壁と古代洞窟群", "ラスト・シャングリラ"],
    image: IMAGES.upperMustang,
    recommendedDays: "10泊11日",
    tourId: "upper_mustang",
    priceEstimate: "320,000円〜",
    region: "ムスタン県・北部高地"
  },
  {
    id: "muktinath",
    name: "ムクティナート 救済の聖地＆ダウラギリ",
    nameEn: "Muktinath Sacred Temple (3,710m)",
    category: "heritage",
    lat: 28.8167,
    lng: 83.8667,
    altitude: "3,710m",
    description: "標高3,710mにあるヒンドゥー教と仏教の共同聖地。108の聖なる水噴口と消えることのない天然ガスによる火が灯り、ダウラギリやアンナプルナ連峰の絶景が一望できます。",
    highlights: ["108の聖水噴口", "消えない天然の炎", "ダウラギリ名峰絶景", "解脱と救済の聖地"],
    image: IMAGES.muktinath,
    recommendedDays: "5泊6日",
    tourId: "muktinath",
    priceEstimate: "158,000円〜",
    region: "ムスタン・ジョムソン近郊"
  },
  {
    id: "manang_mustang",
    name: "マナン＆トロンラ峠5,416m越え",
    nameEn: "Manang & Thorong La Pass (5,416m)",
    category: "trekking",
    lat: 28.6667,
    lng: 84.0167,
    altitude: "3,519m〜5,416m",
    description: "世界的人気を誇るアンナプルナ周遊ルート！美しいガンガプルナ氷河湖のあるマナンから標高5,416mのトロン・ラ峠を越えて、神秘のムスタンへと抜ける大感動トレック。",
    highlights: ["標高5416mトロンラ峠越え", "ガンガプルナ氷河湖", "アンナプルナ周遊ルート", "マナン古式集落"],
    image: IMAGES.manangMustang,
    recommendedDays: "12泊13日",
    tourId: "manang_mustang",
    priceEstimate: "245,000円〜",
    region: "マナン県・アンナプルナ北部"
  },
  {
    id: "annapurna_abc",
    name: "アンナプルナ・サンクチュアリ (ABC)",
    nameEn: "Annapurna Base Camp Sanctuary (4,130m)",
    category: "trekking",
    lat: 28.5309,
    lng: 83.8780,
    altitude: "4,130m",
    description: "360度を囲む巨大なヒマラヤ氷壁の懐へ。シャクナゲの森、段々畑、ウエーブ状の山脈を越えて聖地アンナプルナ・サンクチュアリへ登るネパール屈指の人気コース。",
    highlights: ["360度白銀の氷壁大絶景", "マチャプチャレ近接", "プルヒル展望台の朝焼け", "ジヌダンダ天然温泉"],
    image: IMAGES.hero,
    recommendedDays: "8泊9日",
    tourId: "pokhara",
    priceEstimate: "185,000円〜",
    region: "アンナプルナ山群・カスキ"
  },
  {
    id: "chitwan",
    name: "チトワン国立公園 ジャングルサファリ",
    nameEn: "Chitwan National Park Safari (UNESCO)",
    category: "wildlife",
    lat: 27.5291,
    lng: 84.3542,
    altitude: "150m",
    description: "ユネスコ世界自然遺産のチトワン国立公園。希少な一角インドサイやベンガルトラ、ワニが生息。ジープサファリや木製カヌーで静かに川を下る大自然探検ツアー。",
    highlights: ["ユネスコ世界自然遺産", "一角インドサイと遭遇", "ジープサファリ探検", "ラプティ川木製カヌー"],
    image: IMAGES.chitwan,
    recommendedDays: "3泊4日",
    tourId: "chitwan",
    priceEstimate: "118,000円〜",
    region: "チトワン県・ソウラハ"
  },
  {
    id: "badimalika",
    name: "バディマリカ 天空の聖地＆大草原",
    nameEn: "Badimalika Alpine Meadows (Bajura 4,200m)",
    category: "secret",
    lat: 29.7083,
    lng: 81.4167,
    altitude: "4,200m",
    description: "西ネパール・バジュラに広がる標高4,200mの「天空の天国」。どこまでも地平線まで続く緑の広大な絨毯草原と、女神バディマリカが祀られる神秘の聖地峰を巡ります。",
    highlights: ["地平線まで続く緑の草原", "天空の女神聖地峰", "究極の手つかず秘境", "西ネパール大パノラマ"],
    image: IMAGES.badimalika,
    recommendedDays: "8泊9日",
    tourId: "badimalika",
    priceEstimate: "210,000円〜",
    region: "スドゥパシュチム州・バジュラ"
  },
  {
    id: "ramaroshan",
    name: "ラマロシャン 12の神秘湖と18の大草原",
    nameEn: "Ramaroshan 12 Lakes & 18 Meadows (Achham)",
    category: "secret",
    lat: 29.2167,
    lng: 81.4667,
    altitude: "2,500m",
    description: "「12の神秘の湖と18の広大な草原」を抱くアチャムの隠れたパラダイス。水連咲く静寂の湖畔と緑豊かな放牧地、温かいローカル生活に出会う至高のヒーリングツアー。",
    highlights: ["12の神秘的な湖沼群", "18の広大な牧草地", "スイレン咲く静寂の湖畔", "至福の高地キャンプ"],
    image: IMAGES.ramaroshan,
    recommendedDays: "7泊8日",
    tourId: "ramaroshan",
    priceEstimate: "195,000円〜",
    region: "スドゥパシュチム州・アチャム"
  },
  {
    id: "darchula",
    name: "ダルチュラ＆アピ・ナンパ 自然保護区",
    nameEn: "Darchula & Api Nampa Wilderness (7,132m)",
    category: "trekking",
    lat: 29.8500,
    lng: 80.5333,
    altitude: "2,500m〜7,132m (名峰アピ山)",
    description: "ネパール最西端の秘境ダルチュラ。標高7,132mの名峰アピ山とナンパ山を望むアピ・ナンパ自然保護区。手つかずの巨大氷河とバイアス文化が色濃く残る冒険コース。",
    highlights: ["名峰アピ山7132m", "ネパール最西端ダルチュラ", "手つかずの巨大氷河", "バイアス古式文化"],
    image: IMAGES.balbhadra,
    recommendedDays: "9泊10日",
    tourId: "darchula",
    priceEstimate: "238,000円〜",
    region: "最西端・ダルチュラ県"
  }
];

// Inner map camera controller
function MapCameraHandler({ selectedDest }: { selectedDest: DestinationPoint | null }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !selectedDest) return;
    map.panTo({ lat: selectedDest.lat, lng: selectedDest.lng });
    map.setZoom(selectedDest.category === "secret" || selectedDest.category === "trekking" ? 10 : 9);
  }, [map, selectedDest]);

  return null;
}

interface NepalMapExplorerProps {
  onOpenBookingModal: (tourId?: string) => void;
}

export const NepalMapExplorer: React.FC<NepalMapExplorerProps> = ({
  onOpenBookingModal
}) => {
  const [apiKey, setApiKey] = useState<string>(
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  );
  const [activeCategory, setActiveCategory] = useState<DestinationCategory>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDest, setSelectedDest] = useState<DestinationPoint | null>(
    NEPAL_DESTINATIONS[0]
  );
  const [mapType, setMapType] = useState<"terrain" | "satellite" | "roadmap">("terrain");

  // Fetch API key from backend if not provided in client env
  useEffect(() => {
    if (!apiKey) {
      fetch("/api/config/maps")
        .then((res) => res.json())
        .then((data) => {
          if (data.apiKey) {
            setApiKey(data.apiKey);
          }
        })
        .catch(() => {});
    }
  }, [apiKey]);

  const filteredDestinations = NEPAL_DESTINATIONS.filter((d) => {
    const matchesCategory = activeCategory === "all" || d.category === activeCategory;
    if (!matchesCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.nameEn.toLowerCase().includes(q) ||
      d.region.toLowerCase().includes(q) ||
      d.highlights.some(h => h.toLowerCase().includes(q))
    );
  });

  const getPinColor = (category: string, isSelected: boolean) => {
    if (isSelected) return "#DC2626"; // Vibrant Red for active selection
    switch (category) {
      case "resort": return "#059669"; // Emerald
      case "heritage": return "#D97706"; // Amber Gold
      case "trekking": return "#2563EB"; // Royal Blue
      case "wildlife": return "#16A34A"; // Forest Green
      case "secret": return "#9333EA"; // Purple Mystical
      default: return "#475569";
    }
  };

  return (
    <section id="map" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm font-black mb-3">
            <Compass className="w-4 h-4" />
            <span>Google Maps Platform 連動・全ツアー聖地ガイド</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            ネパール全観光地 & 聖地探索 <span className="text-amber-400">公式MAP</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            ポカラの湖畔、カトマンズやルンビニの世界遺産から、エベレストEBC・ムスタン・バディマリカ等の秘境まで。
            ネパトラベルの公式ツアースポット全17箇所を、実寸の緯度経度・標高・ギャラリー写真で探索できます。
          </p>
        </div>

        {/* Category Filter Chips & Search Bar */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "all", label: `🗺️ 全観光地 (${NEPAL_DESTINATIONS.length})` },
              { id: "resort", label: "🏝️ リゾート・湖 (ポカラ)" },
              { id: "heritage", label: "🏛️ 世界文化遺産 & 聖地" },
              { id: "trekking", label: "🏔️ トレッキング & 名峰" },
              { id: "wildlife", label: "🦏 自然・野生保護区" },
              { id: "secret", label: "🌿 天空の秘境・高山湖" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as DestinationCategory)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick search input */}
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="観光地名・地域名・キーワードで検索..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        {/* Main Map & Detail Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Destination Quick Selector Sidebar (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-2.5 max-h-[640px] overflow-y-auto pr-1.5 custom-scrollbar">
            {filteredDestinations.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm bg-slate-800/40 rounded-2xl border border-slate-800">
                該当する観光地が見つかりませんでした。
              </div>
            ) : (
              filteredDestinations.map((dest) => {
                const isSelected = selectedDest?.id === dest.id;
                return (
                  <div
                    key={dest.id}
                    onClick={() => setSelectedDest(dest)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? "bg-gradient-to-r from-red-950/80 via-slate-800 to-slate-800 border-red-500 shadow-lg scale-[1.01]"
                        : "bg-slate-800/80 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800"
                    }`}
                  >
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-md border border-white/10"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[11px] font-black text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                          標高 {dest.altitude.split(" ")[0]}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 font-bold">
                          {dest.recommendedDays}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white truncate">
                        {dest.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {dest.region}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? "text-amber-400 translate-x-1" : "text-slate-500"}`} />
                  </div>
                );
              })
            )}
          </div>

          {/* Interactive Google Map Canvas (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-800/90 rounded-3xl p-3 sm:p-4 border border-slate-700 flex flex-col shadow-2xl relative">
            
            {/* Map Top Quick Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-700/80 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  マップ表示切替:
                </span>
                <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-700">
                  <button
                    onClick={() => setMapType("terrain")}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      mapType === "terrain" ? "bg-red-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    地形 (Terrain)
                  </button>
                  <button
                    onClick={() => setMapType("satellite")}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      mapType === "satellite" ? "bg-red-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    衛星写真 (Satellite)
                  </button>
                  <button
                    onClick={() => setMapType("roadmap")}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      mapType === "roadmap" ? "bg-red-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    道路地図 (Roadmap)
                  </button>
                </div>
              </div>

              {selectedDest && (
                <div className="text-xs text-slate-300 flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span className="font-mono text-amber-300 font-bold">
                    {selectedDest.lat.toFixed(4)}, {selectedDest.lng.toFixed(4)}
                  </span>
                </div>
              )}
            </div>

            {/* Google Map Box */}
            <div className="w-full h-[450px] sm:h-[500px] rounded-2xl overflow-hidden relative shadow-inner bg-slate-950">
              <APIProvider apiKey={apiKey} libraries={["places", "marker"]}>
                <Map
                  id="nepal-tourism-map"
                  mapId="DEMO_MAP_ID"
                  defaultCenter={{ lat: 28.3949, lng: 84.1240 }}
                  defaultZoom={7}
                  mapTypeId={mapType}
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  fullscreenControl={true}
                  zoomControl={true}
                  streetViewControl={false}
                  className="w-full h-full"
                  internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
                >
                  <MapCameraHandler selectedDest={selectedDest} />

                  {/* Render Advanced Markers for destinations */}
                  {filteredDestinations.map((dest) => {
                    const isSelected = selectedDest?.id === dest.id;
                    const pinBg = getPinColor(dest.category, isSelected);
                    return (
                      <AdvancedMarker
                        key={dest.id}
                        position={{ lat: dest.lat, lng: dest.lng }}
                        onClick={() => setSelectedDest(dest)}
                        title={dest.name}
                      >
                        <Pin
                          background={pinBg}
                          borderColor="#FFFFFF"
                          glyphColor="#FFFFFF"
                          scale={isSelected ? 1.3 : 0.95}
                        />
                      </AdvancedMarker>
                    );
                  })}

                  {/* InfoWindow for active selection */}
                  {selectedDest && (
                    <InfoWindow
                      position={{ lat: selectedDest.lat, lng: selectedDest.lng }}
                      onCloseClick={() => setSelectedDest(null)}
                      headerContent={
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <Mountain className="w-4 h-4 text-red-600 shrink-0" />
                          <span className="truncate">{selectedDest.name}</span>
                        </div>
                      }
                    >
                      <div className="max-w-[260px] sm:max-w-xs text-slate-800 p-1 space-y-2">
                        <img
                          src={selectedDest.image}
                          alt={selectedDest.name}
                          className="w-full h-28 object-cover rounded-lg shadow-sm"
                        />
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                          <span className="text-red-600 font-black">標高: {selectedDest.altitude}</span>
                          <span className="text-slate-500">{selectedDest.recommendedDays}</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {selectedDest.description}
                        </p>
                        
                        <div className="pt-2 border-t border-slate-200">
                          <button
                            onClick={() => onOpenBookingModal(selectedDest.tourId || selectedDest.id)}
                            className="w-full py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-black shadow-sm transition-all cursor-pointer text-center"
                          >
                            このツアーを予約・照会
                          </button>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </APIProvider>
            </div>

            {/* Selected Destination Feature Banner Below Map */}
            {selectedDest && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-black text-white">{selectedDest.name}</span>
                    <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                      標高 {selectedDest.altitude}
                    </span>
                    <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">
                      目安 {selectedDest.priceEstimate}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {selectedDest.highlights.map((h, i) => (
                      <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => onOpenBookingModal(selectedDest.tourId || selectedDest.id)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>このツアーを予約する</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
