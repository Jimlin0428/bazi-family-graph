/**
 * 八字核心型別定義 (BaZi Core TypeScript Interfaces)
 * 遵循現代化資料視覺化與心理學白話轉換原則
 */

// 五行基礎類型
export type FiveElement = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type FiveElementNameZh = '木' | '火' | '土' | '金' | '水';

// 天干與地支
export type HeavenlyStem = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type EarthlyBranch = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

// 陰陽
export type YinYang = 'yin' | 'yang';

// 十神
export type TenGod =
  | '比肩'
  | '劫財'
  | '食神'
  | '傷官'
  | '偏財'
  | '正財'
  | '七殺'
  | '正官'
  | '偏印'
  | '正印';

// 四柱定位
export type PillarType = 'year' | 'month' | 'day' | 'hour';

// 地支藏干結構
export interface HiddenStemInfo {
  stem: HeavenlyStem;
  element: FiveElement;
  elementZh: FiveElementNameZh;
  shiShen: TenGod;
  role: 'primary' | 'secondary' | 'residual'; // 本氣 (主氣)、中氣、餘氣
  weight: number; // 權重比例（如本氣 60%, 中氣 30%, 餘氣 10%）
}

// 單柱結構（年月日時）
export interface Pillar {
  type: PillarType;
  titleZh: string; // '年柱' | '月柱' | '日柱' | '時柱'
  gan: HeavenlyStem;
  zhi: EarthlyBranch;
  ganWuXing: FiveElement;
  zhiWuXing: FiveElement;
  ganYinYang: YinYang;
  zhiYinYang: YinYang;
  hiddenStems: HiddenStemInfo[];
  shiShenGan: TenGod | '日主';
  naYin: string; // 如「海中金」、「爐中火」
  diShi: string; // 十二長生運星（如「長生」、「臨官」、「帝旺」）
  xunKong: string; // 空亡/旬空
}

// 單一五行能量評估
export interface ElementEnergy {
  element: FiveElement;
  nameZh: FiveElementNameZh;
  score: number; // 原始權重加權分
  percentage: number; // 歸一化百分比 (0 - 100)
  level: 'deficient' | 'weak' | 'balanced' | 'strong' | 'excessive'; // 能量狀態
  modernTrait: {
    archetype: string; // 白話原型（如「同理開創」、「行動爆發」、「穩健承載」、「原則銳度」、「智慧策略」）
    strengthDesc: string; // 優勢特質
    blindspotDesc: string; // 盲點與過度傾向
  };
  colorToken: {
    hex: string;
    twBg: string;
    twText: string;
    twBorder: string;
  };
}

// 五行能量綜合權重分佈（五行雷達圖與長條圖核心資料結構）
export interface FiveElementsScore {
  distribution: Record<FiveElement, ElementEnergy>;
  dominant: FiveElement; // 最強旺的五行
  deficient: FiveElement[]; // 缺失或過弱的五行 (score 偏低)
  dayMasterStrength: 'extremely_weak' | 'weak' | 'balanced' | 'strong' | 'extremely_strong'; // 身旺/身弱判定
  dayMasterStrengthScore: number; // 日主得令得地得生之綜合能量係數
  analysisSummary: string; // 現代化白話能量總結
}

// 日元主星（核心本質）
export interface DayMaster {
  stem: HeavenlyStem;
  element: FiveElement;
  elementZh: FiveElementNameZh;
  yinYang: YinYang;
  archetypeTitle: string; // 現代白話人格稱號（例：「陽光型願景引領者」）
  keyword: string; // 核心關鍵詞（例：「溫暖共感」、「堅定原則」）
  coreStrengths: string[]; // 核心才能/優勢
  decisionBlindspots: string[]; // 決策盲點
  stressResponse: string; // 壓力反饋模式
  modernCommunicationAdvice: string; // 現代情境對話指南
}

// 大運十年能量起伏單元（用於 Recharts 曲線視覺化）
export interface DaYunItem {
  index: number;
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
  ganZhi: string;
  gan: HeavenlyStem;
  zhi: EarthlyBranch;
  wuXing: string;
  shiShen: string;
  energyTrendScore: number; // 對原局日元的利潤與流動係數 (0 - 100)，供大運曲線渲染
  focusKeywords: string[]; // 該十年的現代生活關鍵詞（例：["事業拓荒", "團隊共好"]）
}

// 當年度流月運勢單元 (Monthly Fortune Item)
export interface MonthlyFortuneItem {
  month: number; // 陽曆月份 1 - 12
  solarTermRange: string; // 例：「立春 ~ 雨水」或「寒露 ~ 霜降」
  ganZhi: string; // 例：「庚寅」
  gan: HeavenlyStem;
  zhi: EarthlyBranch;
  wuXing: string; // 例：「金木」
  stemElement: FiveElement;
  branchElement: FiveElement;
  shiShen: TenGod; // 相對於日主的十神，例：「正財」
  energyScore: number; // 能量動能/機遇指數 (0 - 100)
  level: 'excellent' | 'good' | 'neutral' | 'challenging'; // 運勢評級
  focusKeywords: string[]; // 關鍵標籤（例：["貴人相助", "業績突破"]）
  isCurrentMonth?: boolean; // 是否為當前月份
  analysis: {
    theme: string; // 月度核心能量主題
    careerGuide: string; // 事業與職場決策指南
    relationGuide: string; // 情感關係與人際互動提醒
    healthWellnessGuide: string; // 身心調養與開運元素
  };
}

// 當年度綜合運勢資料結構 (Annual Fortune)
export interface AnnualFortune {
  year: number; // 公曆年份（例：2026）
  ganZhi: string; // 流年干支（例：「丙午」）
  annualShiShen: TenGod; // 流年主十神
  annualElementZh: string; // 流年五行
  annualTheme: string; // 年度核心指引
  annualEnergyScore: number; // 年度綜合動能均分
  months: MonthlyFortuneItem[]; // 12 個月份流月運勢
}

// 完整八字命盤物件
export interface BaziChart {
  solarDate: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
  };
  lunarDateStr: string; // 例：「乙亥年七月廿九日 未時」
  gender: 'male' | 'female';
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
  };
  dayMaster: DayMaster;
  fiveElements: FiveElementsScore;
  daYunList: DaYunItem[];
  extra: {
    taiYuan: string; // 胎元
    taiXi: string; // 胎息
    mingGong: string; // 命宮
    shenGong: string; // 身宮
  };
}

// 排盤計算輸入參數
export interface BaziInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  gender: 'male' | 'female';
  isHourKnown?: boolean; // 時辰是否已知（若未知則時柱作中性佔位）
}
