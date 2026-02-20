# 知运开源版

## 项目概述

纯前端的易经和八字计算工具，无需后端支持。

> 完整版本: https://yi.3eqf.top/ (支持 AI 分析 + 个性化预测)

**技术栈：**
- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4
- Biome (代码格式化)
- tyme4ts (八字计算)

## 开发命令

```bash
pnpm dev        # 启动开发服务器
pnpm build      # 生产构建
pnpm preview    # 预览构建结果
pnpm lint       # 代码检查
pnpm format     # 格式化代码
```

## 项目结构

```
src/
├── core/               # 核心计算（纯 TS，无 React 依赖）
│   ├── yijing/         # 易经计算
│   │   ├── index.ts    # 导出入口
│   │   ├── types.ts    # 类型定义
│   │   ├── gua.ts      # 卦象计算
│   │   └── data.ts     # 易经数据
│   └── bazi/           # 八字计算
│       ├── index.ts
│       ├── types.ts
│       ├── calculate.ts
│       └── constants.ts
├── components/         # UI 组件
├── App.tsx             # 根组件
└── main.tsx            # 入口文件
```

## 功能

### 易经
- `randomDivination()` - 随机起卦（蓍草法）
- `divinationByNumbers([n1, n2, n3])` - 数字起卦（3个数字）

### 八字
- `calculateBazi(input)` - 计算八字四柱
  - 输入: `{ year, month, day, hour, minute? }`
  - 输出: 年月日时四柱、天干地支、五行、纳音、生肖

## 代码风格

- 使用 Biome 格式化
- 单引号，无分号
- 2 空格缩进
- 行宽 100 字符

## 依赖

- `react` + `react-dom` - UI 框架
- `react-router-dom` - 路由
- `tyme4ts` - 八字计算库
