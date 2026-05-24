<template>
  <div id="js-home-nav" class="home-nav">
    <header></header>
    <main id="js-home-nav__main">
      <ul id="js-home-nav__main-ul">
        <li v-for="category in navSections" :key="category.id" class="record-item pointer text" @click="changeAnchorPosition(category.anchorId)">
          <div class="record-name">{{ category.name }}</div>
        </li>
      </ul>
    </main>
  </div>
</template>

<script setup lang="ts">
import { navSections } from '@/utils/navData'

const changeAnchorPosition = (anchorId: string) => {
  const target = document.getElementById(anchorId)

  if (!target) return

  const targetTop = target.getBoundingClientRect().top + window.scrollY
  const finalScrollPosition = targetTop - 75

  window.scroll({
    top: finalScrollPosition,
    left: 0,
    behavior: 'smooth'
  })
}
</script>

<style lang="scss" scoped>
.home-nav {
  width: 100%;
  margin-top: 100px;
  padding-bottom: 10px;
  box-sizing: border-box;
  background-color: transparent;

  main {
    width: min(90vw, 1440px);
    margin: 0 auto;
    padding: 14px 0;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0.68);
    border: 1px solid rgba(255, 255, 255, 0.48);
    border-radius: 8px;
    box-shadow: 0 18px 48px rgba(31, 41, 55, 0.1);
    -webkit-backdrop-filter: blur(18px) saturate(135%);
    backdrop-filter: blur(18px) saturate(135%);

    @media screen and (max-width: 768px) {
      width: calc(100% - 20px);
    }

    ul {
      width: calc(100% - 20px);
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      align-items: center;
      gap: 12px;
      background-color: rgba(255, 255, 255, 0.34);
      border-radius: 6px;

      .record-item {
        position: relative;
        width: 100px;
        padding: 12px 10px;
        display: flex;
        text-align: center;
        align-items: center;
        box-sizing: border-box;
        border-radius: 6px;
        color: var(--gray-700);
        transition: background-color 0.2s ease, color 0.2s ease;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.5);
          color: var(--gray-900);
        }
      }

      .record-name {
        width: 100%;
        height: 100%;
        text-align: center;
      }

    }
  }
}
</style>
