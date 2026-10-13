/**
 * 家庭關係圖譜 React Flow 狀態管理 Hook
 * 負責管理成員節點、關係連線、點選互動與雙人合盤觸發
 */

import { useState, useCallback } from 'react';
import { FamilyMember, FamilyRelationEdge } from '../types/family';
import { RelationshipAnalysis } from '../types/relationship';
import { analyzeRelationship } from '../lib/bazi/relationship';

export function useFamilyGraph(initialMembers: FamilyMember[] = []) {
  const [members, setMembers] = useState<FamilyMember[]>(initialMembers);
  const [edges, setEdges] = useState<FamilyRelationEdge[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [activePairAnalysis, setActivePairAnalysis] = useState<RelationshipAnalysis | null>(null);

  // 新增家庭成員
  const addMember = useCallback((member: FamilyMember) => {
    setMembers((prev: FamilyMember[]) => [...prev, member]);
  }, []);

  // 移除家庭成員
  const removeMember = useCallback((memberId: string) => {
    setMembers((prev: FamilyMember[]) => prev.filter((m: FamilyMember) => m.id !== memberId));
    setEdges((prev: FamilyRelationEdge[]) =>
      prev.filter((e: FamilyRelationEdge) => e.sourceId !== memberId && e.targetId !== memberId)
    );
    setSelectedMemberId((prev: string | null) => (prev === memberId ? null : prev));
  }, []);

  // 診斷兩人關係
  const compareMembers = useCallback(
    (memberAId: string, memberBId: string) => {
      const mA = members.find((m: FamilyMember) => m.id === memberAId);
      const mB = members.find((m: FamilyMember) => m.id === memberBId);
      if (!mA || !mB) return null;

      const analysis = analyzeRelationship(mA, mB);
      setActivePairAnalysis(analysis);
      return analysis;
    },
    [members]
  );

  return {
    members,
    edges,
    selectedMemberId,
    setSelectedMemberId,
    activePairAnalysis,
    setActivePairAnalysis,
    addMember,
    removeMember,
    compareMembers,
  };
}
