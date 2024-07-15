<template>
  <el-drawer v-model="store.$state.isShowDrawer" :with-header="false" direction="ltr" modal close-on-click-modal
     class="xl:w-px-600 lg:w-px-400 sm:w-px-360 h-px-40">
    <h2 style="text-align: center;font-size: 20px;margin-top: 20px;">黑羽导航</h2>
    <div style="height: 40px;"></div>
    <div v-for="category in store.$state.site" :key="category.index" @click="changeAnchorPosition(category.name)"
      class="text item">{{ category.name }}</div>
  </el-drawer>
</template>

<script setup>
import {  ref } from 'vue';
import { useMainStore } from '@/store';

const store = useMainStore()
const changeAnchorPosition = (name) => {
  let target = document.getElementById(`site-anchor-${name}`);
  // console.log(name);
  // 没有找到节点，退出执行
  if (!target) return;
  target.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}
</script>
<style lang="scss" scoped>
.text {
  font-size: 14px;
  text-align: center;
}
.el-drawer__header {
  margin: 0 auto;
}
.item {
  padding: 18px 0;
}
</style>