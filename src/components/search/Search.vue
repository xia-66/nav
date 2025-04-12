<template>
  <div class="search-container">
    <div class="search-input-wrapper">
      <el-input v-model="searchText" placeholder="请输入搜索内容" clearable @input="handleInputChange" @clear="clearSearch" @focus="handleFocus" @blur="handleBlur">
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <div class="search-results-container" v-if="hasSearched && !loading && isActive">
        <el-empty v-if="searchResults.length === 0" description="未找到相关结果" />
        <div class="search-results" v-else>
          <ul>
            <a class="relative site inherit-text" target="_blank" v-for="item in searchResults" :key="item.id" @click="handleItemClick(item.url)">
              <el-card class="site-card" shadow="never">
                <div class="img-group">
                  <el-avatar :size="42" :src="`${Favicon}${item.url}`">
                    <el-icon><Link /></el-icon>
                  </el-avatar>
                </div>
                <div class="text-group">
                  <div class="name text">{{ item.name }}</div>
                  <div class="name text describe">{{ item.description }}</div>
                </div>
              </el-card>
            </a>
            <i style="width: 200px" v-for="i in 6" :key="i"></i>
          </ul>
        </div>
      </div>
      <div v-if="loading && isActive" class="loading search-results-container">
        <el-skeleton :rows="3" animated />
      </div>
      <el-backtop :right="50" :bottom="50" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { searchItemData } from '@/apis/index'
import { Favicon } from '@/config'
import { openUrl } from '@/utils'
import { Link, Search } from '@element-plus/icons-vue'

// 定义搜索结果项的接口
interface SearchResultItem {
  id: number
  name: string
  description: string
  url: string
  category_id: number
  status: number
  createTime: string
  [key: string]: any
}

interface SearchResponse {
  data: {
    items: SearchResultItem[]
    total: number
  }
  message: string
  statusCode: number
  timestamp: string
}

const searchText = ref('')
const searchResults = ref<SearchResultItem[]>([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const hasSearched = ref(false)
const loading = ref(false)
const debounceTimeout = ref<number | null>(null)
const isActive = ref(false)

// 处理聚焦事件
const handleFocus = () => {
  isActive.value = true
}

// 处理失焦事件
const handleBlur = (e: FocusEvent) => {
  // 获取点击的元素
  const target = e.relatedTarget as HTMLElement

  // 只有当点击到搜索区域外才关闭结果
  if (!target || !document.querySelector('.search-container')?.contains(target)) {
    setTimeout(() => {
      isActive.value = false
    }, 200)
  }
}

// 处理输入变化的函数
const handleInputChange = () => {
  // 如果已有等待执行的搜索，则取消它
  if (debounceTimeout.value !== null) {
    clearTimeout(debounceTimeout.value)
  }

  // 如果搜索框为空，则清空结果
  if (!searchText.value.trim()) {
    searchResults.value = []
    hasSearched.value = false
    return
  }

  // 确保搜索结果显示
  isActive.value = true

  // 设置300ms的防抖延迟
  debounceTimeout.value = setTimeout(() => {
    performSearch()
  }, 300) as unknown as number
}

// 清空搜索
const clearSearch = () => {
  searchText.value = ''
  searchResults.value = []
  hasSearched.value = false
}

// 执行搜索的函数
const performSearch = async () => {
  if (!searchText.value.trim()) {
    return
  }

  loading.value = true
  hasSearched.value = true

  try {
    const params = {
      name: searchText.value,
      pageNum: pageNum.value,
      pageSize: pageSize.value
    }

    const res = (await searchItemData(params)) as SearchResponse

    if (res.statusCode == 200) {
      searchResults.value = res.data.items
      total.value = res.data.total
    } else {
      searchResults.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('搜索出错:', error)
    searchResults.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 处理点击项目
const handleItemClick = (url: string) => {
  // 保存最后一次点击
  setTimeout(() => {
    isActive.value = false
  }, 100)
  openUrl(url)
}
</script>

<style lang="scss" scoped>
.search-container {
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
  z-index: 99;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.loading {
  margin-top: 20px;
}

.search-results-container {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  max-height: 70vh;
  overflow-y: auto;
  background-color: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 16px;
  z-index: 9999;
  transition: all 0.3s ease;

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
        width: 100%;
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
        color: var(--el-text-color-primary);
        transition: all 0.3s;
        border: 1px solid var(--el-border-color-lighter);

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

    i {
      height: 0;
    }
  }
}

.text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.el-input__wrapper) {
  box-shadow: none !important;
  transition: all 0.3s ease;
  height: 46px;
  border-radius: 23px;
  border: 1px solid var(--el-border-color-lighter);

  &:focus-within {
    box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
    border-color: var(--el-color-primary);
  }
}

:deep(.el-input__inner) {
  height: 46px;
  line-height: 46px;
  font-size: 15px;
}

:deep(.el-input__prefix) {
  padding-left: 8px;
}

:deep(.el-input__suffix) {
  padding-right: 8px;
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
