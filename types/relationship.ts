/**
 * 關係診斷與合盤型別定義 (Relationship Analysis Interfaces)
 * 涵蓋傳統相生相剋、合沖刑害與現代心理白話相處指南
 */

import { FiveElement, HeavenlyStem, EarthlyBranch } from './bazi';

// 日元生剋關係類型
export type DayMasterRelationType =
  | 'same' // 同我（比和 / 伙伴同行）
  | 'generates' // 我生（付出、滋養對方）
  | 'generated_by' // 生我（受庇蔭、被對方包容）
  | 'controls' // 我剋（主導、影響、管束對方）
  | 'controlled_by'; // 剋我（感受約束、受對方指導）

// 干支交互作用項目
export interface InteractionDetail {
  type: 'stem_he' | 'branch_liuhe' | 'branch_sanhe' | 'branch_chong' | 'branch_xing' | 'branch_hai' | 'branch_po';
  category: 'combination' | 'clash' | 'punishment' | 'harm' | 'destruction';
  name: string; // 例：「甲己合土」、「子午相沖」、「寅巳申相刑」
  involvedPillars: {
    memberAPillar: string; // 例：「A 日支」
    memberBPillar: string; // 例：「B 月支」
  };
  traditionalMeaning: string; // 傳統釋義
  modernInterpretation: string; // 現代心理白話轉譯
}

// 兩人五行互補分析
export interface ElementsComplementarity {
  harmonyScore: number; // 互補指數 (0 - 100)
  mutualNourishment: string; // 互利滋養面向描述
  potentialDepletion: string; // 能量過度耗損面向描述
  sharedDeficientElements: FiveElement[]; // 兩人共同缺乏的五行（家庭決策死角）
}

// 現代白話互動與溝通相處指南
export interface ModernRelationshipGuide {
  dynamicTitle: string; // 關係互動風格標籤（例：「互信神隊友：理性決策與熱情開拓」）
  dynamicSubtitle: string; // 一句話關係本質概括
  strengths: string[]; // 核心相處優勢（如合拍點、靈感共鳴）
  conflictTriggers: string[]; // 潛在摩擦導火線（如各執己見、節奏不同步）
  decisionBlindspots: string[]; // 共同生活/決策時的盲點
  communicationTips: string[]; // 現代職場/家庭白話溝通心法
  familyGrowthDirection: string; // 家庭關係共同修煉方針
}

// 核心關係分析結構
export interface RelationshipAnalysis {
  id: string;
  memberA: {
    id: string;
    name: string;
    role: string;
    dayMasterStem: HeavenlyStem;
    dayMasterElement: FiveElement;
  };
  memberB: {
    id: string;
    name: string;
    role: string;
    dayMasterStem: HeavenlyStem;
    dayMasterElement: FiveElement;
  };
  dayMasterRelation: {
    type: DayMasterRelationType;
    label: string; // 例：「木生火：源源不絕的思維燃料」
    description: string;
  };
  interactions: {
    combinations: InteractionDetail[]; // 合（天干合、六合、三合）
    clashes: InteractionDetail[]; // 沖（六沖）
    punishments: InteractionDetail[]; // 刑（相刑）
    harms: InteractionDetail[]; // 害（相害）
    destructions: InteractionDetail[]; // 破（相破）
  };
  complementarity: ElementsComplementarity;
  harmonyIndex: number; // 綜合相合和諧度百分比 (0 - 100)
  modernGuide: ModernRelationshipGuide;
}
