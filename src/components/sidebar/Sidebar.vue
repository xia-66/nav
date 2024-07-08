<template>
  <div class="wrap-sidebar" v-if="isShowSidebar">
    <ul>
      <li v-if="isVisible" @click="scrollToTop" class="animate__animated animate__fadeIn shadow">
        <i class="iconfont icon-md-rocket" @click="goTop"></i>
      </li>
      <li class="shadow">
        <i class="iconfont icon-md-menu" @click="showDrawer"> </i>
      </li>
      <li class="shadow">
        <i class="iconfont icon-github" @click="goStorage"> </i>
      </li>
      <li class="shadow" @click="readHelp">
        <i class="iconfont icon-md-help-circle"></i>
      </li>
    </ul>
    <section v-if="showConnect" class="connect-panel animate__animated animate__fadeIn">
      <img :src="appConfig.site.serviceQRCodeUrl" />
    </section>
  </div>
</template>
<script setup>
const showConnect = ref(false)
import { useMainStore } from '@/store';
import { ref, onMounted, onUnmounted, watch } from 'vue';
const store = useMainStore()
// 定义是否显示按钮的变量
const isVisible = ref(false);
const isShowSidebar =ref(true)
const originalHeight = ref(0)
const showHeight = ref(0)
const showDrawer = () => {
  store.$state.isShowDrawer = true
}
// 滚动监听事件
const handleScroll = () => {
  if (window.scrollY  > 300) {
    isVisible.value = true;
  } else {
    isVisible.value = false;
  }
};
onMounted(() => {
  originalHeight.value =  document.documentElement.clientHeight
  window.onresize = () => {
console.log(originalHeight.value);
showHeight.value = document.body.clientHeight
 }
})
watch (showHeight.value , () => {
  
if(originalHeight.value > showHeight.value) {
  isShowSidebar.value = false
} else {
  isShowSidebar.value = true
}
})
// 回到顶部的函数
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

onMounted(() => {
  // 页面加载完成后，添加滚动监听
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  // 组件卸载时，移除滚动监听
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
.wrap-sidebar {
  position: fixed;
  right: 0;
  bottom: 50px;
  z-index: 1;
  ul {
    li {
      width: 40px;
      height: 40px;
      margin: 10px 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background-color: var(--gray-0);
      i {
        font-size: 24px;
        font-weight: bold;
      }
    }
  }
  .connect-panel {
    position: absolute;
    left: -110px;
    bottom: 18px;
    width: 120px;
    height: 120px;
    padding: 4px;
    background-color: var(--gray-400);
    box-sizing: border-box;
    &::after {
      content: "";
      position: absolute;
      top: calc(50% - 8px);
      right: -16px;
      border-width: 8px;
      border-color: transparent;
      border-left-color: var(--gray-400);
      border-style: solid;
    }
    img {
      width: 100%;
    }
  }
}
</style>
