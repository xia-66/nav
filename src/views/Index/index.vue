<script setup lang="ts">
import Head from '@/components/index/Head.vue'
import Anchor from '@/components/index/Anchor.vue'
import Site from '@/components/index/Site.vue'
import Sidebar from '@/components/index/Sidebar.vue'
import Footer from '@/components/index/Footer.vue'
</script>

<template>
  <div class="home">
    <section class="content">
      <Head></Head>
      <main ref="homeContent" class="home-content">
        <Anchor></Anchor>
        <Site></Site>
        <Sidebar></Sidebar>
        <Footer></Footer>
      </main>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.home {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow: hidden;
  isolation: isolate;
  background-color: var(--gray-50);
  
  &::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: -1;
    background-image: url('@/assets/img/wallpaper/2.jpeg');
    background-repeat: no-repeat;
    background-position: center top;
    background-size: cover;
  }

  @media screen and (max-width: 768px) {
    &::before {
      background-image: url('@/assets/img/wallpaper/khadmv.webp');
      background-position: center center;
    }
  }

  .content {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;

    .home-content {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      overflow-y: auto;
      background: transparent;

      .empty-panel {
        width: 100%;
        height: 100%;
        padding: 10px;
        background-color: #111827;
        box-sizing: border-box;
      }
    }
  }
}
</style>
