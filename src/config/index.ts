import * as pkg from '../../package.json'

// ==================== 网站基本信息 ====================
// 网站名称
export const SITE_NAME = '黑羽导航'

// 备案号
export const ICP_NUMBER = '豫ICP备2023030596号'

// ==================== 版本信息 ====================
// 项目版本号
export const RELEASE = `v${pkg.version}`

// ==================== API 配置 ====================
// 获取网站Favicon接口
// 开发环境通过 Vite 插件模拟，生产环境使用 Vercel Serverless Function
export const Favicon = '/api/favicon?url='
