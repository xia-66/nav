import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * GitHub OAuth 回调处理
 * 将 GitHub 的回调重定向到前端的 hash 路由
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code, error, error_description } = req.query;

  // 如果有错误，重定向到首页并提示错误
  if (error) {
    const errorMsg = error_description || error || '授权失败';
    return res.redirect(`/#/index?error=${encodeURIComponent(errorMsg as string)}`);
  }

  // 如果没有 code，返回错误
  if (!code) {
    return res.redirect('/#/index?error=缺少授权码');
  }

  // 重定向到前端的 callback 页面（hash 路由）
  return res.redirect(`/#/admin/callback?code=${code}`);
}

