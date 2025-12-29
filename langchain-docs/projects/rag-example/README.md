# RAG 系统示例

基于 LangChain 1.0 的完整 RAG（检索增强生成）系统实现。

## 🎯 功能特点

- 📚 从网页加载文档
- ✂️ 智能文本分割
- 🗄️ 向量存储和检索
- 🤖 Agentic RAG 实现
- 💬 智能问答

## 🛠️ 技术栈

- **LangChain 1.0**: 核心框架
- **OpenAI**: LLM 和 Embeddings
- **Chroma**: 向量数据库
- **BeautifulSoup4**: 网页解析

## 📦 安装依赖

```bash
# 创建虚拟环境（推荐）
python3.10 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt
```

## ⚙️ 配置

在 `main.py` 中设置你的 OpenAI API Key：

```python
os.environ["OPENAI_API_KEY"] = "your-api-key-here"
```

## 🚀 运行

```bash
python main.py
```

## 📊 系统流程

```
1. 加载文档 → 2. 文本分割 → 3. 向量化存储
                                ↓
6. 生成答案 ← 5. 创建 Agent ← 4. 创建检索工具
```

## 💡 自定义配置

在 `main.py` 的 `CONFIG` 字典中修改参数：

- `chunk_size`: 文本块大小（默认 1000）
- `chunk_overlap`: 块重叠大小（默认 200）
- `embedding_model`: 嵌入模型（默认 text-embedding-3-small）
- `llm_model`: 生成模型（默认 gpt-4o-mini）
- `retrieval_k`: 检索文档数量（默认 3）

## 📝 使用示例

```python
# 提问示例
ask_question(agent, "什么是 LangChain Agent？")
ask_question(agent, "如何创建一个 Agent？")
```

## 🎓 学习资源

- [LangChain 官方文档](https://docs.langchain.com/)
- [RAG 详解教程](../../08-rag.html)
- [API 参考](https://reference.langchain.com/python/langchain/)

## 📄 许可证

MIT License

## 🙋 问题反馈

如有问题，请参考主文档的[故障排除](../../14-troubleshooting.html)章节。
