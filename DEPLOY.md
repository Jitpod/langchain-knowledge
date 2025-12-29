# 部署指南

## Vercel 部署

本项目已配置 Vercel 自动部署支持。

### 方式一：通过 Vercel Dashboard（推荐）

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project"
3. 导入 GitHub 仓库 `Jitpod/langchain-knowledge`
4. Vercel 会自动检测配置，无需修改
5. 点击 "Deploy" 开始部署
6. 等待部署完成，获取访问地址

### 方式二：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署到 Vercel
vercel

# 部署到生产环境
vercel --prod
```

### 自动部署

配置完成后，每次推送到 `main` 分支都会自动触发部署：

```bash
git add .
git commit -m "更新文档"
git push origin main
```

### 配置说明

- `vercel.json`: Vercel 部署配置
  - `outputDirectory`: 指定输出目录为 `langchain-docs`
  - `cleanUrls`: 启用干净的 URL（去除 .html 后缀）
  - `headers`: 配置缓存策略
  - `rewrites`: 配置路由重写

### 自定义域名

1. 在 Vercel Dashboard 的项目设置中
2. 进入 "Domains" 选项卡
3. 添加自定义域名
4. 按照提示配置 DNS 记录

### 环境变量（如需要）

如果项目需要环境变量：

1. 在 Vercel Dashboard 的项目设置中
2. 进入 "Environment Variables" 选项卡
3. 添加所需的环境变量

## 其他部署选项

### GitHub Pages

```bash
# 创建 gh-pages 分支并推送
git checkout -b gh-pages
git push origin gh-pages

# 在 GitHub 仓库设置中启用 GitHub Pages
# Source: gh-pages branch / root
```

### Netlify

1. 访问 [Netlify](https://www.netlify.com/)
2. 点击 "Add new site" > "Import an existing project"
3. 选择 GitHub 仓库
4. 配置：
   - Build command: (留空)
   - Publish directory: `langchain-docs`
5. 点击 "Deploy site"

### 本地预览

```bash
# 使用 Python 简单服务器
cd langchain-docs
python3 -m http.server 8000

# 或使用 Node.js
npx serve langchain-docs

# 访问 http://localhost:8000
```

## 性能优化建议

1. **图片优化**: 使用 WebP 格式
2. **资源压缩**: 启用 Gzip/Brotli 压缩
3. **CDN 加速**: 使用 Vercel 全球 CDN
4. **缓存策略**: 已配置合理的缓存头

## 监控和分析

- Vercel Analytics: 在项目设置中启用
- Google Analytics: 在 HTML 中添加跟踪代码
- Vercel Speed Insights: 监控页面性能
