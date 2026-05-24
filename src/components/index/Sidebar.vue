<template>
  <div class="wrap-sidebar">
    <ul>
      <li v-if="isVisible" class="animate__animated animate__fadeIn shadow" @click="scrollToTop">
        <i class="iconfont icon-md-rocket"></i>
      </li>
      <li class="shadow">
        <i class="iconfont icon-github" @click="goStorage"></i>
      </li>
      <li class="shadow">
        <i class="iconfont icon-md-help-circle" @click="readHelp"></i>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)

const handleScroll = () => {
  isVisible.value = window.scrollY > 300
}

const goStorage = () => {
  window.open('https://github.com/xia-66/nav', '_blank')
}

const readHelp = () => {
  window.open('https://github.com/xia-66/nav/issues', '_blank')
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.wrap-sidebar {
  position: fixed;
  right: 0;
  bottom: 50px;
  z-index: 999;

  ul {
    li {
      width: 40px;
      height: 40px;
      margin: 10px 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background-color: var(--gray-0);

      i {
        font-size: 24px;
        font-weight: bold;
      }
    }
  }
}
</style>
