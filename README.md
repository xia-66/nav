# 黑羽导航 v2.0.0

> 一个简洁、美观、易用的个人导航网站

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/yourusername/heiyu-nav-web)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Vue](https://img.shields.io/badge/vue-3.4.29-brightgreen.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/vite-5.3.1-646cff.svg)](https://vitejs.dev/)

## ✨ 特性

- 🎨 **美观界面** - 现代化设计，支持响应式布局
- 🚀 **快速搜索** - 本地搜索，即时响应
- 📱 **移动优先** - 完美支持移动端和桌面端
- 🎯 **分类管理** - 9 大分类，79 个精选网站
- 🔍 **智能搜索** - 支持按名称和描述搜索
- ⚡ **纯前端** - 无需后端，一键部署
- 💾 **本地数据** - 数据存储在 JSON 文件中
- 🌐 **全球 CDN** - 支持 Vercel 等平台部署

## 📦 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite 5
- **UI 框架**: Element Plus
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **CSS 框架**: TailwindCSS + Sass
- **图标字体**: 自定义 iconfont

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- npm >= 8

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:8080

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 📂 项目结构

```
heiyu-nav-web/
├── src/
│   ├── assets/          # 静态资源
│   │   ├── css/        # 样式文件
│   │   ├── font/       # 字体图标
│   │   └── img/        # 图片资源
│   ├── components/      # 组件
│   │   └── index/      # 前台组件
│   ├── views/          # 视图页面
│   ├── router/         # 路由配置
│   ├── store/          # 状态管理
│   ├── utils/          # 工具函数
│   ├── config/         # 配置文件
│   ├── data.json       # 本地数据
│   ├── App.vue         # 根组件
│   └── main.ts         # 入口文件
├── public/             # 公共资源
├── index.html          # HTML 模板
├── vite.config.ts      # Vite 配置
├── vercel.json         # Vercel 配置
├── tsconfig.json       # TypeScript 配置
├── tailwind.config.js  # TailwindCSS 配置
└── package.json        # 项目配置
```

## 📝 数据管理

### 数据文件位置

`src/data.json`

### 添加新网站

在 `items` 数组中添加：

```json
{
  "id": 80,
  "name": "网站名称",
  "url": "https://example.com",
  "description": "网站描述",
  "categoryId": 1
}
```

### 添加新分类

在 `categories` 数组中添加：

```json
{
  "id": 13,
  "name": "新分类"
}
```

### 修改网站信息

直接编辑 `data.json` 文件中对应的对象即可。

## 🌐 部署

### 部署到 Vercel（推荐）

#### 方法一：CLI 部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

#### 方法二：Git 部署

1. 推送代码到 GitHub
2. 访问 [Vercel](https://vercel.com/)
3. 导入 GitHub 仓库
4. 自动部署完成

详细步骤请查看 [Vercel 部署指南.md](./Vercel部署指南.md)

### 其他部署方式

- **Netlify**: 支持
- **GitHub Pages**: 支持
- **Cloudflare Pages**: 支持
- **任何静态托管**: 支持

## 📊 网站分类

| 分类     | 数量 | 说明                        |
| -------- | ---- | --------------------------- |
| 常用推荐 | 12   | AI 工具、视频网站、云服务等 |
| 实用工具 | 17   | 截图、文件传输、激活工具等  |
| 日漫专区 | 4    | 动漫资源和在线观看          |
| 在线翻译 | 2    | 多语种翻译工具              |
| 站长工具 | 11   | 测速、检测、域名工具等      |
| 清理工具 | 2    | 磁盘清理和卸载工具          |
| 我的收藏 | 15   | VPS、代理、OCR 等工具       |
| 国外服务 | 11   | AI 助手、GitHub、YouTube 等 |
| 开发工具 | 5    | API、图标、模板等           |

## 🎨 功能特性

### 主要功能

- ✅ 网站展示 - 按分类展示所有导航网站
- ✅ 实时搜索 - 支持搜索网站名称和描述
- ✅ 锚点导航 - 快速跳转到指定分类
- ✅ 懒加载 - 网站图标按需加载
- ✅ 响应式 - 完美支持 PC 和移动端
- ✅ 侧边栏 - 移动端友好的抽屉菜单
- ✅ 时钟显示 - 实时显示当前时间
- ✅ 背景效果 - 精美的背景图片

### 交互体验

- 流畅的动画效果
- 直观的操作界面
- 快速的搜索响应
- 优雅的加载状态

## 📖 版本历史

### v2.0.0 (2025-10-25)

- 🎉 重大更新：纯前端化架构
- ✅ 删除所有后台代码和依赖
- ✅ 使用本地 JSON 数据
- ✅ 优化所有网站描述
- ✅ 删除无用代码和文件
- ✅ 精简项目结构

### v1.0.7 (之前版本)

- 使用后端 API
- 包含后台管理功能
- 需要数据库支持

## 🤝 贡献

欢迎贡献！你可以：

- 提交 Issue 报告问题
- 发起 Pull Request 改进代码
- 分享你的网站资源
- 完善文档说明

## 📄 开源协议

本项目采用 MIT 协议开源。

## 🙏 鸣谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Element Plus](https://element-plus.org/) - Vue 3 组件库
- [TailwindCSS](https://tailwindcss.com/) - CSS 框架
- [Vercel](https://vercel.com/) - 部署平台

## 📮 联系方式

- 项目主页: [GitHub](https://github.com/yourusername/heiyu-nav-web)
- 问题反馈: [Issues](https://github.com/yourusername/heiyu-nav-web/issues)

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！

**黑羽导航 - 你的个人网站导航助手** 🎉
