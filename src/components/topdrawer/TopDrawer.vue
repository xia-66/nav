<template>
  <el-drawer
    v-model="drawer"
    title="I am the title"
    direction="ttb"
    close-on-click-modal
    lock-scroll
    modal
  >
    <span>Hi, there!</span>
  </el-drawer>

</template>

<script setup>
const drawer = ref(false)
</script>