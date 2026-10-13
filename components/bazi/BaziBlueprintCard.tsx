'use client';

import React from 'react';
import { BaziChart, Pillar } from '../../types/bazi';
import { ELEMENT_METADATA } from '../../lib/bazi/constants';
import { cn } from '../../lib/utils';
import { Sparkles, Compass, ShieldAlert, Award } from 'lucide-react';

interface BaziBlueprintCardProps {
  chart: BaziChart;
  className?: string;
  userName?: string;
}

export const BaziBlueprintCard: React.FC<BaziBlueprintCardProps> = ({
  chart,
  className,
  userName = '命主',
}) => {
  const { pillars, dayMaster, solarDate, lunarDateStr } = chart;
  const pillarList: Pillar[] = [pillars.year, pillars.month, pillars.day, pillars.hour];

  const dmMeta = ELEMENT_METADATA[dayMaster.element];

  return (
    <div
      className={cn(
        'w-full rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-xl backdrop-blur-md transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/80',
        className
      )}
    >
      {/* 頂部標題與命主日元核心橫幅 */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <Compass className="h-4.5 w-4.5" />
            </span>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              {userName} · 四柱八字命運藍圖
            </h2>
          </div>
          <p className="mt-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
            西曆：{solarDate.year}年{solarDate.month}月{solarDate.day}日 {solarDate.hour.toString().padStart(2, '0')}:
            {solarDate.minute.toString().padStart(2, '0')} · 農曆：{lunarDateStr}
          </p>
        </div>

        {/* 日主主星徽章 */}
        <div
          className={cn(
            'inline-flex items-center gap-3 rounded-2xl border px-4 py-2.5 text-sm font-medium shadow-sm',
            dmMeta.colorToken.twBorder,
            dmMeta.colorToken.twBg
          )}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white font-bold shadow-xs dark:bg-slate-950">
            <Sparkles className={cn('h-4 w-4', dmMeta.colorToken.twText)} />
          </span>
          <div className="flex flex-col">
            <span className={cn('text-xs font-extrabold', dmMeta.colorToken.twText)}>
              日主元神 · {dayMaster.stem}
              {dayMaster.elementZh}（{dayMaster.yinYang === 'yang' ? '陽' : '陰'}
              {dayMaster.elementZh}）
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-slate-100">
              {dayMaster.archetypeTitle}
            </span>
          </div>
        </div>
      </div>

      {/* 四柱年月日時現代卡片矩陣 */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 md:gap-5">
        {pillarList.map((pillar) => {
          const isDay = pillar.type === 'day';
          const stemMeta = ELEMENT_METADATA[pillar.ganWuXing];
          const branchMeta = ELEMENT_METADATA[pillar.zhiWuXing];

          return (
            <div
              key={pillar.type}
              className={cn(
                'relative flex flex-col rounded-2xl border p-4.5 transition-all duration-200',
                isDay
                  ? 'border-indigo-500/70 bg-linear-to-b from-indigo-500/10 to-purple-500/10 shadow-lg shadow-indigo-500/10 dark:border-indigo-400/80 dark:from-indigo-950/30'
                  : 'border-slate-200/90 bg-slate-50/70 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700'
              )}
            >
              {/* 日柱高亮標記標籤 */}
              {isDay && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 px-3 py-0.5 text-xs font-bold text-white shadow-md">
                  日元主星 ★
                </div>
              )}

              {/* 柱位標題與十神 */}
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5 text-sm dark:border-slate-700/60">
                <span className="font-extrabold text-slate-600 dark:text-slate-300">
                  {pillar.titleZh}
                </span>
                <span
                  className={cn(
                    'rounded-lg px-2 py-0.5 text-xs font-bold',
                    isDay
                      ? 'bg-indigo-500/15 text-indigo-700 dark:bg-indigo-400/25 dark:text-indigo-200'
                      : 'bg-slate-200/80 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                  )}
                >
                  {pillar.shiShenGan}
                </span>
              </div>

              {/* 天干 */}
              <div className="my-3 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">天干</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span
                    className={cn(
                      'text-4xl font-black tracking-wider',
                      stemMeta.colorToken.twText
                    )}
                  >
                    {pillar.gan}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {stemMeta.nameZh}
                  </span>
                </div>
              </div>

              {/* 地支 */}
              <div className="mb-3 flex flex-col items-center justify-center border-t border-dashed border-slate-200/80 pt-3 dark:border-slate-700/80">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">地支</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span
                    className={cn(
                      'text-4xl font-black tracking-wider',
                      branchMeta.colorToken.twText
                    )}
                  >
                    {pillar.zhi}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {branchMeta.nameZh}
                  </span>
                </div>
              </div>

              {/* 地支藏干清單與權重 */}
              <div className="mt-auto rounded-xl bg-white/80 p-2.5 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800">
                <div className="mb-1.5 text-xs font-bold text-slate-400 dark:text-slate-400">
                  地支藏干
                </div>
                <div className="space-y-1.5">
                  {pillar.hiddenStems.map((hide, hIdx) => {
                    const hideMeta = ELEMENT_METADATA[hide.element];
                    return (
                      <div
                        key={hIdx}
                        className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-medium"
                      >
                        <span className="flex items-center gap-1.5 font-bold">
                          <span className={cn('text-sm font-black', hideMeta.colorToken.twText)}>
                            {hide.stem}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            ({hide.shiShen})
                          </span>
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {hide.role === 'primary' ? '本氣' : hide.role === 'secondary' ? '中氣' : '餘氣'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 納音與十二長生 */}
              <div className="mt-3 flex items-center justify-between border-t border-slate-200/50 pt-2.5 text-xs text-slate-600 dark:border-slate-700/50 dark:text-slate-300 font-semibold">
                <span className="truncate" title={`納音：${pillar.naYin}`}>
                  {pillar.naYin}
                </span>
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-bold dark:bg-slate-800">
                  {pillar.diShi}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部白話人格特質與盲點速覽 */}
      <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5 sm:grid-cols-2 dark:border-slate-800 dark:bg-slate-800/40">
        <div className="flex items-start gap-3">
          <Award className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
          <div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              核心天賦優勢（{dayMaster.keyword}）
            </div>
            <p className="mt-1.5 text-sm leading-relaxed font-medium text-slate-600 dark:text-slate-300">
              {dayMaster.coreStrengths.join(' · ')}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              決策盲點與壓力防護
            </div>
            <p className="mt-1.5 text-sm leading-relaxed font-medium text-slate-600 dark:text-slate-300">
              {dayMaster.decisionBlindspots.join(' · ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
