<template>
  <div id="js-home-nav" class="home-nav">
    <header></header>
    <main id="js-home-nav__main">
      <ul id="js-home-nav__main-ul">
        <li class="record-item pointer text" v-for="category in store.$state.site" :key="category.id" @click="changeAnchorPosition(category.name)">
          <div style="width: 100%; height: 100%; text-align: center">{{ category.name }}</div>
        </li>
        <i style="width: 100px" v-for="i in 6" :key="i.index"></i>
      </ul>
    </main>
  </div>
</template>
<script setup>
import { useMainStore } from '@/store'
import { ref } from 'vue'
import { GetCategories } from '@/apis/index/index'
const store = useMainStore()
const changeAnchorPosition = name => {
  let target = document.getElementById(`site-anchor-${name}`)
  // console.log(name);
  // 没有找到节点，退出执行
  if (!target) return
  // 计算目标元素距离视口顶部的距离
  let targetTop = target.getBoundingClientRect().top + window.scrollY

  // 设置额外的滚动偏移量
  let additionalOffset = 75

  // 计算最终的滚动位置
  let finalScrollPosition = targetTop - additionalOffset

  // 滚动到最终位置
  window.scroll({
    top: finalScrollPosition,
    left: 0,
    behavior: 'smooth'
  })
  // target.scrollIntoView({
  //   behavior: 'smooth',
  //   block: 'start',
  // });
}
</script>

<style lang="scss" scoped>
.home-nav {
  width: 100%;
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
      justify-content: space-between;

      flex-wrap: wrap;
      background-color: #f9fafb;
      .record-item {
        position: relative;
        width: 100px;
        padding: 10px;
        display: flex;
        text-align: center;

        // justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
      }
    }
  }
}
</style>
