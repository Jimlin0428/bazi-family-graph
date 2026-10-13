'use client';

import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from '@xyflow/react';
import { cn } from '../../lib/utils';
import { Sparkles, ArrowRight, Zap, Heart } from 'lucide-react';

export interface RelationEdgeData {
  relationCategory: 'stem_he' | 'generating' | 'clash_xing' | 'liuhe' | 'controlling' | 'neutral';
  label: string;
  subLabel?: string;
  harmonyScore?: number;
  onEdgeClick?: () => void;
}

export const RelationEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const edgeData = data as unknown as RelationEdgeData | undefined;
  const category = edgeData?.relationCategory || 'neutral';
  const label = edgeData?.label || '';
  const onEdgeClick = edgeData?.onEdgeClick;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // 根據八字關係規則定義線條與標籤樣式
  let edgeStyle: React.CSSProperties = { ...style };
  let badgeStyle = '';
  let IconComponent: React.ComponentType<{ className?: string }> = Sparkles;

  switch (category) {
    case 'stem_he':
      // 1. 天干五合（如乙庚合）：綠色發光平滑連線
      edgeStyle = {
        ...edgeStyle,
        stroke: '#10B981',
        strokeWidth: 3,
        filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.75))',
      };
      badgeStyle =
        'border-emerald-300 bg-emerald-50 text-emerald-800 shadow-md shadow-emerald-500/10 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/90 dark:text-emerald-200';
      IconComponent = Sparkles;
      break;

    case 'generating':
      // 2. 五行相生（如土生金、水生木）：藍色流動箭頭連線
      edgeStyle = {
        ...edgeStyle,
        stroke: '#0EA5E9',
        strokeWidth: 2.5,
        strokeDasharray: '6 4',
        animation: 'flowAnimation 1.5s linear infinite',
      };
      badgeStyle =
        'border-sky-300 bg-sky-50 text-sky-800 shadow-md shadow-sky-500/10 hover:bg-sky-100 dark:border-sky-700 dark:bg-sky-950/90 dark:text-sky-200';
      IconComponent = ArrowRight;
      break;

    case 'clash_xing':
      // 3. 地支相沖/刑（如寅申沖）：橘紅色虛線標註
      edgeStyle = {
        ...edgeStyle,
        stroke: '#F43F5E',
        strokeWidth: 2.5,
        strokeDasharray: '5 5',
      };
      badgeStyle =
        'border-rose-300 bg-rose-50 text-rose-800 shadow-md shadow-rose-500/10 hover:bg-rose-100 dark:border-rose-700 dark:bg-rose-950/90 dark:text-rose-200';
      IconComponent = Zap;
      break;

    case 'liuhe':
      // 地支六合
      edgeStyle = {
        ...edgeStyle,
        stroke: '#8B5CF6',
        strokeWidth: 2.5,
      };
      badgeStyle =
        'border-purple-300 bg-purple-50 text-purple-800 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-950/90 dark:text-purple-200';
      IconComponent = Heart;
      break;

    default:
      edgeStyle = {
        ...edgeStyle,
        stroke: '#94A3B8',
        strokeWidth: 1.8,
      };
      badgeStyle =
        'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';
      IconComponent = Sparkles;
      break;
  }

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={edgeStyle} markerEnd={markerEnd} />

      {/* 連線中央文字標籤 */}
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdgeClick?.();
              }}
              title="點擊查看雙人合盤深度診斷"
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-black tracking-normal transition-transform duration-150 hover:scale-108 active:scale-95 cursor-pointer shadow-md',
                badgeStyle
              )}
            >
              <IconComponent className="h-3.5 w-3.5 shrink-0" />
              <span>{label}</span>
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
