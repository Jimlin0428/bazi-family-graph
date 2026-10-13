'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { BaziChart, MonthlyFortuneItem } from '../../types/bazi';
import { calculateAnnualMonthlyFortune } from '../../lib/bazi/monthlyFortune';
import { ELEMENT_METADATA } from '../../lib/bazi/constants';
import { cn } from '../../lib/utils';
import {
  CalendarDays,
  Sparkles,
  TrendingUp,
  Compass,
  Briefcase,
  HeartHandshake,
  ShieldAlert,
  ChevronRight,
  Sun,
  Flame,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface MonthlyFortuneTimelineProps {
  chart: BaziChart;
  initialYear?: number;
  className?: string;
}

const AVAILABLE_YEARS = [2024, 2025, 2026, 2027, 2028];

export const MonthlyFortuneTimeline: React.FC<MonthlyFortuneTimelineProps> = ({
  chart,
  initialYear,
  className,
}) => {
  const currentActualYear = new Date().getFullYear();
  const currentActualMonth = new Date().getMonth() + 1; // 1-12

  const [selectedYear, setSelectedYear] = useState<number>(
    initialYear || currentActualYear
  );

  // 計算該年份 12 個月份流月運勢
  const annualFortune = useMemo(() => {
    return calculateAnnualMonthlyFortune(chart, selectedYear);
  }, [chart, selectedYear]);

  // 預設選中當月（若為當年度）或第 1 個月
  const defaultMonthIndex = useMemo(() => {
    if (selectedYear === currentActualYear) {
      return currentActualMonth;
    }
    return 1;
  }, [selectedYear, currentActualYear, currentActualMonth]);

  const [selectedMonth, setSelectedMonth] = useState<number>(defaultMonthIndex);

  // 當前選取的流月物件
  const activeMonthItem = useMemo<MonthlyFortuneItem>(() => {
    return (
      annualFortune.months.find((m) => m.month === selectedMonth) ||
      annualFortune.months[0]
    );
  }, [annualFortune.months, selectedMonth]);

  // Recharts 曲線資料結構
  const chartData = useMemo(() => {
    return annualFortune.months.map((m) => ({
      month: `${m.month}月`,
      monthNum: m.month,
      ganZhi: m.ganZhi,
      score: m.energyScore,
      shiShen: m.shiShen,
      solarTerm: m.solarTermRange,
      keywords: m.focusKeywords.join(' · '),
      isCurrent: m.isCurrentMonth,
      theme: m.analysis.theme,
    }));
  }, [annualFortune.months]);

  const activeStemMeta = ELEMENT_METADATA[activeMonthItem.stemElement];
  const activeBranchMeta = ELEMENT_METADATA[activeMonthItem.branchElement];

  return (
    <div
      className={cn(
        'w-full rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-xl backdrop-blur-md transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/90',
        className
      )}
    >
      {/* 頂部標題與年份切換選單 */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-600 to-sky-600 text-white shadow-md shadow-indigo-500/20">
            <CalendarDays className="h-5 w-5" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                當年度每月份流月運勢起伏
              </h3>
              <span className="rounded-lg bg-indigo-100 px-2.5 py-0.5 text-xs sm:text-sm font-black text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                {selectedYear} {annualFortune.ganZhi}年 · {annualFortune.annualShiShen}主導
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              結合節氣交替、原局喜用神引力與十神生剋 · 探索 12 個月最佳決策節奏
            </p>
          </div>
        </div>

        {/* 年份快捷切換按鈕組 */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-slate-100/70 p-1.5 dark:border-slate-800 dark:bg-slate-800/60">
          {AVAILABLE_YEARS.map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => {
                setSelectedYear(yr);
                setSelectedMonth(yr === currentActualYear ? currentActualMonth : 1);
              }}
              className={cn(
                'rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold transition-all cursor-pointer',
                selectedYear === yr
                  ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400 scale-105'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              )}
            >
              {yr}年
            </button>
          ))}
        </div>
      </div>

      {/* 年度總綱概況卡片 */}
      <div className="mt-5 rounded-2xl border border-indigo-200/70 bg-linear-to-r from-indigo-50/70 via-purple-50/40 to-slate-50/60 p-4.5 sm:flex sm:items-center sm:justify-between dark:border-indigo-950 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-slate-900">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Compass className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black text-indigo-950 dark:text-indigo-200">
                【{selectedYear} 流年總綱】
              </span>
              <span className="rounded-md bg-indigo-200/70 px-2 py-0.5 text-xs font-bold text-indigo-900 dark:bg-indigo-900/80 dark:text-indigo-200">
                年度均分：{annualFortune.annualEnergyScore} / 100
              </span>
            </div>
            <p className="mt-0.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
              {annualFortune.annualTheme}
            </p>
          </div>
        </div>

        {selectedYear === currentActualYear && (
          <button
            type="button"
            onClick={() => setSelectedMonth(currentActualMonth)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-1.5 text-xs sm:text-sm font-bold text-indigo-600 shadow-xs transition-all hover:bg-indigo-50 sm:mt-0 dark:bg-slate-800 dark:text-indigo-300 dark:hover:bg-slate-750 cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>定位當前本月 ({currentActualMonth}月)</span>
          </button>
        )}
      </div>

      {/* 1. 12 個月能量起伏曲線圖 (Recharts AreaChart) */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-800 dark:text-slate-200">
            <TrendingUp className="h-4 w-4 text-indigo-500" />
            <span>12 個月運勢能量起伏曲線</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-400">
            點選折線點或下方卡片切換月份
          </span>
        </div>

        <div className="h-56 w-full rounded-2xl border border-slate-100 bg-slate-50/50 p-2 sm:p-4 dark:border-slate-800/80 dark:bg-slate-900/50">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload.length > 0) {
                  const mNum = e.activePayload[0].payload?.monthNum;
                  if (mNum) setSelectedMonth(mNum);
                }
              }}
              margin={{ top: 12, right: 12, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="monthEnergyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94A3B8" opacity={0.15} />
              <XAxis
                dataKey="month"
                stroke="#64748B"
                fontSize={12}
                fontWeight={600}
                tickLine={false}
              />
              <YAxis
                domain={[30, 100]}
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                            {data.month} ({data.ganZhi} · {data.shiShen})
                          </span>
                          {data.isCurrent && (
                            <span className="rounded-md bg-emerald-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                              本月
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-baseline gap-1.5 text-xs">
                          <span className="font-semibold text-slate-500">動能評分：</span>
                          <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                            {data.score} 分
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">{data.solarTerm}</div>
                        <div className="mt-1 text-xs font-semibold text-indigo-600/90 dark:text-indigo-300/90">
                          {data.keywords}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#6366F1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#monthEnergyGrad)"
                activeDot={{
                  r: 7,
                  stroke: '#4F46E5',
                  strokeWidth: 2,
                  fill: '#FFFFFF',
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. 12 個月份橫向橫向節點列表 */}
      <div className="mt-6">
        <div className="flex gap-2.5 overflow-x-auto pb-4 pt-1.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          {annualFortune.months.map((mItem) => {
            const isSelected = mItem.month === selectedMonth;
            const isCurrent = mItem.isCurrentMonth;

            return (
              <button
                key={mItem.month}
                type="button"
                onClick={() => setSelectedMonth(mItem.month)}
                className={cn(
                  'group relative flex min-w-[136px] flex-col rounded-2xl border p-3.5 text-left transition-all duration-200 shrink-0 focus:outline-hidden cursor-pointer',
                  isSelected
                    ? 'border-indigo-500/80 bg-indigo-50/70 shadow-md ring-2 ring-indigo-500/20 dark:border-indigo-400 dark:bg-indigo-950/40'
                    : 'border-slate-200/80 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700'
                )}
              >
                {/* 當前本月標籤 */}
                {isCurrent && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 px-2 py-0.5 text-[11px] font-black text-white shadow-xs">
                    本月
                  </span>
                )}

                {/* 月份與節氣 */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                    {mItem.month}月
                  </span>
                  <span className="text-[11px] font-semibold">{mItem.solarTermRange.split(' ')[0]}</span>
                </div>

                {/* 干支與十神 */}
                <div className="my-2 flex items-baseline justify-between">
                  <span
                    className={cn(
                      'text-2xl font-black tracking-wider',
                      isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-100'
                    )}
                  >
                    {mItem.ganZhi}
                  </span>
                  <span
                    className={cn(
                      'rounded-md px-1.5 py-0.5 text-xs font-bold',
                      isSelected
                        ? 'bg-indigo-200/70 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200'
                        : 'bg-slate-200/60 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    )}
                  >
                    {mItem.shiShen}
                  </span>
                </div>

                {/* 能量動能條 */}
                <div className="mt-auto">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <span>動能</span>
                    <span
                      className={cn(
                        mItem.energyScore >= 80
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : mItem.energyScore >= 70
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-amber-600 dark:text-amber-400'
                      )}
                    >
                      {mItem.energyScore}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-300',
                        mItem.energyScore >= 80
                          ? 'bg-emerald-500'
                          : mItem.energyScore >= 70
                          ? 'bg-indigo-500'
                          : 'bg-amber-500'
                      )}
                      style={{ width: `${Math.min(100, mItem.energyScore)}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 點選選中之單月份深度解析看板 */}
      <div className="mt-6 rounded-3xl border border-indigo-200/80 bg-linear-to-br from-indigo-50/50 via-white to-purple-50/50 p-6 shadow-sm dark:border-indigo-900/50 dark:from-indigo-950/20 dark:via-slate-900 dark:to-purple-950/20">
        {/* 月度看板頭部 */}
        <div className="flex flex-col justify-between gap-4 border-b border-indigo-100/80 pb-5 sm:flex-row sm:items-center dark:border-indigo-900/40">
          <div className="flex items-center gap-3.5">
            <div
              className={cn(
                'flex h-14 w-14 flex-col items-center justify-center rounded-2xl border-2 font-black shadow-sm',
                activeStemMeta.colorToken.twBorder,
                activeStemMeta.colorToken.twBg
              )}
            >
              <span className={cn('text-2xl leading-none font-black', activeStemMeta.colorToken.twText)}>
                {activeMonthItem.gan}
              </span>
              <span className="text-[10px] font-black text-slate-600 dark:text-slate-400">
                {activeMonthItem.zhi}
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {selectedYear} 年 {activeMonthItem.month} 月 · {activeMonthItem.ganZhi}月
                </h4>
                <span className="rounded-md bg-indigo-100 px-2.5 py-0.5 text-xs sm:text-sm font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                  主星「{activeMonthItem.shiShen}」
                </span>
                {activeMonthItem.isCurrentMonth && (
                  <span className="rounded-md bg-emerald-500 px-2.5 py-0.5 text-xs font-black text-white shadow-xs">
                    📍 當前本月
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                節氣區間：{activeMonthItem.solarTermRange} · 干支五行：{activeMonthItem.wuXing}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-slate-500">月度機遇指數：</span>
            <span
              className={cn(
                'text-2xl font-black',
                activeMonthItem.energyScore >= 80
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : activeMonthItem.energyScore >= 70
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-amber-600 dark:text-amber-400'
              )}
            >
              {activeMonthItem.energyScore} / 100
            </span>
          </div>
        </div>

        {/* 4 大核心指引卡片 */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. 核心主題 */}
          <div className="flex flex-col rounded-2xl bg-white/80 p-4.5 shadow-xs dark:bg-slate-800/70">
            <span className="flex items-center gap-2 text-sm sm:text-base font-black text-indigo-700 dark:text-indigo-300">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              月度核心主題
            </span>
            <div className="mt-2 text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
              {activeMonthItem.analysis.theme}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {activeMonthItem.focusKeywords.map((kw, kwIdx) => (
                <span
                  key={kwIdx}
                  className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>

          {/* 2. 職場事業與決策 */}
          <div className="flex flex-col rounded-2xl bg-white/80 p-4.5 shadow-xs dark:bg-slate-800/70">
            <span className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-800 dark:text-slate-200">
              <Briefcase className="h-4 w-4 text-sky-500" />
              職場事業與決策指南
            </span>
            <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
              {activeMonthItem.analysis.careerGuide}
            </p>
          </div>

          {/* 3. 情感關係與人際互動 */}
          <div className="flex flex-col rounded-2xl bg-white/80 p-4.5 shadow-xs dark:bg-slate-800/70">
            <span className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-800 dark:text-slate-200">
              <HeartHandshake className="h-4 w-4 text-rose-500" />
              情感關係與人際指南
            </span>
            <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
              {activeMonthItem.analysis.relationGuide}
            </p>
          </div>

          {/* 4. 身心調養與開運元素 */}
          <div className="flex flex-col rounded-2xl bg-white/80 p-4.5 shadow-xs dark:bg-slate-800/70">
            <span className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-800 dark:text-slate-200">
              <Sun className="h-4 w-4 text-emerald-500" />
              身心調養與開運元素
            </span>
            <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
              {activeMonthItem.analysis.healthWellnessGuide}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
