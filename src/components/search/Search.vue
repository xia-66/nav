<template>
  <div class="home-search">
    <ul class="menu" style="color: #fff;">
      <li v-for="item in searchs" :key="item.key">{{ item.name }}</li>
    </ul>
    <form>
      <div class="left">
        <i class="iconfont icon-baidu"></i>
      </div>
      <el-input v-model="input2" placeholder="Please Input" clearable style="width: 500px;height: 50px;"/>
      <div class="right">
        <i class="iconfont icon-md-search" @click="doSearch"></i>
      </div>
    </form>

  </div>

</template>

<script setup>
// import { useMainStore } from '../../store';
import { computed, ref, watch } from 'vue';
// const store = useMainStore()
// const isSearchInputFocus = ref(false)
// const activeSearchIndex = ref(0)
// const searchText = ref('')
// const activeIdeaIndex = ref(-1)
// const currentSearch = ref({})
// const ideas = ref([])
// const af = new AF(searchText, 200);
// const searchInput = ref(null)
const input2 = ref()
const searchs = [
  {
    url: 'https://www.baidu.com/s',
    key: 'word',
    params: {},
    name: '百度',
    iconClass: 'iconfont icon-baidu',
  },
  {
    url: 'https://www.google.com/search',
    key: 'q',
    params: {},
    name: '谷歌',
    iconClass: 'iconfont icon-chrome',
  },
  {
    url: 'https://cn.bing.com/search',
    key: 'q',
    params: {},
    name: '必应',
    iconClass: 'iconfont icon-yingyong',
  },
  {
    url: 'https://dict.youdao.com/search',
    key: 'q',
    params: {},
    name: '翻译',
    iconClass: 'iconfont icon-translate',
  },
  {
    url: 'https://xueshu.baidu.com/s',
    key: 'wd',
    params: {},
    name: '学术',
    iconClass: 'iconfont icon-md-school',
  },
  {
    url: 'https://image.baidu.com/search/index',
    key: 'word',
    params: {
      tn: 'baiduimage',
    },
    name: '搜图',
    iconClass: 'iconfont icon-md-image',
  },
  {
    url: 'https://duckduckgo.com/',
    key: 'q',
    params: {},
    name: '匿名',
    iconClass: 'iconfont icon-md-cube',
  },
  {
    url: "https://quark.sm.cn/s",
    key: "q",
    params: {},
    name: "夸克",
    iconClass: "iconfont icon-md-planet",
  },
  {
    url: 'localhost',
    key: 'instation',
    params: {},
    name: '站内',
    iconClass: 'iconfont icon-md-planet',
  },

];

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
