import { VercelRequest, VercelResponse } from '@vercel/node';

interface GitHubTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
}

const ALLOWED_USERS = (process.env.GITHUB_ALLOWED_USERS || 'xia-66').split(',').map(u => u.trim());

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: '缺少授权码' });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: '服务器配置错误' });
  }

  try {
    // 1. 使用 code 换取 access_token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json() as GitHubTokenResponse;

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description || '授权失败' });
    }

    const accessToken = tokenData.access_token;

    // 2. 获取用户信息
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const userData = await userResponse.json() as GitHubUser;

    // 3. 验证用户是否在允许列表中
    if (!ALLOWED_USERS.includes(userData.login)) {
      return res.status(403).json({ error: `无权限访问，仅允许以下用户: ${ALLOWED_USERS.join(', ')}` });
    }

    // 4. 返回 token 和用户信息
    return res.status(200).json({
      token: accessToken,
      user: {
        login: userData.login,
        name: userData.name,
        avatar_url: userData.avatar_url,
      },
    });
  } catch (error) {
    console.error('GitHub OAuth Error:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
}

