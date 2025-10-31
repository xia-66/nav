import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Vercel Serverless Function - 获取网站 Favicon
 * 使用方法: /api/favicon?url=https://example.com
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' })
  }

  const { url } = req.query

  // 验证 URL 参数
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: '缺少 URL 参数' })
  }

  try {
    // 解析 URL，处理各种格式
    let targetUrl: URL
    try {
      // 如果 URL 没有协议，添加 https://
      const urlToProcess = url.startsWith('http') ? url : `https://${url}`
      targetUrl = new URL(urlToProcess)
    } catch (urlError) {
      return res.status(400).json({ error: 'URL 格式错误' })
    }

    const hostname = targetUrl.hostname

    // 首先尝试通过 Google 的服务获取（最可靠）
    const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch(googleFaviconUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)

      if (response.ok) {
        const buffer = await response.arrayBuffer()
        const contentType = response.headers.get('content-type') || 'image/x-icon'
        
        // 设置缓存（24小时）
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800')
        res.setHeader('Content-Type', contentType)
        
        return res.status(200).send(Buffer.from(buffer))
      }
    } catch (googleError) {
      console.error('Google favicon 服务失败:', googleError instanceof Error ? googleError.message : String(googleError))
    }

    // 如果 Google 服务失败，尝试其他服务
    const fallbackServices = [
      `https://icons.duckduckgo.com/ip3/${hostname}.ico`,
      `https://favicon.im/${hostname}?larger=true`,
    ]

    for (const serviceUrl of fallbackServices) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000)
        
        const response = await fetch(serviceUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)

        if (response.ok) {
          const buffer = await response.arrayBuffer()
          const contentType = response.headers.get('content-type') || 'image/x-icon'
          
          res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800')
          res.setHeader('Content-Type', contentType)
          
          return res.status(200).send(Buffer.from(buffer))
        }
      } catch (error) {
        console.error(`服务 ${serviceUrl} 失败:`, error instanceof Error ? error.message : String(error))
        continue
      }
    }

    // 尝试直接从网站获取
    const directUrls = [
      `${targetUrl.origin}/favicon.ico`,
      `${targetUrl.origin}/favicon.png`,
    ]

    for (const directUrl of directUrls) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2000)
        
        const response = await fetch(directUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)

        if (response.ok) {
          const buffer = await response.arrayBuffer()
          const contentType = response.headers.get('content-type') || 'image/x-icon'
          
          res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800')
          res.setHeader('Content-Type', contentType)
          
          return res.status(200).send(Buffer.from(buffer))
        }
      } catch (error) {
        continue
      }
    }

    // 所有尝试都失败，返回一个简单的 SVG 占位图标
    const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#f0f0f0"/>
      <text x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial" font-size="40" fill="#999">?</text>
    </svg>`
    
    res.setHeader('Content-Type', 'image/svg+xml')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    return res.status(200).send(defaultSvg)

  } catch (error) {
    console.error('获取 favicon 错误:', error)
    
    // 返回错误占位图标
    const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#ffebee"/>
      <text x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial" font-size="40" fill="#c62828">!</text>
    </svg>`
    
    res.setHeader('Content-Type', 'image/svg+xml')
    return res.status(200).send(errorSvg)
  }
}

