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
    <ul class="my">
      <li style="overflow: hidden;">默认订阅</li>
      <li style="margin-left: 60px;overflow: hidden;">注册登录</li>
    </ul>
  </div>
  <LeftDrawer></LeftDrawer>
</template>
<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import Clock from '../clock/Clock.vue';
import LeftDrawer from '../leftdrawer/LeftDrawer.vue'
import { useMainStore } from '@/store';
const change = ref(false)
const store = useMainStore()
const scrollHeight = ref(0);

const showDrawer = () => {
  store.$state.isShowDrawer = true
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
}
.headsp {
  background-color: #fff;
  color: #000;
}
</style>