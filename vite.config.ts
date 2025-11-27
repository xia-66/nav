import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import faviconApiPlugin from './vite-plugin-favicon-api'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
  plugins: [
    vue(), 
    faviconApiPlugin(),
    // 自定义插件处理所有 API 路由（模拟 Vercel Serverless）
    {
      name: 'api-handler',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          // 处理 /api/auth/callback 路由
          if (req.url?.startsWith('/api/auth/callback')) {
            const url = new URL(req.url, `http://${req.headers.host}`);
            const code = url.searchParams.get('code');
            const error = url.searchParams.get('error');
            const errorDescription = url.searchParams.get('error_description');

            if (error) {
              const errorMsg = errorDescription || error || '授权失败';
              res.writeHead(302, { Location: `/#/index?error=${encodeURIComponent(errorMsg)}` });
              res.end();
              return;
            }

            if (!code) {
              res.writeHead(302, { Location: '/#/index?error=缺少授权码' });
              res.end();
              return;
            }

            // 重定向到前端的 callback 页面（hash 路由）
            res.writeHead(302, { Location: `/#/admin/callback?code=${code}` });
            res.end();
            return;
          }

          // 处理 /api/auth/github 路由
          if (req.url?.startsWith('/api/auth/github')) {
            const url = new URL(req.url, `http://${req.headers.host}`);
            const code = url.searchParams.get('code');

            res.setHeader('Content-Type', 'application/json');

            if (!code) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: '缺少授权码' }));
              return;
            }

            const clientId = env.VITE_GITHUB_CLIENT_ID;
            const clientSecret = env.GITHUB_CLIENT_SECRET;

            if (!clientId || !clientSecret) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: '服务器配置错误：请检查 .env 文件中的 GITHUB_CLIENT_ID 和 GITHUB_CLIENT_SECRET' }));
              return;
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

              const tokenData = await tokenResponse.json();

              if (tokenData.error) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: tokenData.error_description || '授权失败' }));
                return;
              }

              const accessToken = tokenData.access_token;

              // 2. 获取用户信息
              const userResponse = await fetch('https://api.github.com/user', {
                headers: {
                  'Authorization': `token ${accessToken}`,
                  'Accept': 'application/vnd.github.v3+json',
                },
              });

              const userData = await userResponse.json();

              // 3. 验证用户是否为 xia-66
              if (userData.login !== 'xia-66') {
                res.statusCode = 403;
                res.end(JSON.stringify({ error: '无权限访问，仅允许 xia-66 用户' }));
                return;
              }

              // 4. 返回 token 和用户信息
              res.statusCode = 200;
              res.end(JSON.stringify({
                token: accessToken,
                user: {
                  login: userData.login,
                  name: userData.name,
                  avatar_url: userData.avatar_url,
                },
              }));
              return;
            } catch (error) {
              console.error('GitHub OAuth Error:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: '服务器内部错误' }));
              return;
            }
          }

          // 处理 /api/github/get-file 路由
          if (req.url?.startsWith('/api/github/get-file')) {
            const url = new URL(req.url, `http://${req.headers.host}`);
            const token = url.searchParams.get('token');

            res.setHeader('Content-Type', 'application/json');

            if (!token) {
              res.statusCode = 401;
              res.end(JSON.stringify({ error: '未授权' }));
              return;
            }

            const repoOwner = env.GITHUB_REPO_OWNER || 'xia-66';
            const repoName = env.GITHUB_REPO_NAME || 'nav';

            try {
              const response = await fetch(
                `https://api.github.com/repos/${repoOwner}/${repoName}/contents/src/config/data.json`,
                {
                  headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                  },
                }
              );

              if (!response.ok) {
                res.statusCode = response.status;
                res.end(JSON.stringify({ error: '获取文件失败' }));
                return;
              }

              const data = await response.json();
              const content = Buffer.from(data.content, 'base64').toString('utf-8');

              res.statusCode = 200;
              res.end(JSON.stringify({
                content: JSON.parse(content),
                sha: data.sha,
              }));
              return;
            } catch (error) {
              console.error('Get File Error:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: '获取文件失败' }));
              return;
            }
          }

          // 处理 /api/github/update-file 路由
          if (req.url?.startsWith('/api/github/update-file') && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });

            req.on('end', async () => {
              try {
                const { token, content, sha, message } = JSON.parse(body);

                res.setHeader('Content-Type', 'application/json');

                if (!token || !content || !sha) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: '缺少必要参数' }));
                  return;
                }

                const allowedUsers = (env.GITHUB_ALLOWED_USERS || 'xia-66').split(',').map(u => u.trim());

                // 验证用户身份
                const userResponse = await fetch('https://api.github.com/user', {
                  headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                  },
                });

                const userData = await userResponse.json();

                if (!allowedUsers.includes(userData.login)) {
                  res.statusCode = 403;
                  res.end(JSON.stringify({ error: `无权限修改，仅允许以下用户: ${allowedUsers.join(', ')}` }));
                  return;
                }

                const repoOwner = env.GITHUB_REPO_OWNER || 'xia-66';
                const repoName = env.GITHUB_REPO_NAME || 'nav';

                // 更新文件
                const updateResponse = await fetch(
                  `https://api.github.com/repos/${repoOwner}/${repoName}/contents/src/config/data.json`,
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
                  const errorData = await updateResponse.json();
                  res.statusCode = updateResponse.status;
                  res.end(JSON.stringify({ error: errorData.message || '更新文件失败' }));
                  return;
                }

                const result = await updateResponse.json();

                res.statusCode = 200;
                res.end(JSON.stringify({
                  success: true,
                  commit: result.commit,
                }));
                return;
              } catch (error) {
                console.error('Update File Error:', error);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: '更新文件失败' }));
                return;
              }
            });
            return;
          }

          next();
        });
      }
    }
  ],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  // 配置根路径
  resolve: {
    // ↓路径别名，主要是这部分
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      // 使用新的API方式
      scss: {
        api: 'modern-compiler'
      }
      // 如果需要全局引入变量或mixin
      // additionalData: `@import "@/styles/variables.scss";`
    }
  },
  server: {
    // 配置host，局域网可访问
    host: '0.0.0.0',
    port: 8080
  }
}})
