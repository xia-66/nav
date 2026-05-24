<template>
  <footer class="footer px-5">
    <div class="footer-copy">
      <span>&copy; {{ copyrightYears }} All rights reserved. </span>
    </div>
    <div class="footer-powered">
      <span>Powered by &nbsp;</span>
      <a target="_blank" href="https://blog.heiyu.fun/">LaLa</a>
      <span> &nbsp; {{ RELEASE }}</span>
    </div>
  </footer>
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
  width: min(90vw, 1440px);
  margin: 18px auto 32px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  box-shadow: 0 18px 48px rgba(31, 41, 55, 0.1);
  -webkit-backdrop-filter: blur(18px) saturate(135%);
  backdrop-filter: blur(18px) saturate(135%);
  z-index: 99;
  padding: 24px 0 22px;

  @media screen and (max-width: 768px) {
    width: calc(100% - 20px);
    margin-bottom: 20px;
  }
}
.footer .footer-alink,
.footer .footer-copy,
.footer .footer-powered {
  text-align: center;
  margin-bottom: 8px;
}
.footer .footer-alink a {
  margin-right: 10px;
}
.footer .footer-powered {
  font-size: 12px;
}
</style>
