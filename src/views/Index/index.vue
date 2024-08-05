<script setup lang="ts">
import Head from "@/components/head/Head.vue";
import Background from "@/components/background/Background.vue";
import Search from "@/components/search/Search.vue";
import Anchor from "@/components/anchor/Anchor.vue";
import Site from "@/components/site/Site.vue";
import Sidebar from "@/components/sidebar/Sidebar.vue";
import Footer from "@/components/footer/Footer.vue";
import axios from "axios";
import { PostIP } from "@/apis";
axios.get('http://myip.ipip.net').then(res => {
    if(res.status === 200) {
      console.log(res.data);
      PostIP(res.data)
    }
  })

</script>

<template>
  <div class="home">
    <!-- 背景 -->
    <Background></Background>
    <!-- 主要内容 -->
    <section class="content">
      <Head></Head>
      <main ref="homeContent" class="home-content">
        <Search></Search>
        <Anchor></Anchor>
        <Site></Site>
        <Sidebar></Sidebar>
        <Footer></Footer>
        <!-- 空内容展示 -->
      </main>
    </section>
  </div>

</template>
<style lang="scss" scoped>
.home {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .content {
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