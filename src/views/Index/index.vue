<script setup lang="ts">
import Head from "../../components/head/Head.vue";
// import Background from "../../components/background/Background.vue";
import Search from "../../components/search/Search.vue";
import Anchor from "../../components/anchor/Anchor.vue";
import Site from "../../components/site/Site.vue";
import Sidebar from "../../components/sidebar/Sidebar.vue";
import Footer from "../../components/footer/Footer.vue"
</script>

<template>
  <div class="bgi">

    <Head></Head>
    <Search></Search>
    <!-- <Anchor></Anchor> -->
    <Site></Site>
    <Sidebar></Sidebar>
    <Footer></Footer>
  </div>

</template>
<style lang="scss" scoped>
.bgi {
  height: 100vh;
  background-image: url(/src/assets/img/wallpaper/3.jpeg);
  background-size: cover;
  background-position: center;
}
</style>