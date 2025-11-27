<template>
  <div class="admin-callback"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminStore } from '@/store/admin';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();

onMounted(async () => {
  const code = route.query.code as string;

  if (!code) {
    ElMessage.error('授权失败：缺少授权码');
    router.push('/index');
    return;
  }

  try {
    const result = await adminStore.handleCallback(code);

    if (result.success) {
      ElMessage.success('登录成功');
      router.push('/admin/dashboard');
    } else {
      ElMessage.error(result.error || '登录失败');
      router.push('/index');
    }
  } catch (err: any) {
    ElMessage.error(err.message || '登录过程出错');
    router.push('/index');
  }
});
</script>

<style scoped lang="scss">
.admin-callback {
  display: none;
}
</style>

