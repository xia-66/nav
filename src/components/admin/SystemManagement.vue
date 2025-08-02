<template>
  <div class="system-management">
    <div class="management-header">
      <h3>系统管理</h3>
      <p>管理网站标题、背景图片等系统设置</p>
    </div>

    <el-card shadow="hover" class="settings-card">
      <template #header>
        <div class="card-header">
          <span>基本设置</span>
          <el-button type="primary" @click="handleSave" :loading="saveLoading">
            <el-icon><Check /></el-icon>
            保存设置
          </el-button>
        </div>
      </template>

      <el-form :model="systemSettings" label-width="120px" class="settings-form">
        <el-form-item label="网站标题">
          <el-input
            v-model="systemSettings.site_title"
            placeholder="请输入网站标题"
            maxlength="50"
            show-word-limit
            class="setting-input"
          />
          <div class="setting-description">
            网站的主标题，将显示在浏览器标签页和页面头部
          </div>
        </el-form-item>

        <el-form-item label="背景图片">
          <div class="background-setting">
            <el-input
              v-model="systemSettings.background_image"
              placeholder="请输入背景图片URL"
              class="setting-input"
            />
            <div class="background-preview" v-if="systemSettings.background_image">
              <img 
                :src="systemSettings.background_image" 
                alt="背景预览"
                @error="handleImageError"
                class="preview-image"
              />
            </div>
            <div class="setting-description">
              网站背景图片的URL地址，支持jpg、png、webp等格式
            </div>
          </div>
        </el-form-item>

        <el-form-item label="预设背景">
          <div class="preset-backgrounds">
            <div 
              v-for="(bg, index) in presetBackgrounds" 
              :key="index"
              class="preset-item"
              :class="{ active: systemSettings.background_image === bg.url }"
              @click="selectPresetBackground(bg.url)"
            >
              <img :src="bg.thumbnail" :alt="bg.name" />
              <span>{{ bg.name }}</span>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 系统信息卡片 -->
    <el-card shadow="hover" class="info-card">
      <template #header>
        <span>系统信息</span>
      </template>
      
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">分类总数</span>
          <span class="info-value">{{ systemInfo.categoryCount }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">链接总数</span>
          <span class="info-value">{{ systemInfo.linkCount }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">最后更新</span>
          <span class="info-value">{{ formatDate(systemInfo.lastUpdate) }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'
import { GetSystemSettings, UpdateSystemSetting, GetCategoryData } from '../../apis/admin'
import { searchItemData } from '../../apis/index'

interface SystemSettings {
  site_title: string
  background_image: string
}

interface SystemInfo {
  categoryCount: number
  linkCount: number
  lastUpdate: string
}

const systemSettings = ref<SystemSettings>({
  site_title: '',
  background_image: ''
})

const systemInfo = ref<SystemInfo>({
  categoryCount: 0,
  linkCount: 0,
  lastUpdate: new Date().toISOString()
})

const saveLoading = ref(false)

// 预设背景图片
const presetBackgrounds = [
  {
    name: '默认',
    url: '',
    thumbnail: '/src/assets/img/wallpaper/1.jpeg'
  },
  {
    name: '风景1',
    url: '/src/assets/img/wallpaper/1.jpeg',
    thumbnail: '/src/assets/img/wallpaper/1.jpeg'
  },
  {
    name: '风景2',
    url: '/src/assets/img/wallpaper/2.jpeg',
    thumbnail: '/src/assets/img/wallpaper/2.jpeg'
  },
  {
    name: '风景3',
    url: '/src/assets/img/wallpaper/3.jpeg',
    thumbnail: '/src/assets/img/wallpaper/3.jpeg'
  },
  {
    name: '风景4',
    url: '/src/assets/img/wallpaper/4.jpeg',
    thumbnail: '/src/assets/img/wallpaper/4.jpeg'
  },
  {
    name: '风景5',
    url: '/src/assets/img/wallpaper/5.jpeg',
    thumbnail: '/src/assets/img/wallpaper/5.jpeg'
  },
  {
    name: '风景6',
    url: '/src/assets/img/wallpaper/6.jpeg',
    thumbnail: '/src/assets/img/wallpaper/6.jpeg'
  }
]

// 获取系统设置
const fetchSystemSettings = async () => {
  try {
    const response = await GetSystemSettings()
    if (response.data.statusCode === 200) {
      const settings = response.data.data
      settings.forEach((setting: any) => {
        if (setting.setting_key === 'site_title') {
          systemSettings.value.site_title = setting.setting_value || '黑鱼导航'
        } else if (setting.setting_key === 'background_image') {
          systemSettings.value.background_image = setting.setting_value || ''
        }
      })
    }
  } catch (error: any) {
    // 如果是404错误，使用默认值而不显示错误
    if (error.response?.status === 404) {
      console.log('系统设置接口不存在，使用默认值')
      systemSettings.value.site_title = '黑鱼导航'
      systemSettings.value.background_image = ''
    } else {
      console.error('获取系统设置失败:', error)
      ElMessage.error('获取系统设置失败: ' + (error.response?.data?.message || error.message))
    }
  }
}

// 获取系统信息
const fetchSystemInfo = async () => {
  try {
    // 获取分类总数
    const categoryResponse = await GetCategoryData({ name: '', pageNum: 1, pageSize: 1000 })
    if (categoryResponse.data.statusCode === 200) {
      systemInfo.value.categoryCount = categoryResponse.data.data.length
    }

    // 获取链接总数
    const itemResponse = await searchItemData({ name: '', pageNum: 1, pageSize: 1000 })
    if (itemResponse.data.statusCode === 200) {
      if (itemResponse.data.data.items) {
        systemInfo.value.linkCount = itemResponse.data.data.items.length
      } else {
        systemInfo.value.linkCount = itemResponse.data.data.length || 0
      }
    }

    systemInfo.value.lastUpdate = new Date().toISOString()
  } catch (error: any) {
    console.error('获取系统信息失败:', error)
  }
}

// 选择预设背景
const selectPresetBackground = (url: string) => {
  systemSettings.value.background_image = url
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  ElMessage.warning('背景图片加载失败，请检查URL是否正确')
}

// 保存设置
const handleSave = async () => {
  saveLoading.value = true
  try {
    // 保存网站标题
    await UpdateSystemSetting({
      setting_key: 'site_title',
      setting_value: systemSettings.value.site_title
    })

    // 保存背景图片
    await UpdateSystemSetting({
      setting_key: 'background_image',
      setting_value: systemSettings.value.background_image
    })

    ElMessage.success('系统设置保存成功！')
    
    // 刷新系统信息
    await fetchSystemInfo()
  } catch (error: any) {
    console.error('保存系统设置失败:', error)
    ElMessage.error('保存失败: ' + (error.response?.data?.message || error.message))
  } finally {
    saveLoading.value = false
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  fetchSystemSettings()
  fetchSystemInfo()
})
</script>

<style scoped>
.system-management {
  padding: 20px;
}

.management-header {
  margin-bottom: 24px;
}

.management-header h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #333;
}

.management-header p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.settings-card {
  margin-bottom: 24px;
  border-radius: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header span {
  font-weight: 600;
  font-size: 16px;
}

.settings-form {
  padding: 20px 0;
}

.setting-input {
  margin-bottom: 8px;
}

.setting-description {
  font-size: 12px;
  color: #999;
  line-height: 1.4;
}

.background-setting {
  width: 100%;
}

.background-preview {
  margin-top: 12px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ebeef5;
}

.preview-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.preset-backgrounds {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 8px;
}

.preset-item {
  border: 2px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.preset-item:hover {
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.preset-item.active {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.preset-item img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  display: block;
}

.preset-item span {
  display: block;
  padding: 8px;
  font-size: 12px;
  color: #666;
  background: #f9f9f9;
}

.preset-item.active span {
  background: #409eff;
  color: white;
}

.info-card {
  border-radius: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.info-label {
  font-weight: 500;
  color: #666;
}

.info-value {
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-card__body) {
  padding: 0 20px 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
}

@media (max-width: 768px) {
  .system-management {
    padding: 16px;
  }
  
  .preset-backgrounds {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
}
</style>

<script lang="ts">
export default {
  name: 'SystemManagement'
}
</script>