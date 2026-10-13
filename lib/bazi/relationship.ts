/**
 * 雙人八字關係與相處指南診斷引擎 (Relationship Analysis Engine)
 * 分析兩人命盤之日元生剋、干支合沖刑害、五行互補度與現代溝通策略
 */

import { FiveElement, HeavenlyStem, EarthlyBranch } from '../../types/bazi';
import { FamilyMember } from '../../types/family';
import {
  RelationshipAnalysis,
  DayMasterRelationType,
  InteractionDetail,
} from '../../types/relationship';

// 天干五合規則
const STEM_COMBINATIONS: Record<string, string> = {
  '甲-己': '甲己合（中正之合 · 誠信共好）',
  '己-甲': '甲己合（中正之合 · 誠信共好）',
  '乙-庚': '乙庚合（仁義之合 · 剛柔並濟）',
  '庚-乙': '乙庚合（仁義之合 · 剛柔並濟）',
  '丙-辛': '丙辛合（威制之合 · 熱情與精準）',
  '辛-丙': '丙辛合（威制之合 · 熱情與精準）',
  '丁-壬': '丁壬合（仁壽之合 · 智慧與直覺）',
  '壬-丁': '丁壬合（仁壽之合 · 智慧與直覺）',
  '戊-癸': '戊癸合（多禮之合 · 穩重與靈動）',
  '癸-戊': '戊癸合（多禮之合 · 穩重與靈動）',
};

// 地支六合規則
const BRANCH_LIUHE: Record<string, string> = {
  '子-丑': '子丑六合（沉穩契合）',
  '丑-子': '子丑六合（沉穩契合）',
  '寅-亥': '寅亥六合（破局互生）',
  '亥-寅': '寅亥六合（破局互生）',
  '卯-戌': '卯戌六合（守信相惜）',
  '戌-卯': '卯戌六合（守信相惜）',
  '辰-酉': '辰酉六合（相生和諧）',
  '酉-辰': '辰酉六合（相生和諧）',
  '巳-申': '巳申六合（活絡開創）',
  '申-巳': '巳申六合（活絡開創）',
  '午-未': '午未六合（溫暖同心）',
  '未-午': '午未六合（溫暖同心）',
};

// 地支六沖規則
const BRANCH_CHONG: Record<string, string> = {
  '子-午': '子午六沖（水火互激 · 靈活與熱烈的思維碰撞）',
  '午-子': '子午六沖（水火互激 · 靈活與熱烈的思維碰撞）',
  '丑-未': '丑未六沖（土性碰撞 · 價值觀與生活細節磨合）',
  '未-丑': '丑未六沖（土性碰撞 · 價值觀與生活細節磨合）',
  '寅-申': '寅申六沖（金木相戰 · 願景開拓與精準執行的張力）',
  '申-寅': '寅申六沖（金木相戰 · 願景開拓與精準執行的張力）',
  '卯-酉': '卯酉六沖（金木互斥 · 情感同理與理性原則的界線）',
  '酉-卯': '卯酉六沖（金木互斥 · 情感同理與理性原則的界線）',
  '辰-戌': '辰戌六沖（土庫相激 · 固有觀念的突破與重塑）',
  '戌-辰': '辰戌六沖（土庫相激 · 固有觀念的突破與重塑）',
  '巳-亥': '巳亥六沖（水火衝擊 · 外向行動與深層情緒的轉換）',
  '亥-巳': '巳亥六沖（水火衝擊 · 外向行動與深層情緒的轉換）',
};

// 五行生剋矩陣
const GENERATES_MAP: Record<FiveElement, FiveElement> = {
  wood: 'fire',
  fire: 'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood',
};

const CONTROLS_MAP: Record<FiveElement, FiveElement> = {
  wood: 'earth',
  earth: 'water',
  water: 'fire',
  fire: 'metal',
  metal: 'wood',
};

/**
 * 分析兩人日元之相生相剋關係
 */
function analyzeDayMasterRelation(
  elA: FiveElement,
  elB: FiveElement,
  nameA: string,
  nameB: string
): { type: DayMasterRelationType; label: string; description: string } {
  if (elA === elB) {
    return {
      type: 'same',
      label: '同氣連枝 · 同儕同行',
      description: `${nameA} 與 ${nameB} 具有相近的思維底色，能迅速理解彼此立場，但也容易在同一痛點上產生競爭或堅持。`,
    };
  }

  if (GENERATES_MAP[elA] === elB) {
    return {
      type: 'generates',
      label: '我生對方 · 主動滋養',
      description: `${nameA} 的能量自然流向並激勵 ${nameB}，在生活中常扮演支持、啟發或給予資源的角色。`,
    };
  }

  if (GENERATES_MAP[elB] === elA) {
    return {
      type: 'generated_by',
      label: '對方生我 · 欣受庇蔭',
      description: `${nameB} 樂於包容並照顧 ${nameA}，為其提供安全感與生活/思維上的穩定後盾。`,
    };
  }

  if (CONTROLS_MAP[elA] === elB) {
    return {
      type: 'controls',
      label: '我剋對方 · 導向管束',
      description: `${nameA} 的節奏通常在關係中居於主導或校正地位，需注意言詞不過度強勢。`,
    };
  }

  return {
    type: 'controlled_by',
    label: '對方剋我 · 受規約束',
    description: `${nameB} 的原則與要求容易對 ${nameA} 產生塑形或壓力，適當調整可化為自我提升的良師益友。`,
  };
}

/**
 * 執行雙人合盤綜合診斷
 */
export function analyzeRelationship(
  memberA: FamilyMember,
  memberB: FamilyMember
): RelationshipAnalysis {
  const chartA = memberA.baziChart;
  const chartB = memberB.baziChart;

  const stemA = chartA.dayMaster.stem;
  const stemB = chartB.dayMaster.stem;
  const elA = chartA.dayMaster.element;
  const elB = chartB.dayMaster.element;

  // 1. 日元生剋分析
  const dayMasterRel = analyzeDayMasterRelation(elA, elB, memberA.name, memberB.name);

  // 2. 檢測合沖刑害交互作用（遍歷四柱）
  const combinations: InteractionDetail[] = [];
  const clashes: InteractionDetail[] = [];
  const punishments: InteractionDetail[] = [];
  const harms: InteractionDetail[] = [];
  const destructions: InteractionDetail[] = [];

  const pillarsA = [chartA.pillars.year, chartA.pillars.month, chartA.pillars.day, chartA.pillars.hour];
  const pillarsB = [chartB.pillars.year, chartB.pillars.month, chartB.pillars.day, chartB.pillars.hour];

  // 天干合檢測
  for (const pA of pillarsA) {
    for (const pB of pillarsB) {
      const key = `${pA.gan}-${pB.gan}`;
      if (STEM_COMBINATIONS[key]) {
        combinations.push({
          type: 'stem_he',
          category: 'combination',
          name: STEM_COMBINATIONS[key],
          involvedPillars: {
            memberAPillar: `${memberA.name} ${pA.titleZh}（${pA.gan}）`,
            memberBPillar: `${memberB.name} ${pB.titleZh}（${pB.gan}）`,
          },
          traditionalMeaning: '天干相合，代表精神想法共鳴、目標一致。',
          modernInterpretation: '在價值觀與長期願景上容易一拍即合，溝通阻力小。',
        });
      }
    }
  }

  // 地支合沖檢測
  for (const pA of pillarsA) {
    for (const pB of pillarsB) {
      const bKey = `${pA.zhi}-${pB.zhi}`;
      // 六合
      if (BRANCH_LIUHE[bKey]) {
        combinations.push({
          type: 'branch_liuhe',
          category: 'combination',
          name: BRANCH_LIUHE[bKey],
          involvedPillars: {
            memberAPillar: `${memberA.name} ${pA.titleZh}（${pA.zhi}）`,
            memberBPillar: `${memberB.name} ${pB.titleZh}（${pB.zhi}）`,
          },
          traditionalMeaning: '地支六合，代表生活相處親和力強、黏著度高。',
          modernInterpretation: '日常生活作息或配合節奏契合度高，具天然默契。',
        });
      }

      // 六沖
      if (BRANCH_CHONG[bKey]) {
        clashes.push({
          type: 'branch_chong',
          category: 'clash',
          name: BRANCH_CHONG[bKey],
          involvedPillars: {
            memberAPillar: `${memberA.name} ${pA.titleZh}（${pA.zhi}）`,
            memberBPillar: `${memberB.name} ${pB.titleZh}（${pB.zhi}）`,
          },
          traditionalMeaning: '地支六沖，代表行事風格相反、容易激起火花或對峙。',
          modernInterpretation: '處理具體事務的手段截然不同，需要多留緩衝時間，避免直球對決。',
        });
      }
    }
  }

  // 3. 雙方五行互補度計算
  const deficientA = chartA.fiveElements.deficient;
  const deficientB = chartB.fiveElements.deficient;

  // 找出雙方共同缺乏之五行（家庭決策盲點）
  const sharedDeficient = deficientA.filter((el) => deficientB.includes(el));

  // 和諧度分數基礎分 70
  let harmonyScore = 72;
  harmonyScore += combinations.length * 7;
  harmonyScore -= clashes.length * 6;
  if (dayMasterRel.type === 'generates' || dayMasterRel.type === 'generated_by') harmonyScore += 8;
  if (dayMasterRel.type === 'same') harmonyScore += 4;
  harmonyScore = Math.min(98, Math.max(45, harmonyScore));

  // 4. 現代白話互動與相處指南生成
  const dynamicTitle =
    combinations.length > clashes.length
      ? '高默契共創隊友 · 溫暖支持'
      : clashes.length > 0
      ? '視角互補催化者 · 需重溝通緩衝'
      : '穩健同行夥伴 · 尊重各自邊界';

  const strengths: string[] = [
    `互補優勢：${memberA.name} 的「${chartA.dayMaster.keyword}」與 ${memberB.name} 的「${chartB.dayMaster.keyword}」形成鮮明配合。`,
  ];
  if (combinations.length > 0) {
    strengths.push(`命盤中擁有 ${combinations.length} 組干支相合，在關鍵時刻能形成利益與情感共同體。`);
  }

  const conflictTriggers: string[] = [];
  if (clashes.length > 0) {
    conflictTriggers.push(`生活細節或做事優先級容易不同步，尤其是直面壓力的當下。`);
  } else {
    conflictTriggers.push(`若雙方皆不願率先開口認錯，易演變成無聲冷戰。`);
  }

  const communicationTips: string[] = [
    `【對話原則】：溝通重要家務或決策時，先確認彼此情緒狀態，不要在疲累時談及敏感話題。`,
    `【分工建議】：發揮各自五行強項，一人負責大方向構思，另一人落實細部檢核。`,
  ];

  return {
    id: `rel-${memberA.id}-${memberB.id}`,
    memberA: {
      id: memberA.id,
      name: memberA.name,
      role: memberA.role,
      dayMasterStem: stemA,
      dayMasterElement: elA,
    },
    memberB: {
      id: memberB.id,
      name: memberB.name,
      role: memberB.role,
      dayMasterStem: stemB,
      dayMasterElement: elB,
    },
    dayMasterRelation: dayMasterRel,
    interactions: {
      combinations,
      clashes,
      punishments,
      harms,
      destructions,
    },
    complementarity: {
      harmonyScore,
      mutualNourishment: `彼此能量能夠相互調和，避免單一性格走極端。`,
      potentialDepletion: `當遇到共同匱乏的面向（如缺少${sharedDeficient.join('、') || '無特別缺乏'}），需要藉由外部生活習慣補足。`,
      sharedDeficientElements: sharedDeficient,
    },
    harmonyIndex: harmonyScore,
    modernGuide: {
      dynamicTitle,
      dynamicSubtitle: `基於五行能量與性格原型的雙向互動模型`,
      strengths,
      conflictTriggers,
      decisionBlindspots: [
        sharedDeficient.length > 0
          ? `雙方皆偏弱之五行領域可能成為家庭共同決策死角。`
          : `避免習慣以理服人而忽略了家庭關係中的情感需求。`,
      ],
      communicationTips,
      familyGrowthDirection: `將不同特質視為家庭多樣性的資產，而非彼此改變對方的負擔。`,
    },
  };
}
