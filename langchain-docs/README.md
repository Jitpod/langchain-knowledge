# 🦜 LangChain 1.0 Python 知识文档

完整的 LangChain 1.0 Python 学习文档，涵盖从基础到高级的所有知识点，特别针对客服机器人和 RAG 应用场景。

## 📚 项目简介

本项目是为公司 LangChain 知识比赛创建的一套完整学习文档，包含：

- **37 个 HTML 文档页面**：覆盖 LangChain 1.0 所有核心概念
- **270+ 个完整代码示例**：全部基于 LangChain 1.0 最新 API，可直接运行
- **40+ 个 Mermaid 流程图**：清晰展示架构和工作流程
- **2 个完整实战项目**：RAG 系统 + 智能客服机器人

## 🎯 核心特色

### 📖 完整的知识体系

- **基础篇**（5章）：LangChain 简介、核心架构、模型接口、消息系统、工具系统
- **进阶篇**（4章）：Agent 基础、中间件系统、RAG 详解、LCEL 表达式
- **高级应用**（6章）：Runtime、持久化、流式输出、人工介入、长期记忆、LangGraph
- **实战篇**（2章）：客服机器人实战、最佳实践
- **参考篇**（3章）：API 速查表、故障排除、迁移指南
- **扩展篇**（1章）：结构化输出
- **DeepAgents 篇**（8章）：Anthropic 高级 Agent 框架深度探索
- **Multi-Agent 篇**（6章）：多代理协作系统完整指南

### 🚀 实战项目

#### 1. RAG 智能问答系统
- 完整的文档加载、分割、向量化流程
- Chroma 向量数据库集成
- 语义检索和答案生成
- 可运行的完整代码（200+ 行）

#### 2. 电商智能客服机器人 ⭐ 重点
- FAQ 智能问答（基于 RAG）
- 订单查询和管理工具
- 多轮对话和上下文记忆
- 用户偏好长期存储
- 流式实时响应
- 敏感操作人工审核
- 完整端到端项目（500+ 行代码）

### 💡 学习路径推荐

**初学者路径**（7章）：
```
01 → 03 → 05 → 06 → 08 → 16 → 22
LangChain 简介 → 模型接口 → 工具系统 → Agent 基础 → RAG 应用 → 客服机器人 → DeepAgents
```

**中级开发者路径**（7章）：
```
02 → 04 → 07 → 09 → 15 → 21 → 30
核心架构 → 消息系统 → 中间件 → LCEL → LangGraph → 结构化输出 → Multi-Agent
```

**高级开发者路径**（7章）：
```
10 → 12 → 13 → 14 → 24 → 28 → 35
Runtime → 流式输出 → 人工介入 → 长期记忆 → DeepAgents Harness → 记忆管理 → 自定义工作流
```

## 🏗️ 项目结构

```
langchain-docs/
├── index.html                          # 主页和导航入口
├── assets/
│   ├── css/style.css                   # 统一样式文件
│   └── js/mermaid-init.js              # Mermaid 和智能滚动
├── projects/                           # 完整项目代码
│   ├── rag-example/                    # RAG 系统示例
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   └── README.md
│   └── customer-service-bot/           # 客服机器人项目
│       ├── main.py
│       ├── tools.py
│       ├── data/
│       │   ├── faq.json
│       │   └── orders.json
│       ├── requirements.txt
│       └── README.md
├── 01-35.html                          # 36 个知识点文档
└── README.md                           # 本文件
```

## 🚀 快速开始

### 在线浏览

直接在浏览器中打开 `index.html` 即可开始学习。

### 运行示例项目

#### RAG 系统示例

```bash
cd projects/rag-example
pip install -r requirements.txt

# 设置 OpenAI API Key
export OPENAI_API_KEY="your-api-key"

# 运行示例
python main.py
```

#### 客服机器人项目

```bash
cd projects/customer-service-bot
pip install -r requirements.txt

# 设置 API Key
export OPENAI_API_KEY="your-api-key"

# 运行客服机器人
python main.py
```

## 📋 系统要求

- **Python**: 3.10+
- **浏览器**: Chrome 60+, Firefox 55+, Safari 11+, Edge 79+
- **依赖包**: 见各项目的 `requirements.txt`

## ✨ 主要功能特性

### 智能侧边栏导航
- **首次访问**：自动滚动到高亮菜单项（居中位置）
- **后续访问**：记忆上次浏览位置，自动恢复
- **点击导航**：保存当前位置，跨页面持久化
- **基于 localStorage**：无需服务器，纯前端实现

### 响应式设计
- 桌面端：280px 固定侧边栏 + 主内容区
- 移动端（≤768px）：可折叠侧边栏菜单
- 适配各种屏幕尺寸

### 代码高亮
- 支持 Python、Bash、JSON 等多种语言
- 一键复制代码功能
- 难度分级标记（🟢 基础 / 🟡 中级 / 🔴 高级）

### Mermaid 流程图
- 40+ 个架构图和流程图
- 自动渲染，清晰展示系统设计
- 支持点击放大查看

## 📖 文档列表

### 基础篇
- [01-introduction.html](01-introduction.html) - LangChain 简介
- [02-architecture.html](02-architecture.html) - 核心架构
- [03-models.html](03-models.html) - 模型接口
- [04-messages.html](04-messages.html) - 消息系统
- [05-tools.html](05-tools.html) - 工具系统

### 进阶篇
- [06-agents.html](06-agents.html) - Agent 基础
- [07-middleware.html](07-middleware.html) - 中间件系统
- [08-rag.html](08-rag.html) - RAG 详解 ⭐
- [09-lcel.html](09-lcel.html) - LCEL 表达式

### 高级应用
- [10-runtime.html](10-runtime.html) - Runtime 系统
- [11-checkpointer.html](11-checkpointer.html) - 持久化系统
- [12-streaming.html](12-streaming.html) - 流式输出
- [13-human-in-loop.html](13-human-in-loop.html) - 人工介入
- [14-long-term-memory.html](14-long-term-memory.html) - 长期记忆
- [15-langgraph.html](15-langgraph.html) - LangGraph

### 实战篇
- [16-customer-service.html](16-customer-service.html) - 客服机器人实战 ⭐
- [17-best-practices.html](17-best-practices.html) - 最佳实践

### 参考篇
- [18-api-reference.html](18-api-reference.html) - API 速查表
- [19-troubleshooting.html](19-troubleshooting.html) - 故障排除
- [20-migration.html](20-migration.html) - 迁移指南

### 扩展篇
- [21-structured-output.html](21-structured-output.html) - 结构化输出

### DeepAgents 篇
- [22-deepagents-quickstart.html](22-deepagents-quickstart.html) - 快速开始
- [23-deepagents-customization.html](23-deepagents-customization.html) - 定制化
- [24-deepagents-harness.html](24-deepagents-harness.html) - Harness 系统
- [25-deepagents-backends.html](25-deepagents-backends.html) - 后端配置
- [26-deepagents-subagents.html](26-deepagents-subagents.html) - 子代理
- [27-deepagents-hitl.html](27-deepagents-hitl.html) - 人工介入
- [28-deepagents-memory.html](28-deepagents-memory.html) - 长期记忆
- [29-deepagents-middleware.html](29-deepagents-middleware.html) - 中间件

### Multi-Agent 篇
- [30-multi-agent-index.html](30-multi-agent-index.html) - 概述
- [31-multi-agent-subagents.html](31-multi-agent-subagents.html) - 子代理
- [32-multi-agent-handoffs.html](32-multi-agent-handoffs.html) - 交接机制
- [33-multi-agent-skills.html](33-multi-agent-skills.html) - 技能系统
- [34-multi-agent-router.html](34-multi-agent-router.html) - 路由机制
- [35-multi-agent-workflow.html](35-multi-agent-workflow.html) - 自定义工作流

## 🔗 参考资源

- [LangChain 官方文档](https://docs.langchain.com/oss/python/langchain/overview)
- [LangChain API 参考](https://reference.langchain.com/python/langchain/)
- [LangGraph 官方网站](https://langchain-ai.github.io/langgraph/)
- [LangSmith 调试工具](https://docs.smith.langchain.com/)

## 📝 版本历史

### Version 2.0 (2025-01)
- ✅ 新增 17 个页面（21-35）
- ✅ 实现智能侧边栏滚动（localStorage 持久化）
- ✅ 统一菜单结构（9 个分区，36 个导航项）
- ✅ 更新首页内容和学习路径

### Version 1.0 (2024-12)
- ✅ 完成基础 20 个页面（01-20）
- ✅ 实现 RAG 系统和客服机器人项目
- ✅ 响应式设计和代码高亮
- ✅ Mermaid 流程图集成

## 📄 License

本项目仅供学习和参考使用。

## 👥 作者

为公司 LangChain 知识比赛创建

---

**⭐ 如果这个项目对你有帮助，欢迎 Star！**
