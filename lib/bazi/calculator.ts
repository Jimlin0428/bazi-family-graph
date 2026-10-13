/**
 * 八字計算核心引擎 (BaZi Calculation Engine)
 * 基於 lunar-typescript，支援四柱、藏干、十神、五行權重分佈、大運起伏與現代白話人格解讀
 */

import { Solar } from 'lunar-typescript';
import {
  BaziChart,
  BaziInput,
  Pillar,
  PillarType,
  HiddenStemInfo,
  FiveElement,
  FiveElementsScore,
  ElementEnergy,
  DayMaster,
  DaYunItem,
  HeavenlyStem,
  EarthlyBranch,
  TenGod,
} from '../../types/bazi';
import {
  STEM_INFO,
  BRANCH_INFO,
  BRANCH_HIDDEN_STEMS,
  ELEMENT_METADATA,
  SHISHEN_MAP,
  DAY_MASTER_ARCHETYPES,
  getStemShiShen,
} from './constants';


/**
 * 標準化十神名稱為繁體字
 */
function normalizeShiShen(rawName: string): TenGod {
  if (rawName === '日主' || rawName === '元男' || rawName === '元女') {
    return '比肩'; // 預設同五行同氣
  }
  const matched = SHISHEN_MAP[rawName];
  if (matched) {
    return matched.nameZh;
  }
  return (rawName as TenGod) || '比肩';
}

/**
 * 建立單柱資料
 */
function buildPillar(
  type: PillarType,
  titleZh: string,
  ganStr: string,
  zhiStr: string,
  rawShiShenGan: string,
  hideGans: string[],
  hideShiShens: string[],
  naYin: string,
  diShi: string,
  xunKong: string
): Pillar {
  const gan = ganStr as HeavenlyStem;
  const zhi = zhiStr as EarthlyBranch;

  const stemMeta = STEM_INFO[gan] || { element: 'wood', elementZh: '木', yinYang: 'yang' };
  const branchMeta = BRANCH_INFO[zhi] || { element: 'water', elementZh: '水', yinYang: 'yang' };

  // 取得該地支藏干權重設定
  const configuredHides = BRANCH_HIDDEN_STEMS[zhi] || [];

  const hiddenStems: HiddenStemInfo[] = hideGans.map((hGanStr, idx) => {
    const hStem = hGanStr as HeavenlyStem;
    const hMeta = STEM_INFO[hStem] || { element: 'wood', elementZh: '木' };
    const rawSs = hideShiShens[idx] || '';
    const configRole = configuredHides.find((c) => c.stem === hStem);

    return {
      stem: hStem,
      element: hMeta.element,
      elementZh: hMeta.elementZh,
      shiShen: normalizeShiShen(rawSs),
      role: configRole?.role || (idx === 0 ? 'primary' : idx === 1 ? 'secondary' : 'residual'),
      weight: configRole?.weight || (idx === 0 ? 0.6 : 0.3),
    };
  });

  return {
    type,
    titleZh,
    gan,
    zhi,
    ganWuXing: stemMeta.element,
    zhiWuXing: branchMeta.element,
    ganYinYang: stemMeta.yinYang,
    zhiYinYang: branchMeta.yinYang,
    hiddenStems,
    shiShenGan: type === 'day' ? '日主' : normalizeShiShen(rawShiShenGan),
    naYin: naYin || '',
    diShi: diShi || '',
    xunKong: xunKong || '',
  };
}

/**
 * 計算五行能量加權分數（考慮月令加權與藏干權重）
 */
function calculateFiveElementsEnergy(
  pillars: { year: Pillar; month: Pillar; day: Pillar; hour: Pillar },
  dayMasterElement: FiveElement,
  isHourKnown: boolean = true
): FiveElementsScore {
  // 基礎分數累積桶
  const rawScores: Record<FiveElement, number> = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };

  const pillarList: Pillar[] = [pillars.year, pillars.month, pillars.day];
  if (isHourKnown) {
    pillarList.push(pillars.hour);
  }

  // 1. 天干計分（天干每柱基礎分 10 分）
  for (const pillar of pillarList) {
    const el = pillar.ganWuXing;
    rawScores[el] += 10;
  }

  // 2. 地支藏干計分（月令重要性提高 1.6 倍係數）
  for (const pillar of pillarList) {
    const isMonthPillar = pillar.type === 'month';
    const monthMultiplier = isMonthPillar ? 1.6 : 1.0;

    for (const hide of pillar.hiddenStems) {
      // 本氣基本 18 分、中氣 9 分、餘氣 4 分
      const basePoints = hide.role === 'primary' ? 18 : hide.role === 'secondary' ? 9 : 4;
      const points = basePoints * hide.weight * monthMultiplier;
      rawScores[hide.element] += points;
    }
  }

  // 總分與歸一化百分比
  const totalScore = Object.values(rawScores).reduce((acc, curr) => acc + curr, 0) || 1;

  const distribution = {} as Record<FiveElement, ElementEnergy>;
  const elementsOrder: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];

  for (const el of elementsOrder) {
    const score = Math.round(rawScores[el] * 10) / 10;
    const percentage = Math.round((rawScores[el] / totalScore) * 100);

    // 等級判定
    let level: ElementEnergy['level'] = 'balanced';
    if (percentage < 7) level = 'deficient';
    else if (percentage < 15) level = 'weak';
    else if (percentage <= 28) level = 'balanced';
    else if (percentage <= 40) level = 'strong';
    else level = 'excessive';

    const meta = ELEMENT_METADATA[el];

    distribution[el] = {
      element: el,
      nameZh: meta.nameZh,
      score,
      percentage,
      level,
      modernTrait: {
        archetype: meta.archetype,
        strengthDesc: meta.strengthDesc,
        blindspotDesc: meta.blindspotDesc,
      },
      colorToken: meta.colorToken,
    };
  }

  // 最旺與最弱五行
  const sorted = [...elementsOrder].sort((a, b) => distribution[b].score - distribution[a].score);
  const dominant = sorted[0];
  const deficient = elementsOrder.filter((el) => distribution[el].level === 'deficient' || distribution[el].percentage < 10);

  // 日元強弱（比劫與印星得分 vs 食傷、財星、官殺）
  const elementCycle: Record<FiveElement, { resource: FiveElement }> = {
    wood: { resource: 'water' },
    fire: { resource: 'wood' },
    earth: { resource: 'fire' },
    metal: { resource: 'earth' },
    water: { resource: 'metal' },
  };

  const sameElementScore = distribution[dayMasterElement].percentage;
  const resourceElementScore = distribution[elementCycle[dayMasterElement].resource].percentage;
  const supportivePercentage = sameElementScore + resourceElementScore;

  let dayMasterStrength: FiveElementsScore['dayMasterStrength'] = 'balanced';
  if (supportivePercentage > 58) {
    dayMasterStrength = 'extremely_strong';
  } else if (supportivePercentage >= 48) {
    dayMasterStrength = 'strong';
  } else if (supportivePercentage >= 38) {
    dayMasterStrength = 'balanced';
  } else if (supportivePercentage >= 26) {
    dayMasterStrength = 'weak';
  } else {
    dayMasterStrength = 'extremely_weak';
  }

  const analysisSummary = `命盤五行以「${ELEMENT_METADATA[dominant].nameZh}」能量最為充沛（${distribution[dominant].percentage}%），日主能量呈現「${
    dayMasterStrength === 'strong' || dayMasterStrength === 'extremely_strong'
      ? '身旺自帶驅動力'
      : dayMasterStrength === 'weak' || dayMasterStrength === 'extremely_weak'
      ? '身弱善於借力借勢'
      : '中和平衡穩健'
  }」格局。`;

  return {
    distribution,
    dominant,
    deficient,
    dayMasterStrength,
    dayMasterStrengthScore: supportivePercentage,
    analysisSummary,
  };
}

/**
 * 八字核心計算主函式 (calculateBazi)
 */
export function calculateBazi(input: BaziInput): BaziChart {
  const { year, month, day, hour, minute = 0, gender, isHourKnown = true } = input;

  // 1. 初始化 Lunar 與 EightChar
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  // 2. 構建四柱
  const yearPillar = buildPillar(
    'year',
    '年柱',
    eightChar.getYearGan(),
    eightChar.getYearZhi(),
    eightChar.getYearShiShenGan(),
    eightChar.getYearHideGan(),
    eightChar.getYearShiShenZhi(),
    eightChar.getYearNaYin(),
    eightChar.getYearDiShi(),
    eightChar.getYearXunKong()
  );

  const monthPillar = buildPillar(
    'month',
    '月柱',
    eightChar.getMonthGan(),
    eightChar.getMonthZhi(),
    eightChar.getMonthShiShenGan(),
    eightChar.getMonthHideGan(),
    eightChar.getMonthShiShenZhi(),
    eightChar.getMonthNaYin(),
    eightChar.getMonthDiShi(),
    eightChar.getMonthXunKong()
  );

  const dayPillar = buildPillar(
    'day',
    '日柱',
    eightChar.getDayGan(),
    eightChar.getDayZhi(),
    '日主',
    eightChar.getDayHideGan(),
    eightChar.getDayShiShenZhi(),
    eightChar.getDayNaYin(),
    eightChar.getDayDiShi(),
    eightChar.getDayXunKong()
  );

  const hourPillar = buildPillar(
    'hour',
    '時柱',
    eightChar.getTimeGan(),
    eightChar.getTimeZhi(),
    eightChar.getTimeShiShenGan(),
    eightChar.getTimeHideGan(),
    eightChar.getTimeShiShenZhi(),
    eightChar.getTimeNaYin(),
    eightChar.getTimeDiShi(),
    eightChar.getTimeXunKong()
  );

  const pillars = {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
  };

  // 3. 日元主星與白話原型解讀
  const dayGan = dayPillar.gan;
  const dayMasterMeta = STEM_INFO[dayGan];
  const dayMasterArchetype = DAY_MASTER_ARCHETYPES[dayGan] || {
    archetypeTitle: `${dayGan}${dayMasterMeta.elementZh}開拓者`,
    keyword: '自主實踐',
    coreStrengths: ['踏實穩重', '富有毅力'],
    decisionBlindspots: ['缺乏彈性'],
    stressResponse: '以務實自我消化',
    modernCommunicationAdvice: '就事論事交流',
  };

  const dayMaster: DayMaster = {
    stem: dayGan,
    element: dayMasterMeta.element,
    elementZh: dayMasterMeta.elementZh,
    yinYang: dayMasterMeta.yinYang,
    archetypeTitle: dayMasterArchetype.archetypeTitle,
    keyword: dayMasterArchetype.keyword,
    coreStrengths: dayMasterArchetype.coreStrengths,
    decisionBlindspots: dayMasterArchetype.decisionBlindspots,
    stressResponse: dayMasterArchetype.stressResponse,
    modernCommunicationAdvice: dayMasterArchetype.modernCommunicationAdvice,
  };

  // 4. 計算五行能量佔比
  const fiveElements = calculateFiveElementsEnergy(pillars, dayMaster.element, isHourKnown);

  // 5. 計算大運十年能量起伏
  const genderCode = gender === 'male' ? 1 : 0;
  const yun = eightChar.getYun(genderCode);
  const rawDaYuns = yun.getDaYun();

  const daYunList: DaYunItem[] = [];
  let count = 0;

  for (const dy of rawDaYuns) {
    const ganZhi = dy.getGanZhi();
    if (!ganZhi || ganZhi.length < 2) continue; // 跳過童限起運前的空白期

    const dyGan = ganZhi.charAt(0) as HeavenlyStem;
    const dyZhi = ganZhi.charAt(1) as EarthlyBranch;
    const dyGanMeta = STEM_INFO[dyGan];
    const dyShiShen = getStemShiShen(dyGan, dayMaster.stem);

    // 大運流動係數計算（簡化為五行生助平衡分數 40 - 95）
    const isHelpful =
      dyGanMeta?.element === dayMaster.element ||
      fiveElements.deficient.includes(dyGanMeta?.element);
    const energyTrendScore = isHelpful ? 75 + (count % 4) * 5 : 55 + (count % 3) * 6;

    // 根據大運十神生成白話關鍵詞
    const keywordsByShiShen: Record<string, string[]> = {
      比肩: ['獨立自主', '同儕合夥', '自信確立'],
      劫財: ['號召開創', '冒險擴張', '人脈整合'],
      食神: ['才華施展', '生活沉澱', '靈感創作'],
      傷官: ['破局創新', '思維躍遷', '挑戰體制'],
      偏財: ['商業敏銳', '機遇擴展', '靈活調度'],
      正財: ['務實營運', '資產累積', '穩定架構'],
      七殺: ['魄力攻堅', '突破逆境', '承壓躍升'],
      正官: ['秩序規範', '品牌聲望', '管理威信'],
      偏印: ['深度鑽研', '專業進階', '獨特視角'],
      正印: ['知識吸收', '貴人庇蔭', '穩固根基'],
    };

    daYunList.push({
      index: dy.getIndex(),
      startAge: dy.getStartAge(),
      endAge: dy.getEndAge(),
      startYear: dy.getStartYear(),
      endYear: dy.getEndYear(),
      ganZhi,
      gan: dyGan,
      zhi: dyZhi,
      wuXing: `${STEM_INFO[dyGan]?.elementZh || ''}${BRANCH_INFO[dyZhi]?.elementZh || ''}`,
      shiShen: dyShiShen,
      energyTrendScore,
      focusKeywords: keywordsByShiShen[dyShiShen] || ['成長開拓', '沉澱積累'],
    });


    count++;
    if (count >= 8) break; // 一般展示 8 步大運（80 年跨度）
  }

  // 6. 整合完整命盤
  const lunarDateStr = `${lunar.getYearInGanZhi()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()} ${eightChar.getTimeZhi()}時`;

  return {
    solarDate: {
      year,
      month,
      day,
      hour,
      minute,
    },
    lunarDateStr,
    gender,
    pillars,
    dayMaster,
    fiveElements,
    daYunList,
    extra: {
      taiYuan: eightChar.getTaiYuan(),
      taiXi: eightChar.getTaiXi(),
      mingGong: eightChar.getMingGong(),
      shenGong: eightChar.getShenGong(),
    },
  };
}
