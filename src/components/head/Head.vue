<template>
  <div class="head">
    <ul class="menu">
      <li @click="showDrawer">
        <i class="iconfont icon-md-menu" style="margin-right: 5px;"></i>
        <span style="margin-right: 80px;"></span>
      </li>
      <li v-for="item in store.$state.menu" :key="item.index">
        <i :class="item.iconClass" style="margin-right: 5px;"></i>
        <span style="margin-right: 60px;">{{ item.name }}</span>
      </li>
    </ul>
    <Clock></Clock>
    <div class="flex-grow" />
    <ul class="my">
      <li>默认订阅</li>
      <li style="margin-left: 80px">注册登录</li>
    </ul>
  </div>
  <LeftDrawer></LeftDrawer>
</template>
<script setup>
import { ref } from 'vue';
import Clock from '../clock/Clock.vue';
import LeftDrawer from '../leftdrawer/LeftDrawer.vue'
import { useMainStore } from '../../store';
const store = useMainStore()
const showDrawer = () => {
  store.$state.isShowDrawer = true
}

</script>
<style lang="scss" scoped>
.head {
  //  position: absolute;
  //  top: 0;
  //  left: 0;
  display: flex;
  height: 75px;
  line-height: 75px;
  padding: 0 40px;
  background-color: transparent;
  color: #fff;
  // z-index:999;
  .menu {
    display: flex;
  }
  .my {
    display: flex;
  }
  .flex-grow {
    flex-grow: 1;
  }
}
</style>