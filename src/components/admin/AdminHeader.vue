<template>
  <div class="admin-header">
    <div class="header-content">
      <div class="header-left">
        <h1 class="page-title">管理后台</h1>
        <el-button 
          type="info" 
          @click="goToIndex" 
          :icon="House" 
          class="back-button"
          plain
        >
          返回首页
        </el-button>
      </div>
      <div class="auth-section">
        <span v-if="isLoggedIn" class="welcome-text">欢迎，{{ username }}</span>
        <el-button 
          v-if="!isLoggedIn" 
          type="primary" 
          @click="$emit('showLogin')" 
          :icon="User" 
          class="login-button"
        >
          管理员登录
        </el-button>
        <el-button 
          v-if="isLoggedIn" 
          type="danger" 
          @click="$emit('logout')" 
          :icon="SwitchButton" 
          class="logout-button"
        >
          退出登录
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, SwitchButton, House } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

interface Props {
  isLoggedIn: boolean
  username: string
}

defineProps<Props>()
defineEmits<{
  showLogin: []
  logout: []
}>()

const router = useRouter()

const goToIndex = () => {
  router.push('/')
}
</script>

<script lang="ts">
export default {
  name: 'AdminHeader'
}
</script>

<style scoped>
.admin-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.auth-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.welcome-text {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.back-button {
  height: 36px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;
}

.back-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.login-button, .logout-button {
  height: 40px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;
}

.login-button {
  background: linear-gradient(45deg, #1890ff, #36cfc9);
  border: none;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.logout-button {
  background: linear-gradient(45deg, #ff4d4f, #ff7875);
  border: none;
}

.logout-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  color: #1a1a1a;
  position: relative;
  display: inline-block;
}

.page-title:after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #1890ff, #36cfc9);
  border-radius: 2px;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .page-title {
    font-size: 24px;
  }
}
</style>