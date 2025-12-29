#!/usr/bin/env node

/**
 * 批量更新 HTML 文件的导航菜单 (修复版)
 * 正确处理嵌套的 <ul> 标签
 */

const fs = require('fs');
const path = require('path');

// 需要更新的文件列表
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

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

/**
 * 找到匹配的结束 </ul> 标签
 */
function findMatchingClosingUl(content, startPos) {
    let depth = 1;
    let pos = startPos;

    while (depth > 0 && pos < content.length) {
        const nextUl = content.indexOf('<ul', pos);
        const nextClosingUl = content.indexOf('</ul>', pos);

        if (nextClosingUl === -1) {
            return -1; // 没有找到结束标签
        }

        if (nextUl !== -1 && nextUl < nextClosingUl) {
            // 找到了嵌套的 <ul>
            depth++;
            pos = nextUl + 3;
        } else {
            // 找到了 </ul>
            depth--;
            if (depth === 0) {
                return nextClosingUl;
            }
            pos = nextClosingUl + 5;
        }
    }

    return -1;
}

/**
 * 提取参考菜单
 */
function extractReferenceMenu() {
    const indexPath = path.join(__dirname, 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');

    const menuStart = content.indexOf('<ul class="nav-menu">');
    if (menuStart === -1) {
        throw new Error('无法找到 <ul class="nav-menu">');
    }

    const menuEnd = findMatchingClosingUl(content, menuStart + 21); // +21 跳过开始标签
    if (menuEnd === -1) {
        throw new Error('无法找到匹配的 </ul>');
    }

    return content.substring(menuStart, menuEnd + 5); // +5 包含 </ul>
}

/**
 * 更新单个文件的菜单
 */
function updateFileMenu(filename, referenceMenu) {
    const filePath = path.join(__dirname, filename);
    let content = fs.readFileSync(filePath, 'utf-8');

    // 找到菜单起始位置
    const menuStart = content.indexOf('<ul class="nav-menu">');
    if (menuStart === -1) {
        console.log(`${colors.yellow}⚠${colors.reset} ${filename}: 找不到菜单起始标签，跳过`);
        return false;
    }

    // 找到匹配的结束标签
    const menuEnd = findMatchingClosingUl(content, menuStart + 21);
    if (menuEnd === -1) {
        console.log(`${colors.yellow}⚠${colors.reset} ${filename}: 找不到匹配的结束标签，跳过`);
        return false;
    }

    // 为当前文件添加 active 类
    let newMenu = referenceMenu;
    const currentHref = filename;

    // 找到对应的 nav-item 并添加 active 类
    const escapedHref = currentHref.replace(/\./g, '\\.');
    const hrefRegex = new RegExp(
        `(<li class="nav-item)"\\s*>\\s*<a href="${escapedHref}"`,
        'g'
    );
    newMenu = newMenu.replace(hrefRegex, `$1 active">\\n                            <a href="${currentHref}"`);

    // 构造新内容
    const before = content.substring(0, menuStart);
    const after = content.substring(menuEnd + 5); // +5 跳过 </ul>
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
    console.log(`${colors.cyan}批量更新菜单结构 (修复版)${colors.reset}`);
    console.log(`${colors.cyan}========================================${colors.reset}\n`);

    // 提取参考菜单
    console.log(`${colors.blue}正在从 index.html 提取参考菜单...${colors.reset}`);
    const referenceMenu = extractReferenceMenu();
    console.log(`${colors.green}✓${colors.reset} 参考菜单提取成功 (${referenceMenu.length} 字符)\n`);

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
