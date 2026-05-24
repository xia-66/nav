# heiyu-nav

一个纯静态的 Vue 3 导航页。站点数据来自 `src/config/data.json`，构建后可以部署到任意静态托管服务。

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 数据维护

导航分类和条目都在 `src/config/data.json` 中维护：

- `categories`：分类列表
- `items`：导航条目

页面不会调用本项目后端接口，也不包含管理后台、OAuth 登录或 serverless API。
