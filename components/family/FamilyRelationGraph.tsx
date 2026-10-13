'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { FamilyMember } from '../../types/family';
import { RelationshipAnalysis } from '../../types/relationship';
import { DEFAULT_FAMILY_MEMBERS } from '../../lib/bazi/mockFamily';
import { analyzeRelationship } from '../../lib/bazi/relationship';
import { FamilyMemberNode, FamilyMemberNodeData } from './FamilyMemberNode';
import { RelationEdge, RelationEdgeData } from './RelationEdge';
import { InterpersonalModal } from './InterpersonalModal';
import { EditFamilyMemberModal } from './EditFamilyMemberModal';
import { cn } from '../../lib/utils';
import { Network, Sparkles, RefreshCw, Info, Pencil, UserCheck, CalendarDays } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'bazi_family_members_v1';

const nodeTypes = {
  familyMember: FamilyMemberNode,
};

const edgeTypes = {
  baziRelation: RelationEdge,
};

interface FamilyRelationGraphProps {
  initialMembers?: FamilyMember[];
  onMembersChange?: (members: FamilyMember[]) => void;
  onSelectMemberForDetail?: (memberId: string) => void;
  className?: string;
}

export const FamilyRelationGraph: React.FC<FamilyRelationGraphProps> = ({
  initialMembers = DEFAULT_FAMILY_MEMBERS,
  onMembersChange,
  onSelectMemberForDetail,
  className,
}) => {
  // 成員狀態（支援 localStorage 持久化儲存使用者的自訂修改）
  const [members, setMembers] = useState<FamilyMember[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // 忽略解析錯誤
      }
    }
    return initialMembers;
  });

  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<RelationshipAnalysis | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 編輯成員彈窗狀態
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 儲存至 localStorage 並通知父層
  const updateMembersList = useCallback(
    (newMembers: FamilyMember[]) => {
      setMembers(newMembers);
      onMembersChange?.(newMembers);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newMembers));
        } catch {
          // 忽略快取存儲限制
        }
      }
    },
    [onMembersChange]
  );

  // 儲存修改的成員
  const handleSaveMember = useCallback(
    (updated: FamilyMember) => {
      const nextMembers = members.map((m) => (m.id === updated.id ? updated : m));
      updateMembersList(nextMembers);
    },
    [members, updateMembersList]
  );

  // 重設為預設家庭資料
  const handleResetDefaults = () => {
    if (window.confirm('確定要將家庭成員資料恢復為預設的示範資料嗎？')) {
      updateMembersList(DEFAULT_FAMILY_MEMBERS);
      setSelectedMemberIds([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  };

  // 觸發雙人合盤診斷
  const triggerPairAnalysis = useCallback(
    (idA: string, idB: string) => {
      const mA = members.find((m) => m.id === idA);
      const mB = members.find((m) => m.id === idB);
      if (mA && mB) {
        const analysis = analyzeRelationship(mA, mB);
        setActiveAnalysis(analysis);
        setIsModalOpen(true);
      }
    },
    [members]
  );

  // 節點點擊邏輯：點第一個選取，點第二個立即觸發合盤診斷
  const handleNodeClick = useCallback(
    (memberId: string) => {
      setSelectedMemberIds((prev) => {
        if (prev.includes(memberId)) {
          return prev.filter((id) => id !== memberId);
        }
        if (prev.length === 0) {
          return [memberId];
        }
        if (prev.length === 1) {
          const firstId = prev[0];
          triggerPairAnalysis(firstId, memberId);
          return [firstId, memberId];
        }
        return [memberId];
      });
    },
    [triggerPairAnalysis]
  );

  // 開啟編輯成員彈窗
  const openEditModal = useCallback((member: FamilyMember) => {
    setEditingMember(member);
    setIsEditModalOpen(true);
  }, []);

  // 1. 生成 React Flow Nodes
  const initialNodes: Node[] = useMemo(() => {
    return members.map((member) => ({
      id: member.id,
      type: 'familyMember',
      position: member.nodeConfig?.position || { x: 100, y: 100 },
      data: {
        member,
        isSelected: selectedMemberIds.includes(member.id),
        isPairSelected: selectedMemberIds.length === 2 && selectedMemberIds.includes(member.id),
        onSelect: handleNodeClick,
        onEdit: openEditModal,
      } as unknown as Record<string, unknown>,
    }));
  }, [members, selectedMemberIds, handleNodeClick, openEditModal]);

  // 2. 根據八字生剋合沖規則自動生成 Edges
  const initialEdges: Edge[] = useMemo(() => {
    const edgeList: Edge[] = [];

    // 定義家庭主要互動關聯對象
    const keyPairs: Array<{
      source: string;
      target: string;
      sourceHandle?: string;
      targetHandle?: string;
    }> = [
      { source: members[0]?.id, target: members[1]?.id, sourceHandle: 'right', targetHandle: 'left' },
      { source: members[0]?.id, target: members[2]?.id, sourceHandle: 'bottom', targetHandle: 'top' },
      { source: members[1]?.id, target: members[2]?.id, sourceHandle: 'bottom', targetHandle: 'top' },
      { source: members[0]?.id, target: members[3]?.id, sourceHandle: 'bottom', targetHandle: 'top' },
      { source: members[1]?.id, target: members[3]?.id, sourceHandle: 'bottom', targetHandle: 'top' },
      { source: members[2]?.id, target: members[3]?.id, sourceHandle: 'right', targetHandle: 'left' },
    ];

    for (const pair of keyPairs) {
      if (!pair.source || !pair.target) continue;
      const mA = members.find((m) => m.id === pair.source);
      const mB = members.find((m) => m.id === pair.target);
      if (!mA || !mB) continue;

      const analysis = analyzeRelationship(mA, mB);

      let relationCategory: RelationEdgeData['relationCategory'] = 'neutral';
      let label = '';
      let markerEnd: Edge['markerEnd'] = undefined;

      // 優先級 1：天干五合（如乙庚合：綠色發光平滑連線）
      const stemHe = analysis.interactions.combinations.find((c) => c.type === 'stem_he');
      // 優先級 2：地支六沖/刑（如寅申沖：橘紅色虛線）
      const clash = analysis.interactions.clashes[0];
      // 優先級 3：五行相生（藍色流向箭頭）
      const isGenerating =
        analysis.dayMasterRelation.type === 'generates' ||
        analysis.dayMasterRelation.type === 'generated_by';
      // 優先級 4：地支六合
      const liuhe = analysis.interactions.combinations.find((c) => c.type === 'branch_liuhe');

      if (stemHe) {
        relationCategory = 'stem_he';
        label = stemHe.name.split('（')[1]?.replace('）', '') || '天干相合';
      } else if (clash) {
        relationCategory = 'clash_xing';
        label = clash.name.split('（')[0] || '地支相沖';
      } else if (isGenerating) {
        relationCategory = 'generating';
        label = analysis.dayMasterRelation.label.split(' · ')[0] || '相生滋養';
        markerEnd = {
          type: MarkerType.ArrowClosed,
          color: '#0EA5E9',
        };
      } else if (liuhe) {
        relationCategory = 'liuhe';
        label = liuhe.name.split('（')[0] || '地支六合';
      } else {
        relationCategory = 'neutral';
        label = '相處互動';
      }

      edgeList.push({
        id: `edge-${mA.id}-${mB.id}`,
        source: mA.id,
        target: mB.id,
        sourceHandle: pair.sourceHandle || 'bottom',
        targetHandle: pair.targetHandle || 'top',
        type: 'baziRelation',
        markerEnd,
        data: {
          relationCategory,
          label,
          harmonyScore: analysis.harmonyIndex,
          onEdgeClick: () => {
            setActiveAnalysis(analysis);
            setIsModalOpen(true);
            setSelectedMemberIds([mA.id, mB.id]);
          },
        } as unknown as Record<string, unknown>,
      });
    }

    return edgeList;
  }, [members]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 當 members 改變時即時更新 nodes 和 edges
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // 當前選取的成員物件
  const selectedMemberA = members.find((m) => m.id === selectedMemberIds[0]);
  const selectedMemberB = members.find((m) => m.id === selectedMemberIds[1]);

  return (
    <div
      className={cn(
        'relative flex h-[720px] w-full flex-col rounded-3xl border border-slate-200/90 bg-slate-900/5 shadow-2xl backdrop-blur-md overflow-hidden dark:border-slate-800 dark:bg-slate-950/40',
        className
      )}
    >
      {/* 畫布頂部控制列 */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-col justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-lg backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-sm">
              <Network className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                家庭成員合盤與關係力導向圖
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                點擊節點右上角 ✏️ 筆圖示可自由修改姓名、稱謂與生辰；點擊兩位成員查看合盤
              </p>
            </div>
          </div>

          {/* 右上方操作按鈕群 */}
          <div className="flex flex-wrap items-center gap-2">
            {selectedMemberIds.length === 2 && selectedMemberA && selectedMemberB ? (
              <button
                onClick={() => triggerPairAnalysis(selectedMemberA.id, selectedMemberB.id)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-102 active:scale-95 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>
                  查看【{selectedMemberA.name} × {selectedMemberB.name}】合盤診斷
                </span>
              </button>
            ) : selectedMemberIds.length === 1 && selectedMemberA ? (
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-sm font-bold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300">
                  <Info className="h-4 w-4" />
                  <span>已選取 {selectedMemberA.name}，請點選第二位成員</span>
                </div>
                {onSelectMemberForDetail && (
                  <button
                    onClick={() => onSelectMemberForDetail(selectedMemberA.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-bold text-white shadow-xs transition-all hover:bg-indigo-700 active:scale-95 cursor-pointer"
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span>查看 {selectedMemberA.name} 的流月運勢</span>
                  </button>
                )}
              </div>
            ) : null}

            <button
              onClick={handleResetDefaults}
              title="重設為預設示範家庭"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>恢復預設</span>
            </button>
          </div>
        </div>

        {/* 成員快捷修改標籤列 */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Pencil className="h-3.5 w-3.5 text-indigo-500" />
            快速修改成員：
          </span>
          {members.map((m) => (
            <button
              key={m.id}
              onClick={() => openEditModal(m)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-bold text-slate-800 hover:border-indigo-500 hover:bg-indigo-50/50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:bg-slate-750 transition-all cursor-pointer shadow-2xs"
            >
              <span>{m.name}</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">({m.roleLabel})</span>
              <Pencil className="h-3 w-3 text-indigo-500" />
            </button>
          ))}
        </div>
      </div>

      {/* React Flow 畫布主體 */}
      <div className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.5}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.95 }}
        >
          <Background color="#94a3b8" gap={20} size={1} />
          <Controls className="!bottom-4 !left-4" />
          <MiniMap
            className="!bottom-4 !right-4 !rounded-xl !border-slate-300 dark:!border-slate-800"
            nodeColor="#6366f1"
          />
        </ReactFlow>
      </div>

      {/* 底部圖例說明列 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 hidden rounded-full border border-slate-200/90 bg-white/95 px-5 py-2.5 text-sm font-bold shadow-md backdrop-blur-md sm:flex items-center gap-5 dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
          <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
          <span>天干五合（仁義之合）</span>
        </div>
        <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
          <span className="h-3 w-3 rounded-full bg-sky-500" />
          <span>五行相生（生助滋養）</span>
        </div>
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
          <span className="h-3 w-3 rounded-full bg-rose-500" />
          <span>地支相沖（觀點碰撞）</span>
        </div>
        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
          <span className="h-3 w-3 rounded-full bg-purple-500" />
          <span>地支六合（深層默契）</span>
        </div>
      </div>

      {/* 雙人合盤深度診斷對話框 */}
      <InterpersonalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        analysis={activeAnalysis}
        memberA={selectedMemberA}
        memberB={selectedMemberB}
      />

      {/* 編輯家庭成員資料對話框 */}
      <EditFamilyMemberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        member={editingMember}
        onSave={handleSaveMember}
      />
    </div>
  );
};
