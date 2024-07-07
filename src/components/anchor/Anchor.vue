<template>
  <div id="js-home-nav" class="home-nav" v-discolor>
    <header></header>
    <main id="js-home-nav__main" v-discolor>
      <ul id="js-home-nav__main-ul" v-balance v-discolor>
        <li class="record-item pointer text" v-for="category in store.$state.site" :key="category.index"
          @click="changeAnchorPosition(category.name)">
          {{ category.name }}
        </li>
      </ul>
    </main>
  </div>
</template>
<script setup>
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
.home-nav {
  width: 100%;
  // height: 100vh;
  margin-top: 300px;
  padding-bottom: 10px;
  box-sizing: border-box;
  background-color: #f9fafb;
  main {
    width: calc(100% - 20px);
    margin: 0 auto;
    padding: 10px 0;
    box-sizing: border-box;
    background-color: #ffffff;
    ul {
      width: calc(100% - 20px);
      margin: 0 auto;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      background-color: #f9fafb;
      .record-item {
        position: relative;
        width: 110px;
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }
    }
  }
}
</style>
