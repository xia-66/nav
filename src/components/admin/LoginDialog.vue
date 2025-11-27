<template>
  <el-dialog
    v-model="visible"
    width="420px"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    :show-close="false"
    center
    class="login-dialog mobile-login-dialog"
  >
    <!-- <template #header>
      <div class="dialog-header">
        <div class="icon-wrapper">
          <svg viewBox="0 0 1024 1024" width="32" height="32">
            <path fill="currentColor" d="M512 12.64c-282.752 0-512 229.216-512 512 0 226.208 146.688 418.144 350.08 485.824 25.6 4.736 35.008-11.104 35.008-24.64 0-12.192-0.48-52.544-0.704-95.328-142.464 30.976-172.512-60.416-172.512-60.416-23.296-59.168-56.832-74.912-56.832-74.912-46.464-31.776 3.52-31.136 3.52-31.136 51.392 3.616 78.464 52.768 78.464 52.768 45.664 78.272 119.776 55.648 148.992 42.56 4.576-33.088 17.856-55.68 32.512-68.48-113.728-12.928-233.28-56.864-233.28-253.024 0-55.904 20-101.568 52.768-137.44-5.312-12.896-22.848-64.96 4.96-135.488 0 0 43.008-13.76 140.832 52.48 40.832-11.36 84.64-17.024 128.16-17.248 43.488 0.192 87.328 5.888 128.256 17.248 97.728-66.24 140.64-52.48 140.64-52.48 27.872 70.528 10.336 122.592 5.024 135.488 32.832 35.84 52.704 81.536 52.704 137.44 0 196.64-119.776 239.936-233.792 252.64 18.368 15.904 34.72 47.04 34.72 94.816 0 68.512-0.608 123.648-0.608 140.512 0 13.632 9.216 29.6 35.168 24.576 203.328-67.776 349.856-259.616 349.856-485.76 0-282.784-229.248-512-512-512z"/>
          </svg>
        </div>
        <h2>后台管理系统</h2>
        <p>使用 GitHub 账号安全登录</p>
      </div>
    </template> -->
    
    <div class="login-content">
      <div class="feature-list">
        <div class="feature-item" v-for="(feature, index) in features" :key="index">
          <el-icon color="#67C23A"><Check /></el-icon>
          <span>{{ feature }}</span>
        </div>
      </div>
      
      <el-button 
        type="primary" 
        size="large" 
        @click="handleLogin"
        class="login-btn"
      >
        <svg viewBox="0 0 1024 1024" width="18" height="18">
          <path fill="currentColor" d="M512 12.64c-282.752 0-512 229.216-512 512 0 226.208 146.688 418.144 350.08 485.824 25.6 4.736 35.008-11.104 35.008-24.64 0-12.192-0.48-52.544-0.704-95.328-142.464 30.976-172.512-60.416-172.512-60.416-23.296-59.168-56.832-74.912-56.832-74.912-46.464-31.776 3.52-31.136 3.52-31.136 51.392 3.616 78.464 52.768 78.464 52.768 45.664 78.272 119.776 55.648 148.992 42.56 4.576-33.088 17.856-55.68 32.512-68.48-113.728-12.928-233.28-56.864-233.28-253.024 0-55.904 20-101.568 52.768-137.44-5.312-12.896-22.848-64.96 4.96-135.488 0 0 43.008-13.76 140.832 52.48 40.832-11.36 84.64-17.024 128.16-17.248 43.488 0.192 87.328 5.888 128.256 17.248 97.728-66.24 140.64-52.48 140.64-52.48 27.872 70.528 10.336 122.592 5.024 135.488 32.832 35.84 52.704 81.536 52.704 137.44 0 196.64-119.776 239.936-233.792 252.64 18.368 15.904 34.72 47.04 34.72 94.816 0 68.512-0.608 123.648-0.608 140.512 0 13.632 9.216 29.6 35.168 24.576 203.328-67.776 349.856-259.616 349.856-485.76 0-282.784-229.248-512-512-512z"/>
        </svg>
        使用 GitHub 登录
      </el-button>
      
      <p class="notice">
        <el-icon><InfoFilled /></el-icon>
        登录即表示同意授权访问您的 GitHub 账号
      </p>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAdminStore } from '@/store/admin';
import { Check, InfoFilled } from '@element-plus/icons-vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const adminStore = useAdminStore();

const features = [
  '安全可靠的 OAuth 认证',
  '实时同步到 GitHub 仓库',
  '完整的权限管理'
];

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const handleLogin = () => {
  adminStore.loginWithGitHub();
  emit('update:modelValue', false);
};
</script>

<style scoped lang="scss">
.login-dialog {
  :deep(.el-dialog) {
    border-radius: 12px;
    overflow: hidden;
    
    @media screen and (max-width: 480px) {
      border-radius: 10px;
    }
  }

  :deep(.el-dialog__header) {
    padding: 0;
    margin: 0;
  }

  :deep(.el-dialog__body) {
    padding: 0 40px 40px;
    
    @media screen and (max-width: 768px) {
      padding: 0 30px 30px;
    }
  }

  :deep(.el-dialog__headerbtn) {
    top: 16px;
    right: 16px;
    
    .el-dialog__close {
      color: rgba(255, 255, 255, 0.9);
    }
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
      border-radius: 50%;
    }
  }
}

// 移动端适配
.mobile-login-dialog {
  :deep(.el-dialog) {
    @media screen and (max-width: 768px) {
      width: 65% !important;
      max-width: 320px;
      margin: 5vh auto;
    }

    @media screen and (max-width: 480px) {
      width: 70% !important;
      max-width: 280px;
      margin: 10vh auto;
      
      .el-dialog__body {
        padding: 0 20px 20px;
      }
    }
    
    @media screen and (max-width: 375px) {
      width: 75% !important;
      max-width: 260px;
      
      .el-dialog__body {
        padding: 0 16px 16px;
      }
    }
  }
}

.dialog-header {
  text-align: center;
  padding: 40px 40px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  .icon-wrapper {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    svg {
      color: #333;
    }
  }

  h2 {
    font-size: 22px;
    font-weight: 600;
    margin: 0 0 8px;
  }

  p {
    font-size: 14px;
    margin: 0;
    opacity: 0.9;
  }
}

.login-content {
  padding-top: 30px;

  .feature-list {
    margin-bottom: 25px;

    .feature-item {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 10px 0;
      font-size: 14px;
      color: #606266;

      .el-icon {
        font-size: 18px;
        flex-shrink: 0;
      }
    }
  }

  .login-btn {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 8px;
    touch-action: manipulation; // 优化移动端点击
    -webkit-tap-highlight-color: transparent; // 移除移动端点击高亮
    
    svg {
      flex-shrink: 0;
    }
  }

  .notice {
    margin-top: 20px;
    padding: 12px;
    font-size: 12px;
    color: #909399;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: #f5f7fa;
    border-radius: 6px;
  }

  // 移动端适配
  @media screen and (max-width: 768px) {
    padding-top: 24px;
    
    .feature-list {
      margin-bottom: 20px;
      
      .feature-item {
        font-size: 13px;
        padding: 8px 0;
        gap: 8px;
      }
    }
    
    .login-btn {
      height: 46px;
      font-size: 15px;
      
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
  
  @media screen and (max-width: 480px) {
    padding-top: 16px;
    
    .feature-list {
      margin-bottom: 16px;
      
      .feature-item {
        font-size: 12px;
        padding: 6px 0;
        gap: 6px;
        
        .el-icon {
          font-size: 16px;
        }
      }
    }
    
    .login-btn {
      height: 44px;
      font-size: 14px;
      gap: 6px;
      
      svg {
        width: 15px;
        height: 15px;
      }
    }
    
    .notice {
      margin-top: 14px;
      padding: 8px;
      font-size: 11px;
      gap: 4px;
      
      .el-icon {
        font-size: 14px;
      }
    }
  }
  
  @media screen and (max-width: 375px) {
    padding-top: 12px;
    
    .feature-list {
      margin-bottom: 12px;
      
      .feature-item {
        font-size: 11px;
        padding: 5px 0;
      }
    }
    
    .login-btn {
      height: 42px;
      font-size: 13px;
    }
    
    .notice {
      margin-top: 12px;
      padding: 6px;
      font-size: 10px;
    }
  }
  
  // 横屏模式优化
  @media screen and (max-height: 600px) and (orientation: landscape) {
    padding-top: 10px;
    
    .feature-list {
      margin-bottom: 12px;
      
      .feature-item {
        padding: 4px 0;
      }
    }
    
    .login-btn {
      height: 40px;
    }
    
    .notice {
      margin-top: 10px;
      padding: 6px;
    }
  }
}
</style>

