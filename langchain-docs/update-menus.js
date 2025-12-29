#!/usr/bin/env node

/**
 * 批量更新 HTML 文件的导航菜单
 * 将 index.html 的菜单结构复制到其他文件，并保持正确的 active 状态
 */

const fs = require('fs');
const path = require('path');

// 需要更新的文件列表（从验证脚本得出）
const filesToUpdate = [
    '01-introduction.html',
    '03-models.html',
    '04-messages.html',
    '05-tools.html',
    '06-agents.html',
    '07-middleware.html',
    '08-rag.html',
    '10-runtime.html',
    '11-checkpointer.html',
    '12-streaming.html',
    '13-human-in-loop.html',
    '14-long-term-memory.html',
    '15-langgraph.html',
    '16-customer-service.html',
    '17-best-practices.html',
    '18-api-reference.html',
    '19-troubleshooting.html',
    '20-migration.html'
];

// 文件名到 href 的映射
const fileToHref = {
    'index.html': 'index.html',
    '01-introduction.html': '01-introduction.html',
    '02-architecture.html': '02-architecture.html',
    '03-models.html': '03-models.html',
    '04-messages.html': '04-messages.html',
    '05-tools.html': '05-tools.html',
    '06-agents.html': '06-agents.html',
    '07-middleware.html': '07-middleware.html',
    '08-rag.html': '08-rag.html',
    '09-lcel.html': '09-lcel.html',
    '10-runtime.html': '10-runtime.html',
    '11-checkpointer.html': '11-checkpointer.html',
    '12-streaming.html': '12-streaming.html',
    '13-human-in-loop.html': '13-human-in-loop.html',
    '14-long-term-memory.html': '14-long-term-memory.html',
    '15-langgraph.html': '15-langgraph.html',
    '16-customer-service.html': '16-customer-service.html',
    '17-best-practices.html': '17-best-practices.html',
    '18-api-reference.html': '18-api-reference.html',
    '19-troubleshooting.html': '19-troubleshooting.html',
    '20-migration.html': '20-migration.html',
    '21-structured-output.html': '21-structured-output.html',
    '22-deepagents-quickstart.html': '22-deepagents-quickstart.html',
    '23-deepagents-customization.html': '23-deepagents-customization.html',
    '24-deepagents-harness.html': '24-deepagents-harness.html',
    '25-deepagents-backends.html': '25-deepagents-backends.html',
    '26-deepagents-subagents.html': '26-deepagents-subagents.html',
    '27-deepagents-hitl.html': '27-deepagents-hitl.html',
    '28-deepagents-memory.html': '28-deepagents-memory.html',
    '29-deepagents-middleware.html': '29-deepagents-middleware.html',
    '30-multi-agent-index.html': '30-multi-agent-index.html',
    '31-multi-agent-subagents.html': '31-multi-agent-subagents.html',
    '32-multi-agent-handoffs.html': '32-multi-agent-handoffs.html',
    '33-multi-agent-skills.html': '33-multi-agent-skills.html',
    '34-multi-agent-router.html': '34-multi-agent-router.html',
    '35-multi-agent-workflow.html': '35-multi-agent-workflow.html'
};

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

/**
 * 提取参考菜单
 */
function extractReferenceMenu() {
    const indexPath = path.join(__dirname, 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');

    // 提取从 <ul class="nav-menu"> 到对应的 </ul>
    const menuStart = content.indexOf('<ul class="nav-menu">');
    const menuEnd = content.indexOf('</ul>', menuStart) + 5; // 包含 </ul> 标签

    if (menuStart === -1 || menuEnd === -1) {
        throw new Error('无法从 index.html 提取菜单结构');
    }

    return content.substring(menuStart, menuEnd);
}

/**
 * 更新单个文件的菜单
 */
function updateFileMenu(filename, referenceMenu) {
    const filePath = path.join(__dirname, filename);
    let content = fs.readFileSync(filePath, 'utf-8');

    // 找到并替换整个菜单部分
    const menuStart = content.indexOf('<ul class="nav-menu">');
    const menuEnd = content.indexOf('</ul>', menuStart) + 5;

    if (menuStart === -1 || menuEnd === -1) {
        console.log(`${colors.yellow}⚠${colors.reset} ${filename}: 找不到菜单结构，跳过`);
        return false;
    }

    // 替换菜单
    let newMenu = referenceMenu;

    // 为当前文件添加 active 类
    const currentHref = fileToHref[filename];
    if (currentHref) {
        // 找到对应的 nav-item 并添加 active 类
        const hrefPattern = new RegExp(
            `(<li class="nav-item)"\\s*>\\s*<a href="${currentHref.replace('.', '\\.')}"`,
            'g'
        );
        newMenu = newMenu.replace(hrefPattern, '$1 active">\\n                            <a href="' + currentHref + '"');
    }

    // 构造新内容
    const before = content.substring(0, menuStart);
    const after = content.substring(menuEnd);
    const newContent = before + newMenu + after;

    // 写回文件
    fs.writeFileSync(filePath, newContent, 'utf-8');

    return true;
}

/**
 * 主函数
 */
function main() {
    console.log(`\n${colors.cyan}========================================${colors.reset}`);
    console.log(`${colors.cyan}批量更新菜单结构${colors.reset}`);
    console.log(`${colors.cyan}========================================${colors.reset}\n`);

    // 提取参考菜单
    console.log(`${colors.blue}正在从 index.html 提取参考菜单...${colors.reset}`);
    const referenceMenu = extractReferenceMenu();
    console.log(`${colors.green}✓${colors.reset} 参考菜单提取成功\n`);

    // 更新所有文件
    console.log(`${colors.blue}开始更新 ${filesToUpdate.length} 个文件...${colors.reset}\n`);

    let successCount = 0;
    let failCount = 0;

    for (const filename of filesToUpdate) {
        try {
            const success = updateFileMenu(filename, referenceMenu);
            if (success) {
                console.log(`${colors.green}✓${colors.reset} ${filename}`);
                successCount++;
            } else {
                failCount++;
            }
        } catch (error) {
            console.log(`${colors.yellow}✗${colors.reset} ${filename}: ${error.message}`);
            failCount++;
        }
    }

    // 总结
    console.log(`\n${colors.cyan}========================================${colors.reset}`);
    console.log(`${colors.cyan}更新完成${colors.reset}`);
    console.log(`${colors.cyan}========================================${colors.reset}\n`);
    console.log(`成功更新: ${colors.green}${successCount}${colors.reset} 个文件`);
    console.log(`失败: ${colors.yellow}${failCount}${colors.reset} 个文件\n`);

    if (failCount === 0) {
        console.log(`${colors.green}✓ 所有文件菜单已更新！${colors.reset}`);
        console.log(`${colors.blue}建议: 运行 node verify-menu-consistency.js 验证更新结果${colors.reset}\n`);
    }
}

// 运行
if (require.main === module) {
    main();
}
