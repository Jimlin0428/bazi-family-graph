/**
 * 家庭成員與關係圖譜型別定義 (Family Member & Graph Interfaces)
 * 整合 React Flow 畫布節點與家庭親屬架構
 */

import { BaziChart } from './bazi';

// 家庭角色列舉
export type FamilyRole =
  | 'self' // 自己
  | 'father' // 父親
  | 'mother' // 母親
  | 'spouse' // 配偶 / 伴侶
  | 'son' // 兒子
  | 'daughter' // 女兒
  | 'elder_brother' // 兄
  | 'younger_brother' // 弟
  | 'elder_sister' // 姊
  | 'younger_sister' // 妹
  | 'paternal_grandfather' // 祖父
  | 'paternal_grandmother' // 祖母
  | 'maternal_grandfather' // 外祖父
  | 'maternal_grandmother' // 外祖母
  | 'custom'; // 自定義親友

// 親屬連線血緣/法律關係
export type KinshipType =
  | 'spouses' // 伴侶/夫妻關係
  | 'parent-child' // 親子關係
  | 'siblings' // 兄弟姊妹
  | 'custom'; // 其他

// 家庭成員核心介面
export interface FamilyMember {
  id: string; // 唯一識別碼 (UUID)
  name: string; // 姓名或稱呼（例：「父親」、「小明」）
  role: FamilyRole;
  roleLabel: string; // 顯示標籤（例：「爸爸」、「長女」）
  gender: 'male' | 'female';
  birthDate: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    isHourKnown: boolean;
  };
  baziChart: BaziChart; // 關聯之八字命盤物件
  avatarUrl?: string; // 頭像 (選填)
  notes?: string; // 筆記/備註
  colorTheme?: string; // 自訂節點配色 (或依五行日主動態產生)
  // React Flow 圖譜畫布坐標與視覺設定
  nodeConfig?: {
    position: { x: number; y: number };
    isPinned?: boolean;
    tierLevel?: number; // 輩分世代階層 (0: 祖輩, 1: 父母輩, 2: 同輩/自己, 3: 子輩)
  };
}

// 家庭網絡關係連結定義 (對應 React Flow Edge)
export interface FamilyRelationEdge {
  id: string; // 關係邊 ID
  sourceId: string; // 來源成員 ID
  targetId: string; // 目標成員 ID
  kinship: KinshipType; // 親屬物理關係
  label?: string; // 關係文字標籤
  harmonyScore?: number; // 兩人八字合盤相處指數 (0 - 100)
  interactionTag?: string; // 快速標籤（例：「相生滋養」、「性格對沖」）
  animated?: boolean; // 動態粒子流向（如能量生入或生出）
}

// 整個家庭圖譜的持久化資料結構
export interface FamilyGraphData {
  id: string;
  title: string;
  description?: string;
  members: FamilyMember[];
  edges: FamilyRelationEdge[];
  updatedAt: string;
}
