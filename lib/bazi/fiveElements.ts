/**
 * 五行喜用神與調候元素計算模組 (Useful Gods & Climate Balancing Engine)
 */

import { BaziChart, FiveElement } from '../../types/bazi';
import { ELEMENT_METADATA } from './constants';

export interface UsefulGodsAnalysis {
  favorableElements: Array<{
    element: FiveElement;
    nameZh: string;
    role: '用神' | '喜神';
    reason: string;
  }>;
  climateAdjustment: {
    element: FiveElement;
    nameZh: string;
    label: string;
    reason: string;
    needed: boolean;
  };
  tabooElements: Array<{
    element: FiveElement;
    nameZh: string;
    reason: string;
  }>;
  summary: string;
}

// 五行生剋循環
const GENERATES: Record<FiveElement, FiveElement> = {
  wood: 'fire',
  fire: 'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood',
};

const GENERATED_BY: Record<FiveElement, FiveElement> = {
  wood: 'water',
  fire: 'wood',
  earth: 'fire',
  metal: 'earth',
  water: 'metal',
};

const CONTROLS: Record<FiveElement, FiveElement> = {
  wood: 'earth',
  earth: 'water',
  water: 'fire',
  fire: 'metal',
  metal: 'wood',
};

/**
 * 計算喜用神與調候需求
 */
export function analyzeUsefulGods(chart: BaziChart): UsefulGodsAnalysis {
  const dm = chart.dayMaster.element;
  const monthZhi = chart.pillars.month.zhi;
  const strength = chart.fiveElements.dayMasterStrength;
  const dist = chart.fiveElements.distribution;

  const resourceEl = GENERATED_BY[dm]; // 印星 (生我)
  const outputEl = GENERATES[dm];      // 食傷 (我生)
  const wealthEl = CONTROLS[dm];       // 財星 (我剋)

  const favorable: UsefulGodsAnalysis['favorableElements'] = [];
  const taboo: UsefulGodsAnalysis['tabooElements'] = [];

  // 1. 強弱扶抑推導
  const isStrong = strength === 'strong' || strength === 'extremely_strong';
  const isWeak = strength === 'weak' || strength === 'extremely_weak';

  if (isStrong) {
    // 身旺：需洩秀 (食傷) 或耗身 (財星)
    favorable.push({
      element: outputEl,
      nameZh: ELEMENT_METADATA[outputEl].nameZh,
      role: '用神',
      reason: `日主身旺，需以${ELEMENT_METADATA[outputEl].nameZh}（食傷創意）引導洩秀，轉化充沛內驅力為成果。`,
    });
    favorable.push({
      element: wealthEl,
      nameZh: ELEMENT_METADATA[wealthEl].nameZh,
      role: '喜神',
      reason: `以${ELEMENT_METADATA[wealthEl].nameZh}（商業與務實資源）落實想法，使能量取得世俗成果支點。`,
    });
    taboo.push({
      element: resourceEl,
      nameZh: ELEMENT_METADATA[resourceEl].nameZh,
      reason: '再行印星易過度自信、固步自封。',
    });
    taboo.push({
      element: dm,
      nameZh: ELEMENT_METADATA[dm].nameZh,
      reason: '比劫過旺易產生競爭焦慮與人際磨擦。',
    });
  } else if (isWeak) {
    // 身弱：需印生、比助
    favorable.push({
      element: resourceEl,
      nameZh: ELEMENT_METADATA[resourceEl].nameZh,
      role: '用神',
      reason: `日主偏弱，首重${ELEMENT_METADATA[resourceEl].nameZh}（印星貴人與知識資源）滋養底層底氣。`,
    });
    favorable.push({
      element: dm,
      nameZh: ELEMENT_METADATA[dm].nameZh,
      role: '喜神',
      reason: `以${ELEMENT_METADATA[dm].nameZh}（同儕比肩、團隊合作）借力使力，分擔壓力並拓展視野。`,
    });
    taboo.push({
      element: wealthEl,
      nameZh: ELEMENT_METADATA[wealthEl].nameZh,
      reason: '身弱見過重財星容易力不從心、心力交瘁。',
    });
  } else {
    // 中和平衡：取缺乏者為用
    const lowestEl = (['wood', 'fire', 'earth', 'metal', 'water'] as FiveElement[]).sort(
      (a, b) => dist[a].score - dist[b].score
    )[0];
    favorable.push({
      element: lowestEl,
      nameZh: ELEMENT_METADATA[lowestEl].nameZh,
      role: '用神',
      reason: `命盤整體相對中和，取現有偏弱的${ELEMENT_METADATA[lowestEl].nameZh}補齊最後一塊拼圖。`,
    });
    favorable.push({
      element: outputEl,
      nameZh: ELEMENT_METADATA[outputEl].nameZh,
      role: '喜神',
      reason: `平穩流暢表達自我，維持動態平衡。`,
    });
  }

  // 2. 調候用神推導（根據生月節氣氣候）
  let climateAdjustment: UsefulGodsAnalysis['climateAdjustment'];

  if (['亥', '子', '丑'].includes(monthZhi)) {
    // 冬季：天寒地凍，首重丙丁火暖局
    climateAdjustment = {
      element: 'fire',
      nameZh: '火',
      label: '冬令需暖局（急需火）',
      reason: '生於冬令天寒水冷，急需「火」氣溫煦心性，激發主動熱情與行動動機。',
      needed: true,
    };
  } else if (['巳', '午', '未'].includes(monthZhi)) {
    // 夏季：炎炎烈日，首重壬癸水潤局
    climateAdjustment = {
      element: 'water',
      nameZh: '水',
      label: '夏令需潤局（急需水）',
      reason: '生於夏令氣候炎燥，亟需「水」性靈動滋潤，緩解急躁焦慮與衝動決策。',
      needed: true,
    };
  } else if (['申', '酉', '戌'].includes(monthZhi)) {
    // 秋季金寒，水木調節
    climateAdjustment = {
      element: dist.water.percentage < 15 ? 'water' : 'wood',
      nameZh: dist.water.percentage < 15 ? '水' : '木',
      label: '秋金肅殺（宜水木調和）',
      reason: '生於秋令金氣肅殺，適宜引水疏導或取木生發柔軟同理心。',
      needed: dist.water.percentage < 15 || dist.wood.percentage < 15,
    };
  } else {
    // 春季木盛
    climateAdjustment = {
      element: dist.fire.percentage < 15 ? 'fire' : 'metal',
      nameZh: dist.fire.percentage < 15 ? '火' : '金',
      label: '春生向陽（火明金修）',
      reason: '生於春令欣欣向榮，得適度火光照拂或金器裁修為佳。',
      needed: dist.fire.percentage < 15,
    };
  }

  const summary = `喜用以「${favorable.map((f) => f.nameZh).join('、')}」為主，日常可多接觸相應生活元素（色彩、環境、思維模式）；${
    climateAdjustment.needed ? `命格${climateAdjustment.label}，${climateAdjustment.reason}` : '氣候調候適中，原局溫潤。'
  }`;

  return {
    favorableElements: favorable,
    climateAdjustment,
    tabooElements: taboo,
    summary,
  };
}
