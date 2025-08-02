<template>
  <div class="category-management">
    <div class="toolbar">
      <el-space>
        <el-input 
          v-model="categorySearch" 
          placeholder="按名称搜索" 
          @input="handleCategorySearch" 
          clearable 
          style="width: 240px" 
          :prefix-icon="Search" 
          class="search-input"
        />
        <el-button 
          type="primary" 
          @click="showAddCategoryDialog = true" 
          :icon="Plus" 
          class="action-button"
        >
          添加分类
        </el-button>
      </el-space>
      
      <el-space>
        <el-button 
          type="success" 
          @click="handleExportCategories" 
          :icon="Download" 
          :loading="exportLoading"
          class="export-button"
        >
          导出分类
        </el-button>
        <el-button 
          type="warning" 
          @click="handleImportCategories" 
          :icon="Upload" 
          class="import-button"
        >
          导入分类
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
      :data="categories" 
      style="width: 100%" 
      border 
      stripe 
      header-cell-class-name="table-header" 
      class="custom-table"
    >
      <el-table-column prop="name" label="名称" width="180" align="center" />
      <el-table-column prop="description" label="描述" align="center" />
      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <div class="action-buttons">
            <el-button 
              size="small" 
              @click="handleEditCategory(scope.row)" 
              :icon="Edit" 
              class="edit-button"
            >
              编辑
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDeleteCategory(scope.row)" 
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
      :total="categoryTotal" 
      :page-size="categoryPageSize" 
      :current-page="categoryPageNum" 
      @current-change="handleCategoryPageChange" 
      class="pagination-container" 
    />

    <!-- 添加/编辑分类对话框 -->
    <el-dialog 
      v-model="showAddCategoryDialog" 
      :title="categoryForm.id ? '编辑分类' : '添加分类'" 
      @close="resetCategoryForm" 
      width="500px" 
      custom-class="form-dialog"
    >
      <el-form :model="categoryForm" label-width="80px" class="dialog-form">
        <el-form-item label="名称" prop="name" class="form-item">
          <el-input v-model="categoryForm.name" class="custom-input" />
        </el-form-item>
        <el-form-item label="描述" prop="description" class="form-item">
          <el-input
            v-model="categoryForm.description"
            type="textarea"
            rows="4"
            class="custom-textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAddCategoryDialog = false" class="cancel-button">
            取消
          </el-button>
          <el-button 
            type="primary" 
            @click="handleAddOrUpdateCategory" 
            class="confirm-button"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入分类对话框 -->
    <el-dialog 
      v-model="showImportDialog" 
      title="导入分类" 
      width="500px" 
      custom-class="form-dialog"
    >
      <div class="import-content">
        <p class="import-description">请选择要导入的分类文件（支持 CSV 格式）</p>
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
  Document
} from '@element-plus/icons-vue'
import { GetCategoryData, AddCategory, UpdateCategory, DeleteCategory } from '../../apis/admin'

interface Category {
  id: number | null
  name: string
  description: string
  status: number
}

// 响应式数据
const categories = ref<Category[]>([])
const categoryTotal = ref(0)
const categoryPageNum = ref(1)
const categoryPageSize = ref(10)
const categorySearch = ref('')
const showAddCategoryDialog = ref(false)
const showImportDialog = ref(false)
const exportLoading = ref(false)
const importLoading = ref(false)
const selectedFile = ref<File | null>(null)
const uploadRef = ref()

const categoryForm = ref<Category>({
  id: null,
  name: '',
  description: '',
  status: 1
})

// 暴露数据给父组件
defineExpose({
  categories,
  categoryTotal,
  categoryPageNum,
  categoryPageSize
})

// 接口调用方法
const fetchCategories = async () => {
  try {
    const params = {
      name: '',
      pageNum: categoryPageNum.value,
      pageSize: categoryPageSize.value
    }
    const response = await GetCategoryData(params)
    
    if (response.statusCode === 200) {
      // 检查response.data的结构，如果是对象且包含categorys字段，则使用categorys数组
      if (response.data && typeof response.data === 'object' && 'categorys' in response.data) {
        categories.value = Array.isArray(response.data.categorys) ? response.data.categorys : []
        categoryTotal.value = response.data.total || response.total || categories.value.length || 0
      } else if (Array.isArray(response.data)) {
        // 如果response.data直接是数组，则直接使用
        categories.value = response.data
        categoryTotal.value = response.total || categories.value.length || 0
      } else {
        // 如果都不是，则设置为空数组
        categories.value = []
        categoryTotal.value = 0
      }
    } else {
      ElMessage.error('获取分类失败: ' + response.message)
    }
  } catch (error: any) {
    ElMessage.error('获取分类失败: ' + (error.response?.data?.message || error.message))
  }
}

const fetchCategoriesWithSearch = async (searchText: string) => {
  const params = {
    name: searchText,
    pageNum: categoryPageNum.value,
    pageSize: categoryPageSize.value
  }
  const response = await GetCategoryData(params)
  if (response.statusCode === 200) {
    // 检查response.data的结构，如果是对象且包含categorys字段，则使用categorys数组
    if (response.data && typeof response.data === 'object' && 'categorys' in response.data) {
      categories.value = Array.isArray(response.data.categorys) ? response.data.categorys : []
      categoryTotal.value = response.data.total || response.total || categories.value.length || 0
    } else if (Array.isArray(response.data)) {
      // 如果response.data直接是数组，则直接使用
      categories.value = response.data
      categoryTotal.value = response.total || categories.value.length || 0
    } else {
      // 如果都不是，则设置为空数组
      categories.value = []
      categoryTotal.value = 0
    }
  }
}

// 方法
const handleCategorySearch = () => {
  categoryPageNum.value = 1
  fetchCategoriesWithSearch(categorySearch.value)
}

const handleCategoryPageChange = (page: number) => {
  categoryPageNum.value = page
  // 如果有搜索条件，使用搜索接口，否则使用普通接口
  if (categorySearch.value) {
    fetchCategoriesWithSearch(categorySearch.value)
  } else {
    fetchCategories()
  }
}

const resetCategoryForm = () => {
  categoryForm.value = {
    id: null,
    name: '',
    description: '',
    status: 1
  }
}

const handleEditCategory = (row: Category) => {
  categoryForm.value = { ...row }
  showAddCategoryDialog.value = true
}

const handleDeleteCategory = async (row: Category) => {
  ElMessageBox.confirm('此操作将永久删除该分类, 是否继续?', '删除确认', {
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
      await DeleteCategory(row.id as number)
      ElMessage.success('删除成功!')
      fetchCategories()
    } catch (error: any) {
      ElMessage.error('删除失败: ' + (error.response?.data?.message || error.message))
    }
  }).catch(() => {
    // 用户取消删除
  })
}

const handleAddOrUpdateCategory = async () => {
  try {
    if (categoryForm.value.id) {
      await UpdateCategory(categoryForm.value)
      ElMessage.success('更新成功!')
    } else {
      await AddCategory(categoryForm.value)
      ElMessage.success('添加成功!')
    }
    fetchCategories()
    showAddCategoryDialog.value = false
  } catch (error: any) {
    ElMessage.error('操作失败: ' + (error.response?.data?.message || error.message))
  }
}

const handleExportCategories = async () => {
  try {
    exportLoading.value = true
    
    // 创建CSV内容
    const csvHeader = 'name,description\n'
    const csvContent = categories.value.map((cat: Category) =>
      `"${cat.name.replace(/"/g, '""')}","${cat.description.replace(/"/g, '""')}"`
    ).join('\n')
    const csvData = csvHeader + csvContent
    
    // 创建下载链接
    const blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8'
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `categories-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    ElMessage.success('分类数据导出成功!')
  } catch (error: any) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败: ' + error.message)
  } finally {
    exportLoading.value = false
  }
}

const handleImportCategories = () => {
  showImportDialog.value = true
}

const downloadTemplate = () => {
  const csvTemplate = 'name,description\n示例分类1,这是一个示例分类的描述\n示例分类2,这是另一个示例分类的描述'
  
  const blob = new Blob(['\ufeff' + csvTemplate], {
    type: 'text/csv;charset=utf-8'
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'category-import-template.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
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
    if (!headers.includes('name') || !headers.includes('description')) {
      throw new Error('CSV文件格式错误：必须包含 name 和 description 列')
    }
    
    const nameIndex = headers.indexOf('name')
    const descriptionIndex = headers.indexOf('description')
    
    // 解析数据行
    const categories = []
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      if (values.length > nameIndex && values.length > descriptionIndex) {
        const name = values[nameIndex]?.trim().replace(/"/g, '')
        const description = values[descriptionIndex]?.trim().replace(/"/g, '')
        
        if (!name) {
          throw new Error(`第${i + 1}行：分类名称不能为空`)
        }
        
        categories.push({
          name,
          description: description || ''
        })
      }
    }
    
    if (categories.length === 0) {
      throw new Error('没有找到有效的分类数据')
    }
    
    // 批量添加分类
    let successCount = 0
    let failCount = 0
    
    for (const categoryData of categories) {
      try {
        const newCategory: Category = {
          id: null,
          name: categoryData.name,
          description: categoryData.description,
          status: 1
        }
        await AddCategory(newCategory)
        successCount++
      } catch (error) {
        failCount++
      }
    }
    
    if (successCount > 0) {
      ElMessage.success(`成功导入 ${successCount} 个分类${failCount > 0 ? `，失败 ${failCount} 个` : ''}`)
      fetchCategories() // 刷新分类列表
    } else {
      ElMessage.error('导入失败，没有成功添加任何分类')
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
.category-management {
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

.search-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  transition: all 0.3s;
}

.search-input :deep(.el-input__wrapper:focus-within),
.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
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

.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.custom-input :deep(.el-input__inner),
.custom-textarea :deep(.el-textarea__inner) {
  border-radius: 8px;
  transition: all 0.3s;
}

.custom-input :deep(.el-input__inner:focus),
.custom-textarea :deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.custom-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  transition: all 0.3s;
}

.custom-input :deep(.el-input__wrapper:focus-within),
.custom-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

/* 对话框内输入框的上下间距 */
.dialog-form .custom-input,
.dialog-form .custom-textarea {
  margin: 8px 0;
}

.dialog-form .custom-input :deep(.el-input__wrapper),
.dialog-form .custom-textarea :deep(.el-textarea__inner) {
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
  name: 'CategoryManagement'
}
</script>