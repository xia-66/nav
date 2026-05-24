<template>
  <div class="head" :class="{ headsp: change }">
    <div class="brand">
      <img class="brand-logo" :src="logoUrl" alt="LaLa" />
      <span class="brand-name">LaLa</span>
    </div>
    <Search class="head-search"></Search>
    <button class="theme-toggle" type="button" :aria-label="themeLabel" :title="themeLabel" @click="toggleTheme">
      <el-icon>
        <Sunny v-if="themeMode === 'dark'" />
        <Moon v-else />
      </el-icon>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'
import Search from './Search.vue'
import logoUrl from '@/assets/img/logo/favicon.ico'

type ThemeMode = 'light' | 'dark'

const change = ref(false)
const scrollHeight = ref(0)
const themeMode = ref<ThemeMode>('light')
const themeLabel = ref('切换夜间主题')

const applyTheme = (mode: ThemeMode) => {
  themeMode.value = mode
  themeLabel.value = mode === 'dark' ? '切换白天主题' : '切换夜间主题'
  document.documentElement.setAttribute('theme-mode', mode)
  localStorage.setItem('theme-mode', mode)
}

const toggleTheme = () => {
  applyTheme(themeMode.value === 'dark' ? 'light' : 'dark')
}

const handleScroll = () => {
  scrollHeight.value = window.scrollY
  change.value = scrollHeight.value > 30
}

onMounted(() => {
  const currentTheme = document.documentElement.getAttribute('theme-mode') as ThemeMode | null
  applyTheme(currentTheme ?? 'light')
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.head {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  width: 100%;
  height: 75px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding-inline: max(5vw, calc((100vw - 1440px) / 2));
  background-color: transparent;
  color: var(--gray-800);
  z-index: 999;
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;

  .brand {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    min-width: 130px;
    margin-right: auto;
  }

  .brand-logo {
    width: 28px;
    height: 28px;
    object-fit: cover;
    border-radius: 8px;
  }

  .brand-name {
    margin-left: 10px;
    font-size: 20px;
    line-height: 1;
    font-weight: 700;
    letter-spacing: 0;
  }

  .head-search {
    flex: 0 1 520px;
    max-width: 520px;
    margin-left: 0;
    margin-right: 0;
  }

  .theme-toggle {
    flex: 0 0 auto;
    width: 48px;
    height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 14px;
    background: var(--glass-bg-strong);
    color: var(--gray-900);
    box-shadow: 0 6px 18px rgba(31, 41, 55, 0.08);
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;

    .el-icon {
      font-size: 22px;
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 24px rgba(31, 41, 55, 0.12);
    }
  }

  @media screen and (max-width: 768px) {
    gap: 12px;
    padding: 0 16px;

    .brand {
      min-width: auto;
      margin-right: 0;
    }

    .brand-name {
      font-size: 18px;
    }
  }

  @media screen and (max-width: 480px) {
    height: 64px;
    min-height: 64px;
    align-items: center;
    flex-direction: row;
    gap: 8px;
    padding: 0 8px;

    .brand {
      height: auto;
    }

    .brand-logo {
      width: 24px;
      height: 24px;
    }

    .brand-name {
      margin-left: 6px;
      font-size: 15px;
    }

    .head-search {
      min-width: 0;
      max-width: none;
      flex: 1;
    }

    .theme-toggle {
      position: static;
      width: 40px;
      height: 40px;
      border-radius: 12px;

      .el-icon {
        font-size: 20px;
      }
    }
  }
}

.headsp {
  background-color: var(--glass-bg);
  box-shadow: 0 10px 30px rgba(31, 41, 55, 0.08);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  backdrop-filter: blur(18px) saturate(140%);
  border-bottom: 1px solid var(--glass-border);
}
</style>
