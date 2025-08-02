<template>
  <!-- 已登录状态 - 管理后台 -->
  <div class="admin-container" v-if="isLoggedIn">
    <!-- 管理后台头部 -->
    <AdminHeader
      :is-logged-in="isLoggedIn"
      :username="username"
      @show-login="showLoginDialog = true"
      @logout="handleLogout"
    />

    <el-card shadow="hover" class="admin-card">
      <el-tabs v-model="activeTab" class="custom-tabs">
        <el-tab-pane label="分类管理" name="categories">
          <CategoryManagement />
        </el-tab-pane>
        <el-tab-pane label="链接管理" name="items">
          <ItemManagement />
        </el-tab-pane>
        <el-tab-pane label="系统管理" name="system">
          <SystemManagement />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>

  <!-- 未登录状态 - 全屏登录页面 -->
  <div class="fullscreen-login" v-else>
    <div class="login-background">
      <div class="login-content">
        <!-- 标题区域 -->
        <div class="title-section">
          <!-- <h1 class="main-title">黑羽导航管理平台</h1> -->
          <p class="subtitle">黑羽导航管理系统</p>
        </div>

        <!-- 登录卡片 -->
        <div class="login-card">
          <div class="card-header">
            <h3 class="welcome-title">欢迎回来</h3>
            <p class="welcome-subtitle">请输入您的授权密钥以继续</p>
          </div>

          <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" @keyup.enter="handleLogin" class="login-form">
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入授权密钥"
                :prefix-icon="Lock"
                show-password
                class="password-input"
                :disabled="loginLoading"
                size="large"
              />
            </el-form-item>
            
            <div class="form-options" v-if="loginAttempts > 0 || rememberMe">
              <el-checkbox v-model="rememberMe" :disabled="loginLoading" class="remember-checkbox">
                记住我
              </el-checkbox>
              <span class="login-attempts" v-if="loginAttempts > 0">
                登录失败 {{ loginAttempts }} 次
              </span>
            </div>

            <el-button
              type="primary"
              @click="handleLogin"
              :loading="loginLoading"
              class="login-submit-btn"
              :disabled="isLoginBlocked"
              size="large"
            >
              {{ isLoginBlocked ? `请等待 ${blockTimeRemaining}s` : '立即登录' }}
            </el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AdminLogin } from '../../apis/admin'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import AdminHeader from '../../components/admin/AdminHeader.vue'
import CategoryManagement from '../../components/admin/CategoryManagement.vue'
import ItemManagement from '../../components/admin/ItemManagement.vue'
import SystemManagement from '../../components/admin/SystemManagement.vue'
import { DEFAULT_ADMIN_PASSWORD } from '../../config'

interface LoginForm {
  password: string
}

const activeTab = ref('categories')

// 登录相关变量
const isLoggedIn = ref(false)
const username = ref('')
const showLoginDialog = ref(false)
const loginLoading = ref(false)
const loginFormRef = ref<FormInstance>()
const loginForm = ref<LoginForm>({
  password: ''
})

// 新增的登录相关变量
const rememberMe = ref(false)
const loginAttempts = ref(0)
const isLoginBlocked = ref(false)
const blockTimeRemaining = ref(0)
const maxLoginAttempts = 5
const blockDuration = 300 // 5分钟

// 登录表单验证规则
const loginRules: FormRules<LoginForm> = {
  password: [
    { required: true, message: '请输入授权密钥', trigger: 'blur' },
    { min: 4, message: '密钥长度至少 4 个字符', trigger: 'blur' }
  ]
}

// 登录相关函数
const resetLoginForm = () => {
  loginForm.value = {
    password: ''
  }
  rememberMe.value = false
  loginFormRef.value?.clearValidate()
}

// 检查登录是否被阻止
const checkLoginBlock = () => {
  const blockEndTime = localStorage.getItem('login_block_end')
  if (blockEndTime) {
    const now = Date.now()
    const endTime = parseInt(blockEndTime)
    if (now < endTime) {
      isLoginBlocked.value = true
      blockTimeRemaining.value = Math.ceil((endTime - now) / 1000)
      
      // 开始倒计时
      const timer = setInterval(() => {
        blockTimeRemaining.value--
        if (blockTimeRemaining.value <= 0) {
          isLoginBlocked.value = false
          localStorage.removeItem('login_block_end')
          localStorage.removeItem('login_attempts')
          loginAttempts.value = 0
          clearInterval(timer)
        }
      }, 1000)
      
      return true
    } else {
      // 阻止时间已过，清理数据
      localStorage.removeItem('login_block_end')
      localStorage.removeItem('login_attempts')
      loginAttempts.value = 0
    }
  }
  return false
}

// 处理登录失败
const handleLoginFailure = () => {
  loginAttempts.value++
  localStorage.setItem('login_attempts', loginAttempts.value.toString())
  
  if (loginAttempts.value >= maxLoginAttempts) {
    const blockEndTime = Date.now() + blockDuration * 1000
    localStorage.setItem('login_block_end', blockEndTime.toString())
    isLoginBlocked.value = true
    blockTimeRemaining.value = blockDuration
    
    ElMessage.error(`登录失败次数过多，请等待 ${blockDuration / 60} 分钟后再试`)
    
    // 开始倒计时
    const timer = setInterval(() => {
      blockTimeRemaining.value--
      if (blockTimeRemaining.value <= 0) {
        isLoginBlocked.value = false
        localStorage.removeItem('login_block_end')
        localStorage.removeItem('login_attempts')
        loginAttempts.value = 0
        clearInterval(timer)
      }
    }, 1000)
  }
}

// 处理登录成功
const handleLoginSuccess = (usernameParam: string, message: string) => {
  isLoggedIn.value = true
  username.value = usernameParam
  showLoginDialog.value = false
  
  // 清理登录失败记录
  loginAttempts.value = 0
  localStorage.removeItem('login_attempts')
  localStorage.removeItem('login_block_end')
  
  // 根据"记住我"选择存储方式
  const storage = rememberMe.value ? localStorage : sessionStorage
  storage.setItem('admin_logged_in', 'true')
  storage.setItem('admin_username', usernameParam)
  
  // 如果选择了记住我，设置过期时间（30天）
  if (rememberMe.value) {
    const expireTime = Date.now() + 30 * 24 * 60 * 60 * 1000
    localStorage.setItem('admin_login_expire', expireTime.toString())
  }
  
  ElMessage.success(message)
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  // 检查是否被阻止登录
  if (isLoginBlocked.value) {
    ElMessage.warning(`登录被阻止，请等待 ${blockTimeRemaining.value} 秒`)
    return
  }
  
  try {
    await loginFormRef.value.validate()
    loginLoading.value = true
    
    // 首先检查是否为默认密码
    if (loginForm.value.password === DEFAULT_ADMIN_PASSWORD) {
      handleLoginSuccess('管理员', '授权验证成功!')
      return
    }
    
    // 如果不是默认密码，则调用后端 API 进行密码验证
    try {
      const response = await AdminLogin({
        password: loginForm.value.password
      })
      
      if (response.data.statusCode === 200) {
        const responseUsername = response.data.data?.username || '管理员'
        handleLoginSuccess(responseUsername, response.data.message || '授权验证成功!')
      } else {
        handleLoginFailure()
        ElMessage.error(response.data.message || '授权密钥错误!')
      }
    } catch (apiError: any) {
      // 如果后端API调用失败，检查是否可以使用默认密码
      if (loginForm.value.password === DEFAULT_ADMIN_PASSWORD) {
        handleLoginSuccess('管理员', '服务器连接失败，使用默认密钥登录成功!')
      } else {
        handleLoginFailure()
        ElMessage.error('无法连接到服务器，请检查网络连接或使用默认密钥 "heiyu" 登录')
      }
    }
  } catch (error: any) {
    ElMessage.error('登录验证失败，请检查输入信息!')
  } finally {
    loginLoading.value = false
  }
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    isLoggedIn.value = false
    username.value = ''
    
    // 清理所有存储的登录信息
    sessionStorage.removeItem('admin_logged_in')
    sessionStorage.removeItem('admin_username')
    localStorage.removeItem('admin_logged_in')
    localStorage.removeItem('admin_username')
    localStorage.removeItem('admin_login_expire')
    
    ElMessage.success('已退出登录!')
  })
}

onMounted(() => {
  // 初始化登录失败次数
  const storedAttempts = localStorage.getItem('login_attempts')
  if (storedAttempts) {
    loginAttempts.value = parseInt(storedAttempts)
  }
  
  // 检查登录阻止状态
  checkLoginBlock()
  
  // 检查登录状态 - 优先检查localStorage（记住我），然后检查sessionStorage
  let isStoredLoggedIn = localStorage.getItem('admin_logged_in')
  let storedUsername = localStorage.getItem('admin_username')
  let isRemembered = false
  
  if (isStoredLoggedIn === 'true' && storedUsername) {
    // 检查localStorage中的登录是否过期
    const expireTime = localStorage.getItem('admin_login_expire')
    if (expireTime && Date.now() > parseInt(expireTime)) {
      // 已过期，清理localStorage
      localStorage.removeItem('admin_logged_in')
      localStorage.removeItem('admin_username')
      localStorage.removeItem('admin_login_expire')
      isStoredLoggedIn = null
      storedUsername = null
    } else {
      isRemembered = true
    }
  }
  
  // 如果localStorage中没有有效登录信息，检查sessionStorage
  if (!isStoredLoggedIn || !storedUsername) {
    isStoredLoggedIn = sessionStorage.getItem('admin_logged_in')
    storedUsername = sessionStorage.getItem('admin_username')
  }
  
  if (isStoredLoggedIn === 'true' && storedUsername) {
    isLoggedIn.value = true
    username.value = storedUsername
    const welcomeMessage = isRemembered ? '欢迎回来，' + storedUsername + '（已记住登录）' : '欢迎回来，' + storedUsername
    ElMessage.success(welcomeMessage)
  }
})
</script>

<style scoped>
/* 管理后台样式 */
.admin-container {
  padding: 32px;
  background-color: #f5f7fa;
  min-height: 100vh;
  transition: all 0.3s ease;
}

.admin-card {
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

:deep(.el-card__body) {
  padding: 0;
}

.custom-tabs {
  padding: 0 20px;
}

:deep(.el-tabs__header) {
  margin: 0;
  padding: 16px 0 0;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-tabs__item) {
  font-size: 16px;
  padding: 0 24px 16px;
  height: auto;
  font-weight: 500;
  transition: all 0.3s;
}

:deep(.el-tabs__item.is-active) {
  color: #1890ff;
  font-weight: 600;
}

:deep(.el-tabs__active-bar) {
  height: 3px;
  border-radius: 3px;
  background: linear-gradient(90deg, #1890ff, #36cfc9);
}

/* 全屏登录页面样式 */
.fullscreen-login {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.login-background {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%);
  pointer-events: none;
  animation: backgroundFloat 20s ease-in-out infinite;
}

.login-background::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background:
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 25%),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 0%, transparent 25%);
  animation: floatingOrbs 30s linear infinite;
  pointer-events: none;
}

@keyframes backgroundFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
}

@keyframes floatingOrbs {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.login-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  padding: 0 20px;
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title-section {
  text-align: center;
  margin-bottom: 60px;
  animation: titleGlow 2s ease-in-out infinite alternate;
}

.main-title {
  font-size: 4rem;
  font-weight: 700;
  color: white;
  margin: 0 0 16px 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(255, 255, 255, 0.1);
  letter-spacing: -0.02em;
  background: linear-gradient(45deg, #ffffff, #f0f8ff, #ffffff);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleShimmer 3s ease-in-out infinite;
}

.subtitle {
  font-size: 2.5rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 400;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: subtitleFloat 4s ease-in-out infinite;
}

@keyframes titleGlow {
  0% { filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3)); }
  100% { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.6)); }
}

@keyframes titleShimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes subtitleFloat {
  0%, 100% { transform: translateY(0px); opacity: 0.9; }
  50% { transform: translateY(-3px); opacity: 1; }
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  animation: cardFloat 6s ease-in-out infinite;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: cardShine 3s ease-in-out infinite;
}

@keyframes cardFloat {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-5px) scale(1.01); }
}

@keyframes cardShine {
  0% { left: -100%; }
  50% { left: 100%; }
  100% { left: 100%; }
}

.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.welcome-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 12px 0;
}

.welcome-subtitle {
  font-size: 0.95rem;
  color: #718096;
  margin: 0;
  line-height: 1.5;
}

.login-form {
  width: 100%;
}

.password-input {
  margin-bottom: 20px;
}

.password-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  box-shadow: none;
  transition: all 0.3s ease;
  padding: 8px 16px;
  min-height: 40px;
}

.password-input :deep(.el-input__wrapper:hover) {
  border-color: #cbd5e0;
}

.password-input :deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.password-input :deep(.el-input__inner) {
  font-size: 16px;
  color: #2d3748;
}

.password-input :deep(.el-input__inner::placeholder) {
  color: #a0aec0;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  min-height: 20px;
}

.remember-checkbox :deep(.el-checkbox__label) {
  color: #4a5568;
  font-size: 14px;
}

.login-attempts {
  font-size: 12px;
  color: #e53e3e;
  font-weight: 500;
}

.login-submit-btn {
  width: 100%;
  height: 44px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
}

.login-submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.login-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
  background: linear-gradient(135deg, #7c8ef0 0%, #8a5cb8 100%);
}

.login-submit-btn:hover:not(:disabled)::before {
  left: 100%;
}

.login-submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-submit-btn:disabled {
  background: #cbd5e0;
  color: #a0aec0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.login-submit-btn:disabled::before {
  display: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-container {
    padding: 16px;
  }
  
  .main-title {
    font-size: 3rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  .login-card {
    padding: 32px 24px;
    margin: 0 16px;
  }
  
  .title-section {
    margin-bottom: 40px;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .login-card {
    padding: 28px 20px;
    border-radius: 16px;
  }
  
  .welcome-title {
    font-size: 1.6rem;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

/* Element Plus 组件样式覆盖 */
:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-form-item__content) {
  line-height: 1;
}
</style>
