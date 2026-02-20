// Yao (line) states - 4 possible states
export const YIN = 0b00 as const // Yin line --
export const YANG = 0b01 as const // Yang line ⚊
export const YIN_CHANGE = 0b10 as const // Changing yin ⚋
export const YANG_CHANGE = 0b11 as const // Changing yang ⚊

export type YaoState = typeof YIN | typeof YANG | typeof YIN_CHANGE | typeof YANG_CHANGE

export interface Yao {
  yao: YaoState
  dong: boolean
}

export interface YiDataLite {
  code: number
  gua: string
  yao: string
  data: string
}

export interface YiGuaInfo {
  guaCode: string
  yaoCode: string
  fullCode: string
  name: string
  yaoName: string
  isBenGua: boolean
  info: string
  yaoInfo: string
}

export interface YiResult {
  gua: YiGuaInfo
  dongYao: number[]
  numDong: number
}

export interface YijingNumbersInput {
  numbers: number[]
}
