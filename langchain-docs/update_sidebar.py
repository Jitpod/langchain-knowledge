#!/usr/bin/env python3
"""
批量更新所有 HTML 文件的侧边栏导航
"""
import re
from pathlib import Path

# 新的侧边栏 HTML
NEW_SIDEBAR = '''            <ul class="nav-menu">
                <li class="nav-section">
                    <div class="nav-section-title">开始</div>
                    <ul>
                        <li class="nav-item">
                            <a href="index.html" class="nav-link">
                                <span class="nav-icon">🏠</span>
                                主页
                            </a>
                        </li>
                    </ul>
                </li>

                <li class="nav-section">
                    <div class="nav-section-title">基础篇</div>
                    <ul>
                        <li class="nav-item">
                            <a href="01-introduction.html" class="nav-link">
                                <span class="nav-icon">📖</span>
                                LangChain 简介
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="02-architecture.html" class="nav-link">
                                <span class="nav-icon">🏗️</span>
                                核心架构
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="03-models.html" class="nav-link">
                                <span class="nav-icon">🤖</span>
                                模型接口
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="04-messages.html" class="nav-link">
                                <span class="nav-icon">💬</span>
                                消息系统
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="05-tools.html" class="nav-link">
                                <span class="nav-icon">🔧</span>
                                工具系统
                            </a>
                        </li>
                    </ul>
                </li>

                <li class="nav-section">
                    <div class="nav-section-title">进阶篇</div>
                    <ul>
                        <li class="nav-item">
                            <a href="06-agents.html" class="nav-link">
                                <span class="nav-icon">🎯</span>
                                Agent 基础
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="07-middleware.html" class="nav-link">
                                <span class="nav-icon">⚙️</span>
                                中间件系统
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="08-rag.html" class="nav-link">
                                <span class="nav-icon">🔍</span>
                                RAG 详解
                                <span class="nav-badge">重点</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="09-lcel.html" class="nav-link">
                                <span class="nav-icon">🔗</span>
                                LCEL 表达式
                            </a>
                        </li>
                    </ul>
                </li>

                <li class="nav-section">
                    <div class="nav-section-title">高级应用</div>
                    <ul>
                        <li class="nav-item">
                            <a href="10-runtime.html" class="nav-link">
                                <span class="nav-icon">🔌</span>
                                Runtime 系统
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="11-checkpointer.html" class="nav-link">
                                <span class="nav-icon">💾</span>
                                持久化系统
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="12-streaming.html" class="nav-link">
                                <span class="nav-icon">🌊</span>
                                流式输出
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="13-human-in-loop.html" class="nav-link">
                                <span class="nav-icon">👤</span>
                                人工介入
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="14-long-term-memory.html" class="nav-link">
                                <span class="nav-icon">🗄️</span>
                                长期记忆
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="15-langgraph.html" class="nav-link">
                                <span class="nav-icon">📊</span>
                                LangGraph
                            </a>
                        </li>
                    </ul>
                </li>

                <li class="nav-section">
                    <div class="nav-section-title">实战篇</div>
                    <ul>
                        <li class="nav-item">
                            <a href="16-customer-service.html" class="nav-link">
                                <span class="nav-icon">👥</span>
                                客服机器人
                                <span class="nav-badge">重点</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="17-best-practices.html" class="nav-link">
                                <span class="nav-icon">✨</span>
                                最佳实践
                            </a>
                        </li>
                    </ul>
                </li>

                <li class="nav-section">
                    <div class="nav-section-title">参考篇</div>
                    <ul>
                        <li class="nav-item">
                            <a href="18-api-reference.html" class="nav-link">
                                <span class="nav-icon">📚</span>
                                API 速查表
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="19-troubleshooting.html" class="nav-link">
                                <span class="nav-icon">🐛</span>
                                故障排除
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="20-migration.html" class="nav-link">
                                <span class="nav-icon">🔄</span>
                                迁移指南
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>'''

# 要更新的文件列表
files_to_update = [
    'index.html',
    '01-introduction.html',
    '03-models.html',
    '04-messages.html',
    '05-tools.html',
    '06-agents.html',
    '07-middleware.html',
    '08-rag.html',
]

def update_sidebar(file_path):
    """更新单个文件的侧边栏"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 使用正则表达式替换侧边栏内容
    pattern = r'<ul class="nav-menu">.*?</ul>\s*</nav>'
    replacement = NEW_SIDEBAR + '\n        </nav>'
    
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✅ 已更新: {file_path}")
        return True
    else:
        print(f"⚠️  未变化: {file_path}")
        return False

# 执行更新
updated_count = 0
for filename in files_to_update:
    file_path = Path(filename)
    if file_path.exists():
        if update_sidebar(file_path):
            updated_count += 1
    else:
        print(f"❌ 文件不存在: {filename}")

print(f"\n总计更新了 {updated_count} 个文件")
