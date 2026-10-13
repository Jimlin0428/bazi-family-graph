'use client';

import React, { useState } from 'react';
import { BaziInput } from '../../types/bazi';
import { cn } from '../../lib/utils';
import { Calendar, Clock, User, Sparkles, RefreshCw, ChevronDown } from 'lucide-react';

// 中國傳統十二時辰對照表
const CHINESE_HOURS = [
  { label: '早子時 (00:00 - 00:59)', hour: 0, minute: 30 },
  { label: '丑時 (01:00 - 02:59)', hour: 2, minute: 0 },
  { label: '寅時 (03:00 - 04:59)', hour: 4, minute: 0 },
  { label: '卯時 (05:00 - 06:59)', hour: 6, minute: 0 },
  { label: '辰時 (07:00 - 08:59)', hour: 8, minute: 0 },
  { label: '巳時 (09:00 - 10:59)', hour: 10, minute: 0 },
  { label: '午時 (11:00 - 12:59)', hour: 12, minute: 0 },
  { label: '未時 (13:00 - 14:59)', hour: 14, minute: 0 },
  { label: '申時 (15:00 - 16:59)', hour: 16, minute: 0 },
  { label: '酉時 (17:00 - 18:59)', hour: 18, minute: 0 },
  { label: '戌時 (19:00 - 20:59)', hour: 20, minute: 0 },
  { label: '亥時 (21:00 - 22:59)', hour: 22, minute: 0 },
  { label: '夜子時 (23:00 - 23:59)', hour: 23, minute: 30 },
];

interface BirthInputFormProps {
  initialInput?: BaziInput;
  initialName?: string;
  onCalculate: (input: BaziInput, name: string) => void;
  className?: string;
}

export const BirthInputForm: React.FC<BirthInputFormProps> = ({
  initialInput = {
    year: 1995,
    month: 8,
    day: 24,
    hour: 14,
    minute: 30,
    gender: 'male',
    isHourKnown: true,
  },
  initialName = '我自己',
  onCalculate,
  className,
}) => {
  const [name, setName] = useState(initialName);
  const [gender, setGender] = useState<'male' | 'female'>(initialInput.gender);
  const [year, setYear] = useState(initialInput.year);
  const [month, setMonth] = useState(initialInput.month);
  const [day, setDay] = useState(initialInput.day);
  const [hour, setHour] = useState(initialInput.hour);
  const [minute, setMinute] = useState(initialInput.minute || 0);
  const [isHourKnown, setIsHourKnown] = useState(initialInput.isHourKnown ?? true);
  const [isCustomExpanded, setIsCustomExpanded] = useState(true);

  // 格式化當前日期為 YYYY-MM-DD
  const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    const [y, m, d] = val.split('-').map(Number);
    if (y && m && d) {
      setYear(y);
      setMonth(m);
      setDay(d);
      triggerUpdate({ year: y, month: m, day: d });
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    const [h, min] = val.split(':').map(Number);
    setHour(h ?? 12);
    setMinute(min ?? 0);
    triggerUpdate({ hour: h, minute: min });
  };

  const handleChineseHourSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = Number(e.target.value);
    if (idx >= 0 && idx < CHINESE_HOURS.length) {
      const selected = CHINESE_HOURS[idx];
      setHour(selected.hour);
      setMinute(selected.minute);
      triggerUpdate({ hour: selected.hour, minute: selected.minute });
    }
  };

  const triggerUpdate = (patch?: Partial<BaziInput>, newName?: string) => {
    const currentInput: BaziInput = {
      year: patch?.year ?? year,
      month: patch?.month ?? month,
      day: patch?.day ?? day,
      hour: patch?.hour ?? hour,
      minute: patch?.minute ?? minute,
      gender: patch?.gender ?? gender,
      isHourKnown: patch?.isHourKnown ?? isHourKnown,
    };
    onCalculate(currentInput, newName ?? name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerUpdate();
  };

  return (
    <div
      className={cn(
        'w-full rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-lg backdrop-blur-md transition-all dark:border-slate-800 dark:bg-slate-900/90',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <Calendar className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
              自訂生辰八字輸入
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              輸入西曆出生年月日時，系統將即時轉換為四柱命盤與五行大運
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCustomExpanded(!isCustomExpanded)}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 cursor-pointer"
        >
          <span>{isCustomExpanded ? '收合表單' : '展開輸入'}</span>
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', isCustomExpanded && 'rotate-180')}
          />
        </button>
      </div>

      {isCustomExpanded && (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4.5">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. 姓名 / 稱謂 */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                姓名或稱呼
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    triggerUpdate(undefined, e.target.value);
                  }}
                  placeholder="例如：王小明"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-hidden transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-100 dark:focus:bg-slate-850"
                />
              </div>
            </div>

            {/* 2. 生理性別（影響大運順逆排法） */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                生理性別 <span className="text-xs font-normal text-slate-400">(影響大運順逆)</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-slate-200 bg-slate-100/60 p-1 dark:border-slate-800 dark:bg-slate-800/50">
                <button
                  type="button"
                  onClick={() => {
                    setGender('male');
                    triggerUpdate({ gender: 'male' });
                  }}
                  className={cn(
                    'rounded-lg py-1.5 text-sm font-bold transition-all cursor-pointer',
                    gender === 'male'
                      ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                  )}
                >
                  男 (乾造)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGender('female');
                    triggerUpdate({ gender: 'female' });
                  }}
                  className={cn(
                    'rounded-lg py-1.5 text-sm font-bold transition-all cursor-pointer',
                    gender === 'female'
                      ? 'bg-white text-rose-600 shadow-xs dark:bg-slate-900 dark:text-rose-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                  )}
                >
                  女 (坤造)
                </button>
              </div>
            </div>

            {/* 3. 出生日期 (西曆) */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                出生日期 (公曆)
              </label>
              <input
                type="date"
                value={dateString}
                onChange={handleDateChange}
                min="1900-01-01"
                max="2050-12-31"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-hidden transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-100"
              />
            </div>

            {/* 4. 出生時間 (精確時間 或 時辰) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  出生時間
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!isHourKnown}
                    onChange={(e) => {
                      const unknown = e.target.checked;
                      setIsHourKnown(!unknown);
                      triggerUpdate({ isHourKnown: !unknown });
                    }}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-semibold">時辰未知</span>
                </label>
              </div>

              {isHourKnown ? (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={timeString}
                    onChange={handleTimeChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-hidden transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-100"
                  />
                  <select
                    onChange={handleChineseHourSelect}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-hidden transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-100 cursor-pointer"
                  >
                    <option value="">選十二時辰</option>
                    {CHINESE_HOURS.map((h, i) => (
                      <option key={i} value={i}>
                        {h.label.split(' ')[0]}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-2.5 text-center text-sm font-medium text-slate-400 dark:border-slate-800 dark:bg-slate-800/30">
                  時辰按中性基準排盤
                </div>
              )}
            </div>
          </div>

          {/* 快速快捷填寫列 */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold">快速載入年份：</span>
              {[1980, 1990, 1995, 2000, 2010].map((quickYear) => (
                <button
                  key={quickYear}
                  type="button"
                  onClick={() => {
                    setYear(quickYear);
                    triggerUpdate({ year: quickYear });
                  }}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  {quickYear}年
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-95 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>即時重新排盤</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
