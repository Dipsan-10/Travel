import nepalHero from "./assets/images/nepal_hero_1780290221499.png";
import pokharaTour from "./assets/images/pokhara_tour_1780290241219.png";
import kathmanduTour from "./assets/images/kathmandu_tour_1780290260185.png";
import lumbiniTour from "./assets/images/lumbini_tour_1780290283832.png";
import dhorpatanTour from "./assets/images/dhorpatan_tour_1780290300095.png";
import pathibharaDeviImg from "./assets/images/pathibhara_devi_1785295236993.jpg";
import timbungPokhariImg from "./assets/images/timbung_pokhari_lake_1785295386900.jpg";
import everestClimbImg from "./assets/images/everest_climb_ridge_1785295566715.jpg";
import upperMustangImg from "./assets/images/upper_mustang_village_1785295822147.jpg";
import muktinathTempleImg from "./assets/images/muktinath_temple_snow_1785296082881.jpg";
import manangMustangImg from "./assets/images/manang_mustang_stupa_1785296268132.jpg";
import chitwanNationalParkImg from "./assets/images/chitwan_national_park_1785296589204.jpg";
import badimalikaImg from "./assets/images/badimalika_meadows_1785302601226.jpg";
import ramaroshanLakesImg from "./assets/images/ramaroshan_lakes_1785302918348.jpg";
import balbhadraStatueImg from "./assets/images/balbhadra_kunwar_statue_1785303388414.jpg";
import pashupatinathImg from "./assets/images/pashupatinath_temple_1785388586102.jpg";
import dipsanLimbuImg from "./assets/images/dipsan_limbu_1785601700224.jpg";

export const IMAGES = {
  hero: nepalHero,
  pokhara: pokharaTour,
  kathmandu: kathmanduTour,
  lumbini: lumbiniTour,
  dhorpatan: dhorpatanTour,
  pathibhara: pathibharaDeviImg,
  timbungPokhari: timbungPokhariImg,
  everestClimb: everestClimbImg,
  upperMustang: upperMustangImg,
  muktinath: muktinathTempleImg,
  manangMustang: manangMustangImg,
  chitwan: chitwanNationalParkImg,
  badimalika: badimalikaImg,
  ramaroshan: ramaroshanLakesImg,
  balbhadra: balbhadraStatueImg,
  pashupatinath: pashupatinathImg,
  dipsanLimbu: dipsanLimbuImg,
};

export interface TourItem {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  image: string;
  rating: number;
  tags: string[];
}

export const TOURS: TourItem[] = [
  {
    id: "pokhara",
    name: "ポカラツアー",
    description: "きれいなフェワ湖とヒマラヤの山々に癒やされるネパールのリゾート。ボートに乗ったり、山を歩いたり、パラグライダー体験も楽しめる人気のツアーです。",
    price: "128,000円",
    duration: "4泊5日",
    image: pokharaTour,
    rating: 5.0,
    tags: ["きれいな湖", "ハイキング", "山の景色"],
  },
  {
    id: "kathmandu",
    name: "カトマンズツアー",
    description: "ネパールの首都カトマンズ。有名なお寺や世界遺産の王宮広場など、ネパールの歴史と文化をたっぷり楽しめる観光ツアーです。",
    price: "115,000円",
    duration: "3泊4日",
    image: kathmanduTour,
    rating: 4.8,
    tags: ["世界遺産", "お寺めぐり", "歴史と文化"],
  },
  {
    id: "lumbini",
    name: "ルンビニツアー",
    description: "お釈迦様（ブッダ）が生まれた聖地ルンビニ。マヤデビ寺院や世界各国の美しいお寺をめぐり、静かで落ち着いた時間を過ごせます。",
    price: "135,005円",
    duration: "4泊5日",
    image: lumbiniTour,
    rating: 4.9,
    tags: ["お釈迦様の生誕地", "世界遺産", "リラックス・瞑想"],
  },
  {
    id: "dhorpatan",
    name: "ドルパタンツアー",
    description: "ネパールで唯一の野生動物保護区。豊かな緑と草原、珍しい動物たちに出会える、自然がいっぱいの冒険トレッキングツアーです。",
    price: "165,000円",
    duration: "6泊7日",
    image: dhorpatanTour,
    rating: 4.7,
    tags: ["大自然トレッキング", "野生の動物", "冒険旅行"],
  },
  {
    id: "everest",
    name: "エベレスト・ベースキャンプ トレッキング",
    description: "世界で一番高い山「エベレスト」を近くで見られる大人気ツアー！標高5,364mのベースキャンプを目指し、雄大な山々と氷河の絶景を歩きます。",
    price: "285,000円",
    duration: "11泊12日",
    image: everestClimbImg,
    rating: 4.9,
    tags: ["エベレストトレッキング", "シェルパの文化", "大迫力の氷河"],
  },
  {
    id: "pathibhara",
    name: "パティバラ女神 聖地巡礼ツアー",
    description: "東ネパール・タプレジュンの標高3,794mに鎮座する神秘の願望成就寺院。カンチェンジュンガ峰（世界第3位8,586m）の圧巻の絶景とシャクナゲの森を満喫できます。",
    price: "148,000円",
    duration: "5泊6日",
    image: pathibharaDeviImg,
    rating: 4.9,
    tags: ["願望成就の聖地", "カンチェンジュンガの絶景", "シャクナゲの森"],
  },
  {
    id: "timbung_pokhari",
    name: "ティンブン・ポカリ 秘境神聖湖トレッキング",
    description: "パンチタルとタプレジュンの境、標高4,338mに潜む「銃声のような神秘音が響く神聖な湖」。満開の高山植物と透明度抜群の絶景湖を巡る最高峰の秘境旅。",
    price: "185,000円",
    duration: "7泊8日",
    image: timbungPokhariImg,
    rating: 4.8,
    tags: ["エメラルド色の神聖湖", "高山植物の天然庭園", "静寂のヒマラヤ秘境"],
  },
  {
    id: "everest_climb",
    name: "エベレスト登頂アタック（世界最高峰8,848m）",
    description: "地球の頂点・エベレスト（8,848.86m）へ挑む遠征ツアー。プロの国際Sherpaチームと経験豊富なガイド体制で、一生に一度の夢の山頂アタックを全力サポートします。",
    price: "4,850,000円",
    duration: "45日間",
    image: everestClimbImg,
    rating: 5.0,
    tags: ["世界最高峰8848m", "プロSherpaチーム", "夢の登頂遠征"],
  },
  {
    id: "upper_mustang",
    name: "アッパー・ムスタン 禁断の城塞都市ローマンタン",
    description: "チベットの伝統文化がそのまま残る「ラスト・シャングリラ」。風が削り出した赤い崖や古代の崖穴洞窟群、城壁に囲まれた禁断の王国ローマンタンを巡る神秘の旅。",
    price: "320,000円",
    duration: "10泊11日",
    image: upperMustangImg,
    rating: 4.9,
    tags: ["禁断の古都ローマンタン", "チベット密教文化", "赤い岩壁の壮大な峡谷"],
  },
  {
    id: "muktinath",
    name: "ムクティナート 救済の聖地＆ダウラギリ絶景",
    description: "標高3,710mにあるヒンドゥー教と仏教の聖地。108の聖なる水噴口と消えることのない天然の火が灯るお寺を訪問。ダウラギリやアンナプルナ連峰の絶景も一望できます。",
    price: "158,000円",
    duration: "5泊6日",
    image: muktinathTempleImg,
    rating: 4.8,
    tags: ["108の聖水噴口", "ダウラギリ絶景", "解脱と救済の聖地"],
  },
  {
    id: "manang_mustang",
    name: "マナン＆ムスタン トロンラ峠越え周遊トレック",
    description: "世界的人気を誇るヒマラヤ横断周遊コース！美しいガンガプルナ氷河湖のあるマナンから標高5,416mのトロン・ラ峠を越えて、神秘のムスタン聖地へと抜ける大感動作。",
    price: "245,000円",
    duration: "12泊13日",
    image: manangMustangImg,
    rating: 4.9,
    tags: ["標高5416mトロンラ峠", "ガンガプルナ氷河湖", "アンナプルナ周遊"],
  },
  {
    id: "chitwan",
    name: "チトワン国立公園 世界遺産ジャングルサファリ",
    description: "世界自然遺産のチトワン国立公園。ジープサファリで一角サイや野生動物を探し、木製カヌーで静かに川を下る大自然満喫ファミリーアドベンチャー。",
    price: "118,000円",
    duration: "3泊4日",
    image: chitwanNationalParkImg,
    rating: 4.7,
    tags: ["世界自然遺産", "一角サイと遭遇", "ジープ＆カヌー探検"],
  },
  {
    id: "badimalika",
    name: "バディマリカ 天空の聖地＆大草原（バジュラ）",
    description: "西ネパール・バジュラに広がる標高4,200mの「天空の天国」。どこまでも続く緑の広大な絨毯草原と、女神バディマリカが祀られる神秘の聖地峰を巡ります。",
    price: "210,000円",
    duration: "8泊9日",
    image: badimalikaImg,
    rating: 4.9,
    tags: ["地平線まで続く緑の草原", "天空の女神聖地", "究極の秘境アドベンチャー"],
  },
  {
    id: "ramaroshan",
    name: "ラマロシャン 12の神秘湖と18の大草原（アチャム）",
    description: "「12の神秘の湖と18の広大な草原」を抱くアチャムの隠れたパラダイス。水連咲く静寂の湖畔と緑豊かな放牧地、温かいローカル生活に出会うヒーリングツアー。",
    price: "195,000円",
    duration: "7泊8日",
    image: ramaroshanLakesImg,
    rating: 4.8,
    tags: ["12の神秘的な湖", "18の広大な草原", "心癒やされる至福のキャンプ"],
  },
  {
    id: "darchula",
    name: "ダルチュラ＆アピ・ナンパ 自然保護区ヒマラヤ冒険",
    description: "ネパール最西端の秘境ダルチュラ。標高7,132mの名峰アピ山とナンパ山を望むアピ・ナンパ自然保護区。手つかずの巨大氷河とバイアス文化が色濃く残る冒険コース。",
    price: "238,000円",
    duration: "9泊10日",
    image: balbhadraStatueImg,
    rating: 4.9,
    tags: ["名峰アピ山7132m", "最西端ダルチュラ", "秘境の巨大氷河と大自然"],
  },
];

export interface ReviewItem {
  id: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  tourName: string;
  location?: string;
  verified?: boolean;
  likes?: number;
  tags?: string[];
}

export const REVIEWS: ReviewItem[] = [
  {
    id: "rev1",
    author: "佐藤 健太 様",
    role: "ファミリー旅行 (4名)",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    text: "ポカラのハイキングとフェワ湖のボート遊びが最高でした！マチャプチャレの山頂が湖面に映る姿は息をのむ美しさでした。ネパトラベルのガイドさんは日本語がとても流暢で、子供たちのケアも手厚く安心して楽しめました。",
    date: "2026年5月",
    tourName: "ポカラツアー",
    location: "ポカラ / レイクサイド",
    verified: true,
    likes: 24,
    tags: ["日本語ガイド", "ファミリー安心", "絶景フォト"]
  },
  {
    id: "rev2",
    author: "高橋 美咲 様",
    role: "女性ソロパッカー",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    text: "カトマンズの古都寺院巡りに参加しました。歴史的な建造物や神話についてガイドさんが丁寧かつフレンドリーに日本語で解説してくれ感動！一人旅でしたが空港送迎からホテル手配まで完璧で心強かったです。",
    date: "2026年4月",
    tourName: "カトマンズツアー",
    location: "カトマンズ / ボダナート",
    verified: true,
    likes: 18,
    tags: ["女性一人旅", "世界遺産巡り", "空港送迎完備"]
  },
  {
    id: "rev3",
    author: "渡辺 裕二 様",
    role: "ご夫妻 (ご結婚記念旅行)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    text: "ルンビニは信じられないほど平和な場所でした。聖なるマヤデビ寺院と静かな庭園での瞑想は日常から解放される極上の時間でした。専属ドライバーの方の運転も大変安全で、5つ星ホテルアレンジも素晴らしかったです。",
    date: "2026年3月",
    tourName: "ルンビニツアー",
    location: "ルンビニ / 聖園",
    verified: true,
    likes: 31,
    tags: ["高級リゾート", "プライベート車", "心癒やされる旅"]
  },
  {
    id: "rev4",
    author: "小林 直美 様",
    role: "本格トレッキング愛好家",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    text: "ドルパタンの秘境ツアーに参加。手つかずの大自然と野生の青い羊（ナウール）を発見でき大興奮！専任シェルパさんの高地高山病ケアやロッジでの温かい料理のサポート体制がプロフェッショナルでした。",
    date: "2026年5月",
    tourName: "ドルパタンツアー",
    location: "バグルン / ドルパタン",
    verified: true,
    likes: 15,
    tags: ["本格トレッキング", "専任シェルパ", "大自然体験"]
  },
  {
    id: "rev5",
    author: "中村 慎一 様",
    role: "写真撮影ツアー参加",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    text: "朝焼けのヒマラヤ朝食付き絶景スポットへ案内してもらいました。光の差し込む角度まで計算された行程で、生涯最高の一枚が撮れました。ネパトラベルの日本語スタッフさんの心配りに感謝いたします。",
    date: "2026年2月",
    tourName: "ポカラツアー",
    location: "サランコット丘",
    verified: true,
    likes: 22,
    tags: ["朝焼けヒマラヤ", "写真家絶賛", "プライベート手配"]
  },
  {
    id: "rev6",
    author: "加藤 恵美 様",
    role: "シニアご夫婦",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    text: "60代夫婦での初ネパールでしたが、無理のないゆっくりとした旅程を組んでいただけました。高山病対策の酸素ボンベや専用車の乗り心地も良く、ポカラとカトマンズの両方を贅沢に堪能できました。",
    date: "2026年1月",
    tourName: "カトマンズツアー",
    location: "ナガルコット",
    verified: true,
    likes: 29,
    tags: ["シニア安心", "ゆったり旅程", "高山病ケア"]
  }
];

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: "自然" | "山" | "文化" | "歴史" | "秘境" | string;
  location?: string;
  description?: string;
}

export const GALLERY: GalleryItem[] = [
  { 
    id: "g1", 
    title: "フェワ湖の穏やかな朝", 
    image: pokharaTour, 
    category: "自然", 
    location: "ポカラ / フェワ湖", 
    description: "鏡のような湖面にマチャプチャレ（6,993m）が映り込む奇跡の朝景。" 
  },
  { 
    id: "g2", 
    title: "ボダナート大仏塔と祈りのタルチョ", 
    image: kathmanduTour, 
    category: "文化", 
    location: "カトマンズ / ボダナート", 
    description: "知恵の目が東西南北を見守る、世界最大級の仏塔と風になびく5色のタルチョ。" 
  },
  { 
    id: "g3", 
    title: "ブッダ生誕地マヤデビ寺院の聖園", 
    image: lumbiniTour, 
    category: "歴史", 
    location: "ルンビニ / 聖園", 
    description: "お釈迦様が生まれた平和の聖地。世界各国の巡礼者が集う静寂の菩提樹エリア。" 
  },
  { 
    id: "g4", 
    title: "ドルパタン大草原と野生動物保護区", 
    image: dhorpatanTour, 
    category: "自然", 
    location: "バグルン / ドルパタン", 
    description: "青い羊（ナウール）が住むネパール唯一の野生保護区。標高2,850mの自然の楽園。" 
  },
  { 
    id: "g5", 
    title: "エベレスト・ベースキャンプとクンブ大氷河", 
    image: everestClimbImg, 
    category: "山", 
    location: "ソルクンブ / EBC", 
    description: "標高5,364m。地球の頂点エベレストに挑む世界の登頂家が集う聖地。" 
  },
  { 
    id: "g6", 
    title: "パティバラ女神聖地＆カンチェンジュンガ絶景", 
    image: pathibharaDeviImg, 
    category: "歴史", 
    location: "タプレジュン / 標高3,794m", 
    description: "東ネパールの願望成就の聖地。世界第3位カンチェンジュンガ（8,586m）の大パノラマ。" 
  },
  { 
    id: "g7", 
    title: "ティンブン・ポカリ神聖エメラルド湖", 
    image: timbungPokhariImg, 
    category: "秘境", 
    location: "パンチタル / 標高4,338m", 
    description: "澄み切った高山湖と高山植物の天然庭園。銃声のような神秘音が響く極上の秘境。" 
  },
  { 
    id: "g8", 
    title: "アッパー・ムスタン禁断の城塞都市", 
    image: upperMustangImg, 
    category: "秘境", 
    location: "ムスタン / ローマンタン", 
    description: "風が削り出した赤い絶壁と古代の城壁に囲まれたチベット密教文化のラスト・シャングリラ。" 
  },
  { 
    id: "g9", 
    title: "ムクティナート聖水108の噴口とダウラギリ", 
    image: muktinathTempleImg, 
    category: "文化", 
    location: "ムスタン / 標高3,710m", 
    description: "ヒンドゥー教と仏教の聖地。108の聖水噴口と消えない天然の炎、名峰ダウラギリの躍動。" 
  },
  { 
    id: "g10", 
    title: "マナン＆トロンラ峠5,416m越え", 
    image: manangMustangImg, 
    category: "山", 
    location: "マナン / トロンラ峠", 
    description: "世界中のトレッカーを魅了するアンナプルナ周遊コースの最高到達点。" 
  },
  { 
    id: "g11", 
    title: "チトワン世界遺産ジャングルサファリ", 
    image: chitwanNationalParkImg, 
    category: "自然", 
    location: "チトワン国立公園", 
    description: "絶滅危惧種の一角サイや野生動物が生息する大自然ジャングル探検。" 
  },
  { 
    id: "g12", 
    title: "バディマリカ天空の絨毯草原", 
    image: badimalikaImg, 
    category: "秘境", 
    location: "バジュラ / 標高4,200m", 
    description: "どこまでも地平線まで続く緑の天国草原と女神バディマリカが宿る神秘の頂。" 
  },
  { 
    id: "g13", 
    title: "ラマロシャン12の湖と18の大草原", 
    image: ramaroshanLakesImg, 
    category: "自然", 
    location: "アチャム / ラマロシャン", 
    description: "スイレン咲く静寂の湖畔と豊かな放牧地。極上のヒーリング秘境スポット。" 
  },
  { 
    id: "g14", 
    title: "名峰アピ山7,132mとダルチュラ大自然", 
    image: balbhadraStatueImg, 
    category: "山", 
    location: "ダルチュラ / アピ・ナンパ", 
    description: "ネパール最西端の手つかずの氷河地帯と雄大な山塊。" 
  },
  { 
    id: "g15", 
    title: "アンナプルナ連峰の神々しい朝焼け", 
    image: nepalHero, 
    category: "山", 
    location: "アンナプルナ / ポカラ", 
    description: "朝日に染まるヒマラヤの巨峰群。生命のエネルギーが湧き上がる大絶景。" 
  },
  { 
    id: "g16", 
    title: "パシュパティナート寺院と聖なるバグマティ川", 
    image: pashupatinathImg, 
    category: "歴史", 
    location: "カトマンズ / パシュパティナート", 
    description: "ユネスコ世界文化遺産。ヒンドゥー教最高峰の聖域パシュパティナート寺院と聖なる川の景観。" 
  }
];
