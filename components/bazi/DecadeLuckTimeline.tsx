'use client';

import React, { useState, useMemo } from 'react';
import { BaziChart, DaYunItem } from '../../types/bazi';
import { ELEMENT_METADATA } from '../../lib/bazi/constants';
import { cn } from '../../lib/utils';
import {
  Calendar,
  Clock,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface DecadeLuckTimelineProps {
  chart: BaziChart;
  currentAge?: number;
  className?: string;
}

export const DecadeLuckTimeline: React.FC<DecadeLuckTimelineProps> = ({
  chart,
  currentAge,
  className,
}) => {
  const { daYunList, dayMaster, solarDate } = chart;

  // 計算推算目前年齡（若未指定，則按西曆年份換算）
  const estimatedAge = useMemo(() => {
    if (currentAge !== undefined) return currentAge;
    const currentYear = new Date().getFullYear();
    return Math.max(1, currentYear - solarDate.year);
  }, [currentAge, solarDate.year]);

  // 尋找目前年齡對應的大運索引（預設為符合年齡的步數或第 1 步）
  const initialIndex = useMemo(() => {
    const found = daYunList.find(
      (dy) => estimatedAge >= dy.startAge && estimatedAge <= dy.endAge
    );
    return found ? found.index : daYunList[0]?.index ?? 1;
  }, [daYunList, estimatedAge]);

  const [selectedIdx, setSelectedIdx] = useState<number>(initialIndex);

  // 當前選取的大運詳細物件
  const activeDaYun = useMemo(() => {
    return daYunList.find((dy) => dy.index === selectedIdx) || daYunList[0];
  }, [daYunList, selectedIdx]);

  if (!daYunList || daYunList.length === 0) {
    return null;
  }

  const activeStemMeta = ELEMENT_METADATA[activeDaYun.gan ? chart.pillars.year.ganWuXing : 'wood'];

  return (
    <div
      className={cn(
        'w-full rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-xl backdrop-blur-md transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/80',
        className
      )}
    >
      {/* 頂部標題與目前人生階段提示 */}
      <div className="mb-6 flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
            <Clock className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              大運十年起伏趨勢時間軸
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              每十年為一運勢轉折週期 · 目前約 {estimatedAge} 歲
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/60 bg-purple-50 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-purple-700 dark:border-purple-800/60 dark:bg-purple-950/40 dark:text-purple-300">
          <Sparkles className="h-4 w-4" />
          <span>點選任一週期查看運勢亮點</span>
        </div>
      </div>

      {/* 橫向滾動時間軸節點列表 */}
      <div className="relative mb-6">
        <div className="flex gap-3 overflow-x-auto pb-4 pt-1.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          {daYunList.map((dy) => {
            const isSelected = dy.index === selectedIdx;
            const isCurrentAge = estimatedAge >= dy.startAge && estimatedAge <= dy.endAge;

            return (
              <button
                key={dy.index}
                onClick={() => setSelectedIdx(dy.index)}
                className={cn(
                  'group relative flex min-w-[140px] flex-col rounded-xl border p-4 text-left transition-all duration-200 shrink-0 focus:outline-hidden cursor-pointer',
                  isSelected
                    ? 'border-purple-500/80 bg-purple-50/70 shadow-md ring-2 ring-purple-500/20 dark:border-purple-400 dark:bg-purple-950/30'
                    : 'border-slate-200/80 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700'
                )}
              >
                {/* 當前正在進行的大運標記 */}
                {isCurrentAge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 px-2.5 py-0.5 text-xs font-black text-white shadow-xs">
                    當前此運
                  </span>
                )}

                {/* 年齡區間 */}
                <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-bold">{dy.startAge} - {dy.endAge} 歲</span>
                  <span className="text-xs font-semibold">{dy.startYear}</span>
                </div>

                {/* 干支與十神 */}
                <div className="my-2.5 flex items-baseline justify-between">
                  <span
                    className={cn(
                      'text-2xl sm:text-3xl font-black tracking-wider',
                      isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-slate-800 dark:text-slate-100'
                    )}
                  >
                    {dy.ganZhi}
                  </span>
                  <span
                    className={cn(
                      'rounded-md px-2 py-0.5 text-xs font-bold',
                      isSelected
                        ? 'bg-purple-200/70 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200'
                        : 'bg-slate-200/60 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    )}
                  >
                    {dy.shiShen || '運干'}
                  </span>
                </div>

                {/* 關鍵字標籤 */}
                <div className="mt-auto text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 truncate">
                  {dy.focusKeywords[0]}
                </div>

                {/* 能量指數條 */}
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-300',
                      isSelected ? 'bg-purple-500' : 'bg-slate-400 dark:bg-slate-600'
                    )}
                    style={{ width: `${Math.min(100, dy.energyTrendScore)}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 點選觸發的大運亮點深度提示卡片 */}
      <div className="rounded-2xl border border-purple-200/70 bg-linear-to-br from-purple-50/50 via-white to-indigo-50/50 p-6 shadow-sm dark:border-purple-900/40 dark:from-purple-950/20 dark:via-slate-900 dark:to-indigo-950/20">
        <div className="flex flex-col justify-between gap-3 border-b border-purple-100/80 pb-4 sm:flex-row sm:items-center dark:border-purple-900/30">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600 text-lg font-black text-white shadow-md">
              {activeDaYun.index}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                  第 {activeDaYun.index} 步大運：{activeDaYun.ganZhi} 運（{activeDaYun.shiShen}主星）
                </h4>
                <span className="rounded-lg bg-purple-100 px-2.5 py-1 text-xs sm:text-sm font-bold text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                  {activeDaYun.startAge} ~ {activeDaYun.endAge} 歲（{activeDaYun.startYear} ~{' '}
                  {activeDaYun.endYear}）
                </span>
              </div>
              <p className="mt-0.5 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                干支五行：{activeDaYun.wuXing} · 與日主 {dayMaster.stem}
                {dayMaster.elementZh} 之能量互動
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-purple-700 dark:text-purple-300">
            <TrendingUp className="h-5 w-5" />
            <span>能量動能指數：{activeDaYun.energyTrendScore} / 100</span>
          </div>
        </div>

        {/* 運勢亮點與生活焦點導向 */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col rounded-xl bg-white/80 p-4 shadow-xs dark:bg-slate-800/70">
            <span className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-800 dark:text-slate-200">
              <Sparkles className="h-4 w-4 text-purple-500" />
              十年間核心主題
            </span>
            <p className="mt-2 text-sm sm:text-base leading-relaxed font-medium text-slate-600 dark:text-slate-300">
              受「{activeDaYun.shiShen}」星引導，此階段生活主軸圍繞在
              <strong className="text-purple-700 dark:text-purple-300"> {activeDaYun.focusKeywords.join('、')}</strong>。
            </p>
          </div>

          <div className="flex flex-col rounded-xl bg-white/80 p-4 shadow-xs dark:bg-slate-800/70">
            <span className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-800 dark:text-slate-200">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              現代決策優勢期
            </span>
            <p className="mt-2 text-sm sm:text-base leading-relaxed font-medium text-slate-600 dark:text-slate-300">
              適合主動擴展視野、善用此十年的外在資源與人脈結構，在專業或事業領域取得關鍵突破。
            </p>
          </div>

          <div className="flex flex-col rounded-xl bg-white/80 p-4 shadow-xs dark:bg-slate-800/70">
            <span className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-800 dark:text-slate-200">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              相處與心態建議
            </span>
            <p className="mt-2 text-sm sm:text-base leading-relaxed font-medium text-slate-600 dark:text-slate-300">
              維持個人原則同時保持情緒靈活彈性，避免單一盲點固著，並定期檢視生活作息與身心平衡。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
