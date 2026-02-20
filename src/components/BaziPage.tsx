import { useState } from 'react'
import type { BaziInput, BaziResult as BaziResultType, Pillar } from '@/core/bazi'
import { calculateBazi } from '@/core/bazi'

export function BaziPage() {
  const [input, setInput] = useState<BaziInput>({
    year: 1990,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
  })
  const [result, setResult] = useState<BaziResultType | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = () => {
    // Input validation
    if (input.year < 1900 || input.year > 2100) {
      alert('请输入1900-2100之间的年份')
      return
    }
    if (input.month < 1 || input.month > 12) {
      alert('请输入1-12之间的月份')
      return
    }
    if (input.day < 1 || input.day > 31) {
      alert('请输入1-31之间的日期')
      return
    }

    setLoading(true)
    try {
      const res = calculateBazi(input)
      setResult(res)
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof BaziInput, value: string) => {
    setInput((prev) => ({
      ...prev,
      [field]: parseInt(value, 10) || 0,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">输入生辰</h2>
        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-5">
          <div>
            <label htmlFor="year" className="mb-1 block text-sm text-gray-500">
              年
            </label>
            <input
              id="year"
              type="number"
              value={input.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="month" className="mb-1 block text-sm text-gray-500">
              月
            </label>
            <input
              id="month"
              type="number"
              min={1}
              max={12}
              value={input.month}
              onChange={(e) => handleInputChange('month', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="day" className="mb-1 block text-sm text-gray-500">
              日
            </label>
            <input
              id="day"
              type="number"
              min={1}
              max={31}
              value={input.day}
              onChange={(e) => handleInputChange('day', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="hour" className="mb-1 block text-sm text-gray-500">
              时
            </label>
            <input
              id="hour"
              type="number"
              min={0}
              max={23}
              value={input.hour}
              onChange={(e) => handleInputChange('hour', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="minute" className="mb-1 block text-sm text-gray-500">
              分
            </label>
            <input
              id="minute"
              type="number"
              min={0}
              max={59}
              value={input.minute}
              onChange={(e) => handleInputChange('minute', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleCalculate}
          disabled={loading}
          className="rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? '计算中...' : '排盘'}
        </button>
      </div>

      {result && <BaziResultDisplay result={result} />}
    </div>
  )
}

function BaziResultDisplay({ result }: { result: BaziResultType }) {
  const pillars: { label: string; data: Pillar }[] = [
    { label: '年柱', data: result.year },
    { label: '月柱', data: result.month },
    { label: '日柱', data: result.day },
    { label: '时柱', data: result.hour },
  ]

  const elementColors: Record<string, string> = {
    木: 'text-green-600 bg-green-50',
    火: 'text-red-600 bg-red-50',
    土: 'text-yellow-600 bg-yellow-50',
    金: 'text-gray-600 bg-gray-100',
    水: 'text-blue-600 bg-blue-50',
  }

  return (
    <div className="space-y-6">
      {/* 四柱 */}
      <div className="rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">四柱八字</h2>
        <div className="grid grid-cols-4 gap-3">
          {pillars.map(({ label, data }) => (
            <div key={label} className="rounded-lg bg-purple-50 p-3 text-center">
              <div className="mb-1 text-xs text-gray-500">{label}</div>
              <div className="mb-2 text-3xl font-bold text-purple-600">
                {data.stem}
                {data.branch}
              </div>
              <div className="mb-1 text-xs text-gray-500">
                {data.stemElement}
                {data.branchElement}
              </div>
              <div className="mb-1 text-xs text-gray-400">{data.nanyin}</div>
              {data.animal && (
                <div className="rounded bg-purple-200 px-2 py-0.5 text-sm font-medium text-purple-700">
                  {data.animal}
                </div>
              )}
              {data.hideStems.length > 0 && (
                <div className="mt-2 text-xs text-gray-400">藏干: {data.hideStems.join(' ')}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 日主信息 */}
      <div className="rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">日主</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <div className="text-3xl font-bold text-purple-600">{result.dayMaster}</div>
            <div className="text-sm text-gray-500">日干</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <div
              className={`text-xl font-semibold ${elementColors[result.dayMasterElement]?.split(' ')[0]}`}
            >
              {result.dayMasterElement}命
            </div>
            <div className="text-sm text-gray-500">五行</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <div className="text-xl font-semibold text-gray-700">{result.dayMasterYinYang}</div>
            <div className="text-sm text-gray-500">阴阳</div>
          </div>
        </div>
      </div>

      {/* 五行统计 */}
      <div className="rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">五行分布</h2>
        <div className="flex justify-between gap-2">
          {['木', '火', '土', '金', '水'].map((el) => (
            <div key={el} className="flex-1 text-center">
              <div
                className={`mx-auto mb-1 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold ${elementColors[el]}`}
              >
                {el}
              </div>
              <div className="text-sm text-gray-500">{result.elementCount[el] || 0}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 胎元命宫 */}
      <div className="rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">神煞</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <div className="text-lg font-semibold text-gray-800">{result.fetalOrigin}</div>
            <div className="text-xs text-gray-500">胎元</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <div className="text-lg font-semibold text-gray-800">{result.fetalBreath}</div>
            <div className="text-xs text-gray-500">胎息</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <div className="text-lg font-semibold text-gray-800">{result.ownSign}</div>
            <div className="text-xs text-gray-500">命宫</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <div className="text-lg font-semibold text-gray-800">{result.bodySign}</div>
            <div className="text-xs text-gray-500">身宫</div>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-gray-50 p-3 text-center">
          <div className="text-lg font-semibold text-gray-800">{result.terrain}</div>
          <div className="text-xs text-gray-500">十二长生 (日干在月支)</div>
        </div>
      </div>
    </div>
  )
}
