<template>
  <el-drawer v-model="store.$state.isShowDrawer" :with-header="false" direction="ltr" modal close-on-click-modal
     class="xl:w-px-600 lg:w-px-400 sm:w-px-360 h-px-40">
    <h2 style="text-align: center;font-size: 20px;margin-top: 20px;">{{ SITE_NAME }}</h2>
    <div style="height: 40px;"></div>
    <div v-for="category in store.$state.site" :key="category.index" @click="changeAnchorPosition(category.name)"
      class="text item">{{ category.name }}</div>
  </el-drawer>
</template>

<script setup>
import {  ref } from 'vue';
import { useMainStore } from '@/store';
import { SITE_NAME } from '@/config';

const store = useMainStore()
const changeAnchorPosition = (name) => {
  let target = document.getElementById(`site-anchor-${name}`);
  // console.log(name);
  // 没有找到节点，退出执行
  // 计算目标元素距离视口顶部的距离
  let targetTop = target.getBoundingClientRect().top + window.scrollY;

  // 设置额外的滚动偏移量
  let additionalOffset = 75;

  // 计算最终的滚动位置
  let finalScrollPosition = targetTop - additionalOffset;

  // 滚动到最终位置
  window.scroll({
    top: finalScrollPosition,
    left: 0,
    behavior: 'smooth'
  });
}
</script>
<style lang="scss" scoped>
.text {
  font-size: 14px;
  text-align: center;
  cursor: pointer;
}
.el-drawer__header {
  margin: 0 auto;
}
.item {
  padding: 18px 0;
}
</style>