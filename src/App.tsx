import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { BaziPage } from './components/BaziPage'
import { YijingPage } from './components/YijingPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/yijing" element={<YijingPage />} />
            <Route path="/bazi" element={<BaziPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

function Header() {
  const location = useLocation()

  return (
    <header className="border-b border-purple-100 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <h1 className="text-2xl font-bold text-purple-600">知运</h1>
            <p className="text-sm text-gray-500">开源版 · 易经八字计算器</p>
          </Link>
          <nav className="flex gap-4">
            <Link
              to="/yijing"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                location.pathname === '/yijing'
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              易经
            </Link>
            <Link
              to="/bazi"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                location.pathname === '/bazi'
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              八字
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

function HomePage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Link
        to="/yijing"
        className="block rounded-xl border border-purple-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
      >
        <h2 className="mb-4 text-xl font-semibold text-gray-800">易经起卦</h2>
        <p className="text-gray-600">数字起卦、随机起卦，查看卦象与爻辞</p>
        <div className="mt-4 text-sm text-purple-600">点击开始 →</div>
      </Link>

      <Link
        to="/bazi"
        className="block rounded-xl border border-purple-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
      >
        <h2 className="mb-4 text-xl font-semibold text-gray-800">八字命盘</h2>
        <p className="text-gray-600">输入生辰，计算四柱八字、五行、纳音</p>
        <div className="mt-4 text-sm text-purple-600">点击开始 →</div>
      </Link>
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-6 text-center text-sm text-gray-500">
      <p className="mb-2">开源项目 · 纯前端计算 · 无需后端</p>
      <a
        href="https://yi.3eqf.top/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-700"
      >
        <span>完整版：AI 分析 + 个性化预测</span>
        <span>→</span>
      </a>
    </footer>
  )
}

export default App
