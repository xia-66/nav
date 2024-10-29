<template>
  <el-button type="primary" style="margin-left: 16px" @click="getData"> open </el-button>

  <el-drawer v-model="drawer" title="I am the title" :with-header="false" direction="ttb" size="90%">
    <span>Hi there!</span>
    <img :src="imageSrc" alt="Buffer Image" style="width: 200px; height: 200px" />
    <p v-if="loginStatus === 202">请使用微信扫描二维码...</p>
    <p v-if="loginStatus === 203">已扫码，请在手机上确认登录...</p>
    <p v-if="loginStatus === 200">登录成功！</p>
  </el-drawer>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { checkScanStatus, GetProgramAvatar } from '@/apis'
const imageSrc = ref(null)
const drawer = ref(false)
const scene = ref(null)
const loginStatus = ref(null)
const bufferToBlob = (buffer, mimeType) => {
  // 创建一个包含Buffer数据的Uint8Array
  const uint8Array = new Uint8Array(buffer)
  // 使用Blob构造函数创建Blob对象
  const blob = new Blob([uint8Array], { type: mimeType })
  return blob
}
// 指定MIME类型
const mimeType = 'image/png'
const buffer = ref([])
const getData = () => {
  drawer.value = true
  // 调用方法转换Buffer为Blob
  GetProgramAvatar().then(res => {
    if (res.code === 200) {
      buffer.value = res.qrcode.data
      scene.value = res.scene
      console.log(scene.value)
      const blob = bufferToBlob(buffer.value, mimeType)
      // 现在你可以使用这个Blob对象了，例如用于FileSaver.js等
      // console.log(blob)
      // 将Blob转换为URL
      imageSrc.value = URL.createObjectURL(blob)
    }
  })
}
// 轮询检查扫码状态
const pollScanStatus = () => {
  checkScanStatus(scene.value).then(res => {
    console.log(res)
    loginStatus.value = res.code
  })
}
// 在组件挂载后开始轮询
onMounted(() => {
  const intervalId = setInterval(pollScanStatus, 2000) // 每2秒执行一次
})
// 组件卸载时清除定时器
onUnmounted(() => {
  clearInterval(intervalId)
})
</script>
