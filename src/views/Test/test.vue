<template>
  <el-button type="primary" style="margin-left: 16px" @click="drawer = true">
    open
  </el-button>

  <el-drawer v-model="drawer" title="I am the title" :with-header="false">
    <span>Hi there!</span>
    <!-- <span>{{ isShow }}</span> -->
  </el-drawer>
</template>

<script lang="ts" setup>
// import axios from 'axios';
import { ref,onMounted } from 'vue'
// import { getIp } from '@/utils';
const drawer = ref(false)
// const isShow = ref()
// axios.get('http://myip.ipip.net').then(res => {
//     return res
//   })
// onMounted(() => {
//   const isShow.value = getIp()
 
  
// })
console.log(1111);

// const res =() => {
//   axios.get("http://myip.ipip.net").then((res) => {
//     console.log(res);  
//   })}
//   res()
</script>