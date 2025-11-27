# 黑羽导航 v2.2.0

> 一个简洁、美观、易用的个人导航网站

[![Version](https://img.shields.io/badge/version-2.2.0-blue.svg)](https://github.com/xia-66/nav)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Vue](https://img.shields.io/badge/vue-3.4.29-brightgreen.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/vite-5.3.1-646cff.svg)](https://vitejs.dev/)

## 🚀 一键部署到 Vercel

点击下方按钮即可一键部署到 Vercel，几分钟内拥有你的专属导航网站：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/xia-66/nav)

### 部署步骤

1. **Fork 本仓库** - 点击右上角 Fork 按钮，将项目复制到你的 GitHub 账号
2. **修改配置** - 根据你的需求修改以下配置文件：
   - `src/config/data.json` - 网站数据（分类和网址）
   - `src/config/index.ts` - 网站基本信息（标题、描述、备案号等）
3. **一键部署** - 点击上方 Deploy 按钮，选择你 Fork 的仓库
4. **完成** - 等待几分钟，即可获得你的专属导航网站

## ✨ 特性

- 🎨 **美观界面** - 现代化设计，支持响应式布局
- 🚀 **快速搜索** - 本地搜索，即时响应
- 📱 **移动优先** - 完美支持移动端和桌面端
- 🎯 **分类管理** - 9 大分类，79 个精选网站
- 🔍 **智能搜索** - 支持按名称和描述搜索
- 🔐 **后台管理** - GitHub OAuth 登录，在线编辑数据
- ⚡ **一键部署** - 支持 Vercel 一键部署
- 💾 **GitHub 同步** - 数据自动同步到 GitHub 仓库
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
heiyu-nav/
├── src/
│   ├── assets/          # 静态资源
│   │   ├── css/        # 样式文件
│   │   ├── font/       # 字体图标
│   │   └── img/        # 图片资源
│   ├── components/      # 组件
│   │   ├── index/      # 前台组件
│   │   └── admin/      # 后台组件
│   ├── views/          # 视图页面
│   │   ├── Index/      # 前台页面
│   │   ├── AdminCallback.vue    # OAuth 回调页面
│   │   └── AdminDashboard.vue   # 后台管理页面
│   ├── router/         # 路由配置
│   ├── store/          # 状态管理
│   │   ├── index.ts    # 主 store
│   │   └── admin.ts    # 后台 store
│   ├── utils/          # 工具函数
│   ├── config/         # ⭐ 配置文件（需要修改）
│   │   ├── data.json   # ⭐ 网站数据
│   │   └── index.ts    # ⭐ 网站信息
│   ├── App.vue         # 根组件
│   └── main.ts         # 入口文件
├── api/                # Serverless API
│   ├── auth/           # OAuth 认证
│   │   ├── github.ts   # GitHub OAuth 处理
│   │   └── callback.ts # OAuth 回调处理
│   ├── github/         # GitHub API
│   │   ├── get-file.ts    # 获取文件
│   │   └── update-file.ts # 更新文件
│   └── favicon.ts      # 网站图标获取
├── public/             # 公共资源
├── index.html          # HTML 模板
├── vite.config.ts      # Vite 配置
├── vercel.json         # Vercel 配置
├── tsconfig.json       # TypeScript 配置
├── tailwind.config.js  # TailwindCSS 配置
└── package.json        # 项目配置
```


## 📝 配置说明

### 必改配置项

#### 1. 网站数据 (`src/config/data.json`)

包含所有网站分类和链接：

```json
{
  "categories": [
    {
      "id": 1,
      "name": "分类名称"
    }
  ],
  "items": [
    {
      "id": 1,
      "name": "网站名称",
      "url": "https://example.com",
      "description": "网站描述",
      "categoryId": 1
    }
  ]
}
```

#### 2. 网站信息 (`src/config/index.ts`)

配置项说明：

```typescript
// 网站名称
export const SITE_NAME = '黑羽导航'

// 备案号（如果没有可以留空或删除）
export const ICP_NUMBER = '豫ICP备2023030596号'

// 网站图标API（无需修改）
export const Favicon = '/api/favicon?url='
```

### 可选配置

- **自定义域名**：在 Vercel Dashboard 中配置
- **环境变量**：在 Vercel 项目设置中添加
- **构建配置**：`vercel.json` 已预配置，一般无需修改

## 🔐 后台管理系统

本项目内置了后台管理系统，支持通过 Web 界面管理导航数据。

### 快速配置

1. **创建 GitHub OAuth App** - 参考 [ADMIN_CONFIG.md](./ADMIN_CONFIG.md)
2. **配置环境变量**：

在 Vercel Dashboard → Settings → Environment Variables 添加：

```bash
# 必需的环境变量
GITHUB_CLIENT_ID=你的_client_id           # 后端 API 使用
GITHUB_CLIENT_SECRET=你的_client_secret   # 后端 API 使用
VITE_GITHUB_CLIENT_ID=你的_client_id      # 前端使用（与上面相同）

# 可选的环境变量（有默认值）
GITHUB_REPO_OWNER=你的_github_用户名      # 默认: xia-66
GITHUB_REPO_NAME=nav                      # 默认: nav
GITHUB_ALLOWED_USERS=你的_github_用户名   # 默认: xia-66
```

3. **访问后台** - `https://你的域名.com/#/admin/login`

详细配置请参考：[后台管理配置指南](./ADMIN_CONFIG.md)

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

**前台功能**
- ✅ 网站展示 - 按分类展示所有导航网站
- ✅ 实时搜索 - 支持搜索网站名称和描述
- ✅ 锚点导航 - 快速跳转到指定分类
- ✅ 懒加载 - 网站图标按需加载
- ✅ 响应式 - 完美支持 PC 和移动端
- ✅ 侧边栏 - 移动端友好的抽屉菜单
- ✅ 时钟显示 - 实时显示当前时间
- ✅ 背景效果 - 精美的背景图片

**后台管理**
- ✅ GitHub OAuth - 安全的第三方登录
- ✅ 在线编辑 - 可视化编辑导航数据
- ✅ 实时预览 - 修改后即时查看效果
- ✅ 自动同步 - 一键提交到 GitHub 仓库
- ✅ 权限控制 - 仅允许授权用户访问

### 交互体验

- 流畅的动画效果
- 直观的操作界面
- 快速的搜索响应
- 优雅的加载状态

## 📖 版本历史

### v2.2.0 (2024-11-27)

- 🎨 优化后台登录对话框组件，简化样式
- ✅ 修复 Vercel 部署环境变量配置问题
- ✅ 替换用户头像为 `el-avatar` 组件
- ✅ 移除登录加载页面，改为静默处理
- ✅ 修复图标字体问题（icon-lock → icon-md-lock）
- ✅ 移除按钮悬浮样式
- ✅ 优化弹窗关闭逻辑
- 📝 完善环境变量配置文档

### v2.1.0 (2024-10-31)

- 🚀 优化部署流程，支持 Vercel 一键部署
- ✅ 简化配置文件管理
- ✅ 更新文档说明
- ✅ 优化项目结构

### v2.0.0 (2024-10-25)

- 🎉 重大更新：纯前端化架构
- ✅ 删除所有后台代码和依赖
- ✅ 使用本地 JSON 数据
- ✅ 优化所有网站描述
- ✅ 删除无用代码和文件
- ✅ 精简项目结构

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

- 项目主页: [GitHub](https://github.com/xia-66/nav)
- 问题反馈: [Issues](https://github.com/xia-66/nav/issues)

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！

**黑羽导航 - 你的个人网站导航助手** 🎉
