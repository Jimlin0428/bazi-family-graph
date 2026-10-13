import { calculateBazi } from './lib/bazi/calculator';
import { analyzeRelationship } from './lib/bazi/relationship';
import { FamilyMember } from './types/family';

console.log('=== 1. 測試單人八字排盤與五行計算 ===');
const chartA = calculateBazi({
  year: 1995,
  month: 8,
  day: 24,
  hour: 14,
  minute: 30,
  gender: 'male',
});

console.log('西曆:', chartA.solarDate);
console.log('農曆:', chartA.lunarDateStr);
console.log('四柱干支:');
console.log('  年柱:', chartA.pillars.year.gan, chartA.pillars.year.zhi, '| 十神:', chartA.pillars.year.shiShenGan, '| 納音:', chartA.pillars.year.naYin);
console.log('  月柱:', chartA.pillars.month.gan, chartA.pillars.month.zhi, '| 十神:', chartA.pillars.month.shiShenGan, '| 藏干:', chartA.pillars.month.hiddenStems.map(h => `${h.stem}(${h.shiShen})`).join(', '));
console.log('  日柱:', chartA.pillars.day.gan, chartA.pillars.day.zhi, '| 日元主星:', chartA.dayMaster.stem, `(${chartA.dayMaster.elementZh})`);
console.log('  時柱:', chartA.pillars.hour.gan, chartA.pillars.hour.zhi, '| 十神:', chartA.pillars.hour.shiShenGan);

console.log('\n日主白話原型:', chartA.dayMaster.archetypeTitle);
console.log('核心關鍵字:', chartA.dayMaster.keyword);
console.log('現代溝通指南:', chartA.dayMaster.modernCommunicationAdvice);

console.log('\n五行能量分佈 (雷達圖資料源):');
Object.entries(chartA.fiveElements.distribution).forEach(([el, val]) => {
  console.log(`  ${val.nameZh} (${el}): ${val.percentage}% (得分: ${val.score}, 狀態: ${val.level}) - ${val.modernTrait.archetype}`);
});
console.log('主導五行:', chartA.fiveElements.dominant);
console.log('日主強弱判定:', chartA.fiveElements.dayMasterStrength, '(', chartA.fiveElements.analysisSummary, ')');

console.log('\n大運起伏列表 (前 5 步):');
chartA.daYunList.slice(0, 5).forEach((dy) => {
  console.log(`  第${dy.index}步大運 [${dy.startAge}~${dy.endAge}歲 (${dy.startYear}~${dy.endYear})]: ${dy.ganZhi} | 趨勢能量指數: ${dy.energyTrendScore}`);
});

console.log('\n=== 2. 測試家庭兩人關係診斷 (合盤分析) ===');
const memberA: FamilyMember = {
  id: 'mem-001',
  name: '爸爸 (自己)',
  role: 'father',
  roleLabel: '父親',
  gender: 'male',
  birthDate: { year: 1995, month: 8, day: 24, hour: 14, minute: 30, isHourKnown: true },
  baziChart: chartA,
};

const chartB = calculateBazi({
  year: 1997,
  month: 11,
  day: 12,
  hour: 9,
  minute: 15,
  gender: 'female',
});

const memberB: FamilyMember = {
  id: 'mem-002',
  name: '媽媽 (伴侶)',
  role: 'spouse',
  roleLabel: '妻子',
  gender: 'female',
  birthDate: { year: 1997, month: 11, day: 12, hour: 9, minute: 15, isHourKnown: true },
  baziChart: chartB,
};

const relAnalysis = analyzeRelationship(memberA, memberB);
console.log('合盤診斷對象:', relAnalysis.memberA.name, 'vs', relAnalysis.memberB.name);
console.log('日元生剋關係:', relAnalysis.dayMasterRelation.label, '-', relAnalysis.dayMasterRelation.description);
console.log('和諧互補指數:', relAnalysis.harmonyIndex, '/ 100');
console.log('互動風格原型:', relAnalysis.modernGuide.dynamicTitle);
console.log('核心相處優勢:');
relAnalysis.modernGuide.strengths.forEach(s => console.log('  +', s));
console.log('白話溝通心法:');
relAnalysis.modernGuide.communicationTips.forEach(t => console.log('  *', t));
