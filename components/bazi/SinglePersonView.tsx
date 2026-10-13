'use client';

import React from 'react';
import { BaziChart } from '../../types/bazi';
import { BaziBlueprintCard } from './BaziBlueprintCard';
import { FiveElementsRadar } from './FiveElementsRadar';
import { DecadeLuckTimeline } from './DecadeLuckTimeline';
import { MonthlyFortuneTimeline } from './MonthlyFortuneTimeline';
import { cn } from '../../lib/utils';

interface SinglePersonViewProps {
  chart: BaziChart;
  userName?: string;
  className?: string;
}

export const SinglePersonView: React.FC<SinglePersonViewProps> = ({
  chart,
  userName = '命主',
  className,
}) => {
  return (
    <div className={cn('mx-auto w-full max-w-6xl space-y-6', className)}>
      {/* 1. 四柱八字命運藍圖主卡片 */}
      <BaziBlueprintCard chart={chart} userName={userName} />

      {/* 2. 五行能量雷達圖與喜用調候分佈 */}
      <FiveElementsRadar chart={chart} />

      {/* 3. 大運十年起伏時間軸與階段亮點 */}
      <DecadeLuckTimeline chart={chart} />

      {/* 4. 當年度 12 個月流月運勢起伏與決策指引 */}
      <MonthlyFortuneTimeline chart={chart} />
    </div>
  );
};

