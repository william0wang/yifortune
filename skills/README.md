# YiFortune Skill

> **Version 1.0.0** · Updated 2026-07-28 · [Changelog](#changelog)

把专业的命理解读框架"教"给 AI 客户端，让 LLM 在调用 YiFortune MCP 工具拿到原始数据后，按专业框架输出高质量解读。

## 架构：单 Skill + 渐进式披露

遵循 [Agent Skills 规范](https://agentskills.io/specification)，YiFortune 是**一个 skill**，通过渐进式披露按需加载各主题的解读框架：

```
yifortune/                          ← 唯一的 skill 目录
├── SKILL.md                        ← 入口：路由表 + 全局原则（触发时加载）
├── scripts/
│   ├── natal_chart.py              ← 占星本地计算（Python + kerykeion，离线）
│   └── requirements.txt
└── references/                     ← 各主题详细解读框架（按需加载，不占启动上下文）
    ├── bazi-chart.md               ← 八字排盘解读（日主/格局/十神/大运/刑冲合会）
    ├── astrology-chart.md          ← 占星排盘解读（三巨头/行星落宫/相位）
    ├── yijing-cast.md              ← 易经起卦解读（本卦/动爻/变卦/贞悔亨厉）
    ├── glossary.md                 ← 术语字典 + 映射表（single source of truth）
    ├── mapping-tables.md           ← 扩展映射表（五行→行业/脏腑/颜色/数字…）
    ├── terms-detail.md             ← 术语深挖（纳音/胎元/五格剖象法/生肖全表…）
    ├── career.md                   ← 事业方向
    ├── wealth.md                   ← 财运分析
    ├── love.md                     ← 感情婚姻
    ├── health.md                   ← 健康养生
    ├── growth.md                   ← 个人成长
    ├── compatibility.md            ← 配对合婚
    ├── period-fortune.md           ← 周期运势（日/周/月/年）
    ├── name-analysis.md            ← 姓名分析
    ├── date-selection.md           ← 择日择吉
    ├── fengshui.md                 ← 风水方位/幸运元素
    └── annual-reading.md           ← 年度流年详批
```

**三层加载**（来自 Agent Skills 规范）：

1. **Metadata**（启动时）：Claude 只读 `SKILL.md` 的 frontmatter（`name` + `description`），判断是否触发本 skill
2. **Body**（触发时）：触发后读 `SKILL.md` 正文 —— 路由表 + 全局原则，按用户问题定位到具体 reference
3. **References**（按需）：只在需要某主题时加载对应 `references/*.md`，避免一次性灌满上下文

**设计原则**：

- **术语 single source of truth**：所有术语定义集中在 `references/glossary.md`（+ 扩展表），其他 reference 只引用不重复
- **数据层与功能层分离**：`bazi-chart.md` / `astrology-chart.md` / `yijing-cast.md` 只做排盘/起卦的结构化解读，功能层 reference 各专注一个生活主题
- **交叉引用**：功能层 reference 通过 context pointer 引用数据层（如 `career.md` 引用 `bazi-chart.md` 和 `glossary.md`）
- **语言自适应**：`SKILL.md` 定义全局原则——检测用户语言，用相同语言回答和追问

## 前置条件

本 skill 需要配合 **YiFortune MCP HTTP 端点**一起使用——skill 提供解读框架，MCP 提供计算数据。使用前两步：

**第一步 — 领 API Key**：打开 **https://yifortune.pages.dev**，输入邮箱，Key 会通过邮件发到你邮箱（注意查收垃圾箱）。普通用户默认 100 次/月配额，按自然月重置。

**第二步 — 配置 MCP 客户端**：按 [yifortune/references/setup.md](yifortune/references/setup.md) 把客户端指向 `https://mcp.yifortune.workers.dev/mcp`，并在请求头带上 `X-API-Key: yfk_...`（你收到的 Key）。

**例外：占星不走 MCP**——`references/astrology-chart.md` 用 `scripts/natal_chart.py`（Python + kerykeion）本地计算星盘。需额外装一次 Python 依赖（从 repo 根目录运行）：

```bash
pip install -r skills/yifortune/scripts/requirements.txt   # Python ≥ 3.10
```

## 安装

把 `yifortune` 目录复制到你的 AI 客户端对应的 skills 目录：

### ZCode

```bash
cp -r yifortune ~/.zcode/skills/
```

### Claude Code / 其他 ~/.agents 客户端

```bash
cp -r yifortune ~/.agents/skills/
```

## 验证安装

安装 + 配好 MCP 端点后，在客户端里试这几句话：

1. **"帮我排个八字，1990 年 1 月 15 日下午 2 点 30 分出生在上海，男"**
   → 加载 `references/bazi-chart.md`，输出结构化八字盘解读

2. **"我适合做什么工作？"**（需先提供出生信息）
   → 加载 `references/career.md`，输出十神→职业天赋 + 用神→行业方向

3. **"帮我为'今年换工作是否合适'起一卦"**（需先让用户报三个 0–99 的数）
   → 加载 `references/yijing-cast.md`，输出卦象决策分析

4. **"What does my astrology chart say about me?"** (English)
   → 加载 `references/astrology-chart.md`，**全程英文回答**

5. **"我属龙他属狗，我们配不配"**
   → 加载 `references/compatibility.md`，输出多系统配对分析

6. **"下个月想搬家，帮我选个吉日"**（需提供出生信息）
   → 加载 `references/date-selection.md`，输出避冲+神煞+用神综合择日

## 这个 Skill 不做什么

- ❌ **不含合规规则**——解读由用户的 LLM 自由完成，不需要词汇规避
- ❌ **不含字数硬性规定**——与解读质量无关
- ❌ **不替 LLM 做解读决策**——skill 提供框架和术语，LLM 用自己的能力产出解读

## Changelog

遵循 [语义化版本](https://semver.org/lang/zh-CN/)：MAJOR（不兼容变更）/ MINOR（向后兼容新增）/ PATCH（修 bug）。

### 1.0.0 — 2026-07-28

- 首个公开发布版本
- 单 skill + 渐进式披露架构（`SKILL.md` 入口 + `references/` 按需加载 + `scripts/` 本地占星计算）
- 启动时主动验证 MCP 连接，失败时按错误类型引导用户配置（见 `references/setup.md`）
- 覆盖 15 个主题：八字 / 占星 / 易经 / 事业 / 财运 / 感情 / 健康 / 成长 / 配对 / 周期运势 / 姓名 / 择日 / 风水 / 年度详批 / 术语
- **白话结论层**：每个解读双层输出——内层命理要点（术语 OK）+ 外层大白话总结（强制最后输出）
- **语言匹配**：检测用户语言，全程用同一种语言回答
- **推断优先**：性别、公历/农历等能从用户输入读出来的不再追问
- **MCP 返回 currentDate**：所有工具返回服务器当前时间作为"今天"锚点，避免预测已过去的时间
