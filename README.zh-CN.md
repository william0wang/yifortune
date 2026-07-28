# YiFortune Skill

[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-spec%20compliant-blue)](https://agentskills.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](#changelog)

**[English](README.md)** · **简体中文**

> 一个符合 [Agent Skills](https://agentskills.io) 规范的 skill，把任意 LLM 客户端变成专业的命理解读助手。

YiFortune 教 AI **怎么解读**命理数据——排盘框架、术语体系、白话表达——这样当八字或卦象算出来之后，输出的是一份高质量的专业解读，而不是一堆原始数字。

覆盖 **15 个主题**：八字、西方占星、易经起卦、事业、财运、感情、健康、成长、配对、周期运势、姓名、择日、风水、流年详批，外加一套共享的术语层。

## 这个仓库是什么 —— 以及不是什么

| ✅ 提供 | ❌ 不包含 |
| ------ | ------ |
| `yifortune` skill（SKILL.md + references + scripts） | MCP 服务端 / 计算引擎 |
| 15 个命理主题的解读框架 | 前端 / 领 Key 服务 |
| 本地运行的西方占星 Python 脚本 | API Key 或托管基础设施 |
| 白话输出规则（AI 服务普通人，不是命理大师） | 域名 / 部署配置 |

计算引擎作为独立的 **MCP HTTP 服务**运行，本 skill 消费它的输出并做解读。详见[前置条件](#前置条件)。

---

## 前置条件

### 1. 获取 API Key

打开 **https://yifortune.pages.dev**，输入邮箱，API Key（`yfk_...`）会发到邮箱（注意查垃圾邮件）。免费额度：每用户每月 100 次调用，每月 1 号重置。

### 2. 确认客户端支持 Streamable HTTP MCP

YiFortune MCP 服务使用 **Streamable HTTP** 传输协议 + API Key 鉴权。兼容的客户端：

- **Claude Code** / **Claude Desktop**
- **Cursor**
- **ZCode**
- 任何支持 MCP [Streamable HTTP](https://modelcontextprotocol.io/specification) 传输的客户端

---

## 安装

根据你的客户端选择对应方式。所有方式都需要先完成[前置条件](#前置条件)。

### 方式 A —— 手动安装（Claude Code、ZCode、Claude Desktop、Cursor 等）

把 `yifortune` skill 目录复制到客户端的 skills 文件夹。

**Claude Code / 其他兼容 `~/.agents` 的客户端：**

```bash
git clone https://github.com/william0wang/yifortune.git
cp -r yifortune/skills/yifortune ~/.agents/skills/
```

**ZCode：**

```bash
git clone https://github.com/william0wang/yifortune.git
cp -r yifortune/skills/yifortune ~/.zcode/skills/
```

**Claude Desktop：** 把 skill 放到 `~/Library/Application Support/Claude/skills/`（macOS）或 `%APPDATA%\Claude\skills\`（Windows），然后重启 Claude Desktop。

安装后直接在对话里提到即可——比如"用 yifortune skill 帮我看个八字"。

### 方式 B —— Claude API

可以通过 Claude API 上传自定义 skill。参考 [Skills API Quickstart](https://docs.claude.com/en/api/skills-guide)，把 skill 指向下面描述的 YiFortune MCP 端点。

### 配置 MCP 端点

安装 skill 后，把客户端指向 YiFortune MCP 服务：

- **端点**：`https://mcp.yifortune.workers.dev/mcp`
- **鉴权头**：`X-API-Key: yfk_xxxxxxxxxxxxxxxxxxxxxxxx`（第 1 步拿到的 Key）

各客户端（Claude Desktop JSON、Cursor、ZCode）的具体配置片段见 [`skills/yifortune/references/setup.md`](skills/yifortune/references/setup.md)。

### （仅西方占星）安装 Python 依赖

西方占星通过内置 Python 脚本在**本地**计算（不走 MCP）。一次性安装：

```bash
pip install -r skills/yifortune/scripts/requirements.txt   # 需要 Python ≥ 3.10
```

八字和易经**不需要**这个——它们走 MCP 服务。

> ⚠️ **许可证提示**：占星脚本依赖 [kerykeion](https://github.com/g-battaglia/kerykeion)，它是 **AGPL-3.0**（强 copyleft）。导入它就会让 AGPL 条款作用于你的应用。闭源 / 商业用途建议改用 kerykeion 的托管服务 [Astrologer API](https://www.kerykeion.net/astrologer-api)。skill 的其余部分（markdown + 走 MCP 的八字/易经）是 MIT，不受影响。详见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

---

## 验证安装

安装并配好 MCP 端点后，在客户端里试这些：

| 提示词 | 会发生什么 |
| ------ | ---------- |
| "帮我排个八字，1990 年 1 月 15 日下午 2 点 30 分出生在上海，男" | 八字排盘解读 |
| "我适合做什么工作？"（需提供出生信息） | 事业分析 |
| "帮我为'今年换工作是否合适'起一卦" | 易经起卦（会让你报三个数）|
| "What does my astrology chart say about me?" | 西方星盘解读（用**英文**回答）|
| "下个月想搬家，帮我选个吉日" | 择吉日 |

每个会话的第一次调用会自动验证 MCP 连接。如果失败，skill 会引导你完成配置——见 [`references/setup.md`](skills/yifortune/references/setup.md)。

---

## 架构：单 skill + 渐进式披露

遵循 [Agent Skills 规范](https://agentskills.io/specification)，YiFortune 是**一个 skill**，内容按需加载：

```
skills/yifortune/
├── SKILL.md                  ← 入口：路由表 + 全局原则（触发时加载）
├── scripts/
│   ├── natal_chart.py        ← 本地西方占星计算（Python + kerykeion，离线）
│   └── requirements.txt
└── references/               ← 各主题解读框架（按需加载，启动时不读）
    ├── bazi-chart.md         ← 八字解读（数据层）
    ├── astrology-chart.md    ← 西方占星解读（数据层）
    ├── yijing-cast.md        ← 易经起卦解读（数据层）
    ├── glossary.md           ← 术语（唯一真相源）
    ├── mapping-tables.md     ← 扩展五行映射表
    ├── terms-detail.md       ← 深度术语参考
    ├── setup.md              ← MCP 客户端配置指南
    ├── career.md  wealth.md  love.md  health.md  growth.md
    ├── compatibility.md  period-fortune.md  name-analysis.md
    └── date-selection.md  fengshui.md  annual-reading.md
```

**三层加载**（渐进式披露）：

1. **元数据**（启动时）—— 客户端只读 `SKILL.md` 的 frontmatter，决定是否触发本 skill（约 100 tokens）
2. **正文**（触发时）—— 读 `SKILL.md`：路由表 + 全局原则，然后定位到相关 reference
3. **References**（按需）—— 只在需要某个主题时加载对应的 `references/*.md`，保持上下文窗口精简

---

## 设计原则

- **服务对象是普通人，不是命理大师** —— AI 服务的是好奇的门外汉。每次解读分两层：内层（命理要点 + 术语，保证可追溯）+ **外层大白话**（用户真正想要的）。
- **主动服务** —— AI 自己路由、决定用哪个工具，绝不把工具菜单甩给用户挑。
- **语言匹配** —— 用户用什么语言问，AI 从第一句开始就用同样的语言回答。
- **推断优先** —— 能从用户措辞读出来的出生信息（性别、公历/农历等），AI 不再追问。
- **唯一真相源** —— 所有术语集中在 `references/glossary.md`，其他文件引用它而不是重复定义。

## 这个 skill 不做的事

- ❌ 不做合规 / 审查规则 —— 解读由用户自己的 LLM 产出
- ❌ 不硬性规定字数 —— 与解读质量无关
- ❌ 不替 LLM 做解读决策 —— skill 提供框架和术语，LLM 用自己的能力产出解读

---

## 常见问题

| 症状 | 原因 / 解决 |
| ---- | ----------- |
| Skill 不触发 | 确认 `yifortune` 目录在客户端的 skills 文件夹里，且 `SKILL.md` frontmatter 的 `name: yifortune` 一致。重启客户端。 |
| 找不到 `get_bazi` 工具 | MCP 服务没配好。重新检查端点 URL 和 `X-API-Key` 头——见 [`references/setup.md`](skills/yifortune/references/setup.md)。 |
| 401 "Invalid or disabled API key" | Key 错了 / 打错了。核对邮件里的 Key；丢了的话去 https://yifortune.pages.dev 重新注册。 |
| "Monthly quota exhausted" | 免费额度本月 100 次用完了。下月 1 号重置。 |
| 占星返回 Python 报错 | 运行 `pip install -r skills/yifortune/scripts/requirements.txt`。需要 Python ≥ 3.10。 |

---

## 贡献

欢迎贡献——尤其是术语订正、新主题 reference、翻译。规则见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## Changelog

### 1.0.0 — 2026-07-28

- 首个公开发布版本。单 skill 架构 + 渐进式披露（SKILL.md + references + scripts）
- 覆盖 15 个主题：八字、西方占星、易经、事业、财运、感情、健康、成长、配对、周期运势、姓名、择日、风水、流年详批
- 白话输出规则（双层：专业分析 + 大白话总结）
- 首次调用自动验证 MCP 连接，失败时引导配置

## 许可证

[MIT](LICENSE) © 2026 william0wang
