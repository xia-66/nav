<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import Head from '@/components/index/Head.vue'
import Background from '@/components/index/Background.vue'
import Search from '@/components/index/Search.vue'
import Anchor from '@/components/index/Anchor.vue'
import Site from '@/components/index/Site.vue'
import Sidebar from '@/components/index/Sidebar.vue'
import Footer from '@/components/index/Footer.vue'

const route = useRoute();

onMounted(() => {
  // 检查是否有错误信息（来自 OAuth 回调）
  const error = route.query.error as string;
  if (error) {
    ElMessage.error(decodeURIComponent(error));
    // 清除 URL 中的错误参数
    const newQuery = { ...route.query };
    delete newQuery.error;
    window.history.replaceState({}, '', window.location.pathname + window.location.hash.split('?')[0]);
  }
});
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
