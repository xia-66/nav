import { VercelRequest, VercelResponse } from '@vercel/node';

const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'xia-66';
const REPO_NAME = process.env.GITHUB_REPO_NAME || 'nav';
const FILE_PATH = 'src/config/data.json';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(401).json({ error: '未授权' });
  }

  try {
    // 获取文件内容和 SHA
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('获取文件失败');
    }

    const data = await response.json();
    
    // 解码 Base64 内容
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    
    return res.status(200).json({
      content: JSON.parse(content),
      sha: data.sha,
    });
  } catch (error) {
    console.error('Get File Error:', error);
    return res.status(500).json({ error: '获取文件失败' });
  }
}

