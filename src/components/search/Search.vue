<template>
  <div class="home-search">
    <ul class="menu" style="color: #fff;">
      <li v-for="item in store.$state.searchs" :key="item.key">{{ item.name }}</li>
    </ul>
    <form>
      <div class="left">
        <i class="iconfont icon-baidu"></i>
      </div>
      <el-input  placeholder="Please Input" clearable style="width: 500px;height: 50px;" v-model="searchQuery" @input="() => {}"/>
      <div class="right">
        <i class="iconfont icon-md-search" @click="doSearch"></i>
      </div>
    </form>

  </div>

</template>

<script setup>
import { useMainStore } from '../../store';
import { computed, ref, watch } from 'vue';
const store = useMainStore()

const searchQuery = ref('');

const debouncedSearch = (query) => {
  console.log('搜索:', query);
  // 这里放置你的搜索逻辑
};

watch(searchQuery, (newVal, oldVal) => {
  clearTimeout(debounceTimer);
  const debounceTimer = setTimeout(() => {
    debouncedSearch(newVal);
  }, 300);
});
</script>


<style lang="scss" scoped>
.home-search {
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--gray-o7);
  form {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-self: center;
    align-items: center;
    background-color: #fff;
    border-radius: 25px;
    opacity: 0.8;
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
        background-color: var(--green-500);
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
