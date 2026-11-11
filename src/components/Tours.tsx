import { useState, useEffect } from "react";
import { 
  X, 
  Check, 
  Compass, 
  AlertTriangle,
  BedDouble,
  Calendar,
  Layers,
  Award,
  ArrowRight,
  Clock
} from "lucide-react";
import { TOURS, TourItem } from "../data";
import { motion, AnimatePresence } from "motion/react";

const SharpStar = ({ className = "w-4 h-4 fill-amber-300 text-amber-300" }: { className?: string; key?: string | number }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <polygon points="50,2 60.78,35.17 95.65,35.17 67.44,55.67 78.21,88.83 50,68.33 21.79,88.83 32.56,55.67 4.35,35.17 39.22,35.17" />
  </svg>
);

interface ToursProps {
  onBookTour: (tourName: string) => void;
  isLoggedIn?: boolean;
}

interface ItineraryDay {
  day: string;
  title: string;
  desc: string;
}

interface TourDetail {
  altitude: string;
  difficulty: string;
  season: string;
  accom: string;
  included: string[];
  unincluded: string[];
  notes: string;
  itinerary: ItineraryDay[];
}

const TOUR_DETAILS_MAP: Record<string, TourDetail> = {
  pokhara: {
    altitude: "822m ~ 1,592m",
    difficulty: "★★☆☆☆ (初心者むけハイキング)",
    season: "春 (3〜5月) / 秋 (10〜11月)",
    accom: "フェワ湖のちかくのきれいなホテル",
    included: [
      "カトマンズ〜ポカラの往復ひこうきチケット",
      "きれいなリゾートホテル4泊 (あさご飯つき)",
      "日本語ガイドがずっと一緒にお世話します",
      "エアコンつきの専用車（移動用）",
      "フェワ湖のボート乗りもの代"
    ],
    unincluded: [
      "個人のお買い物やおみやげ代",
      "自由行動のときのお昼・晩ご飯代",
      "ガイドやドライバーへのチップ（気持ちでOK）",
      "海外旅行保険"
    ],
    notes: "なだらかで歩きやすい道が多いツアーです。歩きやすいスニーカーと、帽子やサングラスをお持ちください。",
    itinerary: [
      { day: "1日目", title: "ひこうきでポカラへ & 湖のまわりをお散歩", desc: "カトマンズから飛行機でポカラへ移動します。到着後、専用車で湖の近くのホテルへ。夕方はボートに乗って静かで美しい夕暮れをたのしみます。" },
      { day: "2日目", title: "きれいな朝日鑑賞 & ポカラのまち観光", desc: "朝早くサランコットの丘へ行き、山から登るきれいな朝日を見ます。昼間はお滝や洞窟、山岳博物館を車でめぐります。" },
      { day: "3日目", title: "日本山妙法寺（平和パゴダ）ハイキング", desc: "ボートで湖を渡り、お寺へむかって楽しくハイキング（約1.5時間）。上からの景色は絶景です！午後はホテルでゆっくり休みます。" },
      { day: "4日目", title: "一日じゆう行動（買い物やカフェの時間をたのしむ）", desc: "好きなことをして過ごす一日。パラグライダー体験やカフェでのお休み、お買い物などが楽しめます。ガイドがお手伝いします。" },
      { day: "5日目", title: "ひこうきでカトマンズへもどります", desc: "午前中はおみやげを選びます。午後、飛行機でカトマンズへ戻り、ツアー終了です。" }
    ]
  },
  kathmandu: {
    altitude: "1,400m",
    difficulty: "★☆☆☆☆ (まち歩き・お寺観光)",
    season: "一年中いつでもOK (秋〜春が特におすすめ)",
    accom: "カトマンズのきれいな5つ星ホテル",
    included: [
      "最高級ホテル宿泊 3泊 (あさご飯つき)",
      "有名なお寺や世界遺産のチケット代ぜんぶ",
      "日本語ガイドがずっと一緒にお世話します",
      "エアコンつきの専用車（移動用）",
      "ネパールの伝統ダンスを見ながらの歓迎晩ご飯"
    ],
    unincluded: [
      "日本〜ネパールの往復ひこうき代",
      "個人のお買い物やおみやげ代",
      "お寺などでの個人のお金（お布施など）"
    ],
    notes: "古い石畳の道や階段を歩きます。歩きやすくて履き慣れた運動靴（スニーカー）でお越しください。",
    itinerary: [
      { day: "1日目", title: "カトマンズ到着 & ネパール料理で歓迎会", desc: "空港でお迎え後、ホテルへ案内します。夜はネパールの伝統音楽やダンスを見ながら美味しいネパール料理を食べます。" },
      { day: "2日目", title: "世界遺産の有名なお寺めぐり", desc: "日本語ガイドと一緒に、サルがたくさんいるスワヤンブナート寺院、大きなボダナート仏塔、パシュパティナート寺院をめぐります。" },
      { day: "3日目", title: "芸術の街パタン & 王宮広場をお散歩", desc: "美しい木彫りで有名な古都パタンへ。古い王宮の広場やお寺を歩いて、ネパールの伝統工芸をたのしみます。お買い物タイムもあります。" },
      { day: "4日目", title: "ホテルで朝ご飯 & 空港へ送迎", desc: "ホテルでゆっくり朝ご飯を食べます。帰りの飛行機の時間にあわせて空港までお送りします。" }
    ]
  },
  lumbini: {
    altitude: "150m",
    difficulty: "★☆☆☆☆ (お寺めぐり・リラックス)",
    season: "秋 (10〜11月) / 春 (2〜4月) が特におすすめ",
    accom: "ルンビニの静かで落ち着いたホテル",
    included: [
      "カトマンズ〜バイラワの往復ひこうきチケット",
      "静かで安心できるホテル 4泊",
      "日本語が上手な仏教・歴史ガイド同行",
      "現地での移動車 & 電動リキシャ（三輪車）体験",
      "マヤデビ寺院やお寺の入場チケット代"
    ],
    unincluded: [
      "ご飯のときのジュースやお酒などの飲み物代",
      "個人のお買い物代",
      "海外旅行保険"
    ],
    notes: "日差しが強い場所が多いので、帽子や日傘、お水を用意しておくと快適です。",
    itinerary: [
      { day: "1日目", title: "ひこうきでルンビニ近くの空港へ移動", desc: "飛行機でバイラワ空港へ（約40分）。車でブッダが生まれた場所・ルンビニへ移動し、静かなホテルにチェックインします。" },
      { day: "2日目", title: "ブッダ生誕の地・マヤデビ寺院を訪問", desc: "ブッダが生まれたマヤデビ寺院へ。聖なる池やアショカ王の石柱を見学します。午後は静かな場所で心を落ち着かせる時間を過ごします。" },
      { day: "3日目", title: "世界各国が建てた美しいお寺めぐり", desc: "電動リキシャ（三輪車）や自転車に乗って、日本・タイ・中国・ドイツなど世界各国が作ったきれいなお寺をめぐります。" },
      { day: "4日目", title: "菩提樹の木かげでゆっくり瞑想・リラックス", desc: "一日、大きな木の木かげで深呼吸しながら心をいやします。旅のつかれをさっぱりリフレッシュできる時間です。" },
      { day: "5日目", title: "ひこうきでカトマンズへもどります", desc: "朝の気持ちいい空気の中でお散歩。飛行機でカトマンズへ戻り、ツアー終了となります。" }
    ]
  },
  dhorpatan: {
    altitude: "2,850m ~ 3,210m",
    difficulty: "★★★☆☆ (大自然ハイキング・冒険)",
    season: "秋 (10〜11月) / 春 (3〜5月)",
    accom: "大自然の中のテントと山小屋",
    included: [
      "かっこいい4WDジープ車（カトマンズ往復貸切）",
      "料理スタッフがつくる全食事（朝・昼・晩）",
      "経験豊富な日本語ガイド＆荷物運びスタッフ同行",
      "野生動物保護区に入るための許可証手続き"
    ],
    unincluded: [
      "個人の登山靴や防寒具などの道具",
      "ガイドやスタッフへのチップ（気持ちでOK）",
      "ジュースやお酒などの飲み物代"
    ],
    notes: "標高3,000mほどの高い場所へ行きます。夜は寒くなりますので、暖かい服をしっかりご準備ください。",
    itinerary: [
      { day: "1日目", title: "専用ジープに乗ってネパールの田舎へ出発", desc: "ジープに乗ってカトマンズを出発。美しい川や田んぼの風景を眺めながら、素朴な村へドライブ（約7時間）。" },
      { day: "2日目", title: "ドルパタンに到着 & キャンプの準備", desc: "山道を登り、標高2,850mの広大なドルパタンへ。スタッフと一緒に楽しいテントキャンプをセットします。" },
      { day: "3日目", title: "珍しい動物を探すジャングルハイキング", desc: "緑豊かな森や草原を歩きます。ブルーシープ（山羊のなかま）や珍しい鳥たちを探しながら探検します。" },
      { day: "4日目", title: "草原を歩いて地元の村の人々と交流", desc: "広くて美しい草原を歩き、昔ながらの暮らしを守る村を訪問。あたたかい人々との出会いをたのしみます。" },
      { day: "5日目", title: "山小屋で手作りバーベキュー & 星空鑑賞", desc: "トレッキングを終え、温かい山小屋へ。おいしいお肉や野菜のBBQを食べながら、夜は満天の星空をながめます。" },
      { day: "6日目", title: "ジープに乗ってカトマンズへむかって下山", desc: "お世話になったスタッフとお別れし、車で下山します。途中の街で美味しいローカルご飯を食べます。" },
      { day: "7日目", title: "カトマンズのホテルに帰着・ゆっくりお休み", desc: "午後にカトマンズへ到着。あたたかいお風呂に入って長旅の疲れをいやし、解散します。" }
    ]
  },
  everest: {
    altitude: "2,840m ~ 5,545m",
    difficulty: "★★★★★ (本格的な高い山の歩き)",
    season: "秋 (10〜11月) / 春 (3〜5月)",
    accom: "山の中の暖かくてきれいな山小屋",
    included: [
      "カトマンズ〜ルクラの往復ひこうきチケット",
      "経験豊富な日本語登山ガイド＆荷物を運ぶポーター同行",
      "Wi-Fiやお湯シャワーがある山小屋10泊",
      "国立公園に入るための許可証手続き",
      "カトマンズへ戻ったあとのリフレッシュマッサージ"
    ],
    unincluded: [
      "山小屋でのスマホ充電やお湯代などの個人費用",
      "ヘリコプター保険（高山用旅行保険）"
    ],
    notes: "標高5,000mを超える高地へ行きます。あせらずゆっくり自分のペースで歩くのが大切です。",
    itinerary: [
      { day: "1-2日目", title: "ルクラへ飛んでトレッキングスタート", desc: "小さな飛行機でルクラ空港へ。そこから歩き始め、2日目はシェルパの有名な街ナムチェバザール（3,440m）を目指します。" },
      { day: "3日目", title: "ナムチェでからだを慣らす日（エベレストが見えるホテルへ）", desc: "高地にからだを慣らすためナムチェに宿泊。少し歩いて「エベレストビューホテル」で美味しいコーヒーを飲みながら山をながめます。" },
      { day: "4-6日目", title: "美しいお寺を通って標高を上げていきます", desc: "テンボチェ寺院を通り、森をぬけてさらに高い場所へ。迫力のあるヒマラヤの山々が目の前に迫ってきます。" },
      { day: "7-8日目", title: "ついに夢のエベレスト・ベースキャンプ（EBC）へ！", desc: "標高5,364mのエベレスト・ベースキャンプに到着！目の前にある大きな氷河に感動。一生の記念になる最高の思い出になります。" },
      { day: "9-10日目", title: "景色をたのしみながらナムチェ・ルクラへ下山", desc: "高い場所からゆっくり下ります。美味しいご飯を食べながら、仲間と旅の思い出を語り合います。" },
      { day: "11-12日目", title: "ひこうきでカトマンズへ & おつかれさま会", desc: "朝の飛行機でカトマンズへ。マッサージでお疲れのからだをいやし、美味しいごちそうを食べて旅を締めくくります。" }
    ]
  },
  chitwan: {
    altitude: "150m",
    difficulty: "★☆☆☆☆ (ジャングル探検・動物観察)",
    season: "10月〜5月 (あたたかくて過ごしやすい時期)",
    accom: "ジャングルの中のすてきなリゾートホテル",
    included: [
      "エアコンつきの専用車（カトマンズ往復）",
      "すてきなジャングルロッジ3泊（朝・昼・晩のご飯つき）",
      "ジープサファリ・カヌー乗船・国立公園入場チケット代",
      "動物や植物に詳しい日本語ガイド同行"
    ],
    unincluded: [
      "大きなカメラの持ち込み料金（一部）",
      "お食事のときのお酒や特別な飲み物"
    ],
    notes: "ジャングルに行くため、緑色や茶色の動きやすい服装でお越しください。（派手な赤い服は避けましょう）",
    itinerary: [
      { day: "1日目", title: "カトマンズから専用車でチトワンへ移動", desc: "快適な車でチトワンへむかいます。到着後、ジャングルロッジで冷たいウェルカムドリンクでお出迎え。" },
      { day: "2日目", title: "ジープに乗ってジャングルで探検＆サイ探し", desc: "ジープに乗ってジャングルの奥へ！1本角のサイや珍しい鳥、野生のゾウを探しに行きます。" },
      { day: "3日目", title: "カヌーで川下り & 地元の伝統ダンス鑑賞", desc: "静かなカヌーに乗って川を下り、水辺のワニや鳥を観察します。夜はタルー族の楽しいスティックダンスを見ます。" },
      { day: "4日目", title: "朝のご飯を食べてカトマンズへもどります", desc: "鳥の声を聴きながら美味しい朝ご飯を食べます。チェックアウト後、車でカトマンズへ戻ります。" }
    ]
  },
  bhaktapur: {
    altitude: "1,400m ~ 2,195m",
    difficulty: "★☆☆☆☆ (古い街歩き & 朝日の景色)",
    season: "10月〜5月 (空が澄んでいる時期)",
    accom: "山が見える展望ホテル",
    included: [
      "ナガルコットの山が見えるホテル2泊",
      "日本語ガイドがずっと案内します",
      "バクタプル・お寺の入場チケット代",
      "昔ながらの粘土の焼き物（陶芸）体験代",
      "カトマンズからの往復エアコン専用車"
    ],
    unincluded: [
      "特別なお酒や飲み物代",
      "自分のお土産代や陶芸品の送料"
    ],
    notes: "ナガルコットの朝は少し冷え込みます。薄手のジャケットや上着を1枚持っていくと安心です。",
    itinerary: [
      { day: "1日目", title: "レンガ造りの古都バクタプル & 陶芸体験", desc: "カトマンズからバクタプルへ。古い王宮広場を見学後、粘土で器をつくる陶芸体験をします。夕方、山が見えるナガルコットへ移動します。" },
      { day: "2日目", title: "ヒマラヤの美しい朝日を見る & リラックス", desc: "朝早く、ホテルのテラスから登る美しい朝日を鑑賞します。朝ご飯のあとはホテルでゆっくりお休みしたり、近くをお散歩します。" },
      { day: "3日目", title: "歴史あるチャングナラヤン寺院を訪問", desc: "ネパールでとても古いチャングナラヤン寺院を見学。きれいな木彫りを見たあと、車でカトマンズへ戻ります。" }
    ]
  },
  annapurna: {
    altitude: "900m ~ 3,800m",
    difficulty: "★★★☆☆ (きれいな山を歩くトレッキング)",
    season: "春 (3〜4月) / 秋 (10〜11月)",
    accom: "あたたかい暖炉のある山小屋",
    included: [
      "山に入るための許可証手続き",
      "ポカラ〜カトマンズなどのひこうきチケット",
      "日本語トレッキングガイド＆荷物を運ぶスタッフ同行",
      "山の中の天然温泉に入るチケット代",
      "山小屋8泊 (毎日のあさご飯・晩ご飯つき)"
    ],
    unincluded: [
      "山小屋でのスマホ充電やお湯シャワーなどの個人費用",
      "途中でお腹がすいたときのお菓子やジュース代"
    ],
    notes: "山歩きをたのしむ人気のコースです。歩きやすい靴とあたたかい服、温泉用の水着をお持ちください。",
    itinerary: [
      { day: "1-2日目", title: "きれいな森を歩いてゴレパニへむかいます", desc: "ポカラから車で出発し、山道を歩きはじめます。2日目はきれいなシャクナゲの森をぬけて標高2,860mのゴレパニ村へ。" },
      { day: "3-4日目", title: "プーンヒルの朝日 & 天然の露天温泉", desc: "朝早くプーンヒル（3,210m）へ行き、オレンジ色にかがやく朝日を見ます！下山したあとは温かい川沿いの天然温泉に入ります。" },
      { day: "5-7日目", title: "ジョムソムの風光明媚な谷をめぐる", desc: "飛行機でジョムソムへ飛び、白いお寺や伝統的な山村をめぐります。雄大な山の風景に包まれる感動的な場所です。" },
      { day: "8-9日目", title: "ひこうきでポカラ経由カトマンズへもどります", desc: "ジョムソムからポカラへ飛びます。ポカラの湖で夜ご飯を食べたあと、翌日カトマンズへ戻り解散します。" }
    ]
  },
  patan: {
    altitude: "1,400m",
    difficulty: "★☆☆☆☆ (芸術の街おさんぽ)",
    season: "一年中いつでもOK",
    accom: "パタンの古い街並みにあるかわいいホテル",
    included: [
      "パタンのお寺や美術館のチケット代ぜんぶ",
      "伝統的な建物をリノベーションしたホテル2泊",
      "日本語ガイドが歴史や街を案内します",
      "お庭のカフェでの紅茶＆ケーキセット",
      "カトマンズからのエアコン専用車"
    ],
    unincluded: [
      "個人のお買い物代",
      "自由行動のときのご飯代"
    ],
    notes: "パタンは美しい木彫りや金属細工で有名な街です。お寺をお参りするときは時計回りに歩くのがネパールのマナーです。",
    itinerary: [
      { day: "1日目", title: "パタンの綺麗なホテルチェックイン & ライトアップ散策", desc: "専用車で世界遺産のパタンへ。古いネパール邸宅を改装したすてきなホテルに宿泊。夜はライトアップされた幻想的な広場をお散歩します。" },
      { day: "2日目", title: "美しい王宮広場とお寺の見学 & 伝統の工房見学", desc: "王宮広場や黄金寺院をガイドとゆっくり見学します。午後は金属や木を削る職人さんの工房を訪れて、ネパールの伝統工芸にふれます。" },
      { day: "3日目", title: "お買い物 & カトマンズの空港・ホテルへ送迎", desc: "午前中はおしゃれなお店でお買い物。観光が終わったあと、空港またはホテルまでお送りします。" }
    ]
  },
  manaslu: {
    altitude: "1,350m ~ 5,106m",
    difficulty: "★★★★★ (本格的なロングトレッキング)",
    season: "秋 (10月〜11月) / 春 (4月〜5月)",
    accom: "あたたかい山小屋（ティーハウス）",
    included: [
      "マナスル保護区に入るための許可証手続き代ぜんぶ",
      "経験豊富な日本語登山ガイド＆頼れる荷物持ちスタッフ同行",
      "カトマンズからの移動用4WDジープ専用車",
      "山小屋での宿泊10泊（温かい美味しいご飯つき）"
    ],
    unincluded: [
      "レスキュー対応の海外山岳旅行保険（必須）",
      "山小屋でのスマホ充電やお湯シャワー代"
    ],
    notes: "標高5,106mのラルキャ峠を越える本格派ツアーです。事前に体調を整えてご参加ください。",
    itinerary: [
      { day: "1-2日目", title: "ジープで山奥へむかい、トレッキングスタート", desc: "ジープ車でカトマンズを出発し、山の奥深くソティコラへ。翌日から渓谷の川沿いを歩き始めます。" },
      { day: "3-5日目", title: "チベット文化が残る美しい山村へ", desc: "標高3,000mを越えていきます。山村の風景やお寺をながめながら、あせらず体を高地に慣らしていきます。" },
      { day: "6-7日目", title: "マナスルが見えるサマ・ガオン村へ", desc: "世界第8位の高い山マナスル（8,163m）が見えるサマ・ガオン村（3,530m）に滞在。ハイキングをしてからだを慣らします。" },
      { day: "8-9日目", title: "最高地点ラルキャ峠（5,106m）越えに挑戦！", desc: "一番のハイライト、ラルキャ峠（5,106m）に挑戦！峠からは一面に広がる大氷河と山々のパノラマ絶景が広がります。" },
      { day: "10-11日目", title: "車のある場所へ下山 & ジープでカトマンズへ", desc: "森を抜けジープのある場所へ下山。ジープでカトマンズへ戻り、ガイドから達成認定証をもらって感動のゴールです。" }
    ]
  },
  pathibhara: {
    altitude: "1,200m ~ 3,794m",
    difficulty: "★★★☆☆ (石段と尾根の参拝トレック)",
    season: "3〜5月（シャクナゲ満開） / 9〜11月（秋の絶景）",
    accom: "タプレジュンの伝統的な巡礼ロッジ",
    included: [
      "カトマンズ〜バドラプル往復フライト",
      "全行程専用4WDジープ（移動用）",
      "日本語ガイドが全行程お世話します",
      "ホテル＆巡礼ロッジ5泊（全食事つき）",
      "寺院お参り＆巡礼手続き代"
    ],
    unincluded: [
      "寺院でのお布施やお供え物代",
      "個人の防寒着やおみやげ代",
      "ガイド・ドライバーへのチップ"
    ],
    notes: "標高3,700m超まで登ります。防寒ジャケットと履き慣れたスニーカーをご準備ください。",
    itinerary: [
      { day: "1日目", title: "飛行機でバドラプルへ & 4WDでタプレジュンへドライブ", desc: "飛行機で東ネパールへ。到着後、専用4WDジープで茶畑の美しいイラムを経由してタプレジュンへ向かいます。" },
      { day: "2日目", title: "登山口スークタル・フェディへ移動 & チェックイン", desc: "車でスークタル（登山口）へ移動。美しい尾根道の風景を楽しみながら、山腹のフェディに到着・滞在します。" },
      { day: "3日目", title: "早朝参拝！パティバラ女神寺院（3,794m）へ到達", desc: "早朝から石段を登り、標高3,794mのパティバラ女神寺院へ。世界第3位カンチェンジュンガ峰の絶景大パノラマに感動！" },
      { day: "4日目", title: "感謝のお祈りとともに下山 & ローカル村巡り", desc: "朝日に照らされる山々を眺めてから下山。フンリン村のローカル市場を散策し、温かい伝統料理を楽しみます。" },
      { day: "5日目", title: "車で紅茶の名産地イラムへ移動・本場の紅茶体験", desc: "緑豊かなイラムのお茶畑に寄り道。新鮮な極上イラムティーを試飲し、おみやげに買い物をします。" },
      { day: "6日目", title: "バドラプルから飛行機でカトマンズへ帰還", desc: "空港へ移動し、カトマンズへ帰還。心温まる大絶景の旅を締めくくります。" }
    ]
  },
  timbung_pokhari: {
    altitude: "2,000m ~ 4,338m",
    difficulty: "★★★★☆ (東ネパール秘境トレッキング)",
    season: "7〜9月（高山植物・百花繚乱） / 10〜11月（絶景の秋）",
    accom: "大自然の中の本格テントキャンプ＆ロッジ",
    included: [
      "全行程専用4WDジープ移動",
      "キャンプ用テント＆寝袋一式",
      "経験豊富な日本語ガイド・コック・ポーター同行",
      "全食事（温かい朝・昼・晩のご飯）",
      "入山許可証＆手続費用"
    ],
    unincluded: [
      "個人的なトレッキング装備",
      "ガイド・スタッフへのチップ",
      "高山対応旅行保険"
    ],
    notes: "トレッカーが少なく静かで手つかずの大自然が広がる秘境です。高山病防止のため水分補給を心がけましょう。",
    itinerary: [
      { day: "1日目", title: "カトマンズからバドラプルへ飛ばしパンチタルへドライブ", desc: "フライト後、専用ジープで緑豊かなパンチタルの中心地ファディムへドライブ。" },
      { day: "2日目", title: "ジープで登山口チャンサップへ & トレッキング開始", desc: "山道をジープで登りチャンサップへ。ここから緑あふれるトレイルを歩き始めます。" },
      { day: "3日目", title: "シャクナゲと高山植物の森を抜けサダン（3,300m）へ", desc: "美しい川のせせらぎと希少な高山鳥の声を聞きながら、高地のキャンプ地サダンを目指します。" },
      { day: "4日目", title: "神聖なるティンブン・ポカリ（4,338m）へ到着！", desc: "銃声のような神秘音が響くと語り継がれる神聖な湖へ到着！澄み渡るエメラルドの湖面と峰々に感動。" },
      { day: "5日目", title: "湖畔の散策 & 高山植物やヒマラヤ薬草の撮影", desc: "一日ゆったりと湖の周辺をハイキング。青い高山植物や雄大な山脈の写真を撮影します。" },
      { day: "6日目", title: "爽やかな尾根道を歩いて麓の村へ下山", desc: "満天の星空の夜を明かし、地元の心温まる素朴な村へ下山します。" },
      { day: "7日目", title: "ジープでバドラプルへ移動・ホテルでゆったり休息", desc: "ジープでバドラプルのホテルへ。あたたかいお風呂とご馳走で旅の疲れを癒やします。" },
      { day: "8日目", title: "フライトでカトマンズへ戻り解散", desc: "朝のフライトでカトマンズへ帰還。手つかずの秘境旅が完了します。" }
    ]
  },
  everest_climb: {
    altitude: "2,840m ~ 8,848.86m",
    difficulty: "★★★★★★ (世界最高峰エクスペディション)",
    season: "春 (4月〜5月)",
    accom: "ベースキャンプ（個人個人用ドームテント・豪華食堂テント・専属コック）",
    included: [
      "エベレスト登頂パーミット・環境保護基金全額",
      "最新型酸素ボンベ・マスク・レギュレーターセット",
      "プロの国際認定Sherpa登頂パートナー（1名につき1〜2名）",
      "アイスフォールドクターによるルート整備費",
      "ベースキャンプでの通信・Wi-Fi・最高級温かい食事",
      "緊急用ヘリコプター手配サポート"
    ],
    unincluded: [
      "個人クライミングギア（高所シューズ・ダウン等）",
      "Sherpa登頂サクセスボーナス",
      "高所緊急救助捜索保険（必須）"
    ],
    notes: "8,000m峰登頂を目指す最高の遠征です。事前審査と健康診断が必要です。",
    itinerary: [
      { day: "1-10日目", title: "カトマンズ集合・ルクラへ飛んでEBCへ高度順応トレック", desc: "装備チェックと安全ミーティング後、フライトでルクラへ。ナムチェ経由で安全に高度順応しながらEBC（5,364m）を目指します。" },
      { day: "11-20日目", title: "ベースキャンプ設営・安全祈願祭（プージャ）＆アイスフォール訓練", desc: "シェルパと安全を祈るプージャを執り行い、クンブ・アイスフォールでの実践クライミング訓練を実施。" },
      { day: "21-35日目", title: "C1・C2・C3へのローテーション登高（高度順応アタック）", desc: "サウスコルを目指し段階的に高度を上げ、体を極限の高所に慣らしていきます。" },
      { day: "36-40日目", title: "運命の山頂アタック！世界最高峰8,848mの頂へ", desc: "好天のウインドウを待ち、サウスコル（7,900m）、ヒラリーステップを経てついに世界最高峰の山頂へ到達！" },
      { day: "41-45日目", title: "安全にベースキャンプへ下山＆カトマンズで祝福セレモニー", desc: "全スタッフ無事に下山。ヘリコプターでカトマンズへ戻り、登頂証明書の発行と感動の祝勝会を行います。" }
    ]
  },
  upper_mustang: {
    altitude: "2,720m ~ 3,840m",
    difficulty: "★★★☆☆ (アッパー・ムスタン秘境トレック)",
    season: "5〜10月（雨の影響を受けない快適シーズン）",
    accom: "伝統的なムスタン建築のロッジ＆ティーハウス",
    included: [
      "アッパー・ムスタン特別制限地域許可証（RAP $500込）",
      "ポカラ〜ジョムソン往復フライトまたは4WDジープ",
      "日本語ガイド＆荷物ポーター",
      "全宿泊＆全食事（朝・昼・晩）",
      "文化保護区ACAP許可証"
    ],
    unincluded: [
      "馬のレンタル代（ご希望時）",
      "個人のおみやげ代",
      "ガイド・ポーターへのチップ"
    ],
    notes: "ヒマラヤの雨陰地帯のため日本の夏休み（7月・8月）でも青空が広がる素晴らしい旅が楽しめます。",
    itinerary: [
      { day: "1日目", title: "ポカラからジョムソンへ飛び、王国の入口カグベニへ", desc: "雄大な絶景フライトでジョムソンへ。車で古い城塞集落カグベニ（アッパー・ムスタンのゲート）へ。" },
      { day: "2-3日目", title: "赤と黄色の壮大な峡谷を抜けサマル村へ", desc: "風に削られた赤い崖の風景を歩き、チュサン村やサマル村の静かな果樹園を訪ねます。" },
      { day: "4-5日目", title: "ガルゴンパ古刹と崖穴洞窟群を見学", desc: "8世紀の歴史を持つガル・ゴンパ寺院を訪問。壁画と仏像を鑑賞し、標高を上げていきます。" },
      { day: "6-7日目", title: "城塞都市ローマンタン（3,840m）へ到着・探検！", desc: "ついに城壁に囲まれた旧王国の首都ローマンタンへ！旧王宮や4つの大寺院を見学します。" },
      { day: "8-9日目", title: "チョセル崖穴洞窟探検と絶景ビューポイント", desc: "何階建てにも掘られた神秘的なチョセル洞窟遺跡を探検。チベット馬に乗った散策も体験できます。" },
      { day: "10-11日目", title: "ジョムソンへ下山しフライトでポカラ・カトマンズへ帰還", desc: "ジープでジョムソンへ戻り、フライトでポカラ経由カトマンズへ帰還します。" }
    ]
  },
  muktinath: {
    altitude: "822m ~ 3,710m",
    difficulty: "★★☆☆☆ (車アクセス可能で安心な聖地旅)",
    season: "通年いつでもOK (3〜5月、9〜12月が快晴)",
    accom: "ジョムソン＆ムクティナートの綺麗で快適なホテル",
    included: [
      "ポカラ〜ジョムソン往復フライトまたは専用4WD",
      "全行程日本語ガイド＆専用車",
      "ホテル5泊（全朝食＆温かいネパール料理）",
      "アンナプルナ保全地域（ACAP）入域許可証"
    ],
    unincluded: [
      "寺院近くの乗馬体験費用（希望者）",
      "個人のお買いもの代",
      "チップ"
    ],
    notes: "標高3,710mですが車で寺院近くまで移動できるため、お子様からご年配の方まで安心して参拝いただけます。",
    itinerary: [
      { day: "1日目", title: "カトマンズからポカラへ移動・レイクサイドで滞在", desc: "快適な車または国内線でポカラへ。湖畔の綺麗なホテルにチェックインします。" },
      { day: "2日目", title: "フライトでジョムソンへ & リンゴの村マルファ散策", desc: "ヒマラヤの谷間を飛んでジョムソンへ。白壁が美しいリンゴの名産地マルファ村を散策。" },
      { day: "3日目", title: "救済の聖地ムクティナート（3,710m）へ参拝！", desc: "ジープで聖地へ。108の聖なる冷水噴口と絶えることのない天然の火が灯るお寺で参拝。" },
      { day: "4日目", title: "カグベニ古都とカリガンダキ川で化石探し", desc: "古代の石造り集落カグベニを歩き、川原で神秘的なアンモナイトの化石（シャリグラム）を探します。" },
      { day: "5日目", title: "ジョムソンからポカラへ戻りリラックス", desc: "朝のフライトでポカラへ帰還。マッサージや湖のカフェで心地よい時間を過ごします。" },
      { day: "6日目", title: "カトマンズへ戻りツアー終了", desc: "カトマンズへ移動し、充実した解脱と絶景の旅が完了します。" }
    ]
  },
  manang_mustang: {
    altitude: "1,400m ~ 5,416m",
    difficulty: "★★★★★ (トロンラ峠越え周遊トレック)",
    season: "3〜5月 / 9〜11月",
    accom: "景色の素晴らしいティーハウスロッジ",
    included: [
      "全行程専用車・ジープ移動費",
      "経験豊富な日本語山岳ガイド＆ポータースタッフ",
      "ロッジ12泊（温かい朝・昼・晩のお食事代込）",
      "ACAP＆TIMSトレッキング許可証全額"
    ],
    unincluded: [
      "ロッジでのWi-Fi・充電代・ホットシャワー代",
      "高山緊急対応旅行保険"
    ],
    notes: "マナン村で2日間の高所順応滞在を組んでいるため、高度障害を予防し安全にトロンラ（5,416m）を越えられます。",
    itinerary: [
      { day: "1-2日目", title: "カトマンズからベシサハール経由でチャメ村へ", desc: "ジープで川沿いの深い谷を進みチャメへ。絶景の崖道と針葉樹林を歩き始めます。" },
      { day: "3-5日目", title: "マナン村（3,540m）滞在・ガンガプルナ氷河湖ハイキング", desc: "高所順応のためマナンに宿泊。エメラルドグリーンのガンガプルナ氷河湖やアイスレイクへハイキング。" },
      { day: "6-7日目", title: "ヤクカルカを経てトロン・フェディ（4,450m）へ", desc: "草をはむヤクの群れを見ながら高地へ。明日の峠越えに備えてトロンフェディでしっかり休養。" },
      { day: "8日目", title: "早朝アタック！世界有数の標高トロン・ラ峠（5,416m）制覇！", desc: "星空の下出発。風になびくタルチョ（五色旗）が待つトロンラ峠に到達！聖地ムクティナートへ下山。" },
      { day: "9-10日目", title: "ムスタン街道を下り天然露天温泉タトパニへ", desc: "ジープを交えて下山し、川沿いの天然露天温泉タトパニへ。温泉に浸かって疲れた体をいやします。" },
      { day: "11-13日目", title: "ポカラへ戻り湖畔で祝勝会 & カトマンズ帰還", desc: "ポカラへ戻り美味しい夕食で祝杯。翌日カトマンズへ移動し大感動のゴール！" }
    ]
  },
  badimalika: {
    altitude: "1,100m ~ 4,219m",
    difficulty: "★★★★☆ (西ネパール天国の大草原トレック)",
    season: "7〜9月（緑の絨毯シーズン） / 10〜11月（快晴秋シーズン）",
    accom: "大自然の中の野外キャンプ＆地元の素朴なホームステイ",
    included: [
      "カトマンズ〜ダンガディ往復航空券",
      "全行程専用4WDジープ",
      "キャンプ用テント一式＆コック・ポーターチーム",
      "日本語ガイド同行",
      "全食事（温かいフレッシュな食事）"
    ],
    unincluded: [
      "個人用防寒ウェア・登山靴",
      "ガイド・スタッフへのチップ",
      "海外旅行保険"
    ],
    notes: "地平線まで続く鮮やかな緑の絨毯（草原）が広がる究極の秘境です。携帯の電波が届かない大自然を満喫できます。",
    itinerary: [
      { day: "1日目", title: "ダンガディへ飛んで4WDでバジュラのマルティへ", desc: "フライト後、専用4WDで美しい川と山々を抜けてバジュラ県のマルティへ移動。" },
      { day: "2日目", title: "マルティからトレッキング開始 & 清流の村へ", desc: "素朴なネパールの田舎村を通り、ジャドゥンへ向かって緑の中をトレッキング。" },
      { day: "3日目", title: "森林限界を越えて果てしない緑の大草原へ突入", desc: "樹林帯を抜けると、目の前にどこまでも続く広大な緑の草原（パタン）が姿を現します！" },
      { day: "4日目", title: "標高4,219mバディマリカ山頂へ到達・社で参拝", desc: "緑の丘を登り最高地点のバディマリカ社へ。天空に浮かぶような感動の大パノラマ。" },
      { day: "5日目", title: "トリヴェニ（3つの聖なる川の合流点）でキャンプ＆星空", desc: "3つの川が交わる美しい草原地帯でキャンプ。夜は降るような満天の星空を眺めます。" },
      { day: "6-7日目", title: "広大な丘を下りサンフェバガルへ下山", desc: "緑の絨毯に別れを告げ、地元の心温まる農村を訪ねながらゆったり下山。" },
      { day: "8日目", title: "車でダンガディへ移動・ローカルご馳走で打ち上げ", desc: "ダンガディのホテルへ移動。地元の美味しいデウダ文化の料理と踊りで打ち上げ。" },
      { day: "9日目", title: "フライトでカトマンズへ戻り解散", desc: "カトマンズへ飛んで帰還。一生忘れられない緑の天国の旅が完了です。" }
    ]
  },
  ramaroshan: {
    altitude: "2,050m ~ 3,200m",
    difficulty: "★★★☆☆ (アチャムの12湖と18草原めぐり)",
    season: "3〜5月（花咲く春） / 9〜11月（澄み渡る秋）",
    accom: "湖畔のネイチャーキャンプ＆アチャムの伝統民家",
    included: [
      "カトマンズ〜ダンガディ往復フライト",
      "4WDジープ（全行程移動）",
      "キャンプ一式＆コック・ガイドチーム",
      "地元オーガニックの全食事",
      "環境保護入域手続き"
    ],
    unincluded: [
      "個人用トレッキングギア",
      "チップ",
      "個人的なお買い物代"
    ],
    notes: "12の湖と18の広大な大草原が広がるヒーリングパラダイスです。歩きやすいハイキングシューズでお越しください。",
    itinerary: [
      { day: "1日目", title: "ダンガディへ飛びアチャムのマンガルセンへドライブ", desc: "フライト後、ジープでアチャム県の県都マンガルセンへ絶景ドライブ。" },
      { day: "2日目", title: "4WDでラマロシャン高原へ登りベースキャンプ設営", desc: "標高2,400mのラマロシャン高原へ。湖畔の綺麗な場所にテントを設営します。" },
      { day: "3日目", title: "12の神秘の湖（ジャガル湖・ジギ湖など）巡りハイキング", desc: "スイレンの花が咲く美しい湖群をひとつひとつ巡る癒やしのハイキング。" },
      { day: "4日目", title: "18の広大な草原（パタン）散策＆ピクニック", desc: "見渡す限りの草原でピクニック。のんびり草を食む家畜や可愛い高山鳥と出会えます。" },
      { day: "5日目", title: "展望台へ登りカプチニ山脈のパノラマを堪能", desc: "少し登って絶景展望台へ。西ネパールの雄大な山並みが一望できます。" },
      { day: "6日目", title: "サンフェバガルの素朴な街へ下山", desc: "温かい地元の人々と触れ合いながら下山し、サンフェバガルに宿泊。" },
      { day: "7日目", title: "車でダンガディへ移動・ホテルでゆったり休息", desc: "ダンガディへ移動。温かいお風呂に入り、地元の特産品をお買い物。" },
      { day: "8日目", title: "フライトでカトマンズへ帰還", desc: "朝の便でカトマンズへ。隠れた宝石をめぐる大満足の旅が締めくくられます。" }
    ]
  },
  darchula: {
    altitude: "900m ~ 4,000m",
    difficulty: "★★★★☆ (最西端ダルチュラ＆アピ保護区秘境)",
    season: "3〜5月 / 9〜11月",
    accom: "アピ・ナンパ保護区のロッジ＆テントキャンプ",
    included: [
      "カトマンズ〜ダンガディ往復フライト",
      "全行程専用4WDジープ",
      "アピ・ナンパ自然保護区入域パーミット",
      "経験豊富な日本語ガイド・コック・ポーターチーム",
      "全食事（温かい手作り料理）"
    ],
    unincluded: [
      "個人的な登山着・防寒具",
      "ガイド・スタッフへのチップ",
      "高山対応保険"
    ],
    notes: "ネパール最西端に位置する手つかずの究極の冒険ルートです。現地の人々の素朴な温かさに心を打たれます。",
    itinerary: [
      { day: "1日目", title: "ダンガディへ飛んでダルチュラ本部へロングドライブ", desc: "フライト後、マハカリ川沿いを通り最西端のダルチュラ（カランガ）へ移動。" },
      { day: "2日目", title: "マハカリ川沿いをジープで進みトレッキングスタート", desc: "ダイナミックな渓谷沿いをジープで進み、ラティナートから歩き始めます。" },
      { day: "3日目", title: "アピ・ナンパ自然保護区へ突入・大滝と深い森を散策", desc: "手つかずの自然保護区へ。迫力のある大滝や古い橋を渡ってマカール村へ。" },
      { day: "4-5日目", title: "アピ・ベースキャンプ（3,860m）へ到達！7,132m名峰を仰ぎ見る", desc: "標高を上げベースキャンプへ。目の前に立ちはだかる圧倒的な名峰アピ山（7,132m）と大氷河に感動！" },
      { day: "6日目", title: "アピ山麓の聖なる湖神殿巡り＆絶景撮影", desc: "静かな氷河湖やお寺を散策。野生のブルーシープや高山植物をじっくり観察・撮影します。" },
      { day: "7-8日目", title: "古代バイアス文化の村々を訪ねながらゆったり下山", desc: "独特の衣服や文化を守るバイアス族の村を訪ね、あたたかいお茶ともてなしを受けながら下山。" },
      { day: "9日目", title: "車でダンガディへ戻り達成感に満ちた夕食", desc: "ダンガディへ戻り、最西端トレックの達成を祝う美味しい夕食を堪能。" },
      { day: "10日目", title: "フライトでカトマンズへ帰還・ツアー終了", desc: "カトマンズへ戻り、ネパールの最果てを制覇した一生の思い出の旅が完了します。" }
    ]
  }
};

function getTourDetails(id: string): TourDetail {
  return TOUR_DETAILS_MAP[id] || {
    altitude: "1,400m",
    difficulty: "★★☆☆☆ (初級レベル)",
    season: "春・秋 (10月〜5月推奨)",
    accom: "定評のある高品質ホテルまたはマウンテンロッジ",
    included: [
      "現地日本語ガイド同行サービス",
      "全行程のプライベート専用送迎車",
      "メイン提携ホテル/ロッジ宿泊費"
    ],
    unincluded: [
      "個人のお買い物、お土産購入代金",
      "追加のソフトドリンク・お飲み物代"
    ],
    notes: "動きやすいスニーカーまたはハイキングシューズ、並びに体温調節が容易なアウターを持参することお勧めします。",
    itinerary: [
      { day: "1日目", title: "現地到着 & 専用アスコ特選お出迎え", desc: "空港または集合場所にて専任の日本語ガイドがお出迎え。エアコン完備車両でホテルへチェックイン。" },
      { day: "2日目", title: "フルアテンド観光 & 主要スポット詳細案内", desc: "代表的な名所やパノラマポイントを専用車でゆとりを持ったスケジュールでご案内。" },
      { day: "3日目", title: "お買い物 & 帰還シャトル手配", desc: "地元のお勧めお土産店へご案内。空港または指定の場所までお送りいたします。" }
    ]
  };
}

export default function Tours({ onBookTour, isLoggedIn }: ToursProps) {
  const [selectedTour, setSelectedTour] = useState<TourItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "trek" | "culture" | "nature">("all");

  const [toursList, setToursList] = useState<TourItem[]>(() => {
    const saved = localStorage.getItem("nepa_admin_tours_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return TOURS;
  });

  useEffect(() => {
    const syncTours = () => {
      const saved = localStorage.getItem("nepa_admin_tours_v2");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setToursList(parsed);
          }
        } catch (e) {}
      } else {
        setToursList(TOURS);
      }
    };

    window.addEventListener("nepa_tours_updated", syncTours);
    window.addEventListener("storage", syncTours);
    return () => {
      window.removeEventListener("nepa_tours_updated", syncTours);
      window.removeEventListener("storage", syncTours);
    };
  }, []);

  const filteredTours = toursList.filter(tour => {
    if (activeFilter === "all") return true;
    if (activeFilter === "trek") {
      return tour.tags && tour.tags.some(tag => tag.includes("トレイル") || tag.includes("トレッキング") || tag.includes("登山"));
    }
    if (activeFilter === "culture") {
      return tour.tags && tour.tags.some(tag => 
        tag.includes("世界遺産") || 
        tag.includes("歴史") || 
        tag.includes("伝統") || 
        tag.includes("芸術") || 
        tag.includes("寺院") || 
        tag.includes("美術") || 
        tag.includes("聖地")
      );
    }
    if (activeFilter === "nature") {
      return tour.tags && tour.tags.some(tag => 
        tag.includes("湖畔") || 
        tag.includes("自然") || 
        tag.includes("草原") || 
        tag.includes("ジャングル") || 
        tag.includes("サファリ") || 
        tag.includes("野生")
      );
    }
    return true;
  });

  return (
    <section id="tours" className={`pt-28 sm:pt-32 pb-20 scroll-mt-28 sm:scroll-mt-32 transition-colors duration-300 ${isLoggedIn ? "bg-slate-950 text-white border-t border-slate-800" : "bg-slate-50/50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title describing pristine negative space and premium typography */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14" 
          id="tours-header"
        >
          <span className={`text-[11px] font-black tracking-widest uppercase border px-3 py-1 rounded-full ${
            isLoggedIn ? "bg-emerald-950 text-emerald-400 border-emerald-800" : "text-red-700 bg-red-50 border-red-200"
          }`} id="tours-badge">
            PREMIUM PACKAGES
          </span>
          <h2 className={`mt-4 font-display font-black text-2xl sm:text-3xl md:text-4xl tracking-tight ${isLoggedIn ? "text-white" : "text-slate-900"}`} id="tours-heading">
            ネパールの美を体験する<span className={isLoggedIn ? "text-emerald-400 font-black" : "text-red-600"}>特選ツアー</span>
          </h2>
          <p className={`mt-3 text-sm sm:text-base font-semibold px-2 ${isLoggedIn ? "text-emerald-200/90" : "text-slate-700"}`} id="tours-subheading">
            政府公式推奨・日本語ガイドが全行程プライベートでご案内。安心感と上質な体験を追求した、ネパールの絶景とヒマラヤ秘境を巡る厳選15選です。
          </p>
        </motion.div>

        {/* Tab Controls Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 mb-12 max-w-2xl mx-auto p-2 rounded-2xl border shadow-xs ${
            isLoggedIn ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-200/80 border-slate-300 text-slate-800"
          }`} 
          id="tours-filter"
        >
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
              activeFilter === "all"
                ? isLoggedIn ? "bg-emerald-500 text-slate-950 shadow-md scale-105" : "bg-red-600 text-white shadow-md scale-105"
                : isLoggedIn ? "text-slate-300 hover:text-white hover:bg-slate-800" : "text-slate-800 hover:text-slate-950 hover:bg-white/70"
            }`}
            id="filter-all"
          >
            すべて表示
          </button>
          <button
            onClick={() => setActiveFilter("trek")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
              activeFilter === "trek"
                ? isLoggedIn ? "bg-emerald-500 text-slate-950 shadow-md scale-105" : "bg-red-600 text-white shadow-md scale-105"
                : isLoggedIn ? "text-slate-300 hover:text-white hover:bg-slate-800" : "text-slate-800 hover:text-slate-950 hover:bg-white/70"
            }`}
            id="filter-trek"
          >
            本格登山・トレック
          </button>
          <button
            onClick={() => setActiveFilter("culture")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
              activeFilter === "culture"
                ? isLoggedIn ? "bg-emerald-500 text-slate-950 shadow-md scale-105" : "bg-red-600 text-white shadow-md scale-105"
                : isLoggedIn ? "text-slate-300 hover:text-white hover:bg-slate-800" : "text-slate-800 hover:text-slate-950 hover:bg-white/70"
            }`}
            id="filter-culture"
          >
            世界遺産・芸術伝統
          </button>
          <button
            onClick={() => setActiveFilter("nature")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
              activeFilter === "nature"
                ? isLoggedIn ? "bg-emerald-500 text-slate-950 shadow-md scale-105" : "bg-red-600 text-white shadow-md scale-105"
                : isLoggedIn ? "text-slate-300 hover:text-white hover:bg-slate-800" : "text-slate-800 hover:text-slate-950 hover:bg-white/70"
            }`}
            id="filter-nature"
          >
            大自然・サファリ
          </button>
        </motion.div>

        {/* Grid Listing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="tours-grid">
          {filteredTours.map((tour) => {
            const details = getTourDetails(tour.id);
            return (
              <motion.div
                layout
                key={tour.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-3xl overflow-hidden border shadow-xs group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative ${
                  isLoggedIn ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200/80"
                }`}
                id={`tour-card-${tour.id}`}
              >
                {/* Tour Photo */}
                <div className="relative h-52 select-none shrink-0 overflow-hidden bg-slate-900">
                  <img
                    src={tour.image}
                    alt={tour.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 group-hover:opacity-95"
                  />
                  {isLoggedIn ? (
                    <div className="absolute inset-0 bg-slate-950/40" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                  )}

                  {/* Floating Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3.5 sm:left-3.5 sm:right-3.5 flex justify-between items-center pointer-events-none" id="tour-floats">
                    <span className="bg-slate-950/90 backdrop-blur-md text-amber-300 text-xs sm:text-sm md:text-base font-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl border-2 border-amber-500/50 shadow-lg flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <BedDouble className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                      {tour.duration}
                    </span>
                    <span className="bg-[#059669] text-white text-xs sm:text-sm md:text-base font-black px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl border border-emerald-400/40 flex items-center gap-1 sm:gap-1.5 shadow-md shrink-0">
                      <SharpStar className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-300 text-amber-300 shrink-0" />
                      {tour.rating}
                    </span>
                  </div>

                  {/* Floating Bottom Specs inside image */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs font-extrabold">
                    <span className="bg-slate-950/75 backdrop-blur-md text-white px-3 py-1 rounded-lg border border-white/25 shadow-xs">
                      最高標高 {details.altitude}
                    </span>
                    <span className="bg-slate-950/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg border border-white/15 text-shadow-xs font-bold">
                      {details.season.split(" ")[0]}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between" id="tour-card-body">
                  <div>
                    {/* Tags line */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg border shadow-2xs ${
                        isLoggedIn ? "bg-emerald-950 text-emerald-400 border-emerald-800" : "bg-emerald-50 text-[#059669] border-emerald-200/90"
                      }`}>
                        {tour.tags[0]}
                      </span>
                      {tour.tags[1] && (
                        <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                          isLoggedIn ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-100 text-slate-700 border-slate-200/80"
                        }`}>
                          {tour.tags[1]}
                        </span>
                      )}
                    </div>

                    {/* Tour title */}
                    <h3 className={`font-display font-black text-xl transition-colors leading-snug ${
                      isLoggedIn ? "text-white group-hover:text-amber-400" : "text-slate-900 group-hover:text-[#059669]"
                    }`}>
                      {tour.name}
                    </h3>

                    {/* Tour description */}
                    <p className={`mt-2 text-xs sm:text-sm font-semibold leading-relaxed line-clamp-3 ${
                      isLoggedIn ? "text-slate-300" : "text-blue-900"
                    }`}>
                      {tour.description}
                    </p>
                  </div>

                  {/* Card Action footer */}
                  <div className={`mt-6 pt-4 border-t flex items-center justify-between gap-2 shrink-0 ${
                    isLoggedIn ? "border-slate-800" : "border-slate-100"
                  }`}>
                    <div className="shrink-0 min-w-0">
                      <span className={`text-xs font-black block uppercase tracking-wider whitespace-nowrap mb-0.5 ${
                        isLoggedIn ? "text-amber-400" : "text-[#059669]"
                      }`}>基本参考価格</span>
                      <div className="flex items-baseline gap-1 whitespace-nowrap">
                        <span className={`font-sans font-black text-xl sm:text-2xl tracking-tight whitespace-nowrap ${
                          isLoggedIn ? "text-white" : "text-slate-900"
                        }`}>{tour.price}</span>
                        <span className={`text-xs font-bold whitespace-nowrap ${
                          isLoggedIn ? "text-slate-400" : "text-slate-500"
                        }`}>/名</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* View Details trigger */}
                      <button
                        onClick={() => setSelectedTour(tour)}
                        className={`px-3 py-2 sm:px-3 sm:py-2.5 text-xs font-black rounded-xl border transition-all cursor-pointer text-center whitespace-nowrap active:scale-95 ${
                          isLoggedIn ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/80"
                        }`}
                        id={`view-details-${tour.id}`}
                      >
                        詳細を見る
                      </button>
                      {/* Instant book trigger */}
                      <button
                        onClick={() => onBookTour(tour.name)}
                        className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-black rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer text-center whitespace-nowrap flex items-center justify-center gap-1"
                        id={`instant-book-${tour.id}`}
                      >
                        <span>予約する</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Simplified Beautiful Detail Modal with Day-by-Day itinerary */}
        <AnimatePresence>
          {selectedTour && (() => {
            const extra = getTourDetails(selectedTour.id);
            return (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 py-6 sm:py-10 overflow-y-auto no-scrollbar bg-slate-950/80 backdrop-blur-md" 
                id="tour-detail-overlay-wrapper"
              >
                {/* Backdrop Click Dismiss */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedTour(null)}
                  className="fixed inset-0 cursor-pointer bg-transparent"
                  id="tour-detail-backdrop"
                />

                {/* Minimal Card Container */}
                <motion.div
                  initial={{ scale: 0.95, y: 15, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.95, y: 15, opacity: 0 }}
                  className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] sm:max-h-[88vh] flex flex-col relative border border-slate-200 z-10 shadow-2xl overflow-hidden my-auto"
                  id="tour-detail-modal"
                >
                  {/* Premium Modal Banner Image containing Tour details styled with a subtle overlay gradient */}
                  <div className="relative h-48 sm:h-60 select-none shrink-0 overflow-hidden bg-slate-100">
                    <img 
                      src={selectedTour.image} 
                      alt={selectedTour.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent" />
                    
                    {/* Header info floating absolute left-bottom inside picture */}
                    <div className="absolute bottom-4 left-4 sm:left-6 right-12 text-left">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span className="bg-slate-900/80 backdrop-blur-md text-white font-black text-xs sm:text-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md border border-white/20">
                          <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-300 shrink-0" />
                          {selectedTour.duration}
                        </span>
                        <span className="bg-[#059669] text-white font-black text-xs sm:text-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md border border-emerald-400/40">
                          <SharpStar className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-amber-300 text-amber-300 shrink-0" />
                          評価 {selectedTour.rating}
                        </span>
                      </div>
                      <h3 className="font-sans font-black text-xl sm:text-2xl text-white tracking-tight leading-tight drop-shadow-md">
                        {selectedTour.name}
                      </h3>
                    </div>

                    {/* Absolute Close button */}
                    <button
                      onClick={() => setSelectedTour(null)}
                      className="absolute top-4 right-4 z-10 p-2 text-white bg-slate-950/40 hover:bg-slate-950/70 backdrop-blur-md rounded-full transition-all cursor-pointer border border-white/10"
                      title="閉じる"
                      id="close-tour-modal"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Scrollable side-by-side 2-column details body on desktop, stacked on mobile */}
                  <div className="flex-1 overflow-y-auto p-6 sm:p-8 max-h-[60vh] sm:max-h-[65vh]" id="tour-modal-scrollable">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      
                      {/* Left Column: Tour overview, specs, inclusions/exclusions & notes */}
                      <div className="lg:col-span-5 space-y-6" id="modal-left-col">
                        
                        {/* Tour Overview */}
                        <div>
                          <span className="text-xs text-[#059669] font-black uppercase tracking-wider block mb-2">ツアー概要</span>
                          <p className="text-sm sm:text-base text-slate-900 leading-relaxed font-bold bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                            {selectedTour.description}
                          </p>
                        </div>

                        {/* Clean Key Specs Bar */}
                        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                            <span className="text-slate-600 font-extrabold block text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <Compass className="w-3.5 h-3.5 text-[#059669]" /> 最高標高
                            </span>
                            <span className="font-black text-slate-900 font-mono text-sm">{extra.altitude}</span>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                            <span className="text-slate-600 font-extrabold block text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-blue-900" /> 難易度
                            </span>
                            <div>
                              {(() => {
                                const match = extra.difficulty.match(/^([★☆]+)\s*(.*)$/);
                                if (match) {
                                  const [, starsStr, rest] = match;
                                  const filledCount = (starsStr.match(/★/g) || []).length;
                                  const totalCount = 5;
                                  return (
                                    <div className="flex flex-col gap-1.5 mt-0.5">
                                      <div className="flex items-center gap-1.5">
                                        {Array.from({ length: totalCount }).map((_, idx) => (
                                          <SharpStar
                                            key={idx}
                                            className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 ${
                                              idx < filledCount
                                                ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                                                : "fill-slate-200 text-slate-200"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                      {rest && <span className="text-slate-900 font-extrabold text-xs sm:text-sm leading-snug">{rest}</span>}
                                    </div>
                                  );
                                }
                                return <span className="font-black text-slate-900 text-sm">{extra.difficulty}</span>;
                              })()}
                            </div>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                            <span className="text-slate-600 font-extrabold block text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-amber-500" /> 推奨ベストシーズン
                            </span>
                            <span className="font-black text-slate-900 text-sm">{extra.season}</span>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                            <span className="text-slate-600 font-extrabold block text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-[#059669]" /> 宿泊レベル
                            </span>
                            <span className="font-black text-slate-900 text-sm truncate block">{extra.accom}</span>
                          </div>
                        </div>

                        {/* Included and Excluded details */}
                        <div className="space-y-4">
                          {/* Included - Emerald / Dark Green (#059669) */}
                          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/90 space-y-2.5">
                            <h5 className="text-xs font-black text-[#059669] uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-200 pb-2">
                              <Check className="w-4 h-4 text-white bg-[#059669] rounded-full p-0.5 shrink-0" />
                              <span>料金に含まれるもの</span>
                            </h5>
                            <ul className="space-y-2 text-xs sm:text-sm text-slate-900 font-bold">
                              {extra.included.map((item, id) => (
                                <li key={id} className="flex gap-2 items-start">
                                  <span className="text-[#059669] font-black shrink-0">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Excluded - Red */}
                          <div className="bg-red-50/60 p-4 rounded-2xl border border-red-200/90 space-y-2.5">
                            <h5 className="text-xs font-black text-red-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-red-200 pb-2">
                              <span className="text-red-600 font-black px-1 text-sm shrink-0">×</span>
                              <span>料金に含まれないもの</span>
                            </h5>
                            <ul className="space-y-2 text-xs sm:text-sm text-slate-900 font-bold">
                              {extra.unincluded.map((item, id) => (
                                <li key={id} className="flex gap-2 items-start">
                                  <span className="text-red-600 font-black shrink-0">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Guidance notes block - Red section title with Blue description */}
                        <div className="p-4 bg-red-50/50 rounded-2xl border border-red-200 text-xs sm:text-sm font-medium leading-relaxed flex gap-3 items-start">
                          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-black text-red-700 block mb-1">【ご予約前のご注意事項】</span>
                            <span className="text-blue-900 font-bold block leading-relaxed">{extra.notes}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Dynamic Vertical Day by Day Schedule */}
                      <div className="lg:col-span-7 space-y-6 border-t lg:border-t-0 lg:border-l border-slate-200/80 pt-6 lg:pt-0 lg:pl-8" id="modal-right-col">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                          <h4 className="font-sans font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
                            <ArrowRight className="w-5 h-5 text-[#059669]" />
                            日別プライベート・スケジュール
                          </h4>
                          <span className="text-xs text-[#059669] font-black bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                            日本語ガイド同行
                          </span>
                        </div>

                        {/* Timeline List */}
                        <div className="space-y-0 relative pl-2">
                          {extra.itinerary.map((day, idx) => {
                            const isLast = idx === extra.itinerary.length - 1;
                            return (
                              <div className="relative pl-8 pb-6 last:pb-0" key={idx}>
                                {/* Timeline connecting line */}
                                {!isLast && (
                                  <div className="absolute left-[9px] top-5 bottom-0 w-[2px] bg-slate-200" />
                                )}
                                {/* Timeline point dot */}
                                <div className="absolute left-0 top-1.5 w-[20px] h-[20px] rounded-full bg-white border-4 border-[#059669] shadow-xs" />
                                
                                {/* Day Title */}
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <span className="bg-blue-950 text-white text-xs font-black px-2 py-0.5 rounded-md leading-none select-none">
                                    {day.day}
                                  </span>
                                  <h4 className="font-sans font-black text-sm sm:text-base text-slate-900 tracking-tight">
                                    {day.title}
                                  </h4>
                                </div>
                                {/* Day description */}
                                <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed bg-slate-50/90 p-3 rounded-xl border border-slate-200/80">
                                  {day.desc}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Crisp Sticky Footer with clear breakdown price & call to action booking trigger */}
                  <div className="p-3.5 sm:p-6 border-t border-slate-200 shrink-0 bg-slate-50/95 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center justify-between sm:block shrink-0">
                      <span className="text-[10px] sm:text-xs text-[#059669] font-black block uppercase tracking-wider whitespace-nowrap mb-0.5">参考本体価格 (1名様・税込)</span>
                      <span className="font-sans font-black text-xl sm:text-3xl text-slate-900 tracking-tight whitespace-nowrap block">
                        {selectedTour.price}
                      </span>
                    </div>

                    <div className="flex gap-2.5 sm:gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => setSelectedTour(null)}
                        className="px-3.5 sm:px-5 py-2.5 hover:bg-slate-200 bg-slate-100 text-slate-700 text-xs sm:text-sm font-black rounded-xl border border-slate-200 transition-colors cursor-pointer text-center shrink-0"
                      >
                        閉じる
                      </button>
                      <button
                        onClick={() => {
                          const name = selectedTour.name;
                          setSelectedTour(null);
                          onBookTour(name);
                        }}
                        className="flex-1 sm:flex-none px-4 sm:px-7 py-2.5 bg-red-600 hover:bg-red-700 font-black text-white text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 sm:gap-2"
                      >
                        <span>オンライン予約へ進む</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>

      </div>
    </section>
  );
}
