<template>
  <div class="home-search xl:w-px-600 lg:w-px-400 sm:w-px-360 h-px-40">
    <ul class="menu" style="color: #fff;">
      <li v-for=" (item,index) in store.$state.searchs" :key="item.key" @click="selectEngine(index)"
        class="xl:text-base" :class="{ active: activeSearchIndex === index }">{{ item.name }}</li>
    </ul>
    <form>
      <div class="left">
        <i :class="currentSearch.iconClass"></i>
      </div>
      <el-input placeholder="Please Input" clearable v-model="searchQuery" @input="() => {}" class="size"
        :class="{sizesp : changeSize}" />
      <div class="right">
        <i class="iconfont icon-md-search" @click="doSearch"></i>
      </div>
    </form>
  </div>

</template>

<script setup>
import { useMainStore } from '@/store';
import { computed, ref, watch } from 'vue';
import { openUrl } from '@/utils';
const store = useMainStore()

const searchQuery = ref('');
const activeSearchIndex = ref(0)
const currentSearch = ref({})
// const debouncedSearch = (query) => {
//   console.log('搜索:', query);
//   // 这里放置你的搜索逻辑
// };
// 选择搜索引擎
const selectEngine = (index) => {
  // 搜索输入框获得光标
  // searchQuery.focus();
  // console.log(index);
  // 选择引擎索引
  activeSearchIndex.value = index;
}
watch(    // 选中的建议索引
  activeSearchIndex, (newV, oldV) => {
    currentSearch.value = store.$state.searchs[newV];
  },
  {
    deep: true,
    immediate: true,
  }
)
// watch(searchQuery, (newVal, oldVal) => {
//   clearTimeout(debounceTimer);
//   const debounceTimer = setTimeout(() => {
//     debouncedSearch(newVal);
//   }, 300);
// });
const changeSize = computed(() => {
  if (document.body.clientWidth <= 414) {
    return true
  } else {
    return false
  }
})
const doSearch =() => {
  if (searchQuery.value) {
        const searchUrl = `${currentSearch.value.url}?${currentSearch.value.key}=${searchQuery.value}`;
        // window.location.href = searchUrl; 
openUrl(searchUrl)
      }
}
</script>


<style lang="scss" scoped>
.size {
  width: 500px;
  height: 40px;
}
.sizesp {
  width: 200px;
}
.el-input {
  --el-input-focus-border-color: none;
}
::v-deep(.el-input__wrapper) {
  box-shadow: none;
}
.home-search {
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  form {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-self: center;
    align-items: center;
    background-color: #fff;
    border-radius: 25px;
    opacity: 0.7;
    .left {
      position: relative;
      width: 50px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        font-size: 24px;
        font-weight: 500;
        cursor: pointer;
      }
      .left-placeholder {
        position: absolute;
        left: 65px;
        width: 140px;
        height: 20px;
        color: var(--gray-500);
        .left-placeholder-unfocus {
          display: flex;
          align-items: center;
          .focus-icon {
            width: 14px;
            height: 18px;
            margin: 0 4px;
            border-radius: 2px;
            border: 1px solid var(--gray-500);
            text-align: center;
            line-height: 18px;
          }
        }
      }
    }
    .center {
      width: calc(100% - 100px);
      height: 100%;
      ::v-deep(.el-input__inner) {
        border: none;
        border-radius: 0;
        background: transparent;
        &::placeholder {
          color: var(--gray-600);
        }
      }
      ::v-deep(.el-input__suffix) {
        i {
          font-size: 16px;
          font-weight: 500;
          color: var(--gray-600);
        }
      }
    }
    .right {
      width: 50px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        font-size: 24px;
        font-weight: 500;
      }
    }
    .idea {
      position: absolute;
      top: 50px;
      left: 0;
      right: 0;
      max-height: 180px;
      border-radius: 4px;
      overflow-y: auto;
      li {
        padding: 5px 10px;
        border-radius: 3px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        cursor: pointer;
        &:hover {
          color: var(--gray-700);
          background-color: var(--gray-o3);
        }
        .instation-idea {
          .name {
            font-weight: 600;
            color: var(--gray-700);
          }
          .describe {
            font-size: 12px;
            color: var(--gray-500);
          }
          ::v-deep(.idea-highlight) {
            color: var(--red-400);
          }
        }
      }
      .active {
        color: var(--gray-700);
        background-color: var(--gray-o3);
        cursor: pointer;
      }
    }
  }
  .menu {
    position: absolute;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    color: var(--gray-50);
    li {
      position: relative;
      height: 32px;
      margin-top: 5px;
      cursor: pointer;

      &:first-child {
        margin-left: 0;
      }
    }
    .active {
      &::after {
        content: "";
        position: absolute;
        bottom: 0px;
        left: 50%;
        transform: translateX(-50%);
        display: block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #34d399;
      }
    }
  }
  // 毛玻璃效果
  .gross-glass {
    background-color: var(--gray-o5);
    backdrop-filter: blur(8px);
  }
}
</style>
