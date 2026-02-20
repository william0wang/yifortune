import { useState } from 'react'
import type { YiResult } from '@/core/yijing'
import { divinationByNumbers, randomDivination } from '@/core/yijing'

export function YijingPage() {
  const [result, setResult] = useState<YiResult | null>(null)
  const [numbers, setNumbers] = useState(['', '', ''])
  const [loading, setLoading] = useState(false)

  const handleRandom = () => {
    setLoading(true)
    try {
      const res = randomDivination()
      setResult(res)
    } finally {
      setLoading(false)
    }
  }

  const handleNumbers = () => {
    const nums = numbers.map((n) => parseInt(n, 10) || 0)
    if (nums.some((n) => n < 1 || n > 50)) {
      alert('请输入1-50之间的数字')
      return
    }

    setLoading(true)
    try {
      const res = divinationByNumbers(nums)
      setResult(res)
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleNumberChange = (index: number, value: string) => {
    const newNumbers = [...numbers]
    newNumbers[index] = value
    setNumbers(newNumbers)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">数字起卦</h2>
          <p className="mb-4 text-sm text-gray-500">心中默念想问之事，凭直觉输入3个1-50之间的数字</p>
          <div className="mb-4 flex gap-2">
            <input
              type="number"
              min={1}
              max={50}
              value={numbers[0]}
              onChange={(e) => handleNumberChange(0, e.target.value)}
              className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-center focus:border-purple-500 focus:outline-none"
              placeholder="数1"
            />
            <input
              type="number"
              min={1}
              max={50}
              value={numbers[1]}
              onChange={(e) => handleNumberChange(1, e.target.value)}
              className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-center focus:border-purple-500 focus:outline-none"
              placeholder="数2"
            />
            <input
              type="number"
              min={1}
              max={50}
              value={numbers[2]}
              onChange={(e) => handleNumberChange(2, e.target.value)}
              className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-center focus:border-purple-500 focus:outline-none"
              placeholder="数3"
            />
          </div>
          <button
            type="button"
            onClick={handleNumbers}
            disabled={loading}
            className="rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? '计算中...' : '起卦'}
          </button>
        </div>

        <div className="rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">随机起卦</h2>
          <p className="mb-4 text-sm text-gray-500">心中默念想问之事，使用蓍草法随机生成卦象</p>
          <button
            type="button"
            onClick={handleRandom}
            disabled={loading}
            className="rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? '计算中...' : '随机起卦'}
          </button>
        </div>
      </div>

      {result && <GuaResult result={result} />}
    </div>
  )
}

function GuaResult({ result }: { result: YiResult }) {
  const { gua, dongYao, numDong } = result

  // Render hexagram lines (从上到下: 5,4,3,2,1,0)
  const renderLines = () => {
    const lines = []
    for (let i = 5; i >= 0; i--) {
      const isYang = gua.guaCode[5 - i] === '1'
      const isDong = dongYao.includes(i)
      const lineColor = isDong ? 'bg-red-500' : 'bg-gray-800'

      lines.push(
        <div key={i} className="flex items-center justify-center">
          {isYang ? (
            // 阳爻：实线
            <div className={`h-1.5 w-16 rounded-sm ${lineColor}`} />
          ) : (
            // 阴爻：断开的线
            <div className="flex w-16 justify-between">
              <div className={`h-1.5 w-6 rounded-sm ${lineColor}`} />
              <div className={`h-1.5 w-6 rounded-sm ${lineColor}`} />
            </div>
          )}
        </div>
      )
    }
    return lines
  }

  return (
    <div className="rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start gap-6">
        {/* 卦象图 */}
        <div className="flex flex-col items-center">
          <div className="mb-4 flex flex-col gap-1.5">{renderLines()}</div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{gua.name}</div>
            {gua.yaoName && <div className="text-sm text-gray-500">{gua.yaoName}</div>}
          </div>
        </div>

        {/* 信息 */}
        <div className="flex-1">
          <div className="mb-2 text-sm text-gray-500">
            卦码: {gua.guaCode} | 爻码: {gua.yaoCode}
          </div>
          <div className="mb-2 text-sm text-gray-500">动爻数: {numDong}</div>
          {dongYao.length > 0 && (
            <div className="mb-2 text-sm text-gray-500">
              动爻位置: {dongYao.map((i) => ['初', '二', '三', '四', '五', '上'][i]).join('、')}
            </div>
          )}
        </div>
      </div>

      {/* 卦辞 */}
      {gua.info && (
        <div className="mb-4">
          <h3 className="mb-2 font-semibold text-gray-800">卦辞</h3>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{gua.info}</p>
        </div>
      )}

      {/* 爻辞 */}
      {gua.yaoInfo && !gua.isBenGua && (
        <div>
          <h3 className="mb-2 font-semibold text-gray-800">爻辞</h3>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{gua.yaoInfo}</p>
        </div>
      )}
    </div>
  )
}
