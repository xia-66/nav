<template>
  <el-drawer v-model="store.$state.isShowDrawer" title="侧边导航" direction="ltr" modal close-on-click-modal
     size="20%">
    <ul>
      <li v-for="category in store.$state.site" :key="category.index" @click="changeAnchorPosition(category.name)">
        {{ category.name }}</li>
    </ul>
  </el-drawer>
</template>

<script setup>
import { useMainStore } from '../../store';

const store = useMainStore()
const changeAnchorPosition = (name) => {
  let target = document.getElementById(`site-anchor-${name}`);
  console.log(name);
  // 没有找到节点，退出执行
  if (!target) return;
  target.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}
</script>
<style lang="scss" scoped>
:v-deep(.el-drawer__title ){
  width: 100%;
  text-align: center !important;
}
</style>