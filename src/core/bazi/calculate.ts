import { LunarHour } from 'tyme4ts'
import type { BaziInput, BaziResult, Pillar } from './types'
import { BRANCH_ELEMENTS, BRANCH_ZODIACS, STEM_ELEMENTS, YIN_YANG } from './types'

/**
 * Calculate BaZi (Four Pillars) from birth date/time
 */
export function calculateBazi(input: BaziInput): BaziResult {
  const { year, month, day, hour, minute = 0 } = input

  // Create lunar hour from solar time
  const lunarHour = LunarHour.fromYmdHms(year, month, day, hour, minute, 0)

  // Get EightChar (BaZi)
  const eightChar = lunarHour.getEightChar()

  // Get pillars
  const yearCycle = eightChar.getYear()
  const monthCycle = eightChar.getMonth()
  const dayCycle = eightChar.getDay()
  const hourCycle = eightChar.getHour()

  // Parse pillars
  const yearPillar = parsePillar(yearCycle, true)
  const monthPillar = parsePillar(monthCycle, false)
  const dayPillar = parsePillar(dayCycle, false)
  const hourPillar = parsePillar(hourCycle, false)

  // Get day master (日主)
  const dayMaster = dayPillar.stem
  const dayMasterElement = dayPillar.stemElement
  const dayMasterYinYang = YIN_YANG[dayMaster] || '未知'

  // 胎元、胎息、命宫、身宫
  const fetalOrigin = eightChar.getFetalOrigin().getName()
  const fetalBreath = eightChar.getFetalBreath().getName()
  const ownSign = eightChar.getOwnSign().getName()
  const bodySign = eightChar.getBodySign().getName()

  // 五行统计
  const elementCount: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 }

  // 统计天干五行
  for (const pillar of [yearPillar, monthPillar, dayPillar, hourPillar]) {
    elementCount[pillar.stemElement] = (elementCount[pillar.stemElement] || 0) + 1
    elementCount[pillar.branchElement] = (elementCount[pillar.branchElement] || 0) + 1
  }

  // 十二长生 (日干在月支)
  const terrain = dayCycle.getHeavenStem().getTerrain(monthCycle.getEarthBranch()).getName()

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    dayMaster,
    dayMasterElement,
    dayMasterYinYang,
    fetalOrigin,
    fetalBreath,
    ownSign,
    bodySign,
    elementCount,
    terrain,
  }
}

/**
 * Parse a SixtyCycle to Pillar
 */
function parsePillar(
  cycle: {
    getHeavenStem: () => { getName: () => string }
    getEarthBranch: () => {
      getName: () => string
      getHideHeavenStems: () => Array<{ getHeavenStem: () => { getName: () => string } }>
    }
    getSound: () => { getName: () => string }
  },
  isYear: boolean
): Pillar {
  const stem = cycle.getHeavenStem().getName()
  const branch = cycle.getEarthBranch().getName()
  const stemElement = STEM_ELEMENTS[stem] || '未知'
  const branchElement = BRANCH_ELEMENTS[branch] || '未知'
  const animal = isYear ? BRANCH_ZODIACS[branch] || '未知' : ''

  // 纳音
  const nanyin = cycle.getSound().getName()

  // 藏干
  const hideStems = cycle
    .getEarthBranch()
    .getHideHeavenStems()
    .map((h) => h.getHeavenStem().getName())

  return {
    stem,
    branch,
    stemElement,
    branchElement,
    nanyin,
    hideStems,
    animal,
  }
}
