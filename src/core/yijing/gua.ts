import { codeToInt, getYiData, intToCode } from './data'
import type { Yao, YaoState, YiGuaInfo, YiResult } from './types'
import { YANG, YANG_CHANGE, YIN, YIN_CHANGE } from './types'

/**
 * Convert number to yao (line)
 */
export function intToYao(n: number): YaoState {
  const r = [0, 0, 0]
  let v = n

  for (let i = 0; i < 3; i++) {
    r[i] = v % 2
    v = Math.floor(v / 2)
  }

  const rx = r.filter((x) => x === 1).length

  if (rx === 0) return YIN_CHANGE
  if (rx === 3) return YANG_CHANGE
  if (rx === 1) return YANG
  return YIN
}

/**
 * Simulate yarrow stalk method to generate a yao (line)
 */
export function randomYao(): YaoState {
  const r = [0, 0, 0]

  for (let i = 0; i < 3; i++) {
    const operations = 3 * (Math.floor(Math.random() * 9) + 3)
    for (let j = 0; j < operations; j++) {
      const offset = Math.floor(Math.random() * 5)
      const seed = Date.now() + offset
      const x = Math.sin(seed) * 10000
      const rb = Math.floor((x - Math.floor(x)) * 2)
      r[i % 3] ^= rb
    }
  }

  const rx = r.filter((x) => x === 1).length

  if (rx === 0) return YIN_CHANGE
  if (rx === 3) return YANG_CHANGE
  if (rx === 1) return YANG
  return YIN
}

/**
 * Hexagram (Gua) class - contains yao (lines) and operations
 */
export class YiGua {
  yao: Yao[] = []
  guaCode = ''
  yaoCode = ''

  constructor() {
    this.yao = Array.from({ length: 6 }, () => ({ yao: YIN, dong: false }))
  }

  /**
   * Get total number of changing lines
   */
  numDong(): number {
    return this.yao.filter((y) => y.dong).length
  }

  /**
   * Get number of changing yin lines
   */
  numDongYin(): number {
    return this.yao.filter((y) => y.dong && y.yao === YIN).length
  }

  /**
   * Check if yao at position is a changing line (dong)
   */
  isDong(i: number): boolean {
    return this.yao[i].dong
  }

  /**
   * Generate gua code and yao code - core changing line algorithm
   */
  genCode(): string {
    // Calculate ben gua (original hexagram) code
    let gua = 0
    for (let i = 0; i < 6; i++) {
      gua |= this.yao[i].yao << i
    }

    this.guaCode = intToCode(gua)

    let code = ''
    const dong = this.numDong()

    if (dong === 0) {
      // No changing lines - use ben gua judgment
      code = '111111'
    } else if (dong === 1) {
      // One changing line - use that line's text
      for (let i = 0; i < 6; i++) {
        code = (this.yao[i].dong ? '1' : '0') + code
      }
    } else if (dong === 2) {
      const yin = this.numDongYin()
      if (yin === 1) {
        // Two changing lines with one yin - use yin line's text
        for (let i = 0; i < 6; i++) {
          code = (this.yao[i].dong && this.yao[i].yao === YIN ? '1' : '0') + code
        }
      } else {
        // Two changing lines of same type - use upper line
        let first = true
        for (let i = 0; i < 6; i++) {
          if (this.yao[i].dong) {
            code = (first ? '1' : '0') + code
            first = false
          } else {
            code = `0${code}`
          }
        }
      }
    } else if (dong === 3) {
      // Three changing lines - use middle line's text
      let num = 0
      for (let i = 0; i < 6; i++) {
        if (this.yao[i].dong) {
          code = (num === 1 ? '1' : '0') + code
          num++
        } else {
          code = `0${code}`
        }
      }
    } else if (dong === 4) {
      // Four changing lines - use static line's text
      let first = true
      for (let i = 0; i < 6; i++) {
        if (this.yao[i].dong) {
          code = `0${code}`
        } else {
          code = (first ? '1' : '0') + code
          first = false
        }
      }
    } else if (dong === 5) {
      // Five changing lines - use static line's text
      for (let i = 0; i < 6; i++) {
        code = (this.yao[i].dong ? '0' : '1') + code
      }
    } else if (dong === 6) {
      // All changing lines
      if (gua === 0b111111 || gua === 0b000000) {
        code = '000000'
      } else {
        // Use gong yi
        code = '101010'
      }
    }

    this.yaoCode = code
    return this.guaCode + this.yaoCode
  }

  /**
   * Set all yao at once
   */
  setAllYao(yaoArr: YaoState[]): void {
    for (let i = 0; i < Math.min(6, yaoArr.length); i++) {
      const y = yaoArr[i]
      if (y === YIN_CHANGE || y === YANG_CHANGE) {
        this.yao[i].dong = true
      }
      this.yao[i].yao = (y & 0b01) as YaoState
    }

    this.genCode()
  }

  /**
   * Check if this is ben gua (original hexagram)
   */
  isBenGua(): boolean {
    return this.yaoCode === '111111'
  }

  /**
   * Get corresponding yijing data
   */
  getYi() {
    const fullCode = codeToInt(this.guaCode + this.yaoCode)
    return getYiData(fullCode)
  }

  /**
   * Get hexagram info (gua ci)
   */
  guaInfo(): string {
    const yi = getYiData(codeToInt(`${this.guaCode}111111`))
    return yi?.data ?? ''
  }

  /**
   * Get yao (line) info
   */
  yaoInfo(): string {
    const yi = this.getYi()
    return yi?.data ?? ''
  }
}

/**
 * Format result as YiGuaInfo
 */
function formatGuaInfo(gua: YiGua): YiGuaInfo {
  const yi = gua.getYi()

  return {
    guaCode: gua.guaCode,
    yaoCode: gua.yaoCode,
    fullCode: gua.guaCode + gua.yaoCode,
    name: yi?.gua ?? '',
    yaoName: yi?.yao ?? '',
    isBenGua: gua.isBenGua(),
    info: gua.guaInfo(),
    yaoInfo: gua.yaoInfo(),
  }
}

/**
 * Random divination (yarrow stalk method)
 */
export function randomDivination(): YiResult {
  const gua = new YiGua()
  const yaoArr: YaoState[] = []

  // Generate 6 yao using yarrow stalk method
  for (let i = 0; i < 6; i++) {
    yaoArr.push(randomYao())
  }

  gua.setAllYao(yaoArr)

  const guaInfo = formatGuaInfo(gua)
  const dongYao: number[] = []
  for (let i = 0; i < 6; i++) {
    if (gua.isDong(i)) dongYao.push(i)
  }

  return {
    gua: guaInfo,
    dongYao,
    numDong: dongYao.length,
  }
}

/**
 * Divination by 3 numbers
 */
export function divinationByNumbers(numbers: number[]): YiResult {
  if (numbers.length !== 3) {
    throw new Error('需要提供3个数字')
  }

  const gua = new YiGua()
  const yaoArr: YaoState[] = []

  // Convert 3 numbers to 6 yao
  for (const num of numbers) {
    const yao1 = intToYao(num)
    const yao2 = intToYao(num + 1)
    yaoArr.push(yao1, yao2)
  }

  // Take only first 6 yao
  gua.setAllYao(yaoArr.slice(0, 6))

  const guaInfo = formatGuaInfo(gua)
  const dongYao: number[] = []
  for (let i = 0; i < 6; i++) {
    if (gua.isDong(i)) dongYao.push(i)
  }

  return {
    gua: guaInfo,
    dongYao,
    numDong: dongYao.length,
  }
}
