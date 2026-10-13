/**
 * 八字核心常數、五行對照與現代白話人格資料庫
 */

import {
  FiveElement,
  FiveElementNameZh,
  HeavenlyStem,
  EarthlyBranch,
  YinYang,
  TenGod,
} from '../../types/bazi';

// 天干屬性對照 (五行、陰陽、繁體)
export const STEM_INFO: Record<
  HeavenlyStem,
  { element: FiveElement; elementZh: FiveElementNameZh; yinYang: YinYang }
> = {
  甲: { element: 'wood', elementZh: '木', yinYang: 'yang' },
  乙: { element: 'wood', elementZh: '木', yinYang: 'yin' },
  丙: { element: 'fire', elementZh: '火', yinYang: 'yang' },
  丁: { element: 'fire', elementZh: '火', yinYang: 'yin' },
  戊: { element: 'earth', elementZh: '土', yinYang: 'yang' },
  己: { element: 'earth', elementZh: '土', yinYang: 'yin' },
  庚: { element: 'metal', elementZh: '金', yinYang: 'yang' },
  辛: { element: 'metal', elementZh: '金', yinYang: 'yin' },
  壬: { element: 'water', elementZh: '水', yinYang: 'yang' },
  癸: { element: 'water', elementZh: '水', yinYang: 'yin' },
};

// 地支屬性對照 (五行、陰陽)
export const BRANCH_INFO: Record<
  EarthlyBranch,
  { element: FiveElement; elementZh: FiveElementNameZh; yinYang: YinYang }
> = {
  子: { element: 'water', elementZh: '水', yinYang: 'yang' },
  丑: { element: 'earth', elementZh: '土', yinYang: 'yin' },
  寅: { element: 'wood', elementZh: '木', yinYang: 'yang' },
  卯: { element: 'wood', elementZh: '木', yinYang: 'yin' },
  辰: { element: 'earth', elementZh: '土', yinYang: 'yang' },
  巳: { element: 'fire', elementZh: '火', yinYang: 'yin' },
  午: { element: 'fire', elementZh: '火', yinYang: 'yang' },
  未: { element: 'earth', elementZh: '土', yinYang: 'yin' },
  申: { element: 'metal', elementZh: '金', yinYang: 'yang' },
  酉: { element: 'metal', elementZh: '金', yinYang: 'yin' },
  戌: { element: 'earth', elementZh: '土', yinYang: 'yang' },
  亥: { element: 'water', elementZh: '水', yinYang: 'yin' },
};

// 地支藏干結構與分配比例（本氣 60-70%、中氣 20-30%、餘氣 10%）
export const BRANCH_HIDDEN_STEMS: Record<
  EarthlyBranch,
  Array<{ stem: HeavenlyStem; role: 'primary' | 'secondary' | 'residual'; weight: number }>
> = {
  子: [{ stem: '癸', role: 'primary', weight: 1.0 }],
  丑: [
    { stem: '己', role: 'primary', weight: 0.6 },
    { stem: '癸', role: 'secondary', weight: 0.3 },
    { stem: '辛', role: 'residual', weight: 0.1 },
  ],
  寅: [
    { stem: '甲', role: 'primary', weight: 0.6 },
    { stem: '丙', role: 'secondary', weight: 0.3 },
    { stem: '戊', role: 'residual', weight: 0.1 },
  ],
  卯: [{ stem: '乙', role: 'primary', weight: 1.0 }],
  辰: [
    { stem: '戊', role: 'primary', weight: 0.6 },
    { stem: '乙', role: 'secondary', weight: 0.3 },
    { stem: '癸', role: 'residual', weight: 0.1 },
  ],
  巳: [
    { stem: '丙', role: 'primary', weight: 0.6 },
    { stem: '戊', role: 'secondary', weight: 0.3 },
    { stem: '庚', role: 'residual', weight: 0.1 },
  ],
  午: [
    { stem: '丁', role: 'primary', weight: 0.7 },
    { stem: '己', role: 'secondary', weight: 0.3 },
  ],
  未: [
    { stem: '己', role: 'primary', weight: 0.6 },
    { stem: '丁', role: 'secondary', weight: 0.3 },
    { stem: '乙', role: 'residual', weight: 0.1 },
  ],
  申: [
    { stem: '庚', role: 'primary', weight: 0.6 },
    { stem: '壬', role: 'secondary', weight: 0.3 },
    { stem: '戊', role: 'residual', weight: 0.1 },
  ],
  酉: [{ stem: '辛', role: 'primary', weight: 1.0 }],
  戌: [
    { stem: '戊', role: 'primary', weight: 0.6 },
    { stem: '辛', role: 'secondary', weight: 0.3 },
    { stem: '丁', role: 'residual', weight: 0.1 },
  ],
  亥: [
    { stem: '壬', role: 'primary', weight: 0.7 },
    { stem: '甲', role: 'secondary', weight: 0.3 },
  ],
};

// 五行現代視覺主題色系與白話意涵
export const ELEMENT_METADATA: Record<
  FiveElement,
  {
    nameZh: FiveElementNameZh;
    archetype: string;
    strengthDesc: string;
    blindspotDesc: string;
    colorToken: { hex: string; twBg: string; twText: string; twBorder: string };
  }
> = {
  wood: {
    nameZh: '木',
    archetype: '成長與願景開創',
    strengthDesc: '具向上生長韌性、富有同理心與宏觀開創視野。',
    blindspotDesc: '過盛易固執不通融、缺乏耐心；過弱則欠缺決斷力與持續力。',
    colorToken: {
      hex: '#10B981', // Emerald 500
      twBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      twText: 'text-emerald-600 dark:text-emerald-400',
      twBorder: 'border-emerald-500/30',
    },
  },
  fire: {
    nameZh: '火',
    archetype: '熱情與感染傳播',
    strengthDesc: '具高感染力、勇於表達、行動爆發力強且善於激勵他人。',
    blindspotDesc: '過盛易情緒焦躁、虎頭蛇尾；過弱則欠缺熱情動機與自信。',
    colorToken: {
      hex: '#F43F5E', // Rose 500
      twBg: 'bg-rose-500/10 dark:bg-rose-500/20',
      twText: 'text-rose-600 dark:text-rose-400',
      twBorder: 'border-rose-500/30',
    },
  },
  earth: {
    nameZh: '土',
    archetype: '包容與穩定承載',
    strengthDesc: '具深厚誠信、沉穩厚重、長於協調整合與化解衝突。',
    blindspotDesc: '過盛易墨守成規、抗拒變革；過弱則欠缺承諾落地與信賴基礎。',
    colorToken: {
      hex: '#F59E0B', // Amber 500
      twBg: 'bg-amber-500/10 dark:bg-amber-500/20',
      twText: 'text-amber-600 dark:text-amber-400',
      twBorder: 'border-amber-500/30',
    },
  },
  metal: {
    nameZh: '金',
    archetype: '條理與果決原則',
    strengthDesc: '具精準邏輯、條理分明、重視紀律效率與正義界線。',
    blindspotDesc: '過盛易好挑剔苛責、過度剛烈；過弱則難立原則底線。',
    colorToken: {
      hex: '#94A3B8', // Slate 400
      twBg: 'bg-slate-500/10 dark:bg-slate-400/20',
      twText: 'text-slate-700 dark:text-slate-300',
      twBorder: 'border-slate-400/30',
    },
  },
  water: {
    nameZh: '水',
    archetype: '靈動與策略洞察',
    strengthDesc: '敏銳機變、思考深邃、善於在不確定性中應變轉型。',
    blindspotDesc: '過盛易思慮過甚、游移漂泊；過弱則視野僵化難以彈性應變。',
    colorToken: {
      hex: '#0EA5E9', // Sky 500
      twBg: 'bg-sky-500/10 dark:bg-sky-500/20',
      twText: 'text-sky-600 dark:text-sky-400',
      twBorder: 'border-sky-500/30',
    },
  },
};

// 十神簡繁體映射與白話詮釋
export const SHISHEN_MAP: Record<
  string,
  { nameZh: TenGod; modernRole: string; description: string }
> = {
  比肩: { nameZh: '比肩', modernRole: '自主同行者', description: '自尊自信，追求獨立與平等對等夥伴' },
  劫财: { nameZh: '劫財', modernRole: '開拓號召者', description: '富冒險精神與團隊感染力，競爭心旺盛' },
  劫財: { nameZh: '劫財', modernRole: '開拓號召者', description: '富冒險精神與團隊感染力，競爭心旺盛' },
  食神: { nameZh: '食神', modernRole: '優雅創造者', description: '重視生活品味、善於展現才能與享受創作' },
  伤官: { nameZh: '傷官', modernRole: '突破革新者', description: '思維敏捷、挑戰既定規則、具犀利才智' },
  傷官: { nameZh: '傷官', modernRole: '突破革新者', description: '思維敏捷、挑戰既定規則、具犀利才智' },
  偏财: { nameZh: '偏財', modernRole: '商業敏銳者', description: '善於資源配置與機遇捕捉，豪爽慷慨' },
  偏財: { nameZh: '偏財', modernRole: '商業敏銳者', description: '善於資源配置與機遇捕捉，豪爽慷慨' },
  正财: { nameZh: '正財', modernRole: '務實運營者', description: '腳踏實地、注重確定性與精準的資產累積' },
  正財: { nameZh: '正財', modernRole: '務實運營者', description: '腳踏實地、注重確定性與精準的資產累積' },
  七杀: { nameZh: '七殺', modernRole: '魄力攻堅者', description: '強悍果斷、逆境作戰力強、威嚴執行者' },
  七殺: { nameZh: '七殺', modernRole: '魄力攻堅者', description: '強悍果斷、逆境作戰力強、威嚴執行者' },
  正官: { nameZh: '正官', modernRole: '秩序守護者', description: '敬業自律、重視信譽流程與社會責任' },
  偏印: { nameZh: '偏印', modernRole: '深度洞察者', description: '獨特直覺、長於非常規探索與技術鑽研' },
  正印: { nameZh: '正印', modernRole: '包容滋育者', description: '善良包容、重精神名譽、善於吸納與教誨' },
};

// 十天干日主現代心理學白話原型字典
const ELEMENT_CYCLE: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];

/**
 * 計算任意天干相對於日主的十神
 */
export function getStemShiShen(target: HeavenlyStem, dayMaster: HeavenlyStem): TenGod {
  const metaT = STEM_INFO[target];
  const metaD = STEM_INFO[dayMaster];
  if (!metaT || !metaD) return '比肩';

  const sameYinYang = metaT.yinYang === metaD.yinYang;
  const idxT = ELEMENT_CYCLE.indexOf(metaT.element);
  const idxD = ELEMENT_CYCLE.indexOf(metaD.element);
  const diff = (idxT - idxD + 5) % 5;

  if (diff === 0) return sameYinYang ? '比肩' : '劫財';
  if (diff === 1) return sameYinYang ? '食神' : '傷官';
  if (diff === 2) return sameYinYang ? '偏財' : '正財';
  if (diff === 3) return sameYinYang ? '七殺' : '正官';
  return sameYinYang ? '偏印' : '正印';
}

export const DAY_MASTER_ARCHETYPES: Record<

  HeavenlyStem,
  {
    archetypeTitle: string;
    keyword: string;
    coreStrengths: string[];
    decisionBlindspots: string[];
    stressResponse: string;
    modernCommunicationAdvice: string;
  }
> = {
  甲: {
    archetypeTitle: '森林參天巨木 · 願景開拓者',
    keyword: '正直開創 · 宏觀視野',
    coreStrengths: ['具頂天立地的領導風骨', '富有同情心與社會正義感', '不輕易向逆境低頭'],
    decisionBlindspots: ['不易接納非主流意見', '自尊心極強，低潮時難以主動開口求助'],
    stressResponse: '遇壓力傾向獨自硬扛，若長期壓抑易產生挫折感或驟然爆發。',
    modernCommunicationAdvice: '溝通時先以大局願景切入，多給予正面肯定，避免在公開場合強硬反駁其觀點。',
  },
  乙: {
    archetypeTitle: '柔韌靈動藤蔓 · 敏捷協調者',
    keyword: '彈性靈活 · 善於借力',
    coreStrengths: ['適應環境力極強', '高同理心與人際潤滑劑', '善於整合各方資源完成目標'],
    decisionBlindspots: ['易受他人意見左右', '為顧全關係而延誤核心決策'],
    stressResponse: '遭遇衝突時傾向退讓或迂迴閃避，內心易積累焦慮情緒。',
    modernCommunicationAdvice: '提供安全支持的對話氛圍，鼓勵其明確表達個人界線與真實需求。',
  },
  丙: {
    archetypeTitle: '盛夏明媚烈陽 · 熱情賦能者',
    keyword: '光明感染 · 積極號召',
    coreStrengths: ['自帶光芒與樂觀感染力', '胸懷坦蕩善於帶動團隊氣氛', '果斷熱烈'],
    decisionBlindspots: ['容易衝動承諾超出負荷的任務', '對細瑣細節缺乏足夠耐心'],
    stressResponse: '急於迅速消除問題，節奏過快時易顯急躁與情緒化。',
    modernCommunicationAdvice: '多回應其熱忱與成果亮點，在具體落地執行上協助建立檢核清單與冷靜期。',
  },
  丁: {
    archetypeTitle: '幽夜溫潤燈燭 · 深度洞察者',
    keyword: '溫暖守護 · 細膩敏銳',
    coreStrengths: ['長於直覺感知與心靈療癒', '專注執著，追求深度思維', '善解人意'],
    decisionBlindspots: ['內心小劇場繁複，易多疑過慮', '容易為他人過度燃燒自己'],
    stressResponse: '傾向將負面情緒內縮深藏，暗自消化而呈現疲憊倦怠。',
    modernCommunicationAdvice: '營造放鬆一對一談心時刻，細心傾聽其感受，切忌用粗糙或敷衍字眼帶過。',
  },
  戊: {
    archetypeTitle: '巍峨厚重高山 · 穩健守護者',
    keyword: '承載包容 · 信用如磐',
    coreStrengths: ['沉穩端正，極具可信賴感', '抗壓承重力佳', '具備天然的大哥大姐守護者氣質'],
    decisionBlindspots: ['思慮過長，容易錯失敏捷變革良機', '一旦認同某些觀念極難改變'],
    stressResponse: '以沉默與固執應對外在混亂，不願輕易透露內心動搖。',
    modernCommunicationAdvice: '給予充分時間消化新方案，講究數據與歷史信據，避免急躁催促決策。',
  },
  己: {
    archetypeTitle: '滋潤豐美沃土 · 細膩培育者',
    keyword: '涵養包容 · 靈活應變',
    coreStrengths: ['包容度廣，擅長默默耕耘', '多才多藝，具備極強的後勤統籌能力', '善解人意'],
    decisionBlindspots: ['顧慮過多，容易心軟而攬下過多責任', '界線模糊致使個人心力耗竭'],
    stressResponse: '默默承受所有要求，當無法負荷時容易產生委屈感。',
    modernCommunicationAdvice: '明確劃分職責範圍，肯定其細微付出，主動分擔其隱形工作量。',
  },
  庚: {
    archetypeTitle: '千錘百鍊鋼鐵 · 果敢執行者',
    keyword: '剛毅銳利 · 講究效率',
    coreStrengths: ['做事雷厲風行毫不拖泥帶水', '重義氣、是非分明', '面對逆境具強悍破局能力'],
    decisionBlindspots: ['講話過於直白容易無心傷人', '非黑即白思維，容錯率較低'],
    stressResponse: '以強力對抗或加倍工作來壓制壓力，外表冷硬但內心渴望真誠認同。',
    modernCommunicationAdvice: '溝通直奔核心重點、說話講求效率，就事論事不拐彎抹角。',
  },
  辛: {
    archetypeTitle: '晶瑩無瑕珠寶 · 品味完美者',
    keyword: '靈氣細緻 · 追求極致',
    coreStrengths: ['敏銳美感與獨特品味', '注重細節與個人聲譽', '能耐得住寂寞追求極致專業'],
    decisionBlindspots: ['容易陷入自卑與自負的內耗循環', '對批評十分敏感且記掛久遠'],
    stressResponse: '內心挑剔焦慮升高，對周遭環境與親密之人要求加苛。',
    modernCommunicationAdvice: '注意用詞的委婉與體貼，多讚賞其獨到眼光與心血成果，給予獨立空間。',
  },
  壬: {
    archetypeTitle: '浩瀚奔湧江河 · 策略謀略家',
    keyword: '宏觀格局 · 隨機應變',
    coreStrengths: ['視野開闊、思維不設限', '善於借力打力推動大規模局勢', '充滿探索好奇心'],
    decisionBlindspots: ['容易熱情分散、欠缺長期定力', '過於自信容易輕忽細節風險'],
    stressResponse: '變換跑道或轉移焦點以逃避束縛，難以忍受停滯不前的僵局。',
    modernCommunicationAdvice: '討論新專案或合作時給予足夠自主揮灑空間，以激勵其智謀與宏觀布局。',
  },
  癸: {
    archetypeTitle: '甘霖朝露清泉 · 靈性哲思者',
    keyword: '潤物無聲 · 智慧洞見',
    coreStrengths: ['洞察力直透本質', '善於以柔克剛化解堅冰', '記憶力與學習領悟力超群'],
    decisionBlindspots: ['情緒易隨環境氛圍波動', '想太多而裹足不前、缺乏實體落地決心'],
    stressResponse: '情緒化、退回精神世界，對外界刺激產生過度防備。',
    modernCommunicationAdvice: '建立真誠信任感，以溫和且具同理心的口吻交流，尊重其敏感脆弱的情緒開關。',
  },
};
