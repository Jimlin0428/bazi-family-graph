'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { FamilyMember } from '../../types/family';
import { ELEMENT_METADATA } from '../../lib/bazi/constants';
import { cn } from '../../lib/utils';
import { Sparkles, User, Shield, Pencil } from 'lucide-react';

export interface FamilyMemberNodeData {
  member: FamilyMember;
  isSelected?: boolean;
  isPairSelected?: boolean;
  onSelect?: (memberId: string) => void;
  onEdit?: (member: FamilyMember) => void;
}

export const FamilyMemberNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as FamilyMemberNodeData;
  const { member, isSelected, isPairSelected, onSelect, onEdit } = nodeData;


  const chart = member.baziChart;
  const dm = chart.dayMaster;
  const dmMeta = ELEMENT_METADATA[dm.element];

  // 根據日主五行設定色彩風格
  const elementStyles: Record<
    string,
    { border: string; glow: string; badgeBg: string; text: string; bgSoft: string }
  > = {
    metal: {
      border: 'border-slate-400 dark:border-slate-300',
      glow: 'shadow-slate-400/30',
      badgeBg: 'bg-slate-500/10 dark:bg-slate-400/20',
      text: 'text-slate-700 dark:text-slate-200',
      bgSoft: 'from-slate-50 to-white dark:from-slate-900 dark:to-slate-950',
    },
    wood: {
      border: 'border-emerald-500 dark:border-emerald-400',
      glow: 'shadow-emerald-500/30',
      badgeBg: 'bg-emerald-500/10 dark:bg-emerald-400/20',
      text: 'text-emerald-700 dark:text-emerald-300',
      bgSoft: 'from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-950',
    },
    water: {
      border: 'border-sky-500 dark:border-sky-400',
      glow: 'shadow-sky-500/30',
      badgeBg: 'bg-sky-500/10 dark:bg-sky-400/20',
      text: 'text-sky-700 dark:text-sky-300',
      bgSoft: 'from-sky-50/50 to-white dark:from-sky-950/20 dark:to-slate-950',
    },
    fire: {
      border: 'border-rose-500 dark:border-rose-400',
      glow: 'shadow-rose-500/30',
      badgeBg: 'bg-rose-500/10 dark:bg-rose-400/20',
      text: 'text-rose-700 dark:text-rose-300',
      bgSoft: 'from-rose-50/50 to-white dark:from-rose-950/20 dark:to-slate-950',
    },
    earth: {
      border: 'border-amber-500 dark:border-amber-400',
      glow: 'shadow-amber-500/30',
      badgeBg: 'bg-amber-500/10 dark:bg-amber-400/20',
      text: 'text-amber-700 dark:text-amber-300',
      bgSoft: 'from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-950',
    },
  };

  const style = elementStyles[dm.element] || elementStyles.wood;
  const isHighlighted = selected || isSelected || isPairSelected;

  return (
    <div
      onClick={() => onSelect?.(member.id)}
      className={cn(
        'relative min-w-[260px] cursor-pointer rounded-2xl border-2 bg-linear-to-b p-4.5 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-102 hover:shadow-xl',
        style.border,
        style.bgSoft,
        isHighlighted &&
          `ring-4 ring-indigo-500/30 ${style.glow} scale-102 shadow-2xl`
      )}
    >
      {/* 4 個方向的 Handle，供連線靈活附著 */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!h-3 !w-3 !border-2 !border-white !bg-slate-400 dark:!border-slate-900"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!h-3 !w-3 !border-2 !border-white !bg-slate-400 dark:!border-slate-900"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!h-3 !w-3 !border-2 !border-white !bg-slate-400 dark:!border-slate-900"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!h-3 !w-3 !border-2 !border-white !bg-slate-400 dark:!border-slate-900"
      />

      {/* 頂部稱謂與性別標記 */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5 dark:border-slate-800">
        <span className="flex items-center gap-1.5 text-sm font-extrabold text-slate-800 dark:text-slate-200">
          <User className="h-4 w-4 text-slate-400" />
          {member.roleLabel || member.role}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(member);
            }}
            title="編輯此成員稱謂與出生年月日時"
            className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/70 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wider',
              style.badgeBg,
              style.text
            )}
          >
            {dm.yinYang === 'yang' ? '陽' : '陰'}
            {dm.elementZh}
          </span>
        </div>
      </div>

      {/* 成員姓名與日主核心 */}
      <div className="my-3 flex items-center justify-between">
        <div>
          <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">
            {member.name}
          </h4>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[150px] block mt-0.5">
            {chart.dayMaster.keyword}
          </span>
        </div>

        {/* 日主干支大徽章 */}
        <div
          className={cn(
            'flex h-13 w-13 flex-col items-center justify-center rounded-2xl border-2 font-black shadow-xs',
            style.border,
            style.badgeBg
          )}
        >
          <span className={cn('text-2xl leading-none font-black', style.text)}>
            {dm.stem}
          </span>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-0.5">
            {dm.elementZh}
          </span>
        </div>
      </div>

      {/* 四柱縮微排盤 (年 月 日 時) */}
      <div className="grid grid-cols-4 gap-1.5 rounded-xl bg-white/80 p-2 text-center dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800">
        <div>
          <div className="text-[11px] font-semibold text-slate-400">年</div>
          <div className="text-sm font-black text-slate-800 dark:text-slate-100">
            {chart.pillars.year.gan}
            {chart.pillars.year.zhi}
          </div>
        </div>
        <div>
          <div className="text-[11px] font-semibold text-slate-400">月</div>
          <div className="text-sm font-black text-slate-800 dark:text-slate-100">
            {chart.pillars.month.gan}
            {chart.pillars.month.zhi}
          </div>
        </div>
        <div className="rounded-lg bg-indigo-50/90 p-0.5 font-bold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
          <div className="text-[11px] font-bold text-indigo-500">日★</div>
          <div className="text-sm font-black">
            {chart.pillars.day.gan}
            {chart.pillars.day.zhi}
          </div>
        </div>
        <div>
          <div className="text-[11px] font-semibold text-slate-400">時</div>
          <div className="text-sm font-black text-slate-800 dark:text-slate-100">
            {chart.pillars.hour.gan}
            {chart.pillars.hour.zhi}
          </div>
        </div>
      </div>

      {/* 底部日主白話原型 */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-200/50 pt-2.5 text-xs dark:border-slate-800/80">
        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 truncate font-medium">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-500" />
          <span className="truncate">{dm.archetypeTitle.split('·')[0]}</span>
        </span>
        <span className="font-extrabold text-slate-700 dark:text-slate-300 shrink-0">
          {chart.fiveElements.distribution[chart.fiveElements.dominant].nameZh}旺
        </span>
      </div>

      {/* 被選取為比對時的標記 */}
      {isHighlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-bold text-white shadow-md">
          已選取
        </div>
      )}
    </div>
  );

};
