<template>
  <div class="clipboard-container">
    <div class="clipboard-card">
      <h2 class="title">在线剪贴板</h2>
      
      <div class="content-area">
        <el-input
          v-model="content"
          type="textarea"
          :rows="10"
          placeholder="在此处粘贴内容..."
          resize="none"
        />
      </div>

      <div class="button-group">
        <el-button 
          class="action-button" 
          @click="saveToCloud"
        >
          <el-icon><Upload /></el-icon>
          <span>保存到云端</span>
        </el-button>

        <el-button 
          class="action-button"
          @click="loadFromCloud"
        >
          <el-icon><Download /></el-icon>
          <span>从云端读取</span>
        </el-button>

        <el-button 
          class="action-button"
          @click="copyToLocal"
        >
          <el-icon><CopyDocument /></el-icon>
          <span>复制到本地</span>
        </el-button>

        <el-button 
          class="action-button"
          @click="shareContent"
        >
          <el-icon><Share /></el-icon>
          <span>分享</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload, Download, CopyDocument, Share } from '@element-plus/icons-vue'
import axios from 'axios'

const content = ref('')

// 保存到云端
const saveToCloud = async () => {
  try {
    await axios.post('/api/clip', {
      id: generateId(),
      content: content.value
    })
    ElMessage.success('内容已保存到云端')
  } catch (error) {
    ElMessage.error('保存失败：' + error.message)
  }
}

// 从云端读取
const loadFromCloud = async () => {
  // 这里可以添加一个弹窗让用户输入ID
  const id = await promptForId()
  if (!id) return
  
  try {
    const response = await axios.get(`/api/clip/${id}`)
    content.value = response.data.content
    ElMessage.success('内容已加载')
  } catch (error) {
    ElMessage.error('加载失败：' + error.message)
  }
}

// 复制到本地剪贴板
const copyToLocal = async () => {
  try {
    await navigator.clipboard.writeText(content.value)
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败：' + error.message)
  }
}

// 分享功能
const shareContent = async () => {
  // 实现分享逻辑
  ElMessage.info('分享功能开发中...')
}

// 生成随机ID
const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

// 提示用户输入ID
const promptForId = () => {
  return new Promise((resolve) => {
    // 这里可以用 Element Plus 的 Dialog 组件实现
    const id = prompt('请输入剪贴板ID：')
    resolve(id)
  })
}
</script>

<style scoped>
.clipboard-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  padding: 20px;
}

.clipboard-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.title {
  color: #409EFF;
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
}

.content-area {
  margin-bottom: 30px;
}

.content-area :deep(.el-textarea__inner) {
  border-radius: 8px;
  border: 2px solid #e8eaec;
  padding: 15px;
}

.button-group {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.action-button {
  height: 80px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background-color: #409EFF;
  color: white;
  border: none;
  padding: 15px;
}

.action-button:hover {
  background-color: #66b1ff;
}

.action-button .el-icon {
  font-size: 24px;
}

.action-button span {
  font-size: 14px;
  white-space: nowrap;
}
</style>