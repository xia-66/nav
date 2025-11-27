import { defineStore } from 'pinia';
import { ref } from 'vue';

interface User {
  login: string;
  name: string;
  avatar_url: string;
}

export const useAdminStore = defineStore('admin', () => {
  const token = ref<string | null>(localStorage.getItem('github_token'));
  const user = ref<User | null>(
    localStorage.getItem('github_user')
      ? JSON.parse(localStorage.getItem('github_user')!)
      : null
  );
  const isAuthenticated = ref<boolean>(!!token.value);

  // 设置认证信息
  const setAuth = (newToken: string, newUser: User) => {
    token.value = newToken;
    user.value = newUser;
    isAuthenticated.value = true;
    localStorage.setItem('github_token', newToken);
    localStorage.setItem('github_user', JSON.stringify(newUser));
  };

  // 清除认证信息
  const clearAuth = () => {
    token.value = null;
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_user');
  };

  // GitHub OAuth 登录
  const loginWithGitHub = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    // 注意：这里使用 /api/auth/callback 作为回调地址（没有 #）
    // 服务端会重定向到 /#/admin/callback
    const redirectUri = `${window.location.origin}/api/auth/callback`;
    const scope = 'repo';
    
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  // 处理 OAuth 回调
  const handleCallback = async (code: string) => {
    try {
      const response = await fetch(`/api/auth/github?code=${code}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '登录失败');
      }

      setAuth(data.token, data.user);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  // 获取文件内容
  const getFileContent = async () => {
    if (!token.value) {
      throw new Error('未授权');
    }

    try {
      const response = await fetch(`/api/github/get-file?token=${token.value}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '获取文件失败');
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || '获取文件失败');
    }
  };

  // 更新文件内容
  const updateFileContent = async (content: any, sha: string, message?: string) => {
    if (!token.value) {
      throw new Error('未授权');
    }

    try {
      const response = await fetch('/api/github/update-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token.value,
          content,
          sha,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '更新文件失败');
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || '更新文件失败');
    }
  };

  return {
    token,
    user,
    isAuthenticated,
    setAuth,
    clearAuth,
    loginWithGitHub,
    handleCallback,
    getFileContent,
    updateFileContent,
  };
});

