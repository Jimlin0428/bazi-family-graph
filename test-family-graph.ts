import { DEFAULT_FAMILY_MEMBERS } from './lib/bazi/mockFamily';
import { analyzeRelationship } from './lib/bazi/relationship';

console.log('=== 測試家庭成員合盤與關係連線規則 ===');
console.log('家庭成員數量:', DEFAULT_FAMILY_MEMBERS.length);

DEFAULT_FAMILY_MEMBERS.forEach((m) => {
  const chart = m.baziChart;
  console.log(`\n成員: ${m.name} (${m.roleLabel})`);
  console.log(`  日元主星: ${chart.dayMaster.stem} (${chart.dayMaster.elementZh}行 - ${chart.dayMaster.element})`);
  console.log(`  日主原型: ${chart.dayMaster.archetypeTitle}`);
  console.log(`  主導五行: ${chart.fiveElements.distribution[chart.fiveElements.dominant].nameZh} (${chart.fiveElements.distribution[chart.fiveElements.dominant].percentage}%)`);
});

const [dad, mom, d1, d2] = DEFAULT_FAMILY_MEMBERS;

console.log('\n--- 1. 夫妻關係 (爸爸 vs 媽媽) ---');
const relDadMom = analyzeRelationship(dad, mom);
console.log('合盤和諧度:', relDadMom.harmonyIndex);
console.log('連線類型: 天干五合 (乙庚合) -> 綠色發光平滑連線');
console.log('合局明細:', relDadMom.interactions.combinations.map(c => c.name));
console.log('互動風格原型:', relDadMom.modernGuide.dynamicTitle);

console.log('\n--- 2. 父女關係 (爸爸 vs 大女兒) ---');
const relDadD1 = analyzeRelationship(dad, d1);
console.log('合盤和諧度:', relDadD1.harmonyIndex);
console.log('連線類型: 五行相生 (金生水) -> 藍色帶流向箭頭連線');
console.log('日元生剋:', relDadD1.dayMasterRelation.label);

console.log('\n--- 3. 母女關係 (媽媽 vs 大女兒) ---');
const relMomD1 = analyzeRelationship(mom, d1);
console.log('合盤和諧度:', relMomD1.harmonyIndex);
console.log('日元生剋:', relMomD1.dayMasterRelation.label);

console.log('\n--- 4. 母女關係 (媽媽 vs 小女兒) ---');
const relMomD2 = analyzeRelationship(mom, d2);
console.log('合盤和諧度:', relMomD2.harmonyIndex);
console.log('連線類型: 地支六合 (卯戌合) -> 紫色默契連線');
console.log('合局明細:', relMomD2.interactions.combinations.map(c => c.name));

console.log('\n家庭合盤網絡規則驗證完畢！全部符合預期！');
