'use client';

import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import { BaziChart, FiveElement } from '../../types/bazi';
import { ELEMENT_METADATA } from '../../lib/bazi/constants';
import { analyzeUsefulGods } from '../../lib/bazi/fiveElements';
import { cn } from '../../lib/utils';
import { Flame, Droplet, Sparkles, AlertCircle, CheckCircle2, Activity } from 'lucide-react';

interface FiveElementsRadarProps {
  chart: BaziChart;
  className?: string;
}

export const FiveElementsRadar: React.FC<FiveElementsRadarProps> = ({ chart, className }) => {
  const { fiveElements } = chart;
  const usefulGods = useMemo(() => analyzeUsefulGods(chart), [chart]);

  // 雷達圖五行資料格式化（按傳統木火土金水相生順序排列）
  const radarData = useMemo(() => {
    const sequence: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];
    return sequence.map((el) => {
      const item = fiveElements.distribution[el];
      return {
        element: el,
        subject: `${item.nameZh} (${item.percentage}%)`,
        score: item.score,
        percentage: item.percentage,
        nameZh: item.nameZh,
        level: item.level,
        archetype: item.modernTrait.archetype,
        color: item.colorToken.hex,
      };
    });
  }, [fiveElements]);

  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-xl backdrop-blur-md transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/80',
        className
      )}
    >
      {/* 標題與簡介 */}
      <div className="mb-5 flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <Activity className="h-4.5 w-4.5" />
          </span>
          <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
            五行能量雷達分佈
          </h3>
        </div>

        {/* 身強身弱格局標籤 */}
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
          <span>格局：</span>
          <span className="font-black text-slate-900 dark:text-slate-100">
            {fiveElements.dayMasterStrength === 'extremely_strong' ||
            fiveElements.dayMasterStrength === 'strong'
              ? '身旺（驅動力充沛）'
              : fiveElements.dayMasterStrength === 'extremely_weak' ||
                fiveElements.dayMasterStrength === 'weak'
              ? '身弱（善借力整合）'
              : '中和（動態平衡）'}
          </span>
        </div>
      </div>

      {/* 喜用神與調候需求 Tag 標籤展示區塊 */}
      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <span className="text-sm font-extrabold text-slate-600 dark:text-slate-300">
          調候與喜用：
        </span>

        {/* 喜用神 Tags */}
        {usefulGods.favorableElements.map((fav) => {
          const meta = ELEMENT_METADATA[fav.element];
          return (
            <div
              key={fav.element}
              title={fav.reason}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-sm font-bold shadow-xs transition-colors',
                meta.colorToken.twBorder,
                meta.colorToken.twBg,
                meta.colorToken.twText
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                {fav.role}：<strong>{fav.nameZh}</strong>
              </span>
            </div>
          );
        })}

        {/* 需要調候元素 Tag */}
        {usefulGods.climateAdjustment.needed ? (
          <div
            title={usefulGods.climateAdjustment.reason}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-sm font-bold text-amber-600 shadow-xs dark:text-amber-400"
          >
            {usefulGods.climateAdjustment.element === 'fire' ? (
              <Flame className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
            ) : (
              <Droplet className="h-3.5 w-3.5 text-sky-500 animate-pulse" />
            )}
            <span>
              調候需求：<strong>{usefulGods.climateAdjustment.label}</strong>
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>氣候中和適度</span>
          </div>
        )}
      </div>

      {/* 雷達圖與長條佔比主體 */}
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
        {/* Recharts 雷達圖 */}
        <div className="h-[300px] w-full lg:col-span-7">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="75%">
              <PolarGrid stroke="#94a3b8" strokeDasharray="3 3" opacity={0.35} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#475569', fontSize: 13, fontWeight: 700 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 'dataMax + 10']}
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
              />
              <Radar
                name="能量權重"
                dataKey="percentage"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.35}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95">
                        <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                          {data.nameZh} 行能量：{data.percentage}%
                        </div>
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                          原始權重分：{data.score}
                        </div>
                        <div className="mt-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {data.archetype}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 五行能量百分比長條列表 */}
        <div className="space-y-3 lg:col-span-5">
          {radarData.map((item) => {
            const meta = ELEMENT_METADATA[item.element as FiveElement];
            const isFavorable = usefulGods.favorableElements.some((f) => f.element === item.element);

            return (
              <div
                key={item.element}
                className="group rounded-2xl border border-slate-100 bg-slate-50/70 p-3 transition-all hover:border-slate-200 dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: meta.colorToken.hex }}
                    />
                    <span className="text-base font-black text-slate-900 dark:text-slate-100">
                      {item.nameZh}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      ({meta.archetype})
                    </span>
                    {isFavorable && (
                      <span className="rounded-md bg-indigo-500/15 px-1.5 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        喜用 ★
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-base font-black text-slate-800 dark:text-slate-200">
                    {item.percentage}%
                  </span>
                </div>

                {/* 能量進度條 */}
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, item.percentage * 2)}%`,
                      backgroundColor: meta.colorToken.hex,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 底部調候與喜用白話建議總結 */}
      <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-slate-50/90 p-4 text-sm leading-relaxed font-medium text-slate-700 dark:bg-slate-800/60 dark:text-slate-200 border border-slate-100 dark:border-slate-800">
        <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-indigo-500" />
        <p>{usefulGods.summary}</p>
      </div>
    </div>
  );
};
