<template>
  <el-button type="primary" style="margin-left: 16px" @click="getData" >
    open
  </el-button>

  <el-drawer v-model="drawer" title="I am the title" :with-header="false" direction="ttb" size="90%">
    <span>Hi there!</span>
  <img :src="imageSrc" alt="Buffer Image" style="width:200px;height:200px">
  </el-drawer>
</template>
<script setup>
import { ref } from 'vue';
import { GetProgramAvatar } from '@/apis';
const imageSrc= ref(null)
const drawer = ref(false)
const bufferToBlob = (buffer, mimeType) => {
  // 创建一个包含Buffer数据的Uint8Array
  const uint8Array = new Uint8Array(buffer);
  // 使用Blob构造函数创建Blob对象
  const blob = new Blob([uint8Array], { type: mimeType });
  return blob;
}
// 指定MIME类型
const mimeType = 'image/png';
const buffer = ref([])
const getData = () => {
  drawer.value = true
// 调用方法转换Buffer为Blob
 GetProgramAvatar().then(res => {
if(res.code === 200) {
  buffer.value = res.qrcode.data
  console.log(buffer.value);
  const blob = bufferToBlob(buffer.value, mimeType);
  // 现在你可以使用这个Blob对象了，例如用于FileSaver.js等
  console.log(blob);
  // 将Blob转换为URL
  imageSrc.value = URL.createObjectURL(blob);
}
})}


</script>