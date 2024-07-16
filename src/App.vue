<template>
  <router-view />
</template>
<style>
::-webkit-scrollbar {
  width: 0;
}
</style>
<script setup>
  // 禁止web端屏幕缩放
    window.addEventListener("mousewheel",function (event) {
      if (event.ctrlKey === true || event.metaKey) {event.preventDefault();}},{ passive: false })


</script>