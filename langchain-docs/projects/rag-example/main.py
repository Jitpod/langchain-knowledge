"""
完整的 RAG 系统实现示例
基于 LangChain 1.0
适用于：文档问答、知识库检索等场景
"""
import os
import bs4
from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain.tools import tool
from langchain.agents import create_agent
from langchain.chat_models import init_chat_model

# ==================== 配置 ====================
# 设置 OpenAI API Key（请替换为你的实际 Key）
os.environ["OPENAI_API_KEY"] = "your-api-key-here"

# 配置参数
CONFIG = {
    "chunk_size": 1000,          # 文本块大小
    "chunk_overlap": 200,        # 块重叠大小
    "embedding_model": "text-embedding-3-small",  # 嵌入模型
    "llm_model": "gpt-4o-mini",  # 生成模型
    "vector_db_path": "./chroma_langchain_docs",  # 向量数据库路径
    "retrieval_k": 3,            # 检索文档数量
}

# ==================== 第1步：加载文档 ====================
def load_documents():
    """从网页加载文档"""
    print("📚 正在加载文档...")

    # 使用 WebBaseLoader 加载 LangChain 官方文档
    loader = WebBaseLoader(
        web_paths=(
            "https://python.langchain.com/docs/tutorials/agents/",
        ),
        bs_kwargs=dict(
            parse_only=bs4.SoupStrainer(
                class_=("main",)  # 只解析主要内容
            )
        )
    )

    docs = loader.load()
    print(f"✓ 成功加载 {len(docs)} 个文档")

    return docs


# ==================== 第2步：分割文本 ====================
def split_documents(docs):
    """将长文档分割成小块"""
    print("✂️  正在分割文本...")

    # 使用递归字符文本分割器
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CONFIG["chunk_size"],
        chunk_overlap=CONFIG["chunk_overlap"],
        length_function=len,
        is_separator_regex=False,
    )

    all_splits = text_splitter.split_documents(docs)
    print(f"✓ 文档被分割成 {len(all_splits)} 个文本块")
    print(f"  - 平均块大小: {sum(len(s.page_content) for s in all_splits) // len(all_splits)} 字符")

    return all_splits


# ==================== 第3步：创建向量存储 ====================
def create_vector_store(splits):
    """创建向量数据库"""
    print("🗄️  正在创建向量存储...")

    # 初始化 Embeddings 模型
    embeddings = OpenAIEmbeddings(
        model=CONFIG["embedding_model"]
    )

    # 创建 Chroma 向量存储
    vector_store = Chroma.from_documents(
        documents=splits,
        embedding=embeddings,
        persist_directory=CONFIG["vector_db_path"]
    )

    print(f"✓ 向量存储创建完成")
    print(f"  - 存储路径: {CONFIG['vector_db_path']}")
    print(f"  - 文档数量: {len(splits)}")

    return vector_store


# ==================== 第4步：创建检索工具 ====================
def create_retrieval_tool(vector_store):
    """创建检索工具供 Agent 使用"""

    @tool(response_format="content_and_artifact")
    def retrieve_context(query: str):
        """从 LangChain 文档中检索相关信息。

        Args:
            query: 用户的查询问题

        Returns:
            检索到的相关文档内容和原始文档对象
        """
        # 使用相似度搜索检索相关文档
        retrieved_docs = vector_store.similarity_search(
            query,
            k=CONFIG["retrieval_k"]
        )

        # 格式化检索结果
        serialized = "\n\n".join(
            f"【文档 {i+1}】\n{doc.page_content}"
            for i, doc in enumerate(retrieved_docs)
        )

        return serialized, retrieved_docs

    return retrieve_context


# ==================== 第5步：创建 RAG Agent ====================
def create_rag_agent(tools):
    """创建 RAG Agent"""
    print("🤖 正在创建 RAG Agent...")

    # 初始化聊天模型
    model = init_chat_model(
        CONFIG["llm_model"],
        model_provider="openai"
    )

    # 定义系统提示词
    system_prompt = """你是 LangChain 文档助手，专门帮助用户理解和使用 LangChain。

使用 retrieve_context 工具从文档中检索相关信息来回答问题。

回答要求：
1. 先使用检索工具查找相关信息
2. 基于检索到的内容生成准确、详细的答案
3. 如果检索不到相关信息，诚实地告诉用户
4. 提供代码示例时，确保代码完整且可运行
5. 用中文回答，保持专业和友好的语气

记住：永远基于检索到的文档内容回答，不要编造信息。"""

    # 创建 Agent
    agent = create_agent(
        model=model,
        tools=tools,
        system_prompt=system_prompt
    )

    print("✓ RAG Agent 创建完成\n")
    return agent


# ==================== 第6步：问答交互 ====================
def ask_question(agent, question: str):
    """向 RAG Agent 提问"""
    print(f"\n{'='*70}")
    print(f"❓ 问题: {question}")
    print('='*70)

    # 调用 Agent
    response = agent.invoke({
        "messages": [{"role": "user", "content": question}]
    })

    # 提取答案
    answer = response["messages"][-1].content

    print(f"\n💡 回答:\n{answer}\n")
    return answer


# ==================== 主程序 ====================
def main():
    """主程序入口"""
    print("\n" + "="*70)
    print("🦜 LangChain RAG 系统演示")
    print("="*70 + "\n")

    # 步骤 1: 加载文档
    docs = load_documents()

    # 步骤 2: 分割文本
    splits = split_documents(docs)

    # 步骤 3: 创建向量存储
    vector_store = create_vector_store(splits)

    # 步骤 4: 创建检索工具
    retrieve_tool = create_retrieval_tool(vector_store)

    # 步骤 5: 创建 RAG Agent
    agent = create_rag_agent(tools=[retrieve_tool])

    # 步骤 6: 示例问答
    print("\n" + "="*70)
    print("📝 开始示例问答")
    print("="*70)

    questions = [
        "什么是 LangChain Agent？",
        "如何创建一个 Agent？请给出代码示例",
        "LangChain 支持哪些模型提供商？"
    ]

    for q in questions:
        ask_question(agent, q)

    print("\n" + "="*70)
    print("✅ RAG 系统演示完成！")
    print("="*70 + "\n")


if __name__ == "__main__":
    main()
