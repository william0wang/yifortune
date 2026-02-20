# 知运

纯前端的易经和八字计算工具，无需后端支持。

## 版本说明

| 功能 | 开源版 | 完整版 |
|------|--------|--------|
| 易经起卦 | ✅ | ✅ |
| 八字命盘 | ✅ | ✅ |
| 基础计算 | ✅ | ✅ |
| AI 智能分析 | - | ✅ |
| 个性化预测 | - | ✅ |
| 用户系统 | - | ✅ |
| 历史记录 | - | ✅ |

**完整版地址**: https://yi.3eqf.top/

## 开源版功能

### 易经起卦
- 数字起卦：输入 3 个数字生成卦象
- 随机起卦：蓍草法随机生成
- 显示卦名、卦象、变爻、卦辞、爻辞

### 八字命盘
- 四柱八字（年月日时）
- 天干地支、五行
- 纳音、生肖、藏干
- 五行分布统计
- 胎元、胎息、命宫、身宫

## 技术栈

- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4
- tyme4ts（八字计算）

## 开发

```bash
pnpm install    # 安装依赖
pnpm dev        # 开发服务器
pnpm build      # 构建
```

## API

```typescript
// 易经
import { randomDivination, divinationByNumbers } from '@/core/yijing'
randomDivination()                    // 随机起卦
divinationByNumbers([12, 34, 8])      // 数字起卦

// 八字
import { calculateBazi } from '@/core/bazi'
calculateBazi({ year: 1990, month: 5, day: 20, hour: 8 })
```

## License

MIT
