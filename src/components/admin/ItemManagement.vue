<template>
  <div class="item-management">
    <div class="toolbar">
      <el-space>
        <el-input 
          v-model="itemSearch" 
          placeholder="按名称搜索" 
          @input="handleItemSearch" 
          clearable 
          style="width: 240px" 
          :prefix-icon="Search" 
          class="search-input"
        />
        <el-select 
          v-model="categoryFilter" 
          placeholder="按分类筛选" 
          clearable 
          @change="handleItemSearch" 
          class="category-filter search-input"
        >
          <el-option label="全部分类" value="" />
          <el-option 
            v-for="category in categories" 
            :key="category.id" 
            :label="category.name" 
            :value="category.id" 
          />
        </el-select>
        <el-button 
          type="primary" 
          @click="showAddItemDialog = true" 
          :icon="Plus" 
          class="action-button"
        >
          添加链接
        </el-button>
      </el-space>
      
      <el-space>
        <el-button 
          type="success" 
          @click="handleExportItems" 
          :icon="Download" 
          :loading="exportLoading"
          class="export-button"
        >
          导出链接
        </el-button>
        <el-button 
          type="warning" 
          @click="handleImportItems" 
          :icon="Upload" 
          class="import-button"
        >
          导入链接
        </el-button>
        <el-button 
          type="info" 
          @click="downloadTemplate" 
          :icon="Document" 
          class="template-button"
        >
          下载导入模板
        </el-button>
      </el-space>
    </div>

    <el-table 
      :data="items" 
      style="width: 100%" 
      border 
      stripe 
      header-cell-class-name="table-header" 
      class="custom-table"
    >
      <el-table-column prop="name" label="名称" width="180" align="center" />
      <el-table-column label="所属分类" width="180" align="center">
        <template #default="scope">
          {{ getCategoryName(scope.row.category_id) }}
        </template>
      </el-table-column>
      <el-table-column label="URL" show-overflow-tooltip align="center">
        <template #default="scope">
          <el-popconfirm 
            :title="'复制链接: ' + scope.row.url" 
            confirm-button-text="复制" 
            cancel-button-text="取消" 
            @confirm="handleCopyConfirm(scope.row.url)" 
            width="320"
          >
            <template #reference>
              <div class="url-cell">
                <span>{{ scope.row.url }}</span>
                <el-icon class="copy-icon"><CopyDocument /></el-icon>
              </div>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" show-overflow-tooltip align="center" />
      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <div class="action-buttons">
            <el-button 
              size="small" 
              @click="handleEditItem(scope.row)" 
              :icon="Edit" 
              class="edit-button"
            >
              编辑
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDeleteItem(scope.row)" 
              :icon="Delete" 
              class="delete-button"
            >
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination 
      background 
      layout="total, prev, pager, next, jumper" 
      :total="itemTotal" 
      :page-size="itemPageSize" 
      :current-page="itemPageNum" 
      @current-change="handleItemPageChange" 
      class="pagination-container" 
    />

    <!-- 添加/编辑链接对话框 -->
    <el-dialog 
      v-model="showAddItemDialog" 
      :title="itemForm.id ? '编辑链接' : '添加链接'" 
      @close="resetItemForm" 
      width="500px" 
      custom-class="form-dialog"
    >
      <el-form :model="itemForm" label-width="80px" class="dialog-form">
        <el-form-item label="名称" prop="name" class="form-item">
          <el-input v-model="itemForm.name" class="custom-input" />
        </el-form-item>
        <el-form-item label="URL" prop="url" class="form-item">
          <el-input v-model="itemForm.url" class="custom-input" />
        </el-form-item>
        <el-form-item label="描述" prop="description" class="form-item">
          <el-input
            v-model="itemForm.description"
            type="textarea"
            rows="4"
            class="custom-textarea"
          />
        </el-form-item>
        <el-form-item label="分类" prop="category_id" class="form-item">
          <el-select
            v-model="itemForm.category_id"
            placeholder="请选择分类"
            style="width: 100%"
            class="custom-select"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAddItemDialog = false" class="cancel-button">
            取消
          </el-button>
          <el-button 
            type="primary" 
            @click="handleAddOrUpdateItem" 
            class="confirm-button"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入链接对话框 -->
    <el-dialog 
      v-model="showImportDialog" 
      title="导入链接" 
      width="500px" 
      custom-class="form-dialog"
    >
      <div class="import-content">
        <p class="import-description">请选择要导入的链接文件（支持 CSV 格式）</p>
        <el-upload
          ref="uploadRef"
          :auto-upload="false"
          :show-file-list="true"
          :limit="1"
          accept=".csv"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
          class="upload-demo"
        >
          <el-button :icon="Upload" class="upload-button">选择文件</el-button>
        </el-upload>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showImportDialog = false" class="cancel-button">
            取消
          </el-button>
          <el-button 
            type="primary" 
            @click="handleImportConfirm" 
            :loading="importLoading"
            :disabled="!selectedFile"
            class="confirm-button"
          >
            导入
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Plus,
  Edit,
  Delete,
  Download,
  Upload,
  Document,
  CopyDocument
} from '@element-plus/icons-vue'
import { AddItem, UpdateItem, DeleteItem } from '../../apis/admin'
import { searchItemData } from '../../apis/index'
import { GetCategoryData } from '../../apis/admin'

// 全局对象类型已在环境中定义，无需重复声明

interface Category {
  id: number | null
  name: string
  description: string
  status: number
}

interface Item {
  id: number | null
  name: string
  url: string
  description: string
  category_id: number | null
  status: number
}

// 响应式数据
const items = ref<Item[]>([])
const categories = ref<Category[]>([])
const itemTotal = ref(0)
const itemPageNum = ref(1)
const itemPageSize = ref(10)
const itemSearch = ref('')
const categoryFilter = ref<number | string>('')
const showAddItemDialog = ref(false)
const showImportDialog = ref(false)
const exportLoading = ref(false)
const importLoading = ref(false)
const selectedFile = ref<File | null>(null)
const uploadRef = ref()

const itemForm = ref<Item>({
  id: null,
  name: '',
  url: '',
  description: '',
  category_id: null,
  status: 1
})

// 暴露数据给父组件
defineExpose({
  items,
  categories,
  itemTotal,
  itemPageNum,
  itemPageSize
})

// 接口调用方法
const fetchCategories = async () => {
  try {
    const params = {
      name: '',
      pageNum: 1,
      pageSize: 1000 // 获取所有分类用于下拉选择
    }
    const response = await GetCategoryData(params)
    
    if (response.statusCode === 200) {
      // 检查response.data的结构，如果是对象且包含categorys字段，则使用categorys数组
      if (response.data && typeof response.data === 'object' && 'categorys' in response.data) {
        categories.value = Array.isArray(response.data.categorys) ? response.data.categorys : []
      } else if (Array.isArray(response.data)) {
        // 如果response.data直接是数组，则直接使用
        categories.value = response.data
      } else {
        // 如果都不是，则设置为空数组
        categories.value = []
      }
    } else {
      ElMessage.error('获取分类失败: ' + response.message)
    }
  } catch (error: any) {
    ElMessage.error('获取分类失败: ' + (error.response?.data?.message || error.message))
  }
}

const fetchItems = async () => {
  try {
    const params = {
      name: '',
      pageNum: itemPageNum.value,
      pageSize: itemPageSize.value,
      category_id: null
    }
    const response = await searchItemData(params)
    
    if (response.statusCode === 200) {
      // 检查response.data的结构，如果是对象且包含items字段，则使用items数组
      if (response.data && typeof response.data === 'object' && 'items' in response.data) {
        items.value = Array.isArray(response.data.items) ? response.data.items : []
        itemTotal.value = response.data.total || response.total || items.value.length || 0
      } else if (Array.isArray(response.data)) {
        // 如果response.data直接是数组，则直接使用
        items.value = response.data
        itemTotal.value = response.total || items.value.length || 0
      } else {
        // 如果都不是，则设置为空数组
        items.value = []
        itemTotal.value = 0
      }
    } else {
      ElMessage.error('获取链接失败: ' + response.message)
    }
  } catch (error: any) {
    ElMessage.error('获取链接失败: ' + (error.response?.data?.message || error.message))
  }
}

const fetchItemsWithSearch = async (searchText: string, categoryId: number | null) => {
  const params = {
    name: searchText,
    pageNum: itemPageNum.value,
    pageSize: itemPageSize.value,
    category_id: categoryId
  }
  const response = await searchItemData(params)
  if (response.statusCode === 200) {
    // 检查response.data的结构，如果是对象且包含items字段，则使用items数组
    if (response.data && typeof response.data === 'object' && 'items' in response.data) {
      items.value = Array.isArray(response.data.items) ? response.data.items : []
      itemTotal.value = response.data.total || response.total || items.value.length || 0
    } else if (Array.isArray(response.data)) {
      // 如果response.data直接是数组，则直接使用
      items.value = response.data
      itemTotal.value = response.total || items.value.length || 0
    } else {
      // 如果都不是，则设置为空数组
      items.value = []
      itemTotal.value = 0
    }
  }
}

// 方法
const handleItemSearch = () => {
  const categoryId = categoryFilter.value === '' ? null : Number(categoryFilter.value)
  itemPageNum.value = 1
  fetchItemsWithSearch(itemSearch.value, categoryId)
}

const handleItemPageChange = (page: number) => {
  itemPageNum.value = page
  // 如果有搜索条件，使用搜索接口，否则使用普通接口
  if (itemSearch.value || categoryFilter.value) {
    const categoryId = categoryFilter.value === '' ? null : Number(categoryFilter.value)
    fetchItemsWithSearch(itemSearch.value, categoryId)
  } else {
    fetchItems()
  }
}

const resetItemForm = () => {
  itemForm.value = {
    id: null,
    name: '',
    url: '',
    description: '',
    category_id: null,
    status: 1
  }
}

const handleEditItem = (row: Item) => {
  itemForm.value = { ...row }
  showAddItemDialog.value = true
}

const handleDeleteItem = async (row: Item) => {
  ElMessageBox.confirm('此操作将永久删除该链接, 是否继续?', '删除确认', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning',
    customClass: 'custom-message-box',
    dangerouslyUseHTMLString: false,
    showClose: true,
    closeOnClickModal: false,
    closeOnPressEscape: true,
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '删除中...'
        setTimeout(() => {
          done()
          setTimeout(() => {
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定删除'
          }, 300)
        }, 300)
      } else {
        done()
      }
    }
  }).then(async () => {
    try {
      await DeleteItem(row.id as number)
      ElMessage.success('删除成功!')
      fetchItems()
    } catch (error: any) {
      ElMessage.error('删除失败: ' + (error.response?.data?.message || error.message))
    }
  }).catch(() => {
    // 用户取消删除
  })
}

const handleAddOrUpdateItem = async () => {
  try {
    if (itemForm.value.id) {
      await UpdateItem(itemForm.value)
      ElMessage.success('更新成功!')
    } else {
      await AddItem(itemForm.value)
      ElMessage.success('添加成功!')
    }
    fetchItems()
    showAddItemDialog.value = false
  } catch (error: any) {
    ElMessage.error('操作失败: ' + (error.response?.data?.message || error.message))
  }
}

const getCategoryName = (categoryId: number | null): string => {
  if (!categoryId) return '未分类'
  const category = categories.value.find((c: Category) => c.id === categoryId)
  return category ? category.name : '未知分类'
}

const handleCopyConfirm = (url: string) => {
  ElMessage({
    message: '链接已复制: ' + url,
    type: 'success',
    duration: 2000
  })
}

const handleExportItems = async () => {
  try {
    exportLoading.value = true
    
    // 创建CSV内容
    const csvHeader = 'name,url,description,category_name\n'
    const csvContent = items.value.map((item: Item) =>
      `"${item.name.replace(/"/g, '""')}","${item.url.replace(/"/g, '""')}","${item.description.replace(/"/g, '""')}","${getCategoryName(item.category_id).replace(/"/g, '""')}"`
    ).join('\n')
    const csvData = csvHeader + csvContent
    
    // 创建下载链接
    const blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8'
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `items-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    ElMessage.success('链接数据导出成功!')
  } catch (error: any) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败: ' + error.message)
  } finally {
    exportLoading.value = false
  }
}

const handleImportItems = () => {
  showImportDialog.value = true
}

const downloadTemplate = () => {
  const csvTemplate = 'name,url,description,category_name\n示例链接1,https://example1.com,这是一个示例链接的描述,示例分类1\n示例链接2,https://example2.com,这是另一个示例链接的描述,示例分类2'
  
  const blob = new Blob(['\ufeff' + csvTemplate], {
    type: 'text/csv;charset=utf-8'
  })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'item-import-template.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
  
  ElMessage.success('模板下载成功!')
}

const handleFileChange = (file: any) => {
  selectedFile.value = file.raw
}

const handleFileRemove = () => {
  selectedFile.value = null
}

const handleImportConfirm = async () => {
  if (!selectedFile.value) {
    ElMessage.error('请先选择要导入的文件!')
    return
  }

  try {
    importLoading.value = true
    
    // 读取文件内容
    const fileContent = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e: any) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsText(selectedFile.value!, 'utf-8')
    })
    
    // 解析CSV数据
    const lines = fileContent.trim().split('\n')
    if (lines.length < 2) {
      throw new Error('CSV文件格式错误：至少需要包含标题行和一行数据')
    }
    
    // 验证标题行
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const requiredHeaders = ['name', 'url', 'description', 'category_name']
    for (const required of requiredHeaders) {
      if (!headers.includes(required)) {
        throw new Error(`CSV文件格式错误：必须包含 ${required} 列`)
      }
    }
    
    const nameIndex = headers.indexOf('name')
    const urlIndex = headers.indexOf('url')
    const descriptionIndex = headers.indexOf('description')
    const categoryNameIndex = headers.indexOf('category_name')
    
    // 解析数据行
    const items = []
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      if (values.length > Math.max(nameIndex, urlIndex, descriptionIndex, categoryNameIndex)) {
        const name = values[nameIndex]?.trim().replace(/"/g, '')
        const url = values[urlIndex]?.trim().replace(/"/g, '')
        const description = values[descriptionIndex]?.trim().replace(/"/g, '')
        const categoryName = values[categoryNameIndex]?.trim().replace(/"/g, '')
        
        if (!name) {
          throw new Error(`第${i + 1}行：链接名称不能为空`)
        }
        if (!url) {
          throw new Error(`第${i + 1}行：链接URL不能为空`)
        }
        
        items.push({
          name,
          url,
          description: description || '',
          category_name: categoryName || ''
        })
      }
    }
    
    if (items.length === 0) {
      throw new Error('没有找到有效的链接数据')
    }
    
    // 批量添加链接
    let successCount = 0
    let failCount = 0
    
    for (const itemData of items) {
      try {
        // 根据分类名称查找分类ID
        const category = categories.value.find((c: Category) => c.name === itemData.category_name)
        const newItem: Item = {
          id: null,
          name: itemData.name,
          url: itemData.url,
          description: itemData.description,
          category_id: category ? category.id : null,
          status: 1
        }
        await AddItem(newItem)
        successCount++
      } catch (error) {
        failCount++
      }
    }
    
    if (successCount > 0) {
      ElMessage.success(`成功导入 ${successCount} 个链接${failCount > 0 ? `，失败 ${failCount} 个` : ''}`)
      fetchItems() // 刷新链接列表
    } else {
      ElMessage.error('导入失败，没有成功添加任何链接')
    }
    
    showImportDialog.value = false
    selectedFile.value = null
    uploadRef.value?.clearFiles()
    
  } catch (error: any) {
    console.error('导入失败:', error)
    ElMessage.error('导入失败: ' + error.message)
  } finally {
    importLoading.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchCategories()
  fetchItems()
})

// CSV解析辅助函数
const parseCSVLine = (line: string): string[] => {
  const result = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current)
  return result
}
</script>

<style scoped>
.item-management {
  padding: 24px;
}

.toolbar {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-input :deep(.el-input__inner) {
  border-radius: 8px;
  height: 40px;
  line-height: 40px;
  transition: all 0.3s;
}

.search-input :deep(.el-input__inner:focus) {
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.category-filter :deep(.el-input__wrapper) {
  height: 40px;
  padding-top: 0;
  padding-bottom: 0;
  border-radius: 8px;
  transition: all 0.3s;
}

.category-filter :deep(.el-input__wrapper:focus-within) {
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.category-filter :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.category-filter {
  width: 180px;
}

.action-button {
  height: 40px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;
  background: linear-gradient(45deg, #1890ff, #36cfc9);
  border: none;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.export-button {
  height: 40px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;
  background: linear-gradient(45deg, #52c41a, #73d13d);
  border: none;
}

.export-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
}

.import-button {
  height: 40px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;
  background: linear-gradient(45deg, #fa8c16, #ffa940);
  border: none;
}

.import-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(250, 140, 22, 0.3);
}

.template-button {
  height: 40px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;
  background: linear-gradient(45deg, #722ed1, #9254de);
  border: none;
}

.template-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(114, 46, 209, 0.3);
}

.custom-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

:deep(.table-header th) {
  background-color: #f5f7fa !important;
  font-weight: 700;
  color: #333;
  border-bottom: 1px solid #ebeef5;
  padding: 14px 0;
}

:deep(.el-table tr) {
  transition: background-color 0.3s;
}

:deep(.el-table td) {
  padding: 12px 0;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.edit-button {
  background-color: #f0f7ff;
  color: #1890ff;
  border: 1px solid #b7eb8f;
}

.edit-button:hover {
  background-color: #1890ff;
  color: white;
}

.delete-button {
  background-color: #fff0f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}

.delete-button:hover {
  background-color: #ff4d4f;
  color: white;
}

.url-cell {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  padding: 6px;
  border-radius: 4px;
}

.url-cell:hover {
  background-color: rgba(24, 144, 255, 0.1);
}

.copy-icon {
  font-size: 14px;
  opacity: 0.6;
  color: #1890ff;
}

.url-cell:hover .copy-icon {
  opacity: 1;
}

.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.custom-input :deep(.el-input__inner),
.custom-textarea :deep(.el-textarea__inner),
.custom-select :deep(.el-input__inner) {
  border-radius: 8px;
  transition: all 0.3s;
}

.custom-input :deep(.el-input__inner:focus),
.custom-textarea :deep(.el-textarea__inner:focus),
.custom-select :deep(.el-input__inner:focus) {
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.custom-select :deep(.el-input__wrapper) {
  border-radius: 8px;
  transition: all 0.3s;
}

.custom-select :deep(.el-input__wrapper:focus-within),
.custom-select :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

/* 对话框内输入框的上下间距 */
.dialog-form .custom-input,
.dialog-form .custom-textarea,
.dialog-form .custom-select {
  margin: 8px 0;
}

.dialog-form .custom-input :deep(.el-input__wrapper),
.dialog-form .custom-textarea :deep(.el-textarea__inner),
.dialog-form .custom-select :deep(.el-input__wrapper) {
  margin: 4px 0;
}

.dialog-form {
  padding: 0 8px;
}

.form-item {
  margin-bottom: 24px;
}

.form-item:last-child {
  margin-bottom: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.cancel-button {
  border-radius: 8px;
}

.confirm-button {
  border-radius: 8px;
  background: linear-gradient(45deg, #1890ff, #36cfc9);
  border: none;
}

.import-content {
  padding: 20px 0;
}

.import-description {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.upload-button {
  height: 40px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;
  background: linear-gradient(45deg, #1890ff, #36cfc9);
  border: none;
  color: white;
}

.upload-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.upload-demo {
  margin-bottom: 16px;
}

/* 自定义删除确认弹窗样式 */
:deep(.custom-message-box) {
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;
}

:deep(.custom-message-box .el-message-box__header) {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  padding: 20px 24px;
  border-bottom: none;
}

:deep(.custom-message-box .el-message-box__title) {
  color: white;
  font-weight: 600;
  font-size: 18px;
}

:deep(.custom-message-box .el-message-box__headerbtn) {
  top: 20px;
  right: 20px;
}

:deep(.custom-message-box .el-message-box__headerbtn .el-message-box__close) {
  color: white;
  font-size: 18px;
}

:deep(.custom-message-box .el-message-box__content) {
  padding: 24px;
  background: white;
}

:deep(.custom-message-box .el-message-box__container) {
  position: relative;
}

:deep(.custom-message-box .el-message-box__status) {
  font-size: 24px;
  margin-right: 16px;
}

:deep(.custom-message-box .el-message-box__message) {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

:deep(.custom-message-box .el-message-box__btns) {
  padding: 16px 24px 24px;
  background: #f8f9fa;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.custom-message-box .el-button) {
  border-radius: 8px;
  font-weight: 500;
  padding: 10px 20px;
  transition: all 0.3s;
}

:deep(.custom-message-box .el-button--default) {
  background: white;
  border: 1px solid #d9d9d9;
  color: #666;
}

:deep(.custom-message-box .el-button--default:hover) {
  border-color: #1890ff;
  color: #1890ff;
}

:deep(.custom-message-box .el-button--primary) {
  background: linear-gradient(45deg, #ff4d4f, #ff7875);
  border: none;
  color: white;
}

:deep(.custom-message-box .el-button--primary:hover) {
  background: linear-gradient(45deg, #ff7875, #ffa39e);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

:deep(.custom-message-box .el-button--primary.is-loading) {
  background: linear-gradient(45deg, #ff7875, #ffa39e);
}
:deep(.el-select__wrapper) {
  min-height: 42px;
}
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
  
  :deep(.custom-message-box) {
    width: 90% !important;
    margin: 0 auto;
  }
  
  :deep(.custom-message-box .el-message-box__btns) {
    flex-direction: column;
  }
  
  :deep(.custom-message-box .el-button) {
    width: 100%;
  }
}
</style>
<script lang="ts">
export default {
  name: 'ItemManagement'
}
</script>