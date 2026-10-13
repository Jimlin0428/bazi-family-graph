/**
 * 預設家庭成員資料集 (Default Family Members Data)
 * 包含：爸爸 (庚金)、媽媽 (乙木)、大女兒 (壬水)、小女兒 (戊土)
 * 涵蓋：天干五合 (乙庚合)、五行相生 (土生金、金生水、水生木)、地支相沖/六合 (卯戌合、巳申合等)
 */

import { FamilyMember } from '../../types/family';
import { calculateBazi } from './calculator';

export const DEFAULT_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'member-dad',
    name: '爸爸',
    role: 'father',
    roleLabel: '父親',
    gender: 'male',
    birthDate: {
      year: 1972,
      month: 5,
      day: 9,
      hour: 10,
      minute: 0,
      isHourKnown: true,
    },
    baziChart: calculateBazi({
      year: 1972,
      month: 5,
      day: 9,
      hour: 10,
      minute: 0,
      gender: 'male',
    }),
    nodeConfig: {
      position: { x: 120, y: 80 },
      tierLevel: 1,
    },
    notes: '日主庚金 · 剛毅果決的家庭支柱',
  },
  {
    id: 'member-mom',
    name: '媽媽',
    role: 'mother',
    roleLabel: '母親',
    gender: 'female',
    birthDate: {
      year: 1975,
      month: 9,
      day: 6,
      hour: 14,
      minute: 0,
      isHourKnown: true,
    },
    baziChart: calculateBazi({
      year: 1975,
      month: 9,
      day: 6,
      hour: 14,
      minute: 0,
      gender: 'female',
    }),
    nodeConfig: {
      position: { x: 500, y: 80 },
      tierLevel: 1,
    },
    notes: '日主乙木 · 柔韌協調的溫暖樞紐，與爸爸乙庚相合',
  },
  {
    id: 'member-daughter-1',
    name: '大女兒',
    role: 'daughter',
    roleLabel: '長女',
    gender: 'female',
    birthDate: {
      year: 2002,
      month: 3,
      day: 5,
      hour: 9,
      minute: 0,
      isHourKnown: true,
    },
    baziChart: calculateBazi({
      year: 2002,
      month: 3,
      day: 5,
      hour: 9,
      minute: 0,
      gender: 'female',
    }),
    nodeConfig: {
      position: { x: 180, y: 380 },
      tierLevel: 2,
    },
    notes: '日主壬水 · 聰慧靈動，得爸爸金氣滋養，同時生助媽媽乙木',
  },
  {
    id: 'member-daughter-2',
    name: '小女兒',
    role: 'daughter',
    roleLabel: '次女',
    gender: 'female',
    birthDate: {
      year: 2006,
      month: 7,
      day: 8,
      hour: 16,
      minute: 0,
      isHourKnown: true,
    },
    baziChart: calculateBazi({
      year: 2006,
      month: 7,
      day: 8,
      hour: 16,
      minute: 0,
      gender: 'female',
    }),
    nodeConfig: {
      position: { x: 540, y: 380 },
      tierLevel: 2,
    },
    notes: '日主戊土 · 穩健沉著，與媽媽地支卯戌六合',
  },
];
