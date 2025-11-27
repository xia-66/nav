import { VercelRequest, VercelResponse } from '@vercel/node';

interface GitHubUser {
  login: string;
}

interface GitHubErrorResponse {
  message?: string;
}

interface GitHubUpdateResponse {
  commit: {
    sha: string;
    url: string;
  };
}

const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'xia-66';
const REPO_NAME = process.env.GITHUB_REPO_NAME || 'nav';
const FILE_PATH = 'src/config/data.json';
const ALLOWED_USERS = (process.env.GITHUB_ALLOWED_USERS || 'xia-66').split(',').map(u => u.trim());

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  const { token, content, sha, message } = req.body;

  if (!token || !content || !sha) {
    return res.status(400).json({ error: '缺少必要参数' });
  }

  try {
    // 验证用户身份
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const userData = await userResponse.json() as GitHubUser;

    if (!ALLOWED_USERS.includes(userData.login)) {
      return res.status(403).json({ error: `无权限修改，仅允许以下用户: ${ALLOWED_USERS.join(', ')}` });
    }

    // 更新文件
    const updateResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message || '更新导航数据',
          content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
          sha: sha,
        }),
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json() as GitHubErrorResponse;
      throw new Error(errorData.message || '更新文件失败');
    }

    const result = await updateResponse.json() as GitHubUpdateResponse;

    return res.status(200).json({
      success: true,
      commit: result.commit,
    });
  } catch (error: any) {
    console.error('Update File Error:', error);
    return res.status(500).json({ error: error.message || '更新文件失败' });
  }
}

