<template>
  <div class="admin-dashboard">
    <!-- 顶部导航 -->
    <div class="admin-header">
      <div class="header-left">
        <h1>后台管理系统</h1>
      </div>
      <div class="header-right">
        <el-button 
          type="default" 
          @click="goToIndex"
          class="home-btn"
          title="返回首页"
        >
          <el-icon><HomeFilled /></el-icon>
          <span class="btn-text">返回首页</span>
        </el-button>
        <el-button type="primary" @click="loadData" :loading="loading" title="刷新数据" class="action-btn">
          <el-icon><Refresh /></el-icon>
          <span class="btn-text">刷新数据</span>
        </el-button>
        <el-button type="success" @click="handleSave" :loading="saving" title="保存并提交到 GitHub" class="action-btn">
          <el-icon><Upload /></el-icon>
          <span class="btn-text">保存并提交到 GitHub</span>
        </el-button>
        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <el-avatar 
              :src="adminStore.user?.avatar_url" 
              :alt="adminStore.user?.login"
              :size="32"
            />
            <span class="username">{{ adminStore.user?.login }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="admin-content">
      <el-tabs v-model="activeTab" class="content-tabs">
        <!-- 分类管理 -->
        <el-tab-pane label="分类管理" name="categories">
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span>分类列表</span>
                <el-button type="primary" :icon="PlusIcon" @click="handleAddCategory">
                  添加分类
                </el-button>
              </div>
            </template>

            <el-table :data="categories" border stripe>
              <el-table-column prop="id" label="ID" width="80" align="center" />
              <el-table-column prop="name" label="分类名称" align="center" />
              <el-table-column label="网站数量" width="120" align="center">
                <template #default="{ row }">
                  {{ getItemCountByCategory(row.id) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" align="center" fixed="right">
                <template #default="{ row }">
                  <el-button 
                    type="primary" 
                    size="small" 
                    :icon="EditIcon"
                    @click="handleEditCategory(row)"
                  >
                    编辑
                  </el-button>
                  <el-button 
                    type="danger" 
                    size="small" 
                    :icon="DeleteIcon"
                    @click="handleDeleteCategory(row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- 网站管理 -->
        <el-tab-pane label="网站管理" name="items">
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span>网站列表（共 {{ filteredItems.length }} 个）</span>
                <div class="header-actions">
                  <el-input
                    v-model="searchKeyword"
                    :placeholder="isMobile ? '搜索' : '搜索网站名称、URL或描述'"
                    clearable
                    style="width: 250px;"
                    class="search-input"
                  >
                    <template #prefix>
                      <el-icon><Search /></el-icon>
                    </template>
                  </el-input>
                  <el-select 
                    v-model="filterCategory" 
                    placeholder="筛选分类" 
                    clearable
                    style="width: 200px; margin-right: 10px;"
                    class="filter-select"
                  >
                    <el-option label="全部分类" :value="0" />
                    <el-option 
                      v-for="cat in categories" 
                      :key="cat.id" 
                      :label="cat.name" 
                      :value="cat.id" 
                    />
                  </el-select>
                  <el-button type="primary" :icon="PlusIcon" @click="handleAddItem">
                    添加网站
                  </el-button>
                </div>
              </div>
            </template>

            <el-table :data="filteredItems" border stripe>
              <el-table-column prop="id" label="ID" width="80" align="center" />
              <el-table-column prop="name" label="网站名称" width="150" align="center" />
              <el-table-column prop="url" label="网站地址" min-width="200" align="center" />
              <el-table-column prop="description" label="描述" min-width="180" align="center" />
              <el-table-column label="分类" width="120" align="center">
                <template #default="{ row }">
                  {{ getCategoryName(row.categoryId) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" align="center" fixed="right">
                <template #default="{ row }">
                  <el-button 
                    type="primary" 
                    size="small" 
                    :icon="EditIcon"
                    @click="handleEditItem(row)"
                  >
                    编辑
                  </el-button>
                  <el-button 
                    type="danger" 
                    size="small" 
                    :icon="DeleteIcon"
                    @click="handleDeleteItem(row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 分类编辑对话框 -->
    <el-dialog 
      v-model="categoryDialogVisible" 
      :title="categoryForm.id ? '编辑分类' : '添加分类'"
      width="500px"
      class="mobile-dialog"
    >
      <el-form :model="categoryForm" label-width="100px">
        <el-form-item label="分类 ID">
          <el-input-number 
            v-model="categoryForm.id" 
            :min="1" 
            :disabled="!!categoryForm.id && isEdit"
          />
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="categoryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCategory">确定</el-button>
      </template>
    </el-dialog>

    <!-- 网站编辑对话框 -->
    <el-dialog 
      v-model="itemDialogVisible" 
      :title="itemForm.id ? '编辑网站' : '添加网站'"
      width="600px"
      class="mobile-dialog"
    >
      <el-form :model="itemForm" label-width="100px">
        <el-form-item label="网站 ID">
          <el-input-number 
            v-model="itemForm.id" 
            :min="1" 
            :disabled="!!itemForm.id && isEdit"
          />
        </el-form-item>
        <el-form-item label="网站名称">
          <el-input v-model="itemForm.name" placeholder="请输入网站名称" />
        </el-form-item>
        <el-form-item label="网站地址">
          <el-input v-model="itemForm.url" placeholder="请输入网站地址" />
        </el-form-item>
        <el-form-item label="网站描述">
          <el-input 
            v-model="itemForm.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入网站描述" 
          />
        </el-form-item>
        <el-form-item label="所属分类">
          <el-select v-model="itemForm.categoryId" placeholder="请选择分类">
            <el-option 
              v-for="cat in categories" 
              :key="cat.id" 
              :label="cat.name" 
              :value="cat.id" 
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="itemDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveItem">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminStore } from '@/store/admin';
import { ElMessage, ElMessageBox } from 'element-plus';
import { 
  Refresh, 
  Upload, 
  Plus, 
  Edit, 
  Delete,
  Search,
  HomeFilled
} from '@element-plus/icons-vue';

// 图标组件
const PlusIcon = Plus;
const EditIcon = Edit;
const DeleteIcon = Delete;

interface Category {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
  url: string;
  description: string;
  categoryId: number;
}

const router = useRouter();
const adminStore = useAdminStore();

const activeTab = ref('categories');

// 检测是否为移动端
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
const loading = ref(false);
const saving = ref(false);

// 数据
const categories = ref<Category[]>([]);
const items = ref<Item[]>([]);
const fileSha = ref('');

// 筛选
const filterCategory = ref(0);
const searchKeyword = ref('');

// 对话框
const categoryDialogVisible = ref(false);
const itemDialogVisible = ref(false);
const isEdit = ref(false);

// 表单
const categoryForm = ref<Partial<Category>>({});
const itemForm = ref<Partial<Item>>({});

// 计算属性
const filteredItems = computed(() => {
  let result = items.value;

  // 按分类筛选
  if (filterCategory.value !== 0) {
    result = result.filter(item => item.categoryId === filterCategory.value);
  }

  // 按关键词搜索
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase().trim();
    result = result.filter(item => 
      item.name.toLowerCase().includes(keyword) ||
      item.url.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
    );
  }

  return result;
});

// 获取分类名称
const getCategoryName = (categoryId: number) => {
  const category = categories.value.find(cat => cat.id === categoryId);
  return category?.name || '未知';
};

// 获取分类下的网站数量
const getItemCountByCategory = (categoryId: number) => {
  return items.value.filter(item => item.categoryId === categoryId).length;
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const data = await adminStore.getFileContent();
    categories.value = data.content.categories;
    items.value = data.content.items;
    fileSha.value = data.sha;
    ElMessage.success('数据加载成功');
  } catch (error: any) {
    ElMessage.error(error.message || '加载数据失败');
  } finally {
    loading.value = false;
  }
};

// 保存数据
const handleSave = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要保存并提交到 GitHub 吗？',
      '确认操作',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    saving.value = true;

    const content = {
      categories: categories.value,
      items: items.value,
    };

    await adminStore.updateFileContent(
      content,
      fileSha.value,
      '后台更新导航数据'
    );

    ElMessage.success('保存成功');
    
    // 重新加载以获取新的 SHA
    await loadData();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '保存失败');
    }
  } finally {
    saving.value = false;
  }
};

// 分类操作
const handleAddCategory = () => {
  isEdit.value = false;
  categoryForm.value = {
    id: Math.max(...categories.value.map(c => c.id), 0) + 1,
    name: '',
  };
  categoryDialogVisible.value = true;
};

const handleEditCategory = (row: Category) => {
  isEdit.value = true;
  categoryForm.value = { ...row };
  categoryDialogVisible.value = true;
};

const handleDeleteCategory = async (row: Category) => {
  try {
    const count = getItemCountByCategory(row.id);
    if (count > 0) {
      ElMessage.warning(`该分类下还有 ${count} 个网站，请先删除网站`);
      return;
    }

    await ElMessageBox.confirm(
      `确定要删除分类「${row.name}」吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    categories.value = categories.value.filter(cat => cat.id !== row.id);
    ElMessage.success('删除成功');
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

const saveCategory = () => {
  if (!categoryForm.value.name) {
    ElMessage.warning('请输入分类名称');
    return;
  }

  if (isEdit.value) {
    const index = categories.value.findIndex(cat => cat.id === categoryForm.value.id);
    if (index !== -1) {
      categories.value[index] = categoryForm.value as Category;
    }
  } else {
    categories.value.push(categoryForm.value as Category);
  }

  categoryDialogVisible.value = false;
  ElMessage.success(isEdit.value ? '编辑成功' : '添加成功');
};

// 网站操作
const handleAddItem = () => {
  isEdit.value = false;
  itemForm.value = {
    id: Math.max(...items.value.map(i => i.id), 0) + 1,
    name: '',
    url: '',
    description: '',
    categoryId: categories.value[0]?.id || 1,
  };
  itemDialogVisible.value = true;
};

const handleEditItem = (row: Item) => {
  isEdit.value = true;
  itemForm.value = { ...row };
  itemDialogVisible.value = true;
};

const handleDeleteItem = async (row: Item) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除网站「${row.name}」吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    items.value = items.value.filter(item => item.id !== row.id);
    ElMessage.success('删除成功');
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

const saveItem = () => {
  if (!itemForm.value.name || !itemForm.value.url || !itemForm.value.categoryId) {
    ElMessage.warning('请填写完整信息');
    return;
  }

  if (isEdit.value) {
    const index = items.value.findIndex(item => item.id === itemForm.value.id);
    if (index !== -1) {
      items.value[index] = itemForm.value as Item;
    }
  } else {
    items.value.push(itemForm.value as Item);
  }

  itemDialogVisible.value = false;
  ElMessage.success(isEdit.value ? '编辑成功' : '添加成功');
};

// 用户操作
const goToIndex = () => {
  router.push('/index');
};

const handleCommand = (command: string) => {
  if (command === 'logout') {
    adminStore.clearAuth();
    ElMessage.success('已退出登录');
    router.push('/index');
  }
};

onMounted(() => {
  // 检查登录状态
  if (!adminStore.isAuthenticated) {
    ElMessage.warning('请先登录');
    router.push('/index');
    return;
  }

  // 加载数据
  loadData();
});
</script>

<style scoped lang="scss">
.admin-dashboard {
  min-height: 100vh;
  background: #f0f2f5;
}

.admin-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 12px 24px;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 1000;
  flex-wrap: wrap;
  gap: 12px;

  .header-left {
    h1 {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }
    
    @media screen and (max-width: 768px) {
      display: none;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;

    .el-button {
      display: flex;
      align-items: center;
      justify-content: center;
      
      .btn-text {
        margin-left: 4px;
      }
    }

    .home-btn,
    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      
      .el-icon {
        margin-right: 4px;
      }
    }
    
    @media screen and (max-width: 1200px) {
      gap: 8px;
      
      .el-button {
        font-size: 14px;
        padding: 8px 15px;
      }
    }

    @media screen and (max-width: 768px) {
      width: 100%;
      justify-content: space-between;
      gap: 6px;
      
      .el-button {
        flex: 1;
        font-size: 12px;
        padding: 10px 8px;
        min-width: 40px;
        
        // 在移动端隐藏按钮文字，只保留图标
        .btn-text {
          display: none;
        }
        
        .el-icon {
          margin-right: 0 !important;
          font-size: 18px;
        }
      }
      
      .home-btn {
        .el-icon {
          margin-right: 0 !important;
        }
      }
      
      .el-dropdown {
        flex: 0 0 auto;
      }
    }

    @media screen and (max-width: 480px) {
      gap: 4px;
      
      .el-button {
        padding: 8px 6px;
        min-width: 36px;
        
        .el-icon {
          font-size: 16px;
        }
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background-color 0.3s;
      border: none;
      outline: none;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      .username {
        font-size: 14px;
        color: #333;
        
        // 在小屏幕上隐藏用户名
        @media screen and (max-width: 768px) {
          display: none;
        }
      }
    }
    
    // 移除 dropdown 的默认样式
    :deep(.el-dropdown) {
      border: none;
      outline: none;
    }
    
    :deep(.el-dropdown:focus),
    :deep(.el-dropdown:hover),
    :deep(.el-dropdown:active) {
      border: none;
      outline: none;
      box-shadow: none;
    }
  }

  // 移动端优化标题
  @media screen and (max-width: 768px) {
    padding: 10px 16px;
    min-height: 56px;
    justify-content: center;
    
    .header-right {
      width: 100%;
    }
  }

  @media screen and (max-width: 480px) {
    padding: 8px 12px;
    min-height: 52px;
  }
}

.admin-content {
  padding: 24px;
  padding-top: 88px; // 64px header height + 24px spacing
  max-width: 1400px;
  margin: 0 auto;

  .content-tabs {
    background: white;
    padding: 24px;
    border-radius: 8px;
  }

  // 移动端减少内边距
  @media screen and (max-width: 768px) {
    padding: 16px;
    padding-top: 76px; // 调整顶部间距
    
    .content-tabs {
      padding: 16px;
    }
  }

  @media screen and (max-width: 480px) {
    padding: 12px;
    padding-top: 68px;
    
    .content-tabs {
      padding: 12px;
    }
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;

  .header-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    .header-actions {
      width: 100%;
      flex-wrap: wrap;
      gap: 8px;
      
      .search-input {
        flex: 1 1 50%;
        min-width: 0;
        width: auto !important;
        margin-right: 0;
      }
      
      .filter-select {
        flex: 1 1 50%;
        min-width: 0;
        width: auto !important;
        margin-right: 0 !important;
      }
      
      .el-button {
        width: 100%;
        margin-top: 8px;
      }
    }
  }

  @media screen and (max-width: 480px) {
    gap: 8px;
    
    .header-actions {
      gap: 6px;
      
      .search-input {
        flex: 1 1 50%;
        min-width: 0;
        width: auto !important;
        
        :deep(.el-input__inner) {
          font-size: 13px;
        }
        
        :deep(.el-input__wrapper) {
          padding: 1px 8px;
        }
      }
      
      .filter-select {
        flex: 1 1 50%;
        min-width: 0;
        width: auto !important;
        
        :deep(.el-input__inner) {
          font-size: 13px;
        }
        
        :deep(.el-input__wrapper) {
          padding: 1px 8px;
        }
      }
      
      .el-button {
        width: 100%;
        margin-top: 6px;
        font-size: 14px;
      }
    }
  }
  
  @media screen and (max-width: 375px) {
    .header-actions {
      .search-input {
        flex: 1 1 50%;
        min-width: 0;
      }
      
      .filter-select {
        flex: 1 1 50%;
        min-width: 0;
      }
    }
  }
}

// 表格容器 - 添加横向滚动
:deep(.el-card__body) {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; // iOS 平滑滚动
  
  .el-table {
    min-width: 800px; // 确保表格有最小宽度
  }
}

// 表格在移动端的优化
@media screen and (max-width: 768px) {
  :deep(.el-table) {
    font-size: 13px;
    min-width: 700px;
    
    .el-table__header th,
    .el-table__body td {
      padding: 10px 8px;
    }
    
    .el-button {
      font-size: 12px;
      padding: 5px 8px;
      margin: 2px;
    }
    
    .el-table__fixed-right {
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
    }
  }
  
  // 优化卡片内边距
  :deep(.el-card__body) {
    padding: 10px;
  }
}

@media screen and (max-width: 480px) {
  :deep(.el-table) {
    font-size: 12px;
    min-width: 600px;
    
    .el-table__header th,
    .el-table__body td {
      padding: 8px 4px;
      font-size: 12px;
    }
    
    .el-button {
      font-size: 11px;
      padding: 4px 6px;
    }
  }
  
  :deep(.el-card__body) {
    padding: 8px;
  }
}

// 对话框响应式
.mobile-dialog {
  :deep(.el-dialog) {
    @media screen and (max-width: 768px) {
      width: 90% !important;
      max-width: 600px;
      margin: 0 auto;
    }

    @media screen and (max-width: 480px) {
      width: 95% !important;
      margin: 5vh auto;
      
      .el-dialog__header {
        padding: 16px;
      }
      
      .el-dialog__body {
        padding: 16px;
        max-height: 70vh;
        overflow-y: auto;
      }
      
      .el-dialog__footer {
        padding: 12px 16px;
      }
      
      .el-form {
        .el-form-item {
          margin-bottom: 16px;
          
          .el-form-item__label {
            font-size: 13px;
            padding-bottom: 6px;
          }
          
          .el-input,
          .el-input-number,
          .el-select,
          .el-textarea {
            width: 100%;
          }
        }
      }
    }
  }
}

// Tabs 响应式
:deep(.el-tabs__nav-wrap) {
  @media screen and (max-width: 480px) {
    .el-tabs__item {
      font-size: 14px;
      padding: 0 12px;
    }
  }
}

// Card 响应式
:deep(.el-card) {
  @media screen and (max-width: 768px) {
    .el-card__header {
      padding: 14px;
    }
    
    .el-card__body {
      padding: 14px;
    }
  }

  @media screen and (max-width: 480px) {
    .el-card__header {
      padding: 12px;
    }
    
    .el-card__body {
      padding: 12px;
    }
  }
}
</style>

