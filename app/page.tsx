'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { FamilyRelationGraph } from '../components/family/FamilyRelationGraph';
import { SinglePersonView } from '../components/bazi/SinglePersonView';
import { BirthInputForm } from '../components/bazi/BirthInputForm';
import { DEFAULT_FAMILY_MEMBERS } from '../lib/bazi/mockFamily';
import { calculateBazi } from '../lib/bazi/calculator';
import { BaziInput, BaziChart } from '../types/bazi';
import { FamilyMember } from '../types/family';
import { Network, User, Sparkles, Compass, Layers } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'bazi_family_members_v1';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'family' | 'individual'>('family');

  // 全域家庭成員狀態（支援 localStorage 同步）
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // 忽略解析錯誤
      }
    }
    return DEFAULT_FAMILY_MEMBERS;
  });

  // 自訂命盤輸入狀態
  const [currentInput, setCurrentInput] = useState<BaziInput>({
    year: 1995,
    month: 8,
    day: 24,
    hour: 14,
    minute: 30,
    gender: 'male',
    isHourKnown: true,
  });
  const [currentUserName, setCurrentUserName] = useState<string>('我自己');
  const [selectedFamilyPresetId, setSelectedFamilyPresetId] = useState<string | null>(null);

  // 計算自訂八字命盤
  const currentChart = useMemo<BaziChart>(() => {
    return calculateBazi(currentInput);
  }, [currentInput]);

  // 處理表單更新
  const handleCalculate = (input: BaziInput, name: string) => {
    setCurrentInput(input);
    setCurrentUserName(name);
    setSelectedFamilyPresetId(null);
  };

  // 快速套用家庭成員生辰
  const handleSelectFamilyMember = (memberId: string) => {
    const member = familyMembers.find((m) => m.id === memberId);
    if (member) {
      const bDate = member.birthDate;
      setCurrentInput({
        year: bDate.year,
        month: bDate.month,
        day: bDate.day,
        hour: bDate.hour,
        minute: bDate.minute,
        gender: member.gender,
        isHourKnown: bDate.isHourKnown,
      });
      setCurrentUserName(`${member.name} (${member.roleLabel})`);
      setSelectedFamilyPresetId(member.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* 頂部導航欄 */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
              <Compass className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                八字命盤與家庭關係圖譜
              </h1>
              <p className="hidden text-xs sm:text-sm font-medium text-slate-500 sm:block dark:text-slate-400">
                現代化資料視覺化 · 拒絕老舊算命館風格 · 心理學白話情境解析
              </p>
            </div>
          </div>

          {/* 視圖切換 Tabs */}
          <div className="flex items-center rounded-xl border border-slate-200/80 bg-slate-100/80 p-1.5 dark:border-slate-800 dark:bg-slate-800/80">
            <button
              onClick={() => setActiveTab('family')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'family'
                  ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Network className="h-4 w-4" />
              <span>家庭關係圖譜</span>
            </button>
            <button
              onClick={() => setActiveTab('individual')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'individual'
                  ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <User className="h-4 w-4" />
              <span>個人命盤深層分析</span>
            </button>
          </div>
        </div>
      </header>

      {/* 主體內容容器 */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {activeTab === 'family' ? (
          <div className="space-y-6">
            {/* 說明橫幅 */}
            <div className="rounded-2xl border border-indigo-200/60 bg-linear-to-r from-indigo-50/70 via-purple-50/40 to-white p-5 text-sm shadow-xs sm:flex sm:items-center sm:justify-between dark:border-indigo-950 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-slate-900">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-2xs">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <span className="font-black text-indigo-950 dark:text-indigo-200">
                    互動指引：
                  </span>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">
                    在圖譜中點擊節點右上角的 ✏️ 筆圖示可自由修改姓名、稱謂與生辰；點擊任兩位成員可進行合盤診斷。
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 sm:mt-0">
                <span className="rounded-lg bg-indigo-100 px-3 py-1 text-xs sm:text-sm font-bold text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
                  {familyMembers.length} 位家庭成員
                </span>
                <span className="rounded-lg bg-purple-100 px-3 py-1 text-xs sm:text-sm font-bold text-purple-800 dark:bg-purple-900/60 dark:text-purple-300">
                  即時八字動態重新排盤
                </span>
              </div>
            </div>

            {/* React Flow 家庭關係圖譜主畫布 */}
            <FamilyRelationGraph
              initialMembers={familyMembers}
              onMembersChange={setFamilyMembers}
              onSelectMemberForDetail={(memberId) => {
                handleSelectFamilyMember(memberId);
                setActiveTab('individual');
              }}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* 1. 自訂生日輸入表單 */}
            <BirthInputForm
              initialInput={currentInput}
              initialName={currentUserName}
              onCalculate={handleCalculate}
            />

            {/* 2. 快速載入家庭成員資料對照列 */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-500" />
                <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                  或快速載入家庭成員生辰：
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {familyMembers.map((m) => {
                  const isSelected = selectedFamilyPresetId === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleSelectFamilyMember(m.id)}
                      className={`rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-105'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {m.name}（{m.roleLabel} · {m.baziChart.dayMaster.stem}
                      {m.baziChart.dayMaster.elementZh}）
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. 單人命盤視覺化元件整合展示 */}
            <SinglePersonView chart={currentChart} userName={currentUserName} />
          </div>
        )}
      </main>
    </div>
  );
}
