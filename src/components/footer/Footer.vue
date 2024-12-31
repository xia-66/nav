<template>
  <div class="footer px-5">
    <div class="footer-copy">
      <span>&copy; {{ copyrightYears }} All rights reserved. </span>
      <a target="_blank" href="https://beian.miit.gov.cn/">豫ICP备2023030596号</a>
    </div>
    <div class="footer-powered">
      <span>Powered by &nbsp;</span>
      <a target="_blank" href="https://blog.heiyu.fun/">黑羽</a>
      <span> &nbsp; {{ RELEASE }}</span>
    </div>
  </div>
</template>

<script setup>
import { RELEASE } from '@/config'
import { computed } from 'vue'

const START_YEAR = 2024
const currentYear = new Date().getFullYear()

const copyrightYears = computed(() => {
  return currentYear > START_YEAR ? `${START_YEAR}-${currentYear}` : START_YEAR
})
</script>

<style lang="scss" scoped>
.footer {
  position: relative;
  background: #fff;
  z-index: 99;
  padding-top: 50px;
  padding: 20px 0;
}
.footer .footer-alink,
.footer .footer-copy,
.footer .footer-powered {
  text-align: center;
  margin-bottom: 10px;
}
.footer .footer-alink a {
  margin-right: 10px;
}
.footer .footer-powered {
  font-size: 12px;
}
</style>
