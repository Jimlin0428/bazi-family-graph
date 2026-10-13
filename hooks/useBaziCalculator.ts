/**
 * 八字計算器 React Hook
 * 處理使用者輸入、表單驗證與記憶化命盤計算
 */

import { useState, useMemo } from 'react';
import { BaziChart, BaziInput } from '../types/bazi';
import { calculateBazi } from '../lib/bazi/calculator';

export function useBaziCalculator(initialInput?: Partial<BaziInput>) {
  const [input, setInput] = useState<BaziInput>({
    year: initialInput?.year ?? 1995,
    month: initialInput?.month ?? 1,
    day: initialInput?.day ?? 1,
    hour: initialInput?.hour ?? 12,
    minute: initialInput?.minute ?? 0,
    gender: initialInput?.gender ?? 'male',
    isHourKnown: initialInput?.isHourKnown ?? true,
  });

  const [error, setError] = useState<string | null>(null);

  // 記憶化計算，避免每次渲染重複解析曆法
  const chart = useMemo<BaziChart | null>(() => {
    try {
      setError(null);
      return calculateBazi(input);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '八字排盤計算失敗';
      setError(msg);
      return null;
    }
  }, [input]);

  const updateInput = (patch: Partial<BaziInput>) => {
    setInput((prev: BaziInput) => ({ ...prev, ...patch }));
  };

  return {
    input,
    updateInput,
    chart,
    error,
  };
}
