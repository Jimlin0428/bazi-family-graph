'use client';

import React from 'react';
import { RelationshipAnalysis } from '../../types/relationship';
import { FamilyMember } from '../../types/family';
import { ELEMENT_METADATA } from '../../lib/bazi/constants';
import { cn } from '../../lib/utils';
import {
  X,
  Sparkles,
  HeartHandshake,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface InterpersonalModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: RelationshipAnalysis | null;
  memberA?: FamilyMember;
  memberB?: FamilyMember;
}

export const InterpersonalModal: React.FC<InterpersonalModalProps> = ({
  isOpen,
  onClose,
  analysis,
  memberA,
  memberB,
}) => {
  if (!isOpen || !analysis) return null;

  const { memberA: ma, memberB: mb, dayMasterRelation, interactions, complementarity, harmonyIndex, modernGuide } = analysis;

  const metaA = ELEMENT_METADATA[ma.dayMasterElement];
  const metaB = ELEMENT_METADATA[mb.dayMasterElement];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* 磨砂半透明背景遮罩 */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      {/* 滑出/彈出主卡片視窗 */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-slate-200/90 bg-white/95 shadow-2xl backdrop-blur-md overflow-hidden dark:border-slate-800 dark:bg-slate-900/95">
        {/* 頂部 Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4.5 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <HeartHandshake className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                家庭雙人合盤診斷
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                {ma.name} 與 {mb.name} 之五行生剋與相處指南
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 內容滾動區塊 */}
        <div className="space-y-6 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          {/* 1. 雙方身分與綜合和諧指數看板 */}
          <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-slate-200/80 bg-linear-to-r from-slate-50 via-white to-slate-50 p-5 sm:flex-row dark:border-slate-800 dark:from-slate-900 dark:via-slate-800/60 dark:to-slate-900">
            {/* 成員 A */}
            <div className="flex items-center gap-3.5">
              <div
                className={cn(
                  'flex h-14 w-14 flex-col items-center justify-center rounded-2xl border-2 font-black shadow-sm',
                  metaA.colorToken.twBorder,
                  metaA.colorToken.twBg
                )}
              >
                <span className={cn('text-2xl leading-none font-black', metaA.colorToken.twText)}>
                  {ma.dayMasterStem}
                </span>
                <span className="text-[10px] font-black text-slate-600 dark:text-slate-400">{metaA.nameZh}</span>
              </div>
              <div>
                <span className="text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400">{ma.role}</span>
                <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                  {ma.name}
                </h4>
              </div>
            </div>

            {/* 中間和諧度儀表 */}
            <div className="flex flex-col items-center px-4 py-1 text-center">
              <div className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">八字綜合和諧度</div>
              <div className="my-0.5 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400">
                  {harmonyIndex}
                </span>
                <span className="text-sm font-bold text-slate-400">/ 100</span>
              </div>
              <span className="rounded-full bg-indigo-500/10 px-3 py-0.5 text-xs font-black text-indigo-700 dark:text-indigo-300">
                {harmonyIndex >= 75 ? '高和諧契合' : harmonyIndex >= 60 ? '互補磨合期' : '需多包容理解'}
              </span>
            </div>

            {/* 成員 B */}
            <div className="flex items-center gap-3.5">
              <div className="text-right">
                <span className="text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400">{mb.role}</span>
                <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                  {mb.name}
                </h4>
              </div>
              <div
                className={cn(
                  'flex h-14 w-14 flex-col items-center justify-center rounded-2xl border-2 font-black shadow-sm',
                  metaB.colorToken.twBorder,
                  metaB.colorToken.twBg
                )}
              >
                <span className={cn('text-2xl leading-none font-black', metaB.colorToken.twText)}>
                  {mb.dayMasterStem}
                </span>
                <span className="text-[10px] font-black text-slate-600 dark:text-slate-400">{metaB.nameZh}</span>
              </div>
            </div>
          </div>

          {/* 互動風格標題條 */}
          <div className="rounded-2xl border border-indigo-200/70 bg-indigo-50/60 p-5 text-center dark:border-indigo-900/50 dark:bg-indigo-950/30">
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              【現代互動風格】
            </span>
            <div className="mt-1.5 text-lg sm:text-xl font-black text-indigo-950 dark:text-indigo-100">
              {modernGuide.dynamicTitle}
            </div>
            <p className="mt-1 text-sm sm:text-base font-medium text-indigo-800/80 dark:text-indigo-200/80">
              {modernGuide.dynamicSubtitle}
            </p>
          </div>

          {/* 2. 日元生剋關係 */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center gap-2.5 text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <span>日元五行能量流動</span>
              <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs sm:text-sm font-black text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
                {dayMasterRelation.label}
              </span>
            </div>
            <p className="mt-2.5 text-sm sm:text-base leading-relaxed font-medium text-slate-600 dark:text-slate-300">
              {dayMasterRelation.description}
            </p>
          </div>

          {/* 3. 干支合沖刑害明細 */}
          <div className="space-y-3">
            <h5 className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
              <Zap className="h-4 w-4 text-amber-500" />
              干支具體交互作用（合沖刑害）
            </h5>

            {interactions.combinations.length === 0 && interactions.clashes.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                雙方原局干支無直接相合或相沖，相處以平穩中和為主。
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* 合 */}
                {interactions.combinations.map((comb, cIdx) => (
                  <div
                    key={`comb-${cIdx}`}
                    className="flex flex-col rounded-xl border border-emerald-300 bg-emerald-50/60 p-4 dark:border-emerald-800 dark:bg-emerald-950/30"
                  >
                    <div className="flex items-center justify-between text-sm sm:text-base font-black text-emerald-800 dark:text-emerald-300">
                      <span>{comb.name}</span>
                      <span className="rounded-md bg-emerald-200/80 px-2 py-0.5 text-xs font-bold dark:bg-emerald-900">
                        合局 ★
                      </span>
                    </div>
                    <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-emerald-900/90 dark:text-emerald-200/90">
                      {comb.modernInterpretation}
                    </p>
                  </div>
                ))}

                {/* 沖 */}
                {interactions.clashes.map((clash, cIdx) => (
                  <div
                    key={`clash-${cIdx}`}
                    className="flex flex-col rounded-xl border border-rose-300 bg-rose-50/60 p-4 dark:border-rose-800 dark:bg-rose-950/30"
                  >
                    <div className="flex items-center justify-between text-sm sm:text-base font-black text-rose-800 dark:text-rose-300">
                      <span>{clash.name}</span>
                      <span className="rounded-md bg-rose-200/80 px-2 py-0.5 text-xs font-bold dark:bg-rose-900">
                        對沖 ⚡
                      </span>
                    </div>
                    <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-rose-900/90 dark:text-rose-200/90">
                      {clash.modernInterpretation}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. 白話相處優勢與潛在摩擦 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* 相處優勢 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="flex items-center gap-2 text-sm sm:text-base font-black text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
                核心相處優勢
              </span>
              <ul className="mt-3 space-y-2 text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">
                {modernGuide.strengths.map((str, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 潛在摩擦導火線 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="flex items-center gap-2 text-sm sm:text-base font-black text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-5 w-5" />
                潛在溝通摩擦導火線
              </span>
              <ul className="mt-3 space-y-2 text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">
                {modernGuide.conflictTriggers.map((con, cIdx) => (
                  <li key={cIdx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 5. 具體白話溝通與分工心法 */}
          <div className="rounded-2xl border border-indigo-200/70 bg-indigo-50/40 p-5 dark:border-indigo-900/40 dark:bg-indigo-950/20">
            <span className="flex items-center gap-2 text-sm sm:text-base font-black text-indigo-800 dark:text-indigo-200">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              家庭白話溝通與修煉指南
            </span>
            <div className="mt-3 space-y-2.5">
              {modernGuide.communicationTips.map((tip, tIdx) => (
                <div
                  key={tIdx}
                  className="rounded-xl bg-white/90 p-3.5 text-sm sm:text-base font-medium leading-relaxed text-slate-800 shadow-2xs dark:bg-slate-900/90 dark:text-slate-200"
                >
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部關閉按鈕 */}
        <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-4 text-right dark:border-slate-800 dark:bg-slate-800/40">
          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm sm:text-base font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-95 cursor-pointer"
          >
            完成檢閱
          </button>
        </div>
      </div>
    </div>
  );
};
