import type { Plugin } from 'vite'

/**
 * Vite 插件 - 开发环境 Favicon API 模拟
 * 在开发环境中提供 /api/favicon 路由
 */
export default function faviconApiPlugin(): Plugin {
  return {
    name: 'vite-plugin-favicon-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // 只处理 /api/favicon 请求
        if (!req.url?.startsWith('/api/favicon')) {
          return next()
        }

        // 解析查询参数
        const url = new URL(req.url, `http://${req.headers.host}`)
        const targetUrl = url.searchParams.get('url')

        if (!targetUrl) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: '缺少 URL 参数' }))
          return
        }

        try {
          // 解析目标 URL
          let parsedUrl: URL
          try {
            parsedUrl = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`)
          } catch {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'URL 格式错误' }))
            return
          }

          const hostname = parsedUrl.hostname

          // 尝试获取 favicon
          const services = [
            `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`,
            `https://icons.duckduckgo.com/ip3/${hostname}.ico`,
            `https://favicon.im/${hostname}?larger=true`,
            `${parsedUrl.origin}/favicon.ico`,
          ]

          for (const serviceUrl of services) {
            try {
              const controller = new AbortController()
              const timeoutId = setTimeout(() => controller.abort(), 5000)

              const response = await fetch(serviceUrl, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                },
                signal: controller.signal,
              })

              clearTimeout(timeoutId)

              if (response.ok) {
                const buffer = await response.arrayBuffer()
                const contentType = response.headers.get('content-type') || 'image/x-icon'

                res.statusCode = 200
                res.setHeader('Content-Type', contentType)
                res.setHeader('Cache-Control', 'public, max-age=86400')
                res.end(Buffer.from(buffer))
                return
              }
            } catch (error) {
              // 继续尝试下一个服务
              continue
            }
          }

          // 所有服务都失败，返回默认图标
          const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="#f0f0f0"/>
            <text x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial" font-size="40" fill="#999">?</text>
          </svg>`

          res.statusCode = 200
          res.setHeader('Content-Type', 'image/svg+xml')
          res.setHeader('Cache-Control', 'public, max-age=3600')
          res.end(defaultSvg)
        } catch (error) {
          console.error('Favicon API 错误:', error)

          const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="#ffebee"/>
            <text x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial" font-size="40" fill="#c62828">!</text>
          </svg>`

          res.statusCode = 200
          res.setHeader('Content-Type', 'image/svg+xml')
          res.end(errorSvg)
        }
      })
    },
  }
}

