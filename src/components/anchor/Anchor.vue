<template>
  <div class="anchor">
    <!-- <el-anchor :offset="70" direction="horizontal">
      <el-anchor-link :href="`#${locale['basic-usage']}`">
        {{ locale['Basic Usage'] }}
      </el-anchor-link>
      <el-anchor-link :href="`#${locale['horizontal-mode']}`">
        {{ locale['Horizontal Mode'] }}
      </el-anchor-link>
      <el-anchor-link :href="`#${locale['scroll-container']}`">
        {{ locale['Scroll Container'] }}
      </el-anchor-link>
    </el-anchor> -->
  </div>
</template>
<script setup>
import { computed } from 'vue'
// import anchorLocale from '../../.vitepress/i18n/component/anchor.json'
// import { useLang } from '~/composables/lang'

// const lang = useLang()
// const locale = computed(() => anchorLocale[lang.value])
</script>
<style lang="scss" scoped>
.anchor {
  background-color: red;
  margin-top: 500px;
}
</style>