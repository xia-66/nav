<template>
  <div class="search-container">
    <div class="search-input-wrapper">
      <el-input
        v-model="searchText"
        placeholder="搜索节点..."
        clearable
        @input="handleInputChange"
        @clear="clearSearch"
        @focus="handleFocus"
        @blur="handleBlur"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <div v-if="hasSearched && !loading && isActive" class="search-results-container">
        <el-empty v-if="searchResults.length === 0" description="未找到相关结果" />
        <div v-else class="search-results">
          <ul>
            <a
              v-for="item in searchResults"
              :key="item.id"
              class="relative site inherit-text"
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
              @click.prevent="handleItemClick(item.url)"
            >
              <el-card class="site-card" shadow="never">
                <div class="img-group">
                  <el-avatar :size="42" :src="`${Favicon}${item.url}`"></el-avatar>
                </div>
                <div class="text-group">
                  <div class="name text">{{ item.name }}</div>
                  <div class="name text describe">{{ item.description }}</div>
                </div>
              </el-card>
            </a>
          </ul>
        </div>
      </div>

      <div v-if="loading && isActive" class="loading search-results-container">
        <el-skeleton :rows="3" animated />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { Favicon } from '@/config'
import { allNavItems, type NavItem } from '@/utils/navData'
import { openUrl } from '@/utils'

const searchText = ref('')
const searchResults = ref<NavItem[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const hasSearched = ref(false)
const loading = ref(false)
const debounceTimeout = ref<number | null>(null)
const isActive = ref(false)

const handleFocus = () => {
  isActive.value = true
}

const handleBlur = (e: FocusEvent) => {
  const target = e.relatedTarget as HTMLElement | null

  if (!target || !document.querySelector('.search-container')?.contains(target)) {
    setTimeout(() => {
      isActive.value = false
    }, 200)
  }
}

const handleInputChange = () => {
  if (debounceTimeout.value !== null) {
    clearTimeout(debounceTimeout.value)
  }

  if (!searchText.value.trim()) {
    searchResults.value = []
    hasSearched.value = false
    return
  }

  isActive.value = true

  debounceTimeout.value = setTimeout(() => {
    performSearch()
  }, 300) as unknown as number
}

const clearSearch = () => {
  searchText.value = ''
  searchResults.value = []
  hasSearched.value = false
}

const performSearch = async () => {
  if (!searchText.value.trim()) {
    return
  }

  loading.value = true
  hasSearched.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 120))

    const keyword = searchText.value.toLowerCase()
    const filteredItems = allNavItems.filter(item => {
      return item.name.toLowerCase().includes(keyword) || item.description.toLowerCase().includes(keyword)
    })

    const startIndex = (pageNum.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    searchResults.value = filteredItems.slice(startIndex, endIndex)
  } catch (error) {
    console.error('搜索出错:', error)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

const handleItemClick = (url: string) => {
  setTimeout(() => {
    isActive.value = false
  }, 100)
  openUrl(url)
}
</script>

<style lang="scss" scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
  z-index: 99;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.loading {
  margin-top: 0;
}

.search-results-container {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  width: 100%;
  max-height: 70vh;
  overflow-y: auto;
  background-color: var(--glass-bg-strong);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  box-shadow: 0 18px 45px rgba(31, 41, 55, 0.14);
  padding: 16px;
  z-index: 9999;
  transition: all 0.3s ease;
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--el-border-color-lighter);
    border-radius: 3px;
  }
}

.search-results {
  width: 100%;

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: flex-start;

    .site {
      margin-top: 0;
      text-decoration: none;
      width: calc(33.333% - 11px);
      transition: transform 0.2s ease;

      @media screen and (max-width: 768px) {
        width: calc(50% - 8px);
      }

      @media screen and (max-width: 480px) {
        width: calc(50% - 8px);
      }

      &:hover {
        transform: translateY(-3px);

        .site-card {
          border-color: var(--el-color-primary-light-5);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }
      }

      .site-card {
        position: relative;
        width: 100%;
        height: 70px;
        padding: 0;
        display: flex;
        align-items: center;
        border-radius: 8px;
        color: var(--gray-800);
        transition: all 0.3s;
        border: 1px solid var(--glass-border);
        background-color: var(--glass-bg-soft);

        .img-group {
          position: absolute;
          left: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          overflow: hidden;
          z-index: 2;
        }

        .text-group {
          width: calc(100% - 60px);
          display: block;
          margin-left: 66px;
          padding-right: 10px;

          .name {
            font-weight: 500;
            font-size: 14px;
            line-height: 1.4;
          }

          .describe {
            color: var(--el-text-color-secondary);
            font-size: 12px;
            margin-top: 4px;
            line-height: 1.3;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
      }
    }
  }
}

.text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.el-input__wrapper) {
  height: 40px;
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  background-color: var(--glass-bg);
  box-shadow: 0 6px 18px rgba(31, 41, 55, 0.08) !important;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: rgba(99, 102, 241, 0.5);
    box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.35) inset, 0 8px 22px rgba(31, 41, 55, 0.1) !important;
  }
}

:deep(.el-input__inner) {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-900);
}

:deep(.el-input__inner::placeholder) {
  color: var(--gray-500);
}

@media screen and (max-width: 480px) {
  :deep(.el-input__inner) {
    font-size: 13px;
  }
}

:deep(.el-input__prefix) {
  padding-left: 8px;
  color: var(--gray-500);
}

:deep(.el-input__suffix) {
  padding-right: 8px;
  color: var(--gray-500);
}

:deep(.el-card__body) {
  padding: 12px;
  height: 100%;
  display: flex;
  align-items: center;
}

.el-empty {
  margin: 20px 0;
  padding: 20px;
  border-radius: 8px;
}
</style>
