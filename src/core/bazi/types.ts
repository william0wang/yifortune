export interface BaziInput {
  year: number
  month: number
  day: number
  hour: number
  minute?: number
}

export interface Pillar {
  stem: string // 天干
  branch: string // 地支
  stemElement: string // 天干五行
  branchElement: string // 地支五行
  nanyin: string // 纳音
  hideStems: string[] // 藏干
  animal: string // 生肖 (仅年柱)
}

export interface BaziResult {
  // 四柱
  year: Pillar
  month: Pillar
  day: Pillar
  hour: Pillar

  // 日主
  dayMaster: string
  dayMasterElement: string
  dayMasterYinYang: string

  // 胎元胎息命宫身宫
  fetalOrigin: string // 胎元
  fetalBreath: string // 胎息
  ownSign: string // 命宫
  bodySign: string // 身宫

  // 五行统计
  elementCount: Record<string, number>

  // 十二长生 (日干在月支)
  terrain: string
}

// 五行
export const ELEMENTS = ['木', '火', '土', '金', '水'] as const
export type Element = (typeof ELEMENTS)[number]

// 天干
export const HEAVEN_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const

// 地支
export const EARTH_BRANCHES = [
  '子',
  '丑',
  '寅',
  '卯',
  '辰',
  '巳',
  '午',
  '未',
  '申',
  '酉',
  '戌',
  '亥',
] as const

// 生肖
export const ZODIACS = [
  '鼠',
  '牛',
  '虎',
  '兔',
  '龙',
  '蛇',
  '马',
  '羊',
  '猴',
  '鸡',
  '狗',
  '猪',
] as const

// 天干五行对应
export const STEM_ELEMENTS: Record<string, string> = {
  甲: '木',
  乙: '木',
  丙: '火',
  丁: '火',
  戊: '土',
  己: '土',
  庚: '金',
  辛: '金',
  壬: '水',
  癸: '水',
}

// 地支五行对应
export const BRANCH_ELEMENTS: Record<string, string> = {
  子: '水',
  丑: '土',
  寅: '木',
  卯: '木',
  辰: '土',
  巳: '火',
  午: '火',
  未: '土',
  申: '金',
  酉: '金',
  戌: '土',
  亥: '水',
}

// 地支生肖对应
export const BRANCH_ZODIACS: Record<string, string> = {
  子: '鼠',
  丑: '牛',
  寅: '虎',
  卯: '兔',
  辰: '龙',
  巳: '蛇',
  午: '马',
  未: '羊',
  申: '猴',
  酉: '鸡',
  戌: '狗',
  亥: '猪',
}

// 阴阳
export const YIN_YANG: Record<string, string> = {
  甲: '阳',
  乙: '阴',
  丙: '阳',
  丁: '阴',
  戊: '阳',
  己: '阴',
  庚: '阳',
  辛: '阴',
  壬: '阳',
  癸: '阴',
}
