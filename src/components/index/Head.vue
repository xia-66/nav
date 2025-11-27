<template>
  <div class="head" :class="{headsp:change}">
    <div @click="showDrawer">
      <i class="iconfont icon-md-menu" style="margin-right: 5px;"></i>
      <span style="margin-right: 40px;"></span>
    </div>
    <ul class="menu">
      <li v-for="item in store.$state.menu" :key="item.index">
        <div style="margin-right: 30px;overflow: hidden;height: 75px;"><i :class="item.iconClass" style="margin-right: 5px;"></i>{{ item.name }}</div>
      </li>
    </ul>
    <Clock></Clock>
    <div class="flex-grow" />
    <div class="admin-menu-item" @click="goToAdmin">
      <i class="iconfont icon-md-lock"></i>
      <span class="admin-text">后台登录</span>
    </div>
  </div>
  <LeftDrawer></LeftDrawer>
  <LoginDialog v-model="showLoginDialog" />
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Clock from './Clock.vue';
import LeftDrawer from './LeftDrawer.vue';
import LoginDialog from '@/components/admin/LoginDialog.vue';
import { useMainStore } from '@/store';
import { useAdminStore } from '@/store/admin';

const change = ref(false)
const store = useMainStore()
const router = useRouter()
const adminStore = useAdminStore()
const scrollHeight = ref(0);
const showLoginDialog = ref(false);

const showDrawer = () => {
  store.$state.isShowDrawer = true
}

const goToAdmin = () => {
  // 如果已登录，跳转到管理后台，否则弹出登录对话框
  if (adminStore.isAuthenticated) {
    router.push('/admin/dashboard')
  } else {
    showLoginDialog.value = true
  }
}
const handleScroll = () => {
  // 直接使用 window.scrollY 获取当前滚动高度
  scrollHeight.value = window.scrollY;

  // console.log(scrollHeight.value);
  if (scrollHeight.value > 30) {
    change.value = true;
  } else {
    change.value = false;
  }// 打印当前滚动高度
};

onMounted(() => {
  // 监听整个窗口的滚动事件
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

</script>
<style lang="scss" scoped>
.head {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  display: flex;
  height: 75px;
  line-height: 75px;
  padding: 0 40px;
  background-color: transparent;
  z-index: 999;
  color: #fff;
  .menu {
    display: flex;
  }

  .my {
    display: flex;
  }
  @media screen and (max-width: 414px) {
    .menu {
      display: none;
    }
    .my {
      display: none;
    }
  }
  .flex-grow {
    flex-grow: 1;
  }

  .admin-menu-item {
    margin-right: 30px;
    overflow: hidden;
    height: 75px;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 16px;
    border-radius: 8px;
    transition: all 0.3s ease;
    white-space: nowrap;
    
    .iconfont {
      font-size: 18px;
      transition: transform 0.3s ease;
    }
    
    .admin-text {
      margin-left: 5px;
      font-size: 14px;
      font-weight: 500;
      transition: opacity 0.3s ease;
    }
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      
      .iconfont {
        transform: scale(1.1);
      }
    }
  }
  
  // 移动端优化
  @media screen and (max-width: 768px) {
    padding: 0 20px;
    
    .admin-menu-item {
      margin-right: 0;
      padding: 0 12px;
      
      .admin-text {
        font-size: 13px;
      }
    }
  }
  
  @media screen and (max-width: 480px) {
    padding: 0 12px;
    
    .admin-menu-item {
      padding: 0 8px;
      margin-right: 0;
      
      .iconfont {
        font-size: 20px;
      }
      
      .admin-text {
        display: none; // 小屏幕只显示图标
      }
    }
  }
  
  @media screen and (max-width: 375px) {
    padding: 0 8px;
  }
}
.headsp {
  background-color: #fff;
  color: #000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  
  .admin-menu-item {
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
}
</style>