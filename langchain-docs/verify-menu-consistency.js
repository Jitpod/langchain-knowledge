#!/usr/bin/env node

/**
 * LangChain 文档菜单一致性验证脚本
 *
 * 功能：
 * 1. 提取所有 HTML 文件的导航菜单结构
 * 2. 与参考文件（index.html）对比
 * 3. 报告所有不一致之处
 * 4. 验证分区数、导航项数、href 值
 */

const fs = require('fs');
const path = require('path');

// 配置
const config = {
    baseDir: __dirname,
    referenceFile: 'index.html',
    expectedSections: 9,
    expectedNavItems: 36,
    htmlFiles: [
        'index.html',
        ...Array.from({ length: 35 }, (_, i) => `${String(i + 1).padStart(2, '0')}-*.html`)
    ]
};

// ANSI 颜色代码
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

/**
 * 提取菜单结构
 */
function extractMenuStructure(htmlContent) {
    const sections = [];
    const navItems = [];

    // 提取所有 nav-section
    const sectionRegex = /<li class="nav-section">([\s\S]*?)<\/li>\s*(?=<li class="nav-section">|<\/ul>)/g;
    let sectionMatch;

    while ((sectionMatch = sectionRegex.exec(htmlContent)) !== null) {
        const sectionContent = sectionMatch[1];

        // 提取 section title
        const titleMatch = sectionContent.match(/<div class="nav-section-title">(.*?)<\/div>/);
        const sectionTitle = titleMatch ? titleMatch[1].trim() : '';

        // 提取该 section 下的所有 nav-item
        const itemRegex = /<li class="nav-item(?:\s+active)?">\s*<a href="(.*?)"[^>]*>\s*<span class="nav-icon">(.*?)<\/span>\s*(.*?)\s*(?:<span class="nav-badge">.*?<\/span>)?\s*<\/a>\s*<\/li>/g;
        const items = [];
        let itemMatch;

        while ((itemMatch = itemRegex.exec(sectionContent)) !== null) {
            items.push({
                href: itemMatch[1].trim(),
                icon: itemMatch[2].trim(),
                text: itemMatch[3].trim()
            });
            navItems.push({
                href: itemMatch[1].trim(),
                icon: itemMatch[2].trim(),
                text: itemMatch[3].trim(),
                section: sectionTitle
            });
        }

        sections.push({
            title: sectionTitle,
            items: items
        });
    }

    return { sections, navItems };
}

/**
 * 获取所有 HTML 文件
 */
function getAllHtmlFiles() {
    const files = fs.readdirSync(config.baseDir)
        .filter(file => file.endsWith('.html'))
        .filter(file => {
            // 排除可能的备份文件
            return !file.includes('.bak') && !file.includes('.old');
        })
        .sort();

    return files;
}

/**
 * 比较两个菜单结构
 */
function compareMenuStructures(reference, target, filename) {
    const differences = [];

    // 检查 section 数量
    if (reference.sections.length !== target.sections.length) {
        differences.push({
            type: 'section_count',
            message: `Section 数量不匹配: 期望 ${reference.sections.length}, 实际 ${target.sections.length}`
        });
    }

    // 检查 navItem 数量
    if (reference.navItems.length !== target.navItems.length) {
        differences.push({
            type: 'item_count',
            message: `导航项数量不匹配: 期望 ${reference.navItems.length}, 实际 ${target.navItems.length}`
        });
    }

    // 逐个比较 sections
    for (let i = 0; i < Math.min(reference.sections.length, target.sections.length); i++) {
        const refSection = reference.sections[i];
        const targetSection = target.sections[i];

        if (refSection.title !== targetSection.title) {
            differences.push({
                type: 'section_title',
                message: `Section ${i + 1} 标题不匹配: 期望 "${refSection.title}", 实际 "${targetSection.title}"`
            });
        }

        if (refSection.items.length !== targetSection.items.length) {
            differences.push({
                type: 'section_items',
                message: `Section "${refSection.title}" 的项目数量不匹配: 期望 ${refSection.items.length}, 实际 ${targetSection.items.length}`
            });
        }

        // 比较每个 item
        for (let j = 0; j < Math.min(refSection.items.length, targetSection.items.length); j++) {
            const refItem = refSection.items[j];
            const targetItem = targetSection.items[j];

            if (refItem.href !== targetItem.href) {
                differences.push({
                    type: 'item_href',
                    message: `Section "${refSection.title}" 的第 ${j + 1} 项 href 不匹配: 期望 "${refItem.href}", 实际 "${targetItem.href}"`
                });
            }

            if (refItem.text !== targetItem.text) {
                differences.push({
                    type: 'item_text',
                    message: `Section "${refSection.title}" 的第 ${j + 1} 项文本不匹配: 期望 "${refItem.text}", 实际 "${targetItem.text}"`
                });
            }

            if (refItem.icon !== targetItem.icon) {
                differences.push({
                    type: 'item_icon',
                    message: `Section "${refSection.title}" 的第 ${j + 1} 项图标不匹配: 期望 "${refItem.icon}", 实际 "${targetItem.icon}"`
                });
            }
        }
    }

    return differences;
}

/**
 * 主函数
 */
function main() {
    console.log(`\n${colors.cyan}========================================${colors.reset}`);
    console.log(`${colors.cyan}LangChain 文档菜单一致性验证${colors.reset}`);
    console.log(`${colors.cyan}========================================${colors.reset}\n`);

    // 读取参考文件
    const referenceFilePath = path.join(config.baseDir, config.referenceFile);
    if (!fs.existsSync(referenceFilePath)) {
        console.error(`${colors.red}错误: 参考文件 ${config.referenceFile} 不存在${colors.reset}`);
        process.exit(1);
    }

    const referenceContent = fs.readFileSync(referenceFilePath, 'utf-8');
    const referenceStructure = extractMenuStructure(referenceContent);

    console.log(`${colors.blue}参考文件:${colors.reset} ${config.referenceFile}`);
    console.log(`${colors.blue}Sections:${colors.reset} ${referenceStructure.sections.length}`);
    console.log(`${colors.blue}导航项:${colors.reset} ${referenceStructure.navItems.length}\n`);

    // 获取所有 HTML 文件
    const htmlFiles = getAllHtmlFiles();
    console.log(`${colors.blue}找到 ${htmlFiles.length} 个 HTML 文件${colors.reset}\n`);

    // 验证所有文件
    let totalErrors = 0;
    const problematicFiles = [];

    for (const file of htmlFiles) {
        if (file === config.referenceFile) {
            console.log(`${colors.green}✓${colors.reset} ${file} ${colors.cyan}(参考文件)${colors.reset}`);
            continue;
        }

        const filePath = path.join(config.baseDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const structure = extractMenuStructure(content);

        const differences = compareMenuStructures(referenceStructure, structure, file);

        if (differences.length === 0) {
            console.log(`${colors.green}✓${colors.reset} ${file}`);
        } else {
            console.log(`${colors.red}✗${colors.reset} ${file} ${colors.red}(${differences.length} 个问题)${colors.reset}`);
            problematicFiles.push({ file, differences });
            totalErrors += differences.length;
        }
    }

    // 输出详细错误报告
    if (problematicFiles.length > 0) {
        console.log(`\n${colors.yellow}========================================${colors.reset}`);
        console.log(`${colors.yellow}详细错误报告${colors.reset}`);
        console.log(`${colors.yellow}========================================${colors.reset}\n`);

        for (const { file, differences } of problematicFiles) {
            console.log(`${colors.red}文件: ${file}${colors.reset}`);
            for (const diff of differences) {
                console.log(`  ${colors.yellow}▸${colors.reset} ${diff.message}`);
            }
            console.log('');
        }
    }

    // 总结
    console.log(`\n${colors.cyan}========================================${colors.reset}`);
    console.log(`${colors.cyan}验证总结${colors.reset}`);
    console.log(`${colors.cyan}========================================${colors.reset}\n`);
    console.log(`总文件数: ${htmlFiles.length}`);
    console.log(`通过验证: ${colors.green}${htmlFiles.length - problematicFiles.length}${colors.reset}`);
    console.log(`存在问题: ${colors.red}${problematicFiles.length}${colors.reset}`);
    console.log(`总错误数: ${colors.red}${totalErrors}${colors.reset}\n`);

    if (problematicFiles.length === 0) {
        console.log(`${colors.green}✓ 所有文件菜单结构一致！${colors.reset}\n`);
        process.exit(0);
    } else {
        console.log(`${colors.red}✗ 发现菜单不一致，请修复上述问题${colors.reset}\n`);
        console.log(`${colors.yellow}建议: 使用 ${config.referenceFile} 作为模板更新其他文件的菜单部分${colors.reset}\n`);
        process.exit(1);
    }
}

// 运行主函数
if (require.main === module) {
    main();
}

module.exports = { extractMenuStructure, compareMenuStructures };
