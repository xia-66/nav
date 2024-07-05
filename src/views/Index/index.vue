<template>
  <Background></Background>
  <Search></Search>
  <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false">
    <el-menu-item index="2">
      <i class="iconfont icon-iconset0278"></i>
    </el-menu-item>
    <el-menu-item index="2">
      <i class="iconfont icon-iconset0278"></i>
      <template #title>Navigator Two</template>
    </el-menu-item> <el-menu-item index="2">
      <i class="iconfont icon-iconset0278"></i>
      <template #title>Navigator Two</template>
    </el-menu-item> <el-menu-item index="2">
      <i class="iconfont icon-iconset0278"></i>
      <template #title>Navigator Two</template>
    </el-menu-item>
    <el-menu-item index="0">
      <Clock />
    </el-menu-item>
    <div class="flex-grow" />
    <el-menu-item index="1">Processing Center</el-menu-item>
    <el-sub-menu index="2">
      <template #title>Workspace</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
  </el-menu>
  <Sidebar></Sidebar>

</template>

<script lang="ts" setup>
import { ref } from "vue";
import Clock from "../../components/clock/Clock.vue";
import Sidebar from "../../components/sidebar/Sidebar.vue";
import Background from "@/components/background/Background.vue";
import Search from "../../components/search/Search.vue";
// import { useMainStore } from "../../store";
// const store = useMainStore()
// console.log(store.$state.user);

</script>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
