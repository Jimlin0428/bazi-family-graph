'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FamilyMember, FamilyRole } from '../../types/family';
import { calculateBazi } from '../../lib/bazi/calculator';
import { ELEMENT_METADATA } from '../../lib/bazi/constants';
import { cn } from '../../lib/utils';
import { X, Calendar, Clock, User, Sparkles, Check, RefreshCw } from 'lucide-react';

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

const ROLE_OPTIONS: Array<{ value: FamilyRole; label: string }> = [
  { value: 'father', label: '父親 / 爸爸' },
  { value: 'mother', label: '母親 / 媽媽' },
  { value: 'daughter', label: '女兒' },
  { value: 'son', label: '兒子' },
  { value: 'spouse', label: '伴侶 / 配偶' },
  { value: 'self', label: '自己 / 本人' },
  { value: 'elder_brother', label: '兄長' },
  { value: 'younger_brother', label: '弟弟' },
  { value: 'elder_sister', label: '姊姊' },
  { value: 'younger_sister', label: '妹妹' },
  { value: 'custom', label: '其他親屬' },
];

interface EditFamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: FamilyMember | null;
  onSave: (updatedMember: FamilyMember) => void;
}

export const EditFamilyMemberModal: React.FC<EditFamilyMemberModalProps> = ({
  isOpen,
  onClose,
  member,
  onSave,
}) => {
  if (!isOpen || !member) return null;

  const [name, setName] = useState(member.name);
  const [role, setRole] = useState<FamilyRole>(member.role);
  const [roleLabel, setRoleLabel] = useState(member.roleLabel);
  const [gender, setGender] = useState<'male' | 'female'>(member.gender);
  const [year, setYear] = useState(member.birthDate.year);
  const [month, setMonth] = useState(member.birthDate.month);
  const [day, setDay] = useState(member.birthDate.day);
  const [hour, setHour] = useState(member.birthDate.hour);
  const [minute, setMinute] = useState(member.birthDate.minute);
  const [isHourKnown, setIsHourKnown] = useState(member.birthDate.isHourKnown);

  useEffect(() => {
    if (member) {
      setName(member.name);
      setRole(member.role);
      setRoleLabel(member.roleLabel);
      setGender(member.gender);
      setYear(member.birthDate.year);
      setMonth(member.birthDate.month);
      setDay(member.birthDate.day);
      setHour(member.birthDate.hour);
      setMinute(member.birthDate.minute);
      setIsHourKnown(member.birthDate.isHourKnown);
    }
  }, [member]);

  const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  // 即時預覽重新排盤結果
  const previewChart = useMemo(() => {
    try {
      return calculateBazi({
        year,
        month,
        day,
        hour,
        minute,
        gender,
        isHourKnown,
      });
    } catch {
      return null;
    }
  }, [year, month, day, hour, minute, gender, isHourKnown]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    const [y, m, d] = val.split('-').map(Number);
    if (y && m && d) {
      setYear(y);
      setMonth(m);
      setDay(d);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    const [h, min] = val.split(':').map(Number);
    setHour(h ?? 12);
    setMinute(min ?? 0);
  };

  const handleChineseHourSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = Number(e.target.value);
    if (idx >= 0 && idx < CHINESE_HOURS.length) {
      const selected = CHINESE_HOURS[idx];
      setHour(selected.hour);
      setMinute(selected.minute);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewChart) return;

    const updated: FamilyMember = {
      ...member,
      name,
      role,
      roleLabel,
      gender,
      birthDate: {
        year,
        month,
        day,
        hour,
        minute,
        isHourKnown,
      },
      baziChart: previewChart,
      notes: `日主${previewChart.dayMaster.stem}${previewChart.dayMaster.elementZh} · ${name}`,
    };

    onSave(updated);
    onClose();
  };

  const dm = previewChart?.dayMaster;
  const dmMeta = dm ? ELEMENT_METADATA[dm.element] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-slate-200/90 bg-white shadow-2xl backdrop-blur-md overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        {/* 頂部 Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4.5 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <User className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                編輯家庭成員資料 · {member.name}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                自訂稱謂、角色關係與出生年月日時，關係圖譜將自動動態重新連線
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

        {/* 表單內容 */}
        <form onSubmit={handleSave} className="space-y-4.5 p-6 max-h-[80vh] overflow-y-auto">
          {/* 即時排盤動態預覽小看板 */}
          {previewChart && dm && dmMeta && (
            <div className="flex items-center justify-between rounded-2xl border border-indigo-200/70 bg-indigo-50/60 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/30">
              <div className="flex items-center gap-3.5">
                <div
                  className={cn(
                    'flex h-13 w-13 flex-col items-center justify-center rounded-xl border-2 font-black shadow-xs',
                    dmMeta.colorToken.twBorder,
                    dmMeta.colorToken.twBg
                  )}
                >
                  <span className={cn('text-xl leading-none font-black', dmMeta.colorToken.twText)}>
                    {dm.stem}
                  </span>
                  <span className="text-[10px] font-black text-slate-600 dark:text-slate-400">{dmMeta.nameZh}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                    <span>即時日主：{dm.stem}{dm.elementZh}（{dm.yinYang === 'yang' ? '陽' : '陰'}{dm.elementZh}）</span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                    四柱：{previewChart.pillars.year.gan}{previewChart.pillars.year.zhi}年 · {previewChart.pillars.month.gan}{previewChart.pillars.month.zhi}月 · {previewChart.pillars.day.gan}{previewChart.pillars.day.zhi}日 · {previewChart.pillars.hour.gan}{previewChart.pillars.hour.zhi}時
                  </span>
                </div>
              </div>

              <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-black text-white shadow-xs">
                {previewChart.fiveElements.distribution[previewChart.fiveElements.dominant].nameZh}旺
              </span>
            </div>
          )}

          {/* 稱謂與稱呼標籤 */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                成員姓名 / 暱稱
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：爸爸、媽咪、大寶"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                稱謂標籤（顯示於節點頂部）
              </label>
              <input
                type="text"
                value={roleLabel}
                onChange={(e) => setRoleLabel(e.target.value)}
                placeholder="例如：父親、母親、長女"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-100"
              />
            </div>
          </div>

          {/* 角色屬性與生理性別 */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                家庭角色關係
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as FamilyRole)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-100 cursor-pointer"
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                生理性別 <span className="text-xs font-normal text-slate-400">(決定大運順逆)</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-slate-200 bg-slate-100/60 p-1 dark:border-slate-800 dark:bg-slate-800/50">
                <button
                  type="button"
                  onClick={() => setGender('male')}
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
                  onClick={() => setGender('female')}
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
          </div>

          {/* 出生日期 (西曆) */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
              出生日期 (公曆)
            </label>
            <input
              type="date"
              value={dateString}
              onChange={handleDateChange}
              min="1920-01-01"
              max="2035-12-31"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-100"
            />
          </div>

          {/* 出生時間 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                出生時間
              </label>
              <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!isHourKnown}
                  onChange={(e) => setIsHourKnown(!e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-semibold">時辰未知</span>
              </label>
            </div>

            {isHourKnown ? (
              <div className="grid grid-cols-2 gap-2.5">
                <input
                  type="time"
                  value={timeString}
                  onChange={handleTimeChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-100"
                />
                <select
                  onChange={handleChineseHourSelect}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-100 cursor-pointer"
                >
                  <option value="">快速選十二時辰</option>
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

          {/* 底部按鈕 */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4.5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5.5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>儲存並即時更新圖譜</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
