// LangChain 1.0 Python 知识文档 - JavaScript 功能

// ==================== 侧边栏智能滚动管理器 ====================
const SidebarScrollManager = {
    // localStorage 键名
    STORAGE_KEYS: {
        VISITED_PAGES: 'langchain_visited_pages',
        SCROLL_POSITIONS: 'langchain_scroll_positions',
        LAST_PAGE: 'langchain_last_page'
    },

    // 初始化管理器
    init() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        this.sidebar = sidebar;
        this.currentPage = this.getCurrentPage();

        // 在 DOMContentLoaded 后处理页面加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.handlePageLoad());
        } else {
            this.handlePageLoad();
        }
    },

    // 获取当前页面文件名
    getCurrentPage() {
        const path = window.location.pathname.split('/').pop();
        return path || 'index.html';
    },

    // 检查 localStorage 是否可用
    isLocalStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage 不可用，智能滚动功能将被禁用');
            return false;
        }
    },

    // 获取已访问页面记录
    getVisitedPages() {
        if (!this.isLocalStorageAvailable()) return {};
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.VISITED_PAGES);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    },

    // 保存已访问页面
    markPageAsVisited(page) {
        if (!this.isLocalStorageAvailable()) return;
        try {
            const visited = this.getVisitedPages();
            visited[page] = true;
            localStorage.setItem(this.STORAGE_KEYS.VISITED_PAGES, JSON.stringify(visited));
        } catch (e) {
            console.warn('无法保存访问记录:', e);
        }
    },

    // 检查页面是否已访问
    isPageVisited(page) {
        const visited = this.getVisitedPages();
        return !!visited[page];
    },

    // 获取所有滚动位置
    getScrollPositions() {
        if (!this.isLocalStorageAvailable()) return {};
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.SCROLL_POSITIONS);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    },

    // 保存滚动位置
    saveScrollPosition(page, position) {
        if (!this.isLocalStorageAvailable()) return;
        try {
            const positions = this.getScrollPositions();
            positions[page] = Math.round(position);
            localStorage.setItem(this.STORAGE_KEYS.SCROLL_POSITIONS, JSON.stringify(positions));
        } catch (e) {
            console.warn('无法保存滚动位置:', e);
        }
    },

    // 获取特定页面的滚动位置
    getScrollPosition(page) {
        const positions = this.getScrollPositions();
        return positions[page] || 0;
    },

    // 计算高亮项的中心位置
    calculateCenterPosition() {
        const activeLink = this.sidebar.querySelector('.nav-link.active');
        if (!activeLink) return 0;

        const activeItem = activeLink.closest('.nav-item');
        if (!activeItem) return 0;

        const itemTop = activeItem.offsetTop;
        const itemHeight = activeItem.offsetHeight;
        const sidebarHeight = this.sidebar.clientHeight;

        // 计算使高亮项位于侧边栏中间的滚动位置
        const centerPosition = itemTop - (sidebarHeight / 2) + (itemHeight / 2);

        return Math.max(0, centerPosition);
    },

    // 处理页面加载时的滚动逻辑
    handlePageLoad() {
        const isVisited = this.isPageVisited(this.currentPage);

        if (isVisited) {
            // 场景 2: 后续访问 - 恢复上次滚动位置（无动画）
            const savedPosition = this.getScrollPosition(this.currentPage);
            this.sidebar.scrollTop = savedPosition;
        } else {
            // 场景 1: 首次访问 - 滚动到高亮项中间位置（平滑动画）
            const centerPosition = this.calculateCenterPosition();
            this.sidebar.scrollTo({
                top: centerPosition,
                behavior: 'smooth'
            });

            // 标记页面为已访问
            this.markPageAsVisited(this.currentPage);

            // 保存初始滚动位置
            setTimeout(() => {
                this.saveScrollPosition(this.currentPage, this.sidebar.scrollTop);
            }, 500); // 等待平滑滚动完成
        }

        // 设置滚动位置自动保存
        this.setupScrollSaving();

        // 设置菜单点击监听
        this.setupMenuClickHandlers();
    },

    // 设置滚动位置自动保存（防抖）
    setupScrollSaving() {
        let saveTimeout;

        this.sidebar.addEventListener('scroll', () => {
            // 清除之前的定时器
            clearTimeout(saveTimeout);

            // 150ms 防抖延迟
            saveTimeout = setTimeout(() => {
                this.saveScrollPosition(this.currentPage, this.sidebar.scrollTop);
            }, 150);
        });
    },

    // 设置菜单点击监听
    setupMenuClickHandlers() {
        const navLinks = this.sidebar.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // 场景 3: 点击菜单时保存当前滚动位置
                const currentScrollTop = this.sidebar.scrollTop;
                this.saveScrollPosition(this.currentPage, currentScrollTop);

                // 保存最后访问的页面
                const targetPage = link.getAttribute('href');
                if (targetPage && this.isLocalStorageAvailable()) {
                    try {
                        localStorage.setItem(this.STORAGE_KEYS.LAST_PAGE, targetPage);
                    } catch (e) {
                        console.warn('无法保存最后访问页面:', e);
                    }
                }
            });
        });
    }
};

// 立即初始化智能滚动管理器（在 DOMContentLoaded 之前）
SidebarScrollManager.init();

// ==================== Mermaid 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    // 初始化 Mermaid
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            themeVariables: {
                primaryColor: '#2563eb',
                primaryTextColor: '#1f2937',
                primaryBorderColor: '#3b82f6',
                lineColor: '#6b7280',
                secondaryColor: '#10b981',
                tertiaryColor: '#f59e0b',
                fontSize: '14px'
            },
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'basis'
            }
        });
    }

    // ==================== 代码复制功能 ====================
    const copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.closest('.code-block-wrapper').querySelector('code');
            const text = codeBlock.textContent;

            navigator.clipboard.writeText(text).then(() => {
                const originalText = this.textContent;
                this.textContent = '✓ 已复制';
                this.classList.add('copied');

                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('copied');
                }, 2000);
            });
        });
    });

    // ==================== 返回顶部按钮 ====================
    const backToTopButton = document.querySelector('.back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==================== 移动端菜单切换 ====================
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const sidebar = document.querySelector('.sidebar');

    if (mobileMenuButton && sidebar) {
        mobileMenuButton.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-open');
        });

        // 点击内容区域关闭侧边栏
        document.querySelector('.main-content')?.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-open');
            }
        });
    }

    // ==================== 高亮当前页面导航 ====================
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ==================== 平滑滚动锚点 ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==================== 代码高亮（如果使用 Prism.js）====================
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
});

// ==================== 工具函数 ====================

// 显示通知消息
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

    // ==================== Tabs 组件功能 ====================
    // 初始化所有 tabs 容器
    const tabsContainers = document.querySelectorAll('.tabs-container');

    tabsContainers.forEach(container => {
        const buttons = container.querySelectorAll('.tab-button');
        const contents = container.querySelectorAll('.tab-content');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');

                // 移除所有 active 状态
                buttons.forEach(btn => btn.classList.remove('active'));
                contents.forEach(content => content.classList.remove('active'));

                // 添加当前 tab 的 active 状态
                button.classList.add('active');
                const activeContent = container.querySelector(`.tab-content[data-tab="${tabId}"]`);
                if (activeContent) {
                    activeContent.classList.add('active');
                }
            });
        });
    });
});
