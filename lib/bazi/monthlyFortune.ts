/**
 * 當年度流月運勢計算引擎 (Annual & Monthly Fortune Calculation Engine)
 * 基於 lunar-typescript，結合四柱喜用神、流月干支、十神能量與現代心理學情境解析
 */

import { Solar } from 'lunar-typescript';
import {
  BaziChart,
  AnnualFortune,
  MonthlyFortuneItem,
  HeavenlyStem,
  EarthlyBranch,
  TenGod,
  FiveElement,
} from '../../types/bazi';
import {
  STEM_INFO,
  BRANCH_INFO,
  ELEMENT_METADATA,
  getStemShiShen,
} from './constants';
import { analyzeUsefulGods } from './fiveElements';

// 天干五合配對
const STEM_COMBINES_WITH: Record<HeavenlyStem, HeavenlyStem> = {
  甲: '己',
  乙: '庚',
  丙: '辛',
  丁: '壬',
  戊: '癸',
  己: '甲',
  庚: '乙',
  辛: '丙',
  壬: '丁',
  癸: '戊',
};

// 地支六沖配對
const BRANCH_CLASHES_WITH: Record<EarthlyBranch, EarthlyBranch> = {
  子: '午',
  丑: '未',
  寅: '申',
  卯: '酉',
  辰: '戌',
  巳: '亥',
  午: '子',
  未: '丑',
  申: '寅',
  酉: '卯',
  戌: '辰',
  亥: '巳',
};

// 節氣簡轉繁名稱映射
const JIEQI_ZH_MAP: Record<string, string> = {
  小寒: '小寒',
  大寒: '大寒',
  立春: '立春',
  雨水: '雨水',
  惊蛰: '驚蟄',
  驚蟄: '驚蟄',
  春分: '春分',
  清明: '清明',
  谷雨: '穀雨',
  穀雨: '穀雨',
  立夏: '立夏',
  小满: '小滿',
  小滿: '小滿',
  芒种: '芒種',
  芒種: '芒種',
  夏至: '夏至',
  小暑: '小暑',
  大暑: '大暑',
  立秋: '立秋',
  处暑: '處暑',
  處暑: '處暑',
  白露: '白露',
  秋分: '秋分',
  寒露: '寒露',
  霜降: '霜降',
  立冬: '立冬',
  小雪: '小雪',
  大雪: '大雪',
  冬至: '冬至',
};

// 十神月度現代指引資料庫
const SHISHEN_MONTH_GUIDES: Record<
  TenGod,
  {
    themePrefix: string;
    keywords: string[];
    career: string;
    relation: string;
    wellness: string;
  }
> = {
  比肩: {
    themePrefix: '自主拓荒 · 夥伴並進',
    keywords: ['同儕合作', '意志堅定', '確立界線'],
    career: '適合強化獨立作業能力與凝聚核心同儕，推進自主性強的專案，避免固執己見而錯失他人建議。',
    relation: '平等溝通是關鍵，與伴侶或親友相處多傾聽，避免因好勝心而在無關緊要的話題上爭強好勝。',
    wellness: '適合進行跑步、重訓或體能挑戰，宣洩充沛動能，並維持作息規律。',
  },
  劫財: {
    themePrefix: '破局爭勝 · 資源重組',
    keywords: ['開拓冒險', '財務謹慎', '人脈擴張'],
    career: '競爭意識旺盛，能激發出強大破局驅動力；但重大投資或金錢出入需審慎合約細節，切忌衝動跟風。',
    relation: '朋友圈熱絡、應酬增多，注意給親密家人保留專屬陪伴時間，避免因外務繁多引起誤會。',
    wellness: '注意身心過度耗損，避免連續熬夜與高強度社交，適度安排獨處放空時段。',
  },
  食神: {
    themePrefix: '靈感湧現 · 才華轉化',
    keywords: ['創意迸發', '品味生活', '優雅表達'],
    career: '思維敏銳且富創意，有利提案、創作、技能輸出與策略規劃，能以親和力贏得跨部門支持。',
    relation: '氣氛溫馨愉悅，適合安排聚餐、文化探索或旅行，以感性與幽默感增進關係深度。',
    wellness: '注意脾胃消化功能，享受美食之餘維持適當運動，保持心境悠閒不緊繃。',
  },
  傷官: {
    themePrefix: '革新突破 · 鋒芒初露',
    keywords: ['思維敏銳', '打破常規', '言行收斂'],
    career: '洞察力強且敢於突破舊框架，有利研發創新與解決疑難雜症；對上溝通宜委婉，避免鋒芒太露引發阻力。',
    relation: '容易因直言不諱而刺傷他人，面對親密伴侶請多展現包容，多給予讚美少挑剔瑕疵。',
    wellness: '思慮過度容易影響睡眠質量，睡前可進行冥想或閱讀放鬆，避免過量攝取咖啡因。',
  },
  偏財: {
    themePrefix: '商業敏銳 · 機遇捕捉',
    keywords: ['資源整合', '副業機緣', '眼界開闊'],
    career: '商業嗅覺靈敏，容易遇見新業務、副業機緣或跨界合作；適合拓展市場版圖，但仍需控制單一風險敞口。',
    relation: '為人豪爽慷慨，人際魅力提升，適合參加社群聚會，但需保持真實真誠，避免過度承諾。',
    wellness: '維持生活與財務收支的穩健平衡，注意肝膽與眼睛保健，避免過度疲勞。',
  },
  正財: {
    themePrefix: '穩健耕耘 · 價值落地',
    keywords: ['精準營運', '務實增長', '成果收穫'],
    career: '聚焦在確定性高的核心業務上，按部就班推進必能取得紮實回報；適合進行預算規劃與流程梳理。',
    relation: '重視安全感與責任感，適合與伴侶討論共同生活規劃、家庭資產配置與未來藍圖。',
    wellness: '規律生活作息是最佳護航，維持定時飲食與溫和有氧運動，強化身心安全感。',
  },
  七殺: {
    themePrefix: '逆境攻堅 · 魄力重構',
    keywords: ['意志淬鍊', '抗壓破局', '防範焦慮'],
    career: '面對高難度挑戰或緊急任務能激發非凡決斷力；職場決策講求速戰速決，但需防範過度緊繃引發決策焦慮。',
    relation: '外在壓力較大時容易將急躁情緒帶入家庭，學會主動表達「我需要喘口氣」，尋求親人理解。',
    wellness: '注意血壓與神經緊張，適合透過深呼吸、瑜伽或溫水浴舒緩緊繃筋絡。',
  },
  正官: {
    themePrefix: '自律秩序 · 聲譽躍升',
    keywords: ['責任擔當', '貴人青睞', '專業受肯'],
    career: '重視信譽與標準化流程，容易獲得主管或官方機構信賴，具晉升或承擔更重要職位的良好運勢。',
    relation: '相處端莊而有原則，家庭關係穩定；注意偶爾卸下嚴肅面具，增添生活趣味與溫柔對話。',
    wellness: '注重骨骼、脊椎與肩頸放鬆，工作期間定期伸展運動，避免長時間久坐僵硬。',
  },
  偏印: {
    themePrefix: '深度洞察 · 技術鑽研',
    keywords: ['獨立思考', '專利研討', '直覺領悟'],
    career: '適合深耕專業技術、冷門知識或幕後策劃，直覺力與洞察力特別突出，能看清複雜局面核心。',
    relation: '渴望個人私密思考空間，需主動告知身邊人「只是想沉澱一下」，避免被誤解為冷漠疏離。',
    wellness: '防範思慮過度引起的精神內耗，多接觸大自然、曬太陽與踏青，引導能量接地。',
  },
  正印: {
    themePrefix: '包容滋育 · 貴人相伴',
    keywords: ['吸納學習', '福至心靈', '聲譽增益'],
    career: '貴人運旺盛，適合進修認證、品牌建立與公信力累積；遇困難容易得到長輩、前輩之提攜支持。',
    relation: '心態寬厚祥和，善於給予家人情感撫慰與傾聽，是家庭關係的定海神針與溫暖源泉。',
    wellness: '身心能量處於修復期，重視充足睡眠與滋養溫潤飲食，定期檢視個人體質調理。',
  },
};

/**
 * 計算指定年份之流年與 12 個月份流月運勢
 */
export function calculateAnnualMonthlyFortune(
  chart: BaziChart,
  targetYear?: number
): AnnualFortune {
  const currentYear = targetYear || new Date().getFullYear();
  const currentMonthNum = new Date().getMonth() + 1; // 1-12
  const isActualCurrentYear = currentYear === new Date().getFullYear();

  // 1. 計算喜用神與調候需求
  const usefulGods = analyzeUsefulGods(chart);
  const favorableSet = new Set<FiveElement>(
    usefulGods.favorableElements.map((f) => f.element)
  );
  if (usefulGods.climateAdjustment.needed) {
    favorableSet.add(usefulGods.climateAdjustment.element);
  }
  const tabooSet = new Set<FiveElement>(
    usefulGods.tabooElements.map((t) => t.element)
  );

  const dmStem = chart.dayMaster.stem;
  const dmElement = chart.dayMaster.element;
  const dayBranch = chart.pillars.day.zhi;

  // 2. 獲取該年份年中（約 6 月）的流年干支
  const midSolar = Solar.fromYmd(currentYear, 6, 15);
  const midLunar = midSolar.getLunar();
  const annualGanZhi = midLunar.getYearInGanZhi();
  const annualStem = annualGanZhi.charAt(0) as HeavenlyStem;
  const annualBranch = annualGanZhi.charAt(1) as EarthlyBranch;
  const annualStemMeta = STEM_INFO[annualStem] || { element: 'fire', elementZh: '火' };
  const annualShiShen = getStemShiShen(annualStem, dmStem);

  // 3. 逐月推算 1 ~ 12 月流月運勢
  const monthlyItems: MonthlyFortuneItem[] = [];

  for (let m = 1; m <= 12; m++) {
    // 選取每月 15 日取得平穩的該月八字干支與節氣
    const monthSolar = Solar.fromYmd(currentYear, m, 15);
    const monthLunar = monthSolar.getLunar();

    const mGanZhi = monthLunar.getMonthInGanZhi();
    const mStem = mGanZhi.charAt(0) as HeavenlyStem;
    const mBranch = mGanZhi.charAt(1) as EarthlyBranch;

    const mStemMeta = STEM_INFO[mStem] || { element: 'wood', elementZh: '木' };
    const mBranchMeta = BRANCH_INFO[mBranch] || { element: 'wood', elementZh: '木' };

    // 節氣區間格式化
    let prevJq = monthLunar.getPrevJieQi(true)?.getName() || '';
    let nextJq = monthLunar.getNextJieQi(true)?.getName() || '';
    prevJq = JIEQI_ZH_MAP[prevJq] || prevJq;
    nextJq = JIEQI_ZH_MAP[nextJq] || nextJq;
    const solarTermRange = prevJq && nextJq ? `${prevJq} ~ ${nextJq}` : `${m}月中旬`;

    // 相對於日主的十神
    const shiShen = getStemShiShen(mStem, dmStem);
    const guide = SHISHEN_MONTH_GUIDES[shiShen] || SHISHEN_MONTH_GUIDES['比肩'];

    // 計算當月能量契合評分 (基準 65 分)
    let score = 65;

    // A. 喜用神加減分
    if (favorableSet.has(mStemMeta.element)) score += 12;
    if (favorableSet.has(mBranchMeta.element)) score += 10;
    if (tabooSet.has(mStemMeta.element)) score -= 10;
    if (tabooSet.has(mBranchMeta.element)) score -= 8;

    // B. 天干相合 (加分)
    const isStemCombined = STEM_COMBINES_WITH[dmStem] === mStem;
    if (isStemCombined) score += 9;

    // C. 地支相沖 (變動較大、微扣分以示震盪)
    const isBranchClashed = BRANCH_CLASHES_WITH[dayBranch] === mBranch;
    if (isBranchClashed) score -= 10;

    // 限制評分在 42 - 96 區間
    score = Math.max(42, Math.min(96, Math.round(score)));

    // 運勢評級判定
    let level: MonthlyFortuneItem['level'] = 'neutral';
    if (score >= 80) level = 'excellent';
    else if (score >= 70) level = 'good';
    else if (score >= 58) level = 'neutral';
    else level = 'challenging';

    // 關鍵標籤微調
    const customKeywords = [...guide.keywords];
    if (isStemCombined) customKeywords.unshift('天干合契');
    if (isBranchClashed) customKeywords.unshift('驛馬動盪');
    if (favorableSet.has(mStemMeta.element)) customKeywords.push('喜神生助');

    const isCurrent = isActualCurrentYear && m === currentMonthNum;

    // 生成主題標題
    let themeTitle = `${guide.themePrefix}`;
    if (isStemCombined) themeTitle += ' · 人際貴人牽引';
    if (isBranchClashed) themeTitle += ' · 破舊立新需防急躁';

    monthlyItems.push({
      month: m,
      solarTermRange,
      ganZhi: mGanZhi,
      gan: mStem,
      zhi: mBranch,
      wuXing: `${mStemMeta.elementZh}${mBranchMeta.elementZh}`,
      stemElement: mStemMeta.element,
      branchElement: mBranchMeta.element,
      shiShen,
      energyScore: score,
      level,
      focusKeywords: customKeywords.slice(0, 3),
      isCurrentMonth: isCurrent,
      analysis: {
        theme: themeTitle,
        careerGuide: guide.career,
        relationGuide: guide.relation,
        healthWellnessGuide: guide.wellness,
      },
    });
  }

  // 計算年度均分
  const annualEnergyScore = Math.round(
    monthlyItems.reduce((acc, cur) => acc + cur.energyScore, 0) / monthlyItems.length
  );

  // 生成年度總綱指引
  let annualTheme = `流年${annualGanZhi}（${annualShiShen}）主導，能量起伏重在以柔克剛與資源積累`;
  if (annualEnergyScore >= 78) {
    annualTheme = `流年${annualGanZhi}（${annualShiShen}）全面賦能，大膽拓荒與把握年度躍升機遇`;
  } else if (annualEnergyScore <= 62) {
    annualTheme = `流年${annualGanZhi}（${annualShiShen}）淬鍊磨礪，守成修復與扎穩基本盤為上`;
  }

  return {
    year: currentYear,
    ganZhi: annualGanZhi,
    annualShiShen,
    annualElementZh: annualStemMeta.elementZh,
    annualTheme,
    annualEnergyScore,
    months: monthlyItems,
  };
}
