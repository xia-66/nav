<template>
  <div class="home-wallpaper" :class="{ fullscreen: fullscreen }">
    <section class="bg" :style="wallpaperStyle"></section>
    <div class="bg-shadow" :style="shadowStyle"></div>
    <div class="bg-fiiter" :style="filterStyle"></div>
  </div>
</template>
<script setup>
import { judgeBgType } from '@/utils/index'
import { computed } from 'vue'
import { useMainStore } from "../../store";
const store = useMainStore();
const wallpaperStyle = computed(() => {
  let style = {};
  let config = store.$state.user.config;
  let tag = judgeBgType(config.bg);
  // 处理背景图片
  if (tag === 'img' || tag === 'module' || tag === 'base64') {
    style['backgroundImage'] = `url(${config.bg})`;
  } else if (tag === 'color') {
    style['backgroundColor'] = config.bg;
  }
  return style;
},
)
const shadowStyle = computed(() => {
  let style = {};
  let shadow = store.$state.user.config.bgLightness || 0;
  style['opacity'] = shadow;
  return style;
})
const filterStyle = computed(() => {
  let style = {};
  let shadow = store.$state.user.config.bgFilter || 0;
  style['backdropFilter'] = `blur(${shadow}px)`;
  return style;
})

</script>

<style lang="scss" scoped>
.home-wallpaper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-position: center center;
    background-size: cover;
  }
  .bg-shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--gray-1000);
  }
  .bg-fiiter {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
}
.fullscreen {
  width: 100% !important;
  height: 100% !important;
}
</style>
